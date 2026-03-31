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
            المادة
          </th>

          <th> عدد مرات الوصول</th>
          <th>الوقت الإجمالي</th>

          <th style={{ borderRadius: "10px 0 0 10px" }}>آخر نشاط</th>
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
              {item.course}
            </td>

            <td>{item.accessCount}</td>
            <td>{item.totalTime}</td>

            <td
              style={{
                padding: "10px",
                borderRadius: "10px 0 0 10px",
              }}
            >
              {item.lastActive
                ? new Date(item.lastActive)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : "لا يوجد نشاط"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
