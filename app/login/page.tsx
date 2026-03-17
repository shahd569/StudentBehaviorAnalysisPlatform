"use client";

import styles from "./login.module.css";
import Image from "next/image";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SignInResponse } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const res: SignInResponse | undefined = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("فشل تسجيل الدخول: " + res.error);
    } else {
      const session = await getSession();

      if (session?.user?.role === "TEACHER") {
        router.push("/Teacher_Dashboard/teacher");
      } else if (session?.user?.role === "STUDENT") {
        router.push("/Student_Dashboard/student");
      } else {
        alert("مرحباً بك أيها المدير");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={`${styles.bigLogText} ${styles.illustrationLogSide}`}>
          Log
        </div>

        <div className={styles.illustrationSide}>
          <Image
            src="/image/illustration.png"
            alt="Login Illustration"
            width={400}
            height={400}
            className={styles.illustrationImage}
            priority
          />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.welcomeText}> !مرحباً بعودتك </h1>
            <p className={styles.subText}>سجل الدخول للمتابعة إلى حسابك</p>
          </div>
        </div>
        <div className={styles.formSide}>
          <div className={styles.bigInText}>in</div>
          <div className={styles.formContent}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  className={styles.inputField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>كلمة المرور</label>
                <input
                  type="password"
                  className={styles.inputField}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="أدخل كلمة المرور"
                />
                <Link href="/forgot-password" className={styles.forgotPassword}>
                  هل نسيت كلمة المرور ؟؟
                </Link>
              </div>

              <button type="submit" className={styles.loginButton}>
                تسجيل الدخول
              </button>
            </form>

            <div className={styles.registerSection}>
              <p className={styles.registerText}>ليس لديك حساب ؟؟</p>
              <Link
                href="/ChoosingAccountType"
                className={styles.createAccountBtn}
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
