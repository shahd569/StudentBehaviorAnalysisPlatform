"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Corses() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "/api/studentDashboard/studentCourses/coursesCards",
        );
        const data = await res.json();

        if (res.ok) {
          setCourses(data || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "20px 40px" }}>
      {/* العنوان */}
      <h1 style={{ fontWeight: "bold", fontSize: "32px" }}>المقررات</h1>
      <h4 style={{ color: "#8E8E8E", marginTop: "5px" }}>
        قائمة المقررات الخاصة بك
      </h4>

      {/* الكروت */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        {courses?.map((course, index) => (
          <div
            key={index}
            style={{
              width: "320px",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              transition: "0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* صورة الكورس */}
            <div style={{ position: "relative", height: "150px" }}>
              <Image
                src={course.coursePictureUrl || "/uploads/e-commerce.png"}
                alt="course"
                fill
                style={{
                  objectFit: "cover",
                }}
              />

              {/* صورة المدرس */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-25px",
                  right: "15px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid white",
                }}
              >
                <Image
                  src={
                    course.instructorProfilePictureUrl || "/uploads/avatar.png"
                  }
                  alt="instructor"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* المحتوى */}
            <div style={{ padding: "35px 15px 15px 15px" }}>
              {/* اسم الكورس */}
              <h3
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "5px",
                }}
              >
                {course.courseName}
              </h3>

              {/* اسم المدرس */}
              <p
                style={{
                  fontSize: "13px",
                  color: "#626262",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                د. {course.instructorName}
              </p>

              {/* الإحصائيات */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  color: "#626262",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                <span>{course.lessonsCount} محاضرة</span>
                <span>{course.videosCount} مقاطع مرئية</span>
              </div>

              {/* زر */}
              <button
                style={{
                  width: "95%",
                  background: "#5194F8",
                  color: "#fff",
                  border: "none",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "0.2s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#3b73cc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#5194F8")
                }
                onClick={() =>
                  router.push(
                    `/Student_Dashboard/courses/${course.id}/corseDetails`,
                  )
                }
              >
                عرض المقرر
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
