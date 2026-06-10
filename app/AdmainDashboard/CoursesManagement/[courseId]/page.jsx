"use client";
import Table from "@/components/StudentEnrollmentTable";
import { useParams } from "next/navigation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
// import StudentUpload from "@/components/studentUpload";
// import TeacherUpload from "@/components/teacherUpload";
export default function UsersTable() {
  const [allUsers, setAllUsers] = useState([]);

  const params = useParams();
  const id = Number(params.courseId);

  //   const [displayedUsers, setDisplayedUsers] = useState([]);

  // 3. حالات الفلاتر
  //   const [searchQuery, setSearchQuery] = useState(""); // للبحث بالاسم
  //   const [roleFilter, setRoleFilter] = useState("الكل");
  //   const [loading, setLoading] = useState(false);
  //   const [selectedFile, setSelectedFile] = useState(null);
  //   const [fileName, setFileName] = useState("اختر ملف CSV");

  //   const handleFileChange = (e) => {
  //     const file = e.target.files?.[0];

  //     if (!file) {
  //       setSelectedFile(null);
  //       setFileName("اختر ملف CSV");
  //       return;
  //     }

  //     setSelectedFile(file);
  //     setFileName(file.name);
  //   };

  //   const handleStudentUpload = async () => {
  //     if (!selectedFile) {
  //       alert("يرجى اختيار ملف أولاً");
  //       return;
  //     }

  //     setLoading(true);

  //     try {
  //       const formData = new FormData();
  //       formData.append("file", selectedFile);

  //       const res = await fetch("/api/adminDashboard/settings/upload-students", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       const result = await res.json();

  //       if (res.ok) {
  //         const newlyAddedCount = result.statistics?.newlyAdded ?? 0;
  //         const totalInFileCount = result.statistics?.totalInFile ?? 0;
  //         const alreadyExistsCount = result.statistics?.alreadyExists ?? 0;
  //         alert(
  //           `${result.message}\nعدد الطلاب الجدد الذين تمت إضافتهم: ${newlyAddedCount}\nعدد الطلاب الموجودين بالفعل: ${alreadyExistsCount}\nعدد الطلاب في الملف: ${totalInFileCount}
  // `,
  //         );
  //         setSelectedFile(null);
  //         setFileName("اختر ملف CSV");
  //       } else {
  //         alert(
  //           `فشل الرفع: ${result.error || result.message || "خطأ غير معروف"}`,
  //         );
  //       }
  //     } catch (error) {
  //       console.error("FRONTEND UPLOAD ERROR:", error);
  //       alert("حدث خطأ في معالجة البيانات بالواجهة أو انقطع الاتصال بالخادم");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   const handleTeacherUpload = async () => {
  //     if (!selectedFile) {
  //       alert("يرجى اختيار ملف أولاً");
  //       return;
  //     }

  //     setLoading(true);

  //     try {
  //       const formData = new FormData();
  //       formData.append("file", selectedFile);

  //       const res = await fetch("/api/adminDashboard/settings/upload-stuff", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       const result = await res.json();

  //       if (res.ok) {
  //         const newlyAddedCount = result.statistics?.newlyAdded ?? 0;
  //         const totalInFileCount = result.statistics?.totalInFile ?? 0;
  //         const alreadyExistsCount = result.statistics?.alreadyExists ?? 0;
  //         alert(
  //           `${result.message}\nعدد المدرسين الجدد الذين تمت إضافتهم: ${newlyAddedCount}\nعدد المدرسين الموجودين بالفعل: ${alreadyExistsCount}\nعدد المدرسين في الملف: ${totalInFileCount}
  // `,
  //         );
  //         setSelectedFile(null);
  //         setFileName("اختر ملف CSV");
  //       } else {
  //         alert(
  //           `فشل الرفع: ${result.error || result.message || "خطأ غير معروف"}`,
  //         );
  //       }
  //     } catch (error) {
  //       console.error("FRONTEND UPLOAD ERROR:", error);
  //       alert("حدث خطأ في معالجة البيانات بالواجهة أو انقطع الاتصال بالخادم");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/adminDashboard/studentsEnrollmentInfo/${id}`,
        );
        const data = await res.json();
        console.log("in home page" + data.studentsInfo);
        setAllUsers(data.studentsInfo || []);
        // setDisplayedUsers(data.studentsInfo || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [id]);

  //   useEffect(() => {
  //     let result = allUsers;

  //     // البحث بالاسم أو الإيميل
  //     if (searchQuery) {
  //       result = result.filter(
  //         (user) =>
  //           `${user.firstName} ${user.lastName}`
  //             .toLowerCase()
  //             .includes(searchQuery.toLowerCase()) ||
  //           user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  //       );
  //     }

  //     // فلترة حسب الدور
  //     if (roleFilter !== "الكل") {
  //       result = result.filter((user) => user.role === roleFilter);
  //     }

  //     setDisplayedUsers(result);
  //   }, [searchQuery, roleFilter, allUsers]);

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
      <h1 style={{ fontWeight: "bold", color: "black" }}>
        إدارة الطلاب المسجلين{" "}
      </h1>

      <Table data={allUsers}></Table>
    </div>
  );
}
