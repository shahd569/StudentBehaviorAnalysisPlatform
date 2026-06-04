"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Assignment() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/adminDashboard/coursesManagement/get");
        const data = await res.json();

        if (res.ok) {
          setCourses(data.coursesInfo || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>جاري تحميل المقررات...</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        gap: "3px",
        padding: "20px 40px",
        fontSize: "18px",
      }}
    >
      <h1 style={{ fontWeight: "bold" }}>المقررات</h1>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "gray",
        }}
      >
        قائمة المقررات الخاصة بك
      </p>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        {courses.map((course, index) => (
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
            <div
              style={{
                backgroundImage: `url('${
                  course.coursePictureUrl || "/image/background.jpg"
                }')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
                height: "150px",
              }}
            ></div>

            <div
              style={{
                display: "flex",
                justifyContent: "start",
                gap: "20px",
                padding: "15px",
              }}
            >
              <div>
                <h4>{course.courseName}</h4>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
              }}
            >
              <p style={{ fontSize: "16px", color: "#646464" }}>
                {course.lessonsCount} محاضرة
              </p>

              <p style={{ fontSize: "16px", color: "#646464" }}>
                {course.studentsEnrollmentsCounts} طالب
              </p>

              <p style={{ fontSize: "16px", color: "#646464" }}>
                {course.videosCount} مقاطع مرئية
              </p>
            </div>

            <button
              style={{
                borderRadius: "8px",
                backgroundColor: "#9f04f8",
                color: "white",
                boxShadow: "0 4px 4px #ccc",
                // width: "100px",
                height: "40px",
                textAlign: "center",
                marginRight: "20px",
                marginBottom: "15px",
                width: "87%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#8c04db")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#9f04f8")
              }
              onClick={() =>
                router.push(
                  `/Teacher_Dashboard/courseManagement/${course.id}/corseDetails`,
                )
              }
            >
              عرض المقرر
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
