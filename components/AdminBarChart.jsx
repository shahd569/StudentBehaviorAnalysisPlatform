"use client";

import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TopCoursesChart() {
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR("/api/adminDashboard/homePage/homePageSchems", fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading) {
    return (
      <div
        style={{ minHeight: "300px" }}
        className="card border-0 shadow-sm p-4 d-flex align-items-center justify-content-center"
      >
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  const chartData =
    apiResponse?.topCourses?.map((course) => ({
      name: course.courseName,
      students: course.studentsCount,
    })) || [];

  if (error || chartData.length === 0) {
    return (
      <div
        style={{
          flex: "1",
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid #dad9d9",
          width: "100%",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        // className="card border-0 shadow-sm rounded-4 p-4 d-flex align-items-center justify-content-center"
      >
        <p className="text-muted">لا توجد بيانات للمقررات</p>
      </div>
    );
  }

  return (
    <div
      //   className="card border-0 shadow-sm p-4 h-100"
      style={{
        flex: "1",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        width: "100%",
        height: "300px",
      }}
    >
      <h4 className="fw-bold mb-4 text-end">أكثر المقررات تسجيلاً</h4>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData} barSize={28}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fill: "#64748b" }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              borderColor: "#dbeafe",
            }}
          />

          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "10px" }}
          />

          <Bar
            dataKey="students"
            name="عدد الطلاب"
            fill="#93c5fd"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
