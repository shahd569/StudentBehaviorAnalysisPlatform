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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AttendanceChart = () => {
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR("/api/teacherDashboard/homePageSchemes", fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading) {
    return (
      <div
        style={{ minHeight: "200px" }}
        className="card border-0 shadow-sm p-4 d-flex align-items-center justify-content-center"
      >
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  const chartData = apiResponse?.barChartData;

  if (error || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div
        style={{ minHeight: "200px" }}
        className="card border-0 shadow-sm p-4 d-flex align-items-center justify-content-center"
      >
        <p className="text-muted">لا توجد بيانات نشاط لهذا الأسبوع</p>
      </div>
    );
  }

  return (
    <div
      className="card border-0 shadow-sm p-4 h-100"
      style={{ minHeight: "200px" }}
    >
      <h6 className="fw-bold mb-4 text-end" style={{ color: "#374151" }}>
        نشاط الطلاب خلال الأسبوع
      </h6>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={20}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 13 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            allowDecimals={false}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip cursor={{ fill: "#f9fafb" }} />
          <Bar
            dataKey="students"
            fill="#a855f7"
            radius={[10, 10, 0, 0]}
            name="عدد الطلاب"
            isAnimationActive={false}
            minPointSize={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
