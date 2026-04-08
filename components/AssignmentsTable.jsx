"use client";

import { useEffect, useState } from "react";
import Style from "@/components/table.module.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Table = ({ assignments }) => {
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
      <thead style={{ border: "1px solid #eee" }}>
        <tr style={{ backgroundColor: "#D9D9D9", border: "1px solid #eee" }}>
          <th
            style={{
              padding: "10px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            عنوان الواجب
          </th>
          <th>المادة</th>
          <th>عدد الطلاب </th>
          <th>تم التسليم </th>
          <th>متأخر </th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {assignments.map((item) => (
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

            <td>{item.totalStudents}</td>

            <td style={{ color: "#20c00b" }}> {item.submittedCount}</td>

            <td style={{ color: "red" }}>
              <span>{item.notSubmittedCount}</span>
            </td>

            <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
              <Link
                href={`/Teacher_Dashboard/assignments/${item.id}/assignmentDetails`}
              >
                <button aria-label="عرض الواجب">
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
