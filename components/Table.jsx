"use client";

import Style from "@/components/table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Table = ({ data }) => {
  if (!data) return <p>لا توجد بيانات للعرض</p>;

  return (
    <table
      className={Style.table}
      style={{
        marginTop: "20px",
        borderCollapse: "separate",
        borderSpacing: "0 10px",
        color: "#626262",
        textAlign: "center",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#D9D9D9" }}>
          <th
            style={{
              padding: "10px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            الطالب
          </th>
          <th>البريد الإلكتروني</th>
          <th>المادة</th>
          <th>متوسط الأداء</th>
          <th>النشاط</th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              {item.name}
            </td>

            <td>{item.email}</td>

            <td>{item.courses}</td>

            <td
              style={{
                color:
                  item.performance === "ممتاز"
                    ? "#21d40a"
                    : item.performance === "ضعيف"
                      ? "#fc3333ff"
                      : "#626262",
              }}
            >
              {" "}
              {item.performance}
            </td>

            <td>
              <span
                style={{
                  backgroundColor:
                    item.activity === "نشط"
                      ? "#79ff67"
                      : item.activity === "غير نشط" || item.activity === "منخفض"
                        ? "rgb(253, 107, 107)"
                        : "#ffffff",
                  padding: "5px",
                  borderRadius: "10px",
                  display: "inline-block",
                  width: "70px",
                  textAlign: "center",
                }}
              >
                {item.activity}
              </span>
            </td>

            <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
              <Link
                href={`/Teacher_Dashboard/students/${item.id}/studentDetails`}
              >
                <button aria-label="عرض الطالب">
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
