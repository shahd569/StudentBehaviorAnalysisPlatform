"use client";
import React, { useEffect, useState, use } from "react"; // استيراد use من react

const Performance = ({ data }) => {
  if (!data) return <p>لا توجد إحصائيات متوفرة</p>;

  const getTrendColor = (trend) => {
    if (trend === "في ارتفاع") return "#28a745"; // أخضر
    if (trend === "في انخفاض") return "#dc3545"; // أحمر
    return "#ffc107"; // أصفر للمستقر
  };

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
      {/* 3. التقدير المتوقع (مستقر - في ارتفاع - في انخفاض) مدعوماً بالذكاء الاصطناعي */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{
              color: "#5f5f5f",
              fontWeight: "bold",
              fontSize: "18px",
              margin: 0,
            }}
          >
            التقدير المتوقع :
          </p>
          <span
            style={{
              color: "white",
              backgroundColor: getTrendColor(data.trend),
              padding: "4px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "16px",
              marginRight: "10px",
            }}
          >
            {data.trend || "مستقر"}
          </span>
        </div>

        {/* عرض نسبة ثقة النموذج بالتنبؤ إذا توفرت */}
        {data.confidence && (
          <p style={{ fontSize: "13px", color: "gray", margin: 0 }}>
            نسبة تيقن الذكاء الاصطناعي: {data.confidence}%
          </p>
        )}
      </div>

      {/* 4. كارد أسباب تفصيلية مدعوم بميزة Explainable AI للنظام */}
      {data.reasons && data.reasons.length > 0 && (
        <div
          style={{
            border: "1px dashed #0111a1",
            borderRadius: "10px",
            padding: "15px",
            width: "350px",
            backgroundColor: "#f4f6ff",
          }}
        >
          <h6
            style={{
              color: "#0111a1",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            تحليل السلوك الذكي (أسباب التقدير):
          </h6>
          <ul
            style={{
              paddingRight: "20px",
              margin: 0,
              fontSize: "14px",
              color: "#333",
            }}
          >
            {data.reasons.map((reason, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {reason === "Student performance is declining recently" &&
                  "📉 تراجع أداء الطالب ونشاطه في الأيام الأخيرة ."}
                {reason === "Overall engagement is low" &&
                  "⚠️ التفاعل العام للطالب مع المحتوى يعتبر منخفضاً برمجياً."}
                {![
                  "Student performance is declining recently",
                  "Overall engagement is low",
                ].includes(reason) && reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Performance;
