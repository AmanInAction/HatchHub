import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { getAllUsers } from "@/config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";

function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.loggedIn) {
      router.push("/login");
    } else if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [
    authState.all_profiles_fetched,
    authState.loggedIn,
    dispatch,
    router,
  ]);

  return (
    <main className={styles.pageShell}>
      <div className={styles.homeContainer}>
        <aside className={styles.homeContainer__leftBar}>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className={styles.sideBarOption}
          >
            <span className={styles.sideBarLabel}>Feed</span>
            <p>Trusted updates from your network</p>
          </button>

          <button
            type="button"
            onClick={() => router.push("/discover")}
            className={styles.sideBarOption}
          >
            <span className={styles.sideBarLabel}>Discover</span>
            <p>Find people worth following and learning from</p>
          </button>

          <button
            type="button"
            onClick={() => router.push("/my_connections")}
            className={styles.sideBarOption}
          >
            <span className={styles.sideBarLabel}>Connections</span>
            <p>Manage requests and keep your circle healthy</p>
          </button>
        </aside>

        <section className={styles.homeContainer__feedContainer}>{children}</section>

        <aside className={styles.homeContainer__extraContainer}>
          <div className={styles.panelHeader}>
            <span>People to notice</span>
            <h3>Top Profiles</h3>
          </div>

          <div className={styles.topProfiles}>
            {authState.all_users?.slice(0, 6).map((profile) => (
              <div
                key={profile._id}
                className={styles.extraContainer_profile}
                onClick={() => router.push(`/view_profile/${profile.userId?.username}`)}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${profile.userId?.profilePicture}`}
                  alt={profile.userId?.name}
                />
                <div>
                  <p>{profile.userId?.name}</p>
                  <span>@{profile.userId?.username}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <nav className={styles.mobileNavBar}>
        <button
          type="button"
          className={styles.singleNavItemHolder_mobileview}
          onClick={() => router.push("/dashboard")}
        >
          Feed
        </button>
        <button
          type="button"
          className={styles.singleNavItemHolder_mobileview}
          onClick={() => router.push("/discover")}
        >
          Discover
        </button>
        <button
          type="button"
          className={styles.singleNavItemHolder_mobileview}
          onClick={() => router.push("/my_connections")}
        >
          Connections
        </button>
      </nav>
    </main>
  );
}

export default DashboardLayout;
