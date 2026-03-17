"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import OR from "@/components/OR";

import styles from "./ChoosingAccountType.module.css";

export default function ChoosingAccountType() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Student */}
      <button
        className={`${styles.card} ${styles.fadeSlide}`}
        onClick={() => router.push("/register/student")}
      >
        <div className={`${styles.imageWrapper} ${styles.studentBg}`}>
          <Image
            src="/image/student.png"
            alt="Student account"
            width={320}
            height={455}
            className={styles.characterImage}
          />
        </div>
        <span className={styles.label}>Student</span>
      </button>

      <OR />

      {/* Teacher */}
      <button
        className={`${styles.card} ${styles.fadeSlide}`}
        onClick={() => router.push("/register/teacher")}
      >
        <div className={`${styles.imageWrapper} ${styles.teacherBg}`}>
          <Image
            src="/image/teacher.png"
            alt="Teacher account"
            width={850}
            height={460}
            className={styles.characterImage}
          />
        </div>
        <span className={styles.label}>Teacher</span>
      </button>
    </div>
  );
}
