"use client";

import useSWR from "swr";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RegistrationStatisticsChart() {
  const { data, error, isLoading } = useSWR(
    "/api/adminDashboard/homePage/homePageSchems",
    fetcher,
    {
      refreshInterval: 30000,
    },
  );

  if (isLoading) {
    return (
      <div
        style={{
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        جاري تحميل البيانات...
      </div>
    );
  }

  if (error || !data?.monthlyCounts?.length) {
    return (
      <div
        style={{
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        لا توجد بيانات متاحة
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        height: "420px",
      }}
    >
      <h4
        style={{
          marginBottom: "20px",
          // color: "#00217a",
          fontWeight: "bold",
        }}
      >
        إحصائيات التسجيل خلال آخر 12 شهراً
      </h4>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data.monthlyCounts}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />

          <YAxis tick={{ fill: "#64748b" }} allowDecimals={false} />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              borderColor: "#dbeafe",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="studentsCount"
            name="الطلاب"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />

          <Line
            type="monotone"
            dataKey="teachersCount"
            name="المدرسون"
            stroke="#00217a"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
