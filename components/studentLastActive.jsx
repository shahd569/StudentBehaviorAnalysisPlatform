"use client";
import React from "react";

const StudentDetails = ({ data }) => {
  if (!data) return <p>لا توجد إحصائيات متوفرة</p>;

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className="d-flex items-center justify-content-between">
        <h4 style={{ marginBottom: "2px", marginTop: "2px", color: "black" }}>
          أحدث النشاطات
        </h4>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "2px",
        }}
      >
        {data.length === 0 && (
          <p style={{ fontSize: "13px" }}>لا توجد نشاطات</p>
        )}

        {data.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "rgba(248, 249, 250, 1)",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <div
              className="d-flex  justify-content-between"
              style={{ alignItems: "center" }}
            >
              <span
                style={{
                  padding: "1px",
                  color: "gray",
                  backgroundColor: "#f3d0faff",
                  borderRadius: "5px",
                }}
              >
                {new Date(item.time).toLocaleDateString()}
              </span>
            </div>

            <p
              style={{
                color: "gray",
                fontSize: "15px",
                marginTop: "3px",
              }}
            >
              {/* {item.studentName}  */}
              {item.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDetails;
