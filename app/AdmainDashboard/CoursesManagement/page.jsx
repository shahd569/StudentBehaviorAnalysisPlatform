"use client";

import { useEffect, useState } from "react";
import AddCourse from "@/components/addCourseModal";
import StudentUpload from "@/components/studentEnroll";

import Image from "next/image";
// import Teacher from "@/public/image/odoo.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBookOpen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [fileName, setFileName] = useState("اختر ملف CSV");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loadingCourse, setLoadingCourse] = useState(null);
  const [hoveredCount, setHoveredCount] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const router = useRouter();
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/adminDashboard/coursesManagement/get");
      const data = await res.json();

      setCourses(data.courses || []);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleEFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setFileName("اختر ملف CSV");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleStudentEUpload = async () => {
    if (!selectedFile) {
      alert("يرجى اختيار ملف أولاً");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFiles);

      const res = await fetch(
        "/api/adminDashboard/studentsEnrollmentInfo/deleteAllStudentEnroll",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await res.json();

      if (res.ok) {
        const deletedEnrollmentsCount =
          result.statistics?.deletedEnrollmentsCount ?? 0;
        const totalInFileCount = result.statistics?.totalInFile ?? 0;
        const foundInSystem = result.statistics?.foundInSystem ?? 0;
        alert(
          `${result.message}\nعدد الطلاب الذين تم إلغاء تسجيلهم: ${deletedEnrollmentsCount}\nعدد الطلاب الموجودين بالفعل: ${foundInSystem}\nعدد الطلاب في الملف: ${totalInFileCount}
`,
        );
        setSelectedFile(null);
        setFileName("اختر ملف CSV");
      } else {
        alert(
          `فشل الرفع: ${result.error || result.message || "خطأ غير معروف"}`,
        );
      }
    } catch (error) {
      console.error("FRONTEND UPLOAD ERROR:", error);
      alert("حدث خطأ في معالجة البيانات بالواجهة أو انقطع الاتصال بالخادم");
    } finally {
      setLoading(false);
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
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "20px",
        }}
      >
        
        <div style={{ display: "flex", gap: "15px"}}>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "50px",
            padding: "5px 35px",
            width: "250px",
          }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleEFileChange}
            style={{ display: "none" }} // إخفاء الإدخال الافتراضي
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            style={{
              cursor: "pointer",
            }}
          >
            {fileName}
          </label>
        </div>
        <button
          onClick={handleStudentEUpload}
          disabled={loading}
          style={{
            backgroundColor: "#d7dff5",
            border: "none",
            borderRadius: "10px",
            padding: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            paddingLeft: "15px",
            paddingRight: "15px",
          }}
        >
          {loading
            ? "جاري المعالجة والرفع..."
            : "رفع قائمة الطلاب لإلغاء تسجيلهم"}
        </button>
      </div>
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
              // cursor: "pointer",
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
                  cursor: "pointer",
                }}
                onClick={() =>
                  router.push(`/AdmainDashboard/CoursesManagement/${course.id}`)
                }
                onMouseEnter={() => setHoveredCount(`students-${course.id}`)}
                onMouseLeave={() => setHoveredCount(null)}
              >
                <FontAwesomeIcon icon={faUsers} color="#00217a" />

                <p
                  style={{
                    fontSize: "16px",
                    color:
                      hoveredCount === `students-${course.id}`
                        ? "#7ebbea"
                        : "#646464",
                  }}
                >
                  عدد الطلاب المسجلين : {course.enrollments}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  router.push(
                    `/AdmainDashboard/CoursesManagement/${course.id}/lessonsInfo`,
                  )
                }
                onMouseEnter={() => setHoveredCount(`lessons-${course.id}`)}
                onMouseLeave={() => setHoveredCount(null)}
              >
                <FontAwesomeIcon icon={faBookOpen} color="#00217a" />

                <p
                  style={{
                    fontSize: "16px",
                    color:
                      hoveredCount === `lessons-${course.id}`
                        ? "#7ebbea"
                        : "#646464",
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                marginTop: "10px",
                alignItems: "center",
              }}
            >
              <StudentUpload courseId={course.id} fetchCourses={fetchCourses} />
              <button
                onClick={() => handleDelete(course.id)}
                style={{
                  borderRadius: "8px",
                  border: "2px solid #dc3545",
                  color: "red",
                  width: "45px",
                  height: "30px",
                  // textAlign: "center",
                  // marginRight: "120px",
                  // marginBottom: "15px",
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
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
          </div>
        ))}
      </div>
    </div>
  );
}
