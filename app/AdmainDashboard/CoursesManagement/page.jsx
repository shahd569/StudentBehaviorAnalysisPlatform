"use client";

import { useEffect, useState } from "react";
import AddCourse from "@/components/addCourseModal";
import Image from "next/image";
// import Teacher from "@/public/image/odoo.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBookOpen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/adminDashboard/coursesManagement/get");
      const data = await res.json();

      setCourses(data.courses || []);
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedFiles, setSelectedFiles] = useState({});
  const [loadingCourse, setLoadingCourse] = useState(null);

  const handleFileChange = (courseId, e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFiles((prev) => ({
      ...prev,
      [courseId]: file,
    }));
  };

  const handleStudentUpload = async (courseId) => {
    const file = selectedFiles[courseId];

    if (!file) {
      alert("يرجى اختيار ملف أولاً");
      return;
    }

    try {
      setLoadingCourse(courseId);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `/api/adminDashboard/coursesManagement/${courseId}/enroll-excel`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || result.message);
        return;
      }

      alert(result.message);

      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[courseId];
        return updated;
      });

      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء تسجيل الطلاب");
    } finally {
      setLoadingCourse(null);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المقرر؟");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/adminDashboard/coursesManagement/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        padding: "20px 40px",
        fontSize: "18px",
      }}
    >
      <h1 style={{ fontWeight: "bold", color: "black" }}>إدارة المقررات</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <AddCourse />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "50px",
          padding: "20px",
        }}
      >
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "2px solid #ccc",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              gap: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              transition: "0.2s",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Image
                src={course.coursePictureUrl || Teacher}
                alt={course.courseName}
                width={400}
                height={150}
                style={{
                  borderRadius: "15px",
                  width: "100%",
                  height: "150px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <h4 style={{ fontWeight: "bold" }}>{course.courseName}</h4>

              <p>{course.instructorName}</p>
            </div>

            <p
              style={{
                textAlign: "center",
                color: "#353535cc",
              }}
            >
              {course.description}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <FontAwesomeIcon icon={faUsers} color="#00217a" />

                <p
                  style={{
                    fontSize: "16px",
                    color: "#646464",
                  }}
                >
                  عدد الطلاب المسجلين : {course.enrollments}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <FontAwesomeIcon icon={faBookOpen} color="#00217a" />

                <p
                  style={{
                    fontSize: "16px",
                    color: "#646464",
                  }}
                >
                  عدد الدروس : {course.lessons}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: "#646464",
                }}
              >
                {course.semester}
              </p>

              <p
                style={{
                  fontSize: "16px",
                  color: "#646464",
                }}
              >
                السنة الأكاديمية {course.academicYear}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                type="file"
                accept=".csv"
                id={`file-${course.id}`}
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(course.id, e)}
              />

              <label
                htmlFor={`file-${course.id}`}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                {selectedFiles[course.id]
                  ? selectedFiles[course.id].name
                  : "اختر ملف الطلاب"}
              </label>

              <button
                onClick={() => handleStudentUpload(course.id)}
                disabled={loadingCourse === course.id}
                style={{
                  backgroundColor: "#d7dff5",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                {loadingCourse === course.id
                  ? "جاري التسجيل..."
                  : "تسجيل الطلاب"}
              </button>
            </div>

            <button
              onClick={() => handleDelete(course.id)}
              style={{
                borderRadius: "8px",
                border: "2px solid #dc3545",
                color: "red",
                width: "70px",
                height: "40px",
                textAlign: "center",
                marginRight: "20px",
                marginBottom: "15px",
                marginTop: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faTrash}
                style={{
                  color: "#dc3545",
                  fontSize: "18px",
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
