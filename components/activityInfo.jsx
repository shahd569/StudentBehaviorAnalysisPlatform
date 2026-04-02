"use client";
import React, { useEffect, useState, use } from "react"; // استيراد use من react

const StudentDetails = ({ data }) => {
  if (!data) return <p>لا توجد إحصائيات متوفرة</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "350px",
          display: "flex",
        }}
      >
        <p style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}>
          عدد مرات تسجيل الدخول :
        </p>
        <p
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "18px",
            marginRight: "5px",
          }}
        >
          {" "}
          {data.loginCount} مرات{" "}
        </p>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "350px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}>
          متوسط وقت الجلسة :
        </p>
        <p
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "18px",
            marginRight: "5px",
          }}
        >
          {data.avgSessionTime} دقيقة
        </p>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "350px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}>
          عدد الأيام النشطة :
        </p>
        <p
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "18px",
            marginRight: "5px",
          }}
        >
          {data.activeDays} أيام
        </p>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "350px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}>
          مستوى النشاط :
        </p>
        <p
          style={{
            backgroundColor:
              data.activityStatus === "نشط" ? "#79ff67" : "rgb(253, 107, 107)",
            padding: "5px",
            borderRadius: "10px",
            display: "inline-block",
            width: "70px",
            textAlign: "center",
            marginRight: "5px",
            color: "black",
          }}
        >
          {data.activityStatus}
        </p>
      </div>
    </div>
  );
};

export default StudentDetails;
