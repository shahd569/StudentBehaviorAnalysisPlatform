"use client";

import Style from "@/components/table.module.css";

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
            الاختبار
          </th>

          <th> المادة </th>
          <th>العلامة</th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>التاريخ</th>
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
              {item.title}
            </td>

            <td>{item.courseName}</td>
            <td>{item.score}</td>
            <td 
            style={{
              padding: "10px",
              borderRadius: "10px 0 0 10px",
              }}>
              {item.date
                ? new Date(item.date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : "لا يوجد تسليم"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;