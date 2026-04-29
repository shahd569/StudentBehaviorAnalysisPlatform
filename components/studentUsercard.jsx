"use client";
import { useEffect, useState } from "react";

export default function UserCard() {
  const [data, setData] = useState({
    activeCoursesCount: 0,
    pendingTasks: 0,
    performanceAvg: 0,
    learningHours: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/studentDashboard/homePageCards");
        const result = await res.json();

        if (res.ok) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching cards data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div
        className="flex-fill"
        style={{
          borderRadius: "15px",
          width: "100px",
          backgroundColor: "white",
          padding: "10px",
          border: "3px solid #5194F8",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#5194F8",
          }}
        >
          {data.activeCoursesCount}
        </h2>
        <h6
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "center",
            color: "gray",
          }}
        >
          المواد النشطة
        </h6>
      </div>

      <div
        className="flex-fill"
        style={{
          borderRadius: "15px",
          width: "100px",
          backgroundColor: "white",
          padding: "10px",
          border: "3px solid #5194F8",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#5194F8",
          }}
        >
          {data.pendingTasks}
        </h2>
        <h6
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "center",
            color: "gray",
          }}
        >
          المهام المعلقة
        </h6>
      </div>

      <div
        className="flex-fill"
        style={{
          borderRadius: "15px",
          width: "100px",
          backgroundColor: "white",
          padding: "10px",
          border: "3px solid #5194F8",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#5194F8",
          }}
        >
          {data.performanceAvg ? data.performanceAvg.toFixed(1) : 0}
        </h2>
        <h6
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "center",
            color: "gray",
          }}
        >
          متوسط الأداء
        </h6>
      </div>

      <div
        className="flex-fill"
        style={{
          borderRadius: "15px",
          width: "100px",
          backgroundColor: "white",
          padding: "10px",
          border: "3px solid #5194F8",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#5194F8",
            // fontSize: "16px",
          }}
        >
          {data.learningHours || "0 دقيقة"}
        </h2>
        <h6
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "center",
            color: "gray",
          }}
        >
          ساعات التعلم للأسبوع
        </h6>
      </div>
    </div>
  );
}
