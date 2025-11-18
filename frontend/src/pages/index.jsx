import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layouts/UserLayout";
import NavbarComponent from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <div className={styles.mainContainer_left}>
              <p>Connect with Friends without Exaggeration</p>
              <p>A True social media platform, with stories that matters.</p>

              <p
                className={styles.JoinButton}
                onClick={() => {
                  router.push("/login");
                }}
              >
                Join Now
              </p>
            </div>
            <div className={styles.mainContainer_right}>
              <img src="connect.svg" alt="" />
            </div>
          </div>
        </div>
      </>
    </UserLayout>
  );
}
