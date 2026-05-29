"use client";
import React, { useEffect, useState, use } from "react";
import Table from "@/components/AssignmentDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Style from "@/components/table.module.css";
import Link from "next/link";

const QuizDetails = ({ params }) => {
  const { id } = use(params);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          `/api/teacherDashboard/quizzes/${id}/attempts`,
        );
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        setQuiz(data.attempts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

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
      <h1 style={{ fontWeight: "bold" }}>الاختبارات</h1>
      <p style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>
        إدارة وتتبع اختبارات جميع المواد
      </p>
      <table
        className={Style.table}
        style={{
          borderCollapse: "separate",
          borderSpacing: "0 10px",
          color: "#626262",
          width: "100%",
          textAlign: "center",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#D9D9D9",
              border: "1px solid #eee",
            }}
          >
            <th
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              الطالب
            </th>
            <th> حالة التسليم </th>
            <th>تاريخ البدء </th>
            {/* <th>تاريخ الانتهاء </th> */}
            <th>المدة</th>
            <th>العلامة</th>
            <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
          </tr>
        </thead>

        <tbody>
          {quiz.map((item, index) => (
            <tr key={index}>
              <td
                style={{
                  padding: "10px",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                {item.studentName}
              </td>

              <td>{item.status}</td>
              <td>
                {item.startTime
                  ? new Date(item.startTime)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : "لا يوجد تسليم"}
              </td>
              {/* <td>
                {item.finishTime
                  ? new Date(item.finishTime)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : "لا يوجد تسليم"}
              </td> */}

              <td>{item.duration}</td>
              <td>{item.score}</td>
              <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
                <Link href={`/Teacher_Dashboard/quiz/quizInfo/${item.id}`}>
                  <button
                    disabled={item.score == "لم يقدم بعد"}
                    aria-label="عرض الاسئلة"
                    style={{
                      cursor:
                        item.score === "لم يقدم بعد"
                          ? "not-allowed"
                          : "pointer",
                      opacity: item.score === "لم يقدم بعد" ? 0.6 : 1,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEye}
                      style={{ color: "gray" }}
                    ></FontAwesomeIcon>
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Table data={assignment.submissions} /> */}
    </div>
  );
};
export default QuizDetails;
