import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layouts/UserLayout";
export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <section className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p className={styles.eyebrow}>Professional networking, softened</p>
            <h1>Build trust-first connections without the noise.</h1>
            <p className={styles.description}>
              HatchHub gives your network a calmer place to share work, discover
              people, and stay connected through updates that feel credible.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.JoinButton}
                onClick={() => {
                  router.push("/login");
                }}
              >
                Join Now
              </button>
              <div className={styles.secondaryCard}>
                <strong>One feed, clearer signals</strong>
                <span>Thoughtful posts, real profiles, cleaner interactions.</span>
              </div>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <div className={styles.previewCard}>
              <div className={styles.previewBar}></div>
              <div className={styles.previewContent}>
                <div className={styles.previewPanel}>
                  <span>Trusted voices</span>
                  <strong>Curated updates</strong>
                </div>
                <div className={styles.previewPanelAlt}>
                  <span>Profiles with depth</span>
                  <strong>Work, history, and intent</strong>
                </div>
                <img src="connect.svg" alt="Illustration of connection" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </UserLayout>
  );
}
