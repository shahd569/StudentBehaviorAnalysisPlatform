"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function RecommendationsList({ recommendations = [] }) {
  return (
    <div
      style={{
        width: "50%",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <FontAwesomeIcon
          icon={faUser}
          style={{
            color: "#7c9efc",
            fontSize: "28px",
          }}
        />

        <h4
          style={{
            margin: 0,
            fontWeight: "bold",
          }}
        >
          جدول التوصيات
        </h4>
      </div>

      <hr />

      {recommendations.length > 0 ? (
        recommendations.map((item, index) => (
          <div key={index}>
            <p
              style={{
                margin: "10px 0",
                color: "#4b5563",
                lineHeight: "1.8",
                fontSize: "17px",
              }}
            >
              {item.content || item}
            </p>

            {index < recommendations.length - 1 && (
              <hr
                style={{
                  borderColor: "#e5e7eb",
                  opacity: 0.7,
                }}
              />
            )}
          </div>
        ))
      ) : (
        <p
          style={{
            color: "#6b7280",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          لا توجد توصيات متاحة حالياً
        </p>
      )}
    </div>
  );
}
