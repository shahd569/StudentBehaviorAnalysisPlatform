// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import styles from "./StudentRegister.module.css";
// import { useRouter } from "next/navigation";

// export default function StudentRegister() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [universityId, setUniversityId] = useState("");
//   const [college, setCollege] = useState("");
//   const [major, setMajor] = useState("");
//   const [academicYear, setAcademicYear] = useState("");
//   const [avatar, setAvatar] = useState<File | null>(null);

//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setAvatar(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       formData.append("firstName", firstName);
//       formData.append("lastName", lastName);
//       formData.append("email", email);
//       formData.append("hashedPassword", password);
//       formData.append("universityId", universityId);
//       formData.append("college", college);
//       formData.append("major", major);
//       formData.append("academicYear", academicYear);
//       formData.append("role", "STUDENT");

//       if (avatar) {
//         formData.append("avatar", avatar);
//       }

//       const res = await fetch("/api/newAccount", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "حدث خطأ أثناء التسجيل");
//         setLoading(false);
//         return;
//       }

//       alert("تم إنشاء حساب الطالب بنجاح!");
//       router.push("/login");
//     } catch (error) {
//       console.error(error);
//       alert("حدث خطأ في الشبكة");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className={styles.section}>
//       <div className={styles.right}>
//         <h2 className={styles.title}>Student</h2>
//         <Image
//           src="/image/student.png"
//           alt="student"
//           width={450}
//           height={570}
//           className={styles.teacherImage}
//         />
//       </div>
//       <div className={styles.card}>
//         <div className={styles.left}>
//           <form className={styles.form} onSubmit={handleSubmit}>
//             <label className={styles.avatarWrapper}>
//               {avatar ? (
//                 <Image
//                   src={URL.createObjectURL(avatar)}
//                   alt="Avatar"
//                   fill
//                   className={styles.avatarImage}
//                 />
//               ) : (
//                 <span className={styles.avatarPlaceholder}>+</span>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 hidden
//               />
//             </label>
//             <div className={styles.row}>
//               <input
//                 className={`${styles.input} ${styles.half}`}
//                 placeholder="الاسم الأول"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//               />
//               <input
//                 className={`${styles.input} ${styles.half}`}
//                 placeholder="الاسم الأخير"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//               />
//             </div>

//             <input
//               className={styles.input}
//               type="email"
//               placeholder="الإيميل"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             <input
//               className={styles.input}
//               type="password"
//               placeholder="كلمة السر"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <input
//               className={styles.input}
//               placeholder="الرقم الجامعي"
//               value={universityId}
//               onChange={(e) => setUniversityId(e.target.value)}
//             />
//             <input
//               className={styles.input}
//               placeholder="الكلية"
//               value={college}
//               onChange={(e) => setCollege(e.target.value)}
//             />

//             <div className={styles.row}>
//               <input
//                 className={`${styles.input} ${styles.half}`}
//                 placeholder="الاختصاص"
//                 value={major}
//                 onChange={(e) => setMajor(e.target.value)}
//               />
//               <input
//                 className={`${styles.input} ${styles.half}`}
//                 placeholder="السنة الدراسية"
//                 value={academicYear}
//                 onChange={(e) => setAcademicYear(e.target.value)}
//               />
//             </div>

//             <button className={styles.button} type="submit">
//               إنشاء
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./StudentRegister.module.css";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// دالة تحاول الرفع للسحابة مع خاصية إعادة المحاولة
const uploadToCloudWithRetry = async (
  file: File,
  bucket: string,
  retries = 3,
): Promise<string | null> => {
  const fileName = `${Date.now()}_${file.name}`;

  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false });

      if (error) throw error; // catch إذا وجد خطأ ننتقل لـ

      // إذا نجح الرفع، نجلب الرابط العام
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`المحاولة رقم ${i + 1} فشلت:`, err.message);
      } else {
        console.error(`المحاولة رقم ${i + 1} فشلت:`, err); // في حال كان الخطأ من نوع آخر
      }
      //لنبدأ الرفع المحلي null إذا كانت هذه آخر محاولة، نرجع
      if (i === retries - 1) return null;
      // انتظار بسيط قبل إعادة المحاولة (مثلاً 1 ثانية)
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
  return null; // في حال فشل جميع المحاولات، نرجع null
};

export default function StudentRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [academicYear, setAcademicYear] = useState("");
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
      let profilePictureUrl = null;
      let fallbackAvatar = null; // سنحتاجه في حال فشل السحابة
      if (avatar) {
        // محاولة الرفع للسحابة بـ 3 محاولات
        profilePictureUrl = await uploadToCloudWithRetry(
          avatar,
          "user-profile-picture",
        );

        //هذا يعني فشل السحابة بعد 3 محاولات null اذا عادت الدالة ب
        if (!profilePictureUrl) {
          console.warn("فشل الرفع للسحابة نهائياً، سيتم التخزين محلياً.");
          fallbackAvatar = avatar;
        }
      }

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("hashedPassword", password);
      formData.append("universityId", universityId);
      formData.append("college", college);
      formData.append("major", major);
      formData.append("academicYear", academicYear);
      formData.append("role", "STUDENT");

      if (profilePictureUrl) {
        formData.append("profilePictureUrl", profilePictureUrl);
      } else if (fallbackAvatar) {
        formData.append("avatar", fallbackAvatar); // إرسال الملف الخام في حال فشل السحابة
      }

      const res = await fetch("/api/newAccount", {
        method: "POST",
        body: formData,
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
      <div className={styles.right}>
        <h2 className={styles.title}>Student</h2>
        <Image
          src="/image/student.png"
          alt="student"
          width={450}
          height={570}
          className={styles.teacherImage}
        />
      </div>
      <div className={styles.card}>
        <div className={styles.left}>
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
            <div className={styles.row}>
              <input
                className={`${styles.input} ${styles.half}`}
                placeholder="الاسم الأول"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className={`${styles.input} ${styles.half}`}
                placeholder="الاسم الأخير"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

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
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className={styles.input}
              placeholder="الرقم الجامعي"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="الكلية"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />

            <div className={styles.row}>
              <input
                className={`${styles.input} ${styles.half}`}
                placeholder="الاختصاص"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
              <input
                className={`${styles.input} ${styles.half}`}
                placeholder="السنة الدراسية"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>

            <button className={styles.button} type="submit">
              إنشاء
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
