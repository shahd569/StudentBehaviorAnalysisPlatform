"use client";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

const PerformanceChart = ({ data }) => {
  if (!data) return <p>لا توجد بيانات</p>;

  return (
    <div style={{ width: "600px", marginTop: "-40px" }}>
      <h4 style={{ textAlign: "center" }}>تحليل أداء الطالب شهرياً</h4>
      <LineChart
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={data.charData}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis
          dataKey="month"
          padding={{ left: 30, right: 30 }}
          stroke="gray"
        />
        <YAxis width="auto" stroke="gray" />
        <Tooltip
          cursor={{ stroke: "var(--color-border-2)" }}
          contentStyle={{
            backgroundColor: "var(--color-surface-base)",
            borderColor: "var(--color-border-2)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#d23bf8"
          strokeWidth={6}
          dot={{
            fill: "var(--color-surface-base)",
          }}
          activeDot={{ stroke: "var(--color-surface-base)" }}
        />
        <RechartsDevtools />
      </LineChart>
    </div>
  );
};
export default PerformanceChart;
