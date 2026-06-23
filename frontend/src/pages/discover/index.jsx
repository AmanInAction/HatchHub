import { getAllUsers } from "@/config/redux/action/authAction";
import UserLayout from "@/layouts/UserLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);

  const router = useRouter();

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.page}>
          <div className={styles.headerCard}>
            <h1>Discover</h1>
            <p>
              Browse profiles that look real, read clearly, and make it easier
              to connect with the right people.
            </p>
          </div>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                return (
                  <div
                    key={user._id}
                    className={styles.userCard}
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${user.userId?.profilePicture}`}
                      alt="profile /"
                      className={styles.userCard_image}
                    />
                    <div>
                      <h2>{user.userId?.name}</h2>
                      <p>@{user.userId?.username}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
