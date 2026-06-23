import { clientServer } from "@/config";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import styles from "./index.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  sendConnectionRequest,
  getConnectionRequest,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionRequest({ token: localStorage.getItem("token") })
    );
    await dispatch(
      getMyConnectionRequests({ token: localStorage.getItem("token") })
    );
  };

  useEffect(() => {
    getUsersPost();
  }, [dispatch]);

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userID.username === router.query.username;
    });

    setUserPosts(post);
  }, [postReducer.posts, router.query.username]);

  useEffect(() => {
    if (!Array.isArray(authState.connections)) return;

    if (
      authState.connectionRequest.some(
        (connection) => connection.userId._id === userProfile?.userId?._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connectionRequest.find(
          (user) => user.userId._id === userProfile?.userId?._id
        ).status_accepted === false
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [
    authState.connections,
    userProfile?.userId?._id,
    authState.connectionRequest,
  ]);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${userProfile?.userId?.profilePicture}`}
              alt="backdrop"
            />
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer__flex}>
              <div style={{ flex: "0.8" }}>
                <div className={styles.identityRow}>
                  <h2>{userProfile?.userId?.name}</h2>
                  <p style={{ color: "var(--text-muted)" }}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button type="button" className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user: userProfile.userId,
                          })
                        );
                      }}
                      className={styles.connectButton}
                    >
                      Connect
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      window.open(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/download_resume?id=${userProfile?.userId?._id}`,
                        "_blank"
                      );
                    }}
                    className={styles.downloadButton}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      style={{ width: "1.2em" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <p>{userProfile?.bio}</p>
                </div>
              </div>

              <div className={styles.activityColumn}>
                <h4>Recent Activity</h4>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${post.media}`}
                              alt=""
                            />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>

                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h3>Work History</h3>

            <div className={styles.workHistoryContainer}>
              {userProfile?.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const request = await clientServer.get("/get_profile_based_on_username", {
      params: {
        username: context.query.username,
      },
    });

    return {
      props: {
        userProfile: request.data.profile ?? null, // defensive
      },
    };
  } catch (error) {
    console.error("Error fetching profile:", error.message);

    return {
      notFound: true, // or redirect, or return empty props
    };
  }
}
