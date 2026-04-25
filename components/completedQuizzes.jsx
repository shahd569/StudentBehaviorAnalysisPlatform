"use client";

import { useEffect, useState } from "react";
import Style from "@/components/table2.module.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Table = ({ quizzes, loading }) => {
  if (loading) return <p>جاري التحميل...</p>;
  return (
    <table
      className={Style.table}
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: "0 10px",
        color: "#626262",
        marginTop: "30px",
        textAlign: "center",
      }}
    >
      <thead
        style={{
          backgroundColor: "#D9D9D9",
          border: "1px solid #eee",
        }}
      >
        <tr>
          <th
            style={{
              padding: "10px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            الاختبار
          </th>
          <th>المادة</th>
          <th>العلامة</th>
          <th>الوقت المستغرق</th>
          <th>التاريخ</th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {quizzes?.map((item) => (
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
            <td> {item.score}</td>
            <td>{item.duration}</td>
            <td>
              {new Date(item.date)
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}
            </td>

            <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
              <Link href={`/Student_Dashboard/quizzes/completed/${item.id}`}>
                <button aria-label="عرض الاختبار">
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
  );
};

export default Table;
