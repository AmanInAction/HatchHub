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
  }, []);

  useEffect(() => {
    if (authState.connectionRequest.length != 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);
  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h4>My Connections</h4>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <h3 style={{ color: "gray" }}>{user.userId.username}</h3>
                    </div>
                    <button
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
            .filter((connection) => connection.status_accepted !== null)
            .map((user, index) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  className={styles.userCard}
                  key={index}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <h3 style={{ color: "gray" }}>{user.userId.username}</h3>
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
