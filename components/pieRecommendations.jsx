// "use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function CustomActiveShapePieChart({ data }) {
  const sData = [
    {
      name: "مستوى أداء منخفض",
      value: data?.atRisk || 0,
      color: "#ff4d4f",
    },
    {
      name: "مستوى أداء متوسط",
      value: data?.borderline || 0,
      color: "#ffb703",
    },
    {
      name: "مستوى أداء عالي",
      value: data?.safe || 0,
      color: "#22c55e",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        width: "100%",
        height: "200px",
        display: "flex",
        gap: "40px",
      }}
    >
      <h4 style={{ marginBottom: "20px" }}>توزيع الطلاب حسب مستوى الاداء</h4>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={sData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {sData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
