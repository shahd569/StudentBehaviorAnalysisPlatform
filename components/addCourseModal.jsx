"use client";

import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { supabase } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

// دالة تحاول الرفع للسحابة مع خاصية إعادة المحاولة
const uploadToCloudWithRetry = async (file, bucket, retries = 3) => {
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
    } catch (err) {
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
export default function CreateCourseModal() {
  const [show, setShow] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [avatar, setAvatar] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [instructorId, setInstructorId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coursePictureUrl = null;
      let fallbackAvatar = null; // سنحتاجه في حال فشل السحابة
      if (avatar) {
        // محاولة الرفع للسحابة بـ 3 محاولات
        coursePictureUrl = await uploadToCloudWithRetry(
          avatar,
          "user-profile-picture",
        );

        //هذا يعني فشل السحابة بعد 3 محاولات null اذا عادت الدالة ب
        if (!coursePictureUrl) {
          console.warn("فشل الرفع للسحابة نهائياً، سيتم التخزين محلياً.");
          fallbackAvatar = avatar;
        }
      }

      const formData = new FormData();

      formData.append("courseName", courseName);
      formData.append("description", description);
      formData.append("semester", semester);
      formData.append("instructorId", instructorId);
      formData.append("academicYear", academicYear);

      if (coursePictureUrl) {
        formData.append("coursePictureUrl", coursePictureUrl);
      } else if (fallbackAvatar) {
        formData.append("avatar", fallbackAvatar); // إرسال الملف الخام في حال فشل السحابة
      }

      const res = await fetch("/api/adminDashboard/coursesManagement", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "حدث خطأ أثناء إنشاء المقرر");
        setLoading(false);
        return;
      }

      alert("تم إنشاء المقرر بنجاح!");
      setCourseName("");
      setDescription("");
      setAcademicYear("");
      setSemester("");
      setAvatar("");
      // setStatus("ACTIVE");
      setInstructorId("");

      setShow(false);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الشبكة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!show) return;

    const fetchTeachers = async () => {
      try {
        const res = await fetch(
          "/api/adminDashboard/coursesManagement/teachers",
        );
        const data = await res.json();

        setTeachers(data.teachersInfo || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeachers();
  }, [show]);

  return (
    <>
      <Button
        className="shadow-sm"
        style={{
          backgroundColor: "#00217a",
          border: "none",
          borderRadius: "10px",
          padding: "5px",
          color: "white",
          width: "150px",
          textAlign: "center",
        }}
        onClick={() => setShow(true)}
      >
        إضافة مقرر جديد
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: "#ffffff" }} />

        <Modal.Body
          style={{
            padding: "20px",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <FontAwesomeIcon
                  icon={faBook}
                  style={{ color: "#00217a", fontSize: "26px" }}
                ></FontAwesomeIcon>
                <h3>إنشاء مقرر جديد</h3>
              </div>
              <p
                style={{
                  fontSize: "16px",
                  color: "gray",
                }}
              >
                أضف مقرراً جديداً وقم بتعيين الأستاذ المسؤول عنه
              </p>
            </div>

            <div style={{ display: "flex", gap: "25px" }}>
              {/* الصورة */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "15px",
                  border: "2px solid #dad9d9",
                }}
              >
                <p>صورة المقرر</p>
                <p style={{ color: "gray" }}>
                  أضف صورة تعبر عن المقرر (اختياري)
                </p>
                <label>
                  {avatar ? (
                    <Image
                      style={{ border: "1px solid #ccc", borderRadius: "20px" }}
                      width={200}
                      height={150}
                      src={URL.createObjectURL(avatar)}
                      alt="Avatar"
                      // fill
                    />
                  ) : (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "blue",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              </div>

              {/* معلومات المقرر */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "20px",
                  borderRadius: "15px",
                  border: "2px solid #dad9d9",
                }}
              >
                <label>اسم المقرر</label>
                <input
                  type="text"
                  placeholder="أدخل اسم المقرر"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  style={{
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    height: "40px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "flex",
                    gap: "10px",
                  }}
                />

                <label>وصف المقرر (اختياري)</label>
                <textarea
                  placeholder="أدخل وصفاً مختصراً للمقرر..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    height: "40px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "flex",
                    gap: "10px",
                  }}
                />

                <div style={{ display: "flex", gap: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>السنة الأكاديمية</label>

                    <input
                      type="number"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        height: "40px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        display: "flex",
                        gap: "10px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label>الفصل الدراسي</label>

                    <input
                      type="text"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        height: "40px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        display: "flex",
                        gap: "10px",
                      }}
                    />
                  </div>
                </div>
                <label>الأستاذ المسؤول</label>

                <select
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  style={{
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    height: "40px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <option value="">اختر الأستاذ المسؤول</option>

                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "#00217a",
                    color: "white",
                    textAlign: "center",
                    height: "40px",
                  }}
                >
                  {loading ? "جاري إنشاء المقرر..." : "إنشاء المقرر"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
