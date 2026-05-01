"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import {faClock} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Style from "./cards.module.css";
import { useRouter } from "next/navigation";

export default function QuizCards({ quizzes }) {
  const router = useRouter();

  const handleStartQuiz = async (item) => {
    const id = item.id || item.quizId || (item.quiz && item.quiz.id);
    if (!id) {
      console.error("البيانات المستلمة للكارد:", item); // سيطبع لكِ محتوى الـ item في الـ Console لتعرفي الأسماء الصحيحة
      alert("عذراً، لم يتم العثور على معرّف لهذا الاختبار في البيانات.");
      return;
    }
    try {
      
      const res = await fetch(`/api/studentDashboard/quizzes/available/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: id }),
      });
      const data = await res.json();

      if (res.ok) {
        
        router.push(`/Student_Dashboard/quizzes/available/${data.attemptId}`);
      } else {
        alert(data.message || "فشل بدء الاختبار");
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
      alert("حدث خطأ أثناء محاولة بدء الاختبار");
    }
  };

  if (!quizzes) return <p>لا يوجد بيانات</p>;

  return (
    <div className={Style.cards}>
      {quizzes.map((item, index) => (
        <div
          key={index}
          style={{
            borderRadius: "10px",
            padding: "15px",
            background:
              item.status === "متاح"
                ? "linear-gradient(to bottom, #E5EFFF, #F2F2F2)" 
                : "linear-gradient(to bottom, #F0C2EE, #F2F2F2)", 
            boxShadow: "0 4px 4px #ccc",
          }}
        >
          <div>
            <p
              style={{
                color: "white",
                borderRadius: "20px",
                width: "75px",
                textAlign: "center",
                backgroundColor: item.status === "متاح" ? "#28A745" : "#DC3545",
                padding: "5px",
                boxShadow: "0 4px 4px #ccc",
              }}
            >
              {item.status}
            </p>
          </div>

          <div style={{ display: "flex",flexDirection:"column" }}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <h3 style={{ fontWeight: "bold" }}>{item.title}</h3>
              <p
              style={{
                color: "gray",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
            الدرجة العظمى  : {item.maxScore}
            </p>
            </div>
            <p style={{fontSize:"14px"}}>{item.courseName}</p>
            <div style={{display:"flex",gap:"5px"}}>
              <FontAwesomeIcon icon={faCalendar} />
              <p style={{fontSize:"14px"}}>بداية : {item.startDate}</p>
            </div>
            <div style={{display:"flex",gap:"5px"}}>
              <FontAwesomeIcon icon={faCalendar} />
              <p style={{fontSize:"14px"}}>الانتهاء: {item.endDate}</p>
            </div>
            <div style={{display:"flex",gap:"5px"}}>
              <FontAwesomeIcon icon={faClock} />
              <p style={{fontSize:"14px"}}> المدة : {item.duration}</p>
            </div>
          </div>

          

          <div style={{ display: "flex", justifyContent: "end" }}>
            <button
              onClick={() => handleStartQuiz(item)}
              disabled={item.status !== "متاح"}
              style={{
                borderRadius: "5px",
                backgroundColor: "#5194F8",
                color: "white",
                boxShadow: "0 4px 4px #ccc",
                width: "80px",
                height: "40px",
                textAlign: "center",
                marginTop: "20px",
                cursor: item.status === "متاح" ? "pointer" : "not-allowed",
                opacity: item.status === "متاح" ? 1 : 0.6,
              }}
            >
              ابدأ الحل
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
