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

const AttendanceChart = () => {
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR("/api/studentDashboard/homePageScheme", fetcher, {
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

  const chartData = apiResponse?.studentPerformanceInfo?.map((item) => ({
    name: item.courseName,
    students: Number(item.averageScore),
  }));

  if (error || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div
        style={{ minHeight: "300px" }}
        className="card border-0 shadow-sm rounded-4 p-4 d-flex align-items-center justify-content-center"
      >
        <p className="text-muted">لا توجد بيانات</p>
      </div>
    );
  }

  return (
    <div
      className="card border-0 shadow-sm p-4 h-100"
      style={{ minHeight: "300px" }}
    >
      <h6 className="fw-bold mb-4 text-end" style={{ color: "#374151" }}>
        مخطط الأداء حسب المواد
      </h6>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={30} barCategoryGap={-10} barGap={0}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#9ca3af" }}
            tickLine={false}
            padding={{ left: 0, right: 0 }}
          />

          <YAxis
            axisLine={false}
            tick={{ fill: "#9ca3af" }}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />

          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "10px" }}
          />

          <Bar
            dataKey="students"
            fill="#D7E2F5"
            radius={[10, 10, 0, 0]}
            name="الدرجة"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
