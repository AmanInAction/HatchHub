import UserLayout from "@/layouts/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const [isLogin, setIsLogin] = useState(false);

  const handleRegister = () => {
    console.log("registering...");
    dispatch(
      registerUser({
        username,
        password,
        email,
        name,
      })
    );
  };
  const handleLogin = () => {
    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLogin]);
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeftHeading}>
              {isLogin ? "Sign In" : "Sign Up"}
            </p>

            <p style={{ color: authState.isError ? "#a14a39" : "#32624b" }}>
              {authState.message}
            </p>

            <div className={styles.inputContainers}>
              {!isLogin && (
                <div className={styles.inputRow}>
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Full Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />{" "}
                  <br />
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="@username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
              )}
              <input
                className={styles.inputField}
                type="text"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                className={styles.inputField}
                type="text"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div
                className={styles.button}
                onClick={() => {
                  if (isLogin) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
              >
                {isLogin ? "Sign in" : "Sign up"}
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            <p>Thoughtful networking starts with a clear profile.</p>
            <h2>{isLogin ? "Welcome back" : "Create your space"}</h2>
            {isLogin ? (
              <p>Don't have an account?</p>
            ) : (
              <p>Already have an account?</p>
            )}
            <div
              className={styles.button}
              onClick={() => {
                setIsLogin(!isLogin);
              }}
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              <p> {isLogin ? "Sign up" : "Sign in"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
