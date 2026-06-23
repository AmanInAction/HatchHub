import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { reset } from "@/config/redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";

function NavbarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  return (
    <header className={styles.shell}>
      <nav className={styles.navBar}>
        <button
          type="button"
          className={styles.brand}
          onClick={() => router.push(authState.loggedIn ? "/dashboard" : "/")}
        >
          <span>Hatch</span>
          <span>Hub</span>
        </button>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && authState.user?.userId ? (
            <>
              <div className={styles.userBadge}>
                <span className={styles.userBadgeLabel}>Signed in as</span>
                <strong>{authState.user.userId.name}</strong>
              </div>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className={styles.navButton}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                className={styles.secondaryButton}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                router.push("/login");
              }}
              className={styles.JoinButton}
            >
              Join HatchHub
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavbarComponent;
