"use client";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { faPersonDress } from "@fortawesome/free-solid-svg-icons";
const data = [
  {
    name: "Total",
    count: 98,
    pv: 2400,
    fill: "white",
  },
  {
    name: "Girls",
    count: 53,
    pv: 2400,
    fill: "#fae27c",
  },
  {
    name: "boy",
    count: 45,
    pv: 4567,
    fill: "#C3EBFA",
  },
  {
    name: "boy",
    count: 45,
    pv: 4567,
    fill: "#f1c3faff",
  },
];
const Chart = () => {
  return (
    <div className="bg-white rounded-4 w-100 h-100 p-3">
      {/* Chart */}
      <div className="w-100 p-2 position-relative" style={{ height: "70%" }}>
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={36}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      {/* Botom */}
      <div className="d-flex justify-content-between gap-5 mb-4">
        <div className="d-flex flex-column gap-1">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle"
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#C3EBFA",
              }}
            ></div>
            <span>ممتاز</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle"
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#fae27c",
              }}
            ></div>
            <span>ممتاز</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle"
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#f1c3faff",
              }}
            ></div>
            <span>ممتاز</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chart;
