"use client";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ActivityChart = ({ data }) => {
  if (!data) return <p>لا توجد بيانات</p>;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">النشاط الأسبوعي</h1>
        <FontAwesomeIcon icon={faEllipsis} style={{ color: "black" }} />
      </div>

      <div className="h-full">
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data margin={{ top: 5, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

            <XAxis
              dataKey="day"
              axisLine={false}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
              tickMargin={20}
            />

            <YAxis
              axisLine={false}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
            />

            <Tooltip formatter={(value) => `${value} نشاط`} />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#C3EBFA"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
