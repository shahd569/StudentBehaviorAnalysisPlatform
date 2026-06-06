"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#00217a", // كحلي
  "#1d4ed8", // أزرق
  "#3b82f6", // أزرق فاتح
  "#60a5fa", // سماوي
  "#93c5fd", // أفتح
];

export default function AcademicYearsPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch("/api/adminDashboard/homePage/homePageSchems");
        const result = await res.json();

        if (res.ok) {
          const formattedData =
            result.academicYearDistribution?.map((item) => ({
              name: item.academicYear,
              value: item.studentsCount,
            })) || [];

          setData(formattedData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div
      style={{
        flex: "1",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        width: "100%",
        height: "300px",
      }}
    >
      <h4
        style={{
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        توزيع الطلاب حسب السنوات الدراسية
      </h4>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
