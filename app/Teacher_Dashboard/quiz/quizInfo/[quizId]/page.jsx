"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function QuizReviewPage() {
  const router = useRouter();
  const params = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  const attemptId = params.quizId;

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await fetch(
          `/api/studentDashboard/quizzes/completed/${attemptId}`,
        );
        const data = await res.json();
        if (res.ok) {
          setQuizData(data);
        }
      } catch (error) {
        console.error("خطأ في جلب تفاصيل الاختبار:", error);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) fetchQuizDetails();
  }, [attemptId]);

  if (loading)
    return <div className="text-center mt-5">جاري تحميل النتائج...</div>;
  if (!quizData)
    return <div className="text-center mt-5">لم يتم العثور على بيانات.</div>;

  return (
    <div
      className="container-fluid"
      style={{ minHeight: "100vh", padding: "40px", direction: "rtl" }}
    >
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{
          backgroundColor: "#fff",
          padding: "15px 30px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div className="d-flex gap-4 text-center">
          <div>
            <p
              style={{
                fontWeight: "bold",
                margin: "0",
                fontSize: "16px",
                color: "#333",
              }}
            >
              المادة
            </p>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "5px 25px",
                borderRadius: "5px",
                marginTop: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {quizData.courseName}
            </div>
          </div>
          <div>
            <p
              style={{
                fontWeight: "bold",
                margin: "0",
                fontSize: "16px",
                color: "#333",
              }}
            >
              الدرجة المستحقة
            </p>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "5px 25px",
                borderRadius: "5px",
                marginTop: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {quizData.score} / {quizData.maxScore}
            </div>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="btn btn-light"
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px 30px",
          }}
        >
          رجوع
        </button>
      </div>

      <div className="row g-4">
        {quizData.details.map((q, index) => (
          <div key={index} className="col-md-6">
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #eee",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <span
                  style={{
                    color: "#999",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  ▼
                </span>
                <div
                  className="flex-grow-1"
                  style={{
                    border: "1px solid #999898",
                    padding: "10px",
                    borderRadius: "5px",
                    textAlign: "right",
                    backgroundColor: "#F8F8F8",
                  }}
                >
                  {q.questionText}
                </div>
                <span
                  style={{
                    color: "#0065FC",
                    fontWeight: "bold",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                  }}
                >
                  {q.scoreValue} درجة
                </span>
              </div>

              <div className="d-flex flex-column gap-2">
                {q.options.map((option, optIndex) => {
                  let bgColor = "#F8F8F8";

                  const correctAnswerIndex = q.correctAnswer - 1;
                  const studentAnswerIndex = q.studentAnswer - 1;

                  if (optIndex === correctAnswerIndex) {
                    bgColor = "#ACFF93";
                  } else if (
                    optIndex === studentAnswerIndex &&
                    q.isCorrect === false
                  ) {
                    bgColor = "#FFB3B3";
                  }

                  return (
                    <div
                      key={optIndex}
                      className="d-flex align-items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={optIndex === studentAnswerIndex}
                        readOnly
                        style={{ width: "18px", height: "18px" }}
                      />
                      <div
                        className="flex-grow-1"
                        style={{
                          backgroundColor: bgColor,
                          border: "1px solid #dee2e6",
                          padding: "10px",
                          borderRadius: "5px",
                          textAlign: "right",
                        }}
                      >
                        {option}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
