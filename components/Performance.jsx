"use client";
import React, { useEffect, useState, use } from "react"; // استيراد use من react

const Performance = ({ data }) => {
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
          المستوى العام :
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
          {data.performanceStatus}
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
          المعدل العام :
        </p>
        <p
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "18px",
            marginRight: "5px",
          }}
        >
          {data.percentageScore} %
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
          التقدير المتوقع :
        </p>
        <p
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "18px",
            marginRight: "5px",
          }}
        >
          {data.trend}
        </p>
      </div>
    </div>
  );
};

export default Performance;
