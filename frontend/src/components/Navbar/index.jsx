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
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 style={{ cursor: "pointer" }}>
          {" "}
          <span style={{ color: "#3d52a0" }}>Hatch</span>
          <span style={{ color: "#7091e6" }}>Hub</span>{" "}
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched &&
            authState.user &&
            authState.user.userId && (
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <p>Hey, {authState.user.userId.name}</p>
                <p
                  onClick={() => router.push("/profile")}
                  style={{ cursor: "pointer" }}
                >
                  Profile
                </p>
                <p
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                    dispatch(reset());
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </p>
              </div>
            )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.JoinButton}
            >
              <p>Be a Part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavbarComponent;
