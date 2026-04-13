"use client";

import Style from "@/components/table.module.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Table = ({ data }) => {
  if (!data) return <p>لا توجد بيانات متوفرة</p>;

  return (
    <table
      className={Style.table}
      style={{
        borderCollapse: "separate",
        borderSpacing: "0 10px",
        color: "#626262",
        width: "100%",
        textAlign: "center",
      }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: "#D9D9D9",
            border: "1px solid #eee",
          }}
        >
          <th
            style={{
              padding: "10px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            الطالب
          </th>
          <th> حالة التسليم </th>
          <th>تاريخ التسليم </th>
          <th>الملف</th>
          <th>العلامة</th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              {item.studentName}
            </td>

            <td>{item.status}</td>
            <td>
              {item.submittedAt
                ? new Date(item.submittedAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : "لا يوجد تسليم"}
            </td>
            <td>
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  // style={{ color: "#e672fd", textDecoration: "underline" }}
                >
                  🗂️
                </a>
              ) : (
                "لا يوجد ملف"
              )}
            </td>
            <td>{item.score}</td>
            <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
              <FontAwesomeIcon
                icon={faEye}
                style={{ color: "gray" }}
              ></FontAwesomeIcon>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
