"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./TeacherRegister.module.css";
import { useRouter } from "next/navigation";

export default function TeacherRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("hashedPassword", password);
      formData.append("employeeId", jobNumber);
      formData.append("role", "TEACHER");

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await fetch("/api/newAccount", {
        method: "POST",
        body: formData, // 🚀 بدون headers
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "حدث خطأ أثناء التسجيل");
        setLoading(false);
        return;
      }

      alert("تم إنشاء حساب الطالب بنجاح!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الشبكة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.right}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.avatarWrapper}>
              {avatar ? (
                <Image
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar"
                  fill
                  className={styles.avatarImage}
                />
              ) : (
                <span className={styles.avatarPlaceholder}>+</span>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <input
              className={styles.input}
              placeholder="الاسم الأول"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className={styles.input}
              placeholder="الاسم الأخير"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              className={styles.input}
              type="email"
              placeholder="الإيميل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className={styles.input}
              type="password"
              placeholder="كلمة السر"
              value={password}
              required
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className={styles.input}
              placeholder="الرقم الوظيفي"
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
            />

            <button className={styles.button} type="submit">
              إنشاء
            </button>
          </form>
        </div>
      </div>
      <div className={styles.left}>
        <h2 className={styles.title}>Teacher</h2>
        <Image
          src="/image/teacher.png"
          alt="Teacher"
          width={1150}
          height={575}
          className={styles.teacherImage}
        />
      </div>
    </section>
  );
}
