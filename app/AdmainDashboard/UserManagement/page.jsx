"use client";
import Table from "@/components/UserTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import StudentUpload from "@/components/studentUpload";
import TeacherUpload from "@/components/teacherUpload";
export default function UsersTable() {
  const [allUsers, setAllUsers] = useState([]);

  const [displayedUsers, setDisplayedUsers] = useState([]);

  // 3. حالات الفلاتر
  const [searchQuery, setSearchQuery] = useState(""); // للبحث بالاسم
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("اختر ملف CSV");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setFileName("اختر ملف CSV");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleStudentUpload = async () => {
    if (!selectedFile) {
      alert("يرجى اختيار ملف أولاً");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/adminDashboard/settings/upload-students", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        const newlyAddedCount = result.statistics?.newlyAdded ?? 0;
        const totalInFileCount = result.statistics?.totalInFile ?? 0;
        const alreadyExistsCount = result.statistics?.alreadyExists ?? 0;
        alert(
          `${result.message}\nعدد الطلاب الجدد الذين تمت إضافتهم: ${newlyAddedCount}\nعدد الطلاب الموجودين بالفعل: ${alreadyExistsCount}\nعدد الطلاب في الملف: ${totalInFileCount}
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
  const handleTeacherUpload = async () => {
    if (!selectedFile) {
      alert("يرجى اختيار ملف أولاً");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/adminDashboard/settings/upload-stuff", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        const newlyAddedCount = result.statistics?.newlyAdded ?? 0;
        const totalInFileCount = result.statistics?.totalInFile ?? 0;
        const alreadyExistsCount = result.statistics?.alreadyExists ?? 0;
        alert(
          `${result.message}\nعدد المدرسين الجدد الذين تمت إضافتهم: ${newlyAddedCount}\nعدد المدرسين الموجودين بالفعل: ${alreadyExistsCount}\nعدد المدرسين في الملف: ${totalInFileCount}
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/adminDashboard/usersManagement");
        const data = await res.json();

        setAllUsers(data.users || []);
        setDisplayedUsers(data.users || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = allUsers;

    // البحث بالاسم أو الإيميل
    if (searchQuery) {
      result = result.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // فلترة حسب الدور
    if (roleFilter !== "الكل") {
      result = result.filter((user) => user.role === roleFilter);
    }

    setDisplayedUsers(result);
  }, [searchQuery, roleFilter, allUsers]);

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
      <h1 style={{ fontWeight: "bold", color: "black" }}>إدارة المستخدمين </h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
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
              onChange={handleFileChange}
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
            onClick={handleStudentUpload}
            disabled={loading}
            style={{
              backgroundColor: "#d7dff5",
              border: "none",
              borderRadius: "10px",
              padding: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "جاري المعالجة والرفع..." : "رفع قائمة الطلاب"}
          </button>
          <button
            onClick={handleTeacherUpload}
            disabled={loading}
            style={{
              backgroundColor: "#d7dff5",
              border: "none",
              borderRadius: "10px",
              padding: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "جاري المعالجة والرفع..." : "رفع قائمة المدرسين"}
          </button>
        </div>
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          {/* بحث بالاسم */}
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: "absolute",
                top: "30%",
                right: "10px",
                color: "gray",
              }}
            />

            <input
              style={{
                border: "1px solid #eee",
                borderRadius: "50px",
                padding: "5px 35px",
              }}
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* فلتر الدور */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              backgroundColor: "#d7dff5",
              border: "none",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            <option value="الكل">كل الأدوار</option>
            <option value="TEACHER">أستاذ</option>
            <option value="STUDENT">طالب</option>
            <option value="ADMIN">مدير</option>
          </select>
          {/* رفع طالب  */}
          <StudentUpload></StudentUpload>
          <TeacherUpload></TeacherUpload>
        </div>
      </div>
      <Table data={displayedUsers}></Table>
    </div>
  );
}
