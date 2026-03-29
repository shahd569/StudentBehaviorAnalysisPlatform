"use client";
import Table from "@/components/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function StudentsTable() {
  // 1. حالة لتخزين كل الطلاب القادمين من الـ API (البيانات الأصلية)
  const [allStudents, setAllStudents] = useState([]);

  // 2. حالة لتخزين الطلاب الذين سيتم عرضهم في الجدول (بعد الفلترة)
  const [displayedStudents, setDisplayedStudents] = useState([]);

  // 3. حالات الفلاتر
  const [performanceFilter, setPerformanceFilter] = useState("الكل"); // ممتاز، جيد، ضعيف، الكل
  const [activityFilter, setActivityFilter] = useState("الكل"); // نشط جداً، نشط، منخفض، غير نشط، الكل
  const [searchQuery, setSearchQuery] = useState(""); // للبحث بالاسم
  const [objectFilter, setObjectFilter] = useState("الكل");
  const [courses, setCourses] = useState([]);

  // دالة جلب البيانات من الروت الخاص بكِ (يتم استدعاؤها عند تحميل الصفحة)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/students"); // ضعي مسار الروت الصحيح هنا
        const data = await res.json();
        setAllStudents(data.students);
        setDisplayedStudents(data.students); // في البداية نعرض كل الطلاب

        const allCourses = data.students.flatMap((s) => {
          if (!s.courses) return [];
          const courseArray = Array.isArray(s.courses)
            ? s.courses
            : s.courses.split("،").map((item) => item.trim());
          return courseArray;
        });

        const uniqeCourses = [...new Set(allCourses)];

        setCourses(uniqeCourses);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);
  // يعمل هذا الـ useEffect في كل مرة تتغير فيها قيمة أحد الفلاتر أو البحث
  useEffect(() => {
    let result = allStudents;

    // 1. فلتر البحث بالاسم
    if (searchQuery) {
      result = result.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // 2. فلتر الأداء
    if (performanceFilter !== "الكل") {
      result = result.filter(
        (student) => student.performance === performanceFilter,
      );
    }

    // 3. فلتر النشاط
    if (activityFilter !== "الكل") {
      result = result.filter((student) => student.activity === activityFilter);
    }
    if (objectFilter !== "الكل") {
      result = result.filter((student) => {
        if (!student.courses) return false;

        const studentCoursesText = Array.isArray(student.courses)
          ? student.courses.join(" ")
          : student.courses;

        return studentCoursesText.includes(objectFilter);
      });
    }
    // تحديث الجدول بالنتيجة النهائية
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedStudents(result);
  }, [
    searchQuery,
    performanceFilter,
    activityFilter,
    allStudents,
    objectFilter,
  ]);

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
      <h1 style={{ fontWeight: "bold", color: "black" }}>الطلاب</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>
          متابعة أداء الطلاب في جميع المواد
        </p>
        <div>
          <div
            className="filters-container"
            style={{ display: "flex", gap: "15px", marginBottom: "20px" }}
          >
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
              ></FontAwesomeIcon>
              <input
                style={{
                  border: "1px solid #eee",
                  borderRadius: "50px",
                  padding: "5px 35px",
                }}
                type="text"
                placeholder="بحث ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              ></input>
            </div>

            {/* فلتر الأداء */}
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              style={{
                backgroundColor: "#f5d7f4",
                border: "none",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <option value="الكل">كل مستويات الأداء</option>
              <option value="ممتاز">ممتاز</option>
              <option value="جيد">جيد</option>
              <option value="ضعيف">ضعيف</option>
            </select>

            {/* فلتر النشاط */}
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              style={{
                backgroundColor: "#f5d7f4",
                border: "none",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <option value="الكل">كل مستويات النشاط</option>
              <option value="نشط">نشط</option>
              <option value="غير نشط">غير نشط</option>
            </select>
            {/* فلتر المادة */}
            <select
              style={{
                backgroundColor: "#f5d7f4",
                border: "none",
                borderRadius: "10px",
                padding: "5px",
              }}
              value={objectFilter}
              onChange={(e) => setObjectFilter(e.target.value)}
            >
                        <option value="الكل">المادة</option>
                       {" "}
              {courses.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
                     {" "}
            </select>
          </div>
        </div>
      </div>
      <Table data={displayedStudents}></Table>
    </div>
  );
}
