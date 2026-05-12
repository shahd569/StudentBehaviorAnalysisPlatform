"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRef } from "react";

export default function QuizTakingPage() {
  const router = useRouter();
  const params = useParams();
  const answersRef = useRef({});

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const attemptId = params.quizId;

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await fetch(
          `/api/studentDashboard/quizzes/available/${attemptId}/quizQuestions`,
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

  useEffect(() => {
    if (!quizData?.quizInfo?.duration) return;

    const durationInSeconds = quizData.quizInfo.duration * 60; // نفترض بالدقائق
    let endTime = Date.now() + durationInSeconds * 1000;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizData]);

  const handleSelectOption = (questionId, optionIndex) => {
    const updated = {
      ...answersRef.current,
      [questionId]: optionIndex + 1,
    };

    answersRef.current = updated;
    setSelectedAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < quizData.questions.length) {
      if (
        !confirm(
          "لم تقم بالإجابة على جميع الأسئلة، هل تريد الإرسال على أي حال؟",
        )
      )
        return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        "/api/studentDashboard/quizzes/available/submit",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId: attemptId,
            answers: selectedAnswers,
          }),
        },
      );

      if (res.ok) {
        alert("تم تسليم الاختبار بنجاح!");
        router.push("/Student_Dashboard/quizzes");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "فشل في إرسال الحل");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("حدث خطأ أثناء الإرسال");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    try {
      await fetch("/api/studentDashboard/quizzes/available/submit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: attemptId,
          answers: answersRef.current,
        }),
      });

      alert("انتهى الوقت! تم إرسال الحل تلقائياً ⏰");
      router.push("/Student_Dashboard/quizzes");
    } catch (error) {
      console.error("Auto submit error:", error);
      router.push("/Student_Dashboard/quizzes");
    }
  };

  if (loading)
    return <div className="text-center mt-5">جاري تحميل الأسئلة...</div>;
  if (!quizData)
    return <div className="text-center mt-5">لم يتم العثور على بيانات.</div>;

  return (
    <div
      className="container-fluid"
      style={{ direction: "rtl", padding: "20px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-white rounded">
        <h4 className="fw-bold">{quizData.quizInfo.courseName}</h4>
        <div className=" fw-bold">المدة : {quizData.quizInfo.duration}</div>
        <div className=" fw-bold">
          تاريخ الانتهاء :{" "}
          {new Date(quizData.quizInfo.dueDate)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")}
        </div>
        <div className=" fw-bold">
          الدرجة الكلية : {quizData.quizInfo.maxScore}
        </div>
      </div>

      {timeLeft !== null && (
        <div
          style={{
            position: "sticky",
            top: "0",
            zIndex: 1000,
            background: "#fff",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: timeLeft < 60 ? "#dc3545" : "#5194F8",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          الوقت المتبقي: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      )}

      <div className="row g-4">
        {quizData.questions.map((q, qIndex) => (
          <div key={qIndex} className="col-md-6">
            <div className="card border-0 shadow-sm p-4">
              <div className="d-flex justify-content-between mb-3">
                <span className="badge bg-primary text-white p-2">
                  سؤال {qIndex + 1}
                </span>
                <span className="text-muted small">{q.scoreValue} درجة</span>
              </div>

              <h5 className="mb-4 fw-bold">{q.questionText}</h5>

              <div className="d-flex flex-column gap-3">
                {q.options.map((option, optIndex) => {
                  const isSelected = selectedAnswers[q.id] === optIndex + 1;

                  return (
                    <div
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className="d-flex align-items-center gap-3 p-3 rounded-3"
                      style={{
                        cursor: "pointer",
                        border: isSelected
                          ? "2px solid #5194F8"
                          : "1px solid #dee2e6",
                        backgroundColor: isSelected ? "#EBF3FF" : "#F8F9FA",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={isSelected}
                        onChange={() => {}}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                      <div
                        className="flex-grow-1 text-end"
                        style={{ fontSize: "16px" }}
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

      <div className="d-flex justify-content-center mt-5 mb-5">
        <button
          onClick={handleSubmitQuiz}
          disabled={isSubmitting}
          className="btn btn-lg text-white"
          style={{
            backgroundColor: "#5194F8",
            padding: "12px 60px",
            borderRadius: "10px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(81, 148, 248, 0.3)",
          }}
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال الحل النهائي"}
        </button>
      </div>
    </div>
  );
}
