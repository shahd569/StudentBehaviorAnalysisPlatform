"use client";

import { useEffect, useState } from "react";
import Style from "@/components/table.module.css";

const Table = ({ quizzes }) => {
  return (
    <table
      className={Style.table}
      style={{
        borderCollapse: "separate",
        borderSpacing: "0 10px",
        color: "#626262",
        textAlign: "center",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#D9D9D9", border: "1px solid #eee" }}>
          <th
            style={{
              padding: "10px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            عنوان الاختبار
          </th>
          <th>المادة</th>
          <th>الحالة</th>
          <th>عدد المتقدمين</th>
          <th>عدد غير المتقدمين</th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>متوسط الدرجات</th>
        </tr>
      </thead>

      <tbody>
        {quizzes.map((item) => (
          <tr key={item.id}>
            <td
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              {item.title}
            </td>
            <td>{item.courseName}</td>
            <td>
              <span
                style={{
                  backgroundColor:
                    item.status === "نشط"
                      ? "#8cfc7d"
                      : item.status === "منتهي"
                        ? "#eee"
                        : "#bfd5f7",
                  padding: "5px",
                  borderRadius: "10px",
                  display: "inline-block",
                  width: "70px",
                  textAlign: "center",
                }}
              >
                {item.status}
              </span>
            </td>
            <td> {item.completedCount}</td>
            <td>
              <span>{item.notCompletedCount}</span>
            </td>
            <td>
              <span
                style={{
                  color:
                    item.averageScore >= "60"
                      ? "#20c00b"
                      : item.averageScore <= "60"
                        ? "#fc3333ff"
                        : "#ffffff",
                }}
              >
                {item.averageScore}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
