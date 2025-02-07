'use client'
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h2>Dream Day</h2>
      </header>

      <section className={styles.hero}>
        <h1>Turning Your Dream into Ultimate Reality</h1>
        <p>We bring your ideas to life with creativity, precision, and passion.</p>
        <button className={styles.button} onClick={() => router.push('./login')}>Login</button>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3>Personalized Planning</h3>
          <p>We craft unique experiences tailored just for you.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Expert Execution</h3>
          <p>Our professionals ensure flawless execution from start to finish</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Memorable Moments</h3>
          <p>We make sure your special day is truly unforgettable</p>
        </div>
      </section>

      
    </div>
  );
}
