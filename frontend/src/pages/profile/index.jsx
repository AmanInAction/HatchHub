import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import UserLayout from "@/layouts/UserLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getAboutUser } from "@/config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import { clientServer } from "@/config";

function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  // read posts array from the reducer (may be undefined until loaded).
  // IMPORTANT: avoid returning a new empty array here, because that would
  // create a new reference each render and retrigger effects that depend on it.
  const postsFromStore = useSelector((state) => state.postReducer?.posts);
  const router = useRouter();

  const [userPosts, setUserPosts] = useState(authState.userPosts || []);

  const [userProfile, setUserProfile] = useState({
    userId: {
      name: "",
      username: "",
      profilePicture: "",
    },
    bio: "",
    pastWork: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputData, setInputData] = useState({
    company: "",
    postion: "",
    years: "",
  });

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;

    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);

      // use the posts value from the store if available, otherwise filter an empty array
      const post = (postsFromStore || []).filter(
        (p) => p?.userId?.username === authState.user.userId.username
      );

      setUserPosts(post);
    }
  }, [authState.user, postsFromStore]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileDetails = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currerntPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backdrop_overlay}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </label>
              <input
                onChange={(e) => updateProfilePicture(e.target.files[0])}
                type="file"
                name=""
                id="profilePictureUpload"
                hidden
              />
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${userProfile?.userId?.profilePicture}`}
                alt="backdrop"
              />
            </div>
            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      className={styles.editName}
                      type="text"
                      name="Username"
                      aria-autocomplete="list"
                      value={userProfile?.userId?.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />

                    <p style={{ color: "gray" }}>
                      @{userProfile?.userId?.username}
                    </p>
                  </div>

                  <div>
                    <textarea
                      name="Bio"
                      id="bio"
                      aria-label="User bio"
                      placeholder={
                        userProfile?.bio ||
                        "Tell people about yourself — what you do, interests, or a short intro"
                      }
                      className={styles.bioTextarea}
                      value={userProfile?.bio}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          bio: e.target.value,
                        });
                      }}
                      rows={Math.max(
                        3,
                        Math.ceil(userProfile?.bio.length / 80)
                      )}
                    ></textarea>
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
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

              <button
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className={styles.addworkBtn}
              >
                Add Work
              </button>
            </div>

            {userProfile != authState.user && (
              <div
                className={styles.connectionButton}
                onClick={() => {
                  updateProfileDetails();
                }}
              >
                Update
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <input
                type="text"
                className={styles.inputField}
                placeholder="Company Name"
                name="company"
                onChange={handleWorkInputChange}
              />
              <input
                type="text"
                className={styles.inputField}
                placeholder="Position in the Company"
                name="position"
                onChange={handleWorkInputChange}
              />
              <input
                type="number"
                className={styles.inputField}
                placeholder="Years Worked"
                name="years"
                onChange={handleWorkInputChange}
              />
              <div
                className={styles.connectionButton}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setIsModalOpen(false);
                }}
              >
                Add Work
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfilePage;
