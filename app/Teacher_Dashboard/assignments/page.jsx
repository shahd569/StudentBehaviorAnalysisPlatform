"use client";
import Table from "@/components/AssignmentsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AssignmentTable() {
  const [allAssignments, setAllAssignments] = useState([]);
  const [displayedAssignments, setDisplayedAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [objectFilter, setObjectFilter] = useState("الكل");
  const [courses, setCourses] = useState([]);

  const searchParams = useSearchParams();
  const lessonId = Number(searchParams.get("lessonId"));

  // 🔹 جلب البيانات
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/assignments");
        const data = await res.json();
        const assignmentsData = data.assignments || [];
        setAllAssignments(assignmentsData);
        setDisplayedAssignments(assignmentsData);

        const uniqueCourses = [
          ...new Set(assignmentsData.map((a) => a.courseName)),
        ].filter(Boolean);
        setCourses(uniqueCourses);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  // استبدلي useEffect الخاص بالفلاتر في ملف page.jsx بهذا الكود
  useEffect(() => {
    let result = [...allAssignments];

    if (lessonId) {
      console.log(lessonId);
      result = result.filter(
        (assignment) => Number(assignment.lessonId) === Number(lessonId),
      );
    }
    // فلتر البحث
    if (searchQuery.trim() !== "") {
      result = result.filter((item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // فلتر المادة
    if (objectFilter !== "الكل") {
      result = result.filter((item) => item.courseName === objectFilter);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedAssignments(result);
  }, [searchQuery, objectFilter, allAssignments, lessonId]);

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
      <h1 style={{ fontWeight: "bold", color: "black" }}>الواجبات</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>
          إدارة وتتبع واجبات جميع المواد
        </p>

        <div
          className="filters-container"
          style={{ display: "flex", gap: "15px", marginBottom: "20px" }}
        >
          {/* 🔍 البحث */}
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                color: "gray",
              }}
            />

            <input
              style={{
                border: "1px solid #eee",
                borderRadius: "50px",
                padding: "8px 40px",
              }}
              type="text"
              placeholder="بحث ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 🎯 فلتر المادة */}
          <select
            style={{
              backgroundColor: "#f5d7f4",
              border: "none",
              borderRadius: "10px",
              padding: "5px",
              cursor: "pointer",
              width: "100px",
              textAlign: "center",
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
      <Table assignments={displayedAssignments} />{" "}
    </div>
  );
}
