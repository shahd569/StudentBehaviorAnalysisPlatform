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

const ActivityChart = ({ data }) => {
  if (!data) return <p>لا توجد بيانات</p>;

  return (
    <div style={{ width: "600px", marginTop: "-40px" }}>
      <h4 style={{ textAlign: "center" }}>تحليل نشاط الطالب </h4>
      <LineChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
          width: "500px",
        }}
        responsive
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="day" padding={{ left: 30, right: 30 }} stroke="gray" />
        <YAxis
          width="auto"
          stroke="gray"
          tickFormatter={(value) => Math.floor(value)}
        />
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
          dataKey="count"
          stroke="#DB24CC"
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
export default ActivityChart;
