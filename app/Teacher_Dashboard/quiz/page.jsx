"use client";
import Table from "@/components/quizTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function QuizTable() {
  const [quiz, setQuiz] = useState([]);
  const [displayedQuiz, setDisplayedQuiz] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [objectFilter, setObjectFilter] = useState("الكل");
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("الكل");

  const searchParams = useSearchParams();
  const lessonId = Number(searchParams.get("lessonId"));

  // 🔹 جلب البيانات
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/quizzes");
        const data = await res.json();
        const quizzesData = data.quizzes || [];
        setQuiz(quizzesData);
        setDisplayedQuiz(quizzesData);

        // استخراج المواد للفلاتر
        const uniqueCourses = [
          ...new Set(quizzesData.map((q) => q.courseName)),
        ].filter(Boolean);
        setCourses(uniqueCourses);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, []);

  //  الفلاتر
  useEffect(() => {
    let result = [...quiz];

    if (lessonId) {
      result = result.filter(
        (quiz) => Number(quiz.lessonId) === Number(lessonId),
      );
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (objectFilter !== "الكل") {
      result = result.filter((q) => q.courseName === objectFilter);
    }

    // 2. فلتر الحالة
    if (statusFilter !== "الكل") {
      result = result.filter((student) => student.status === statusFilter);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedQuiz(result);
  }, [searchQuery, objectFilter, statusFilter, quiz]);

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
      <h1 style={{ fontWeight: "bold", color: "black" }}>الاختبارات</h1>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>
          إدارة وتتبع اختبارات جميع المواد
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

            {courses.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* فلتر الحالة */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: "#f5d7f4",
              border: "none",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            <option value="الكل">الحالة</option>
            <option value="لم يبدأ بعد">لم يبدأ بعد</option>
            <option value="نشط">نشط</option>
            <option value="منتهي">منتهي</option>
          </select>
        </div>
      </div>

      <Table quizzes={displayedQuiz} />
    </div>
  );
}
