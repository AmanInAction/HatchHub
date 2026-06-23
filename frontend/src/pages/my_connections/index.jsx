import UserLayout from "@/layouts/UserLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptConnection,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.page}>
          <div className={styles.headerCard}>
            <h1>My Connections</h1>
            <p>
              Review pending requests and keep the people you trust close at
              hand.
            </p>
          </div>
          {authState.connectionRequest.length === 0 && (
            <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
              No Connection Requests
            </h2>
          )}
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted === false)
            .map((user, index) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  className={styles.userCard}
                  key={index}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.profilePicture}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <h3>@{user.userId.username}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          acceptConnection({
                            connectionId: user._id,
                            token: localStorage.getItem("token"),
                            action_type: true,
                          })
                        );
                      }}
                      className={styles.connectedButton}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted === true)
            .map((user, index) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  className={styles.userCard}
                  key={index}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.profilePicture}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <h3>@{user.userId.username}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnectionsPage;
