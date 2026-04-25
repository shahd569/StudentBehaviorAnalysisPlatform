"use client";

import { useEffect, useState } from "react";
import Style from "@/components/table2.module.css";
import { faEdit, faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Table = ({ data, loading }) => {
  if (loading) return <p>جاري تحميل الواجبات...</p>;

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
            الواجب
          </th>
          <th>المادة</th>
          <th>تاريخ التسليم</th>
          <th>الحالة</th>
          <th>العلامة</th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {data?.map((item) => (
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
              {new Date(item.date)
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}
            </td>

            <td> {item.status}</td>

            <td>{item.score}</td>

            <td
              style={{
                padding: "10px",
                borderRadius: "10px 0 0 10px",
              }}
            >
              <Link
                href={`/Student_Dashboard/assignments/completed/${item.id}/availableForEdit`}
                style={{ padding: "10px" }}
              >
                <button aria-label="عرض الواجب">
                  <FontAwesomeIcon
                    icon={faEye}
                    style={{ color: "gray" }}
                  ></FontAwesomeIcon>
                </button>
              </Link>

              <Link
                href={`/Student_Dashboard/assignments/completed/${item.id}/assignmentFinalScore`}
              >
                <button aria-label="تعديل الواجب">
                  <FontAwesomeIcon
                    icon={faPen}
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
1;
