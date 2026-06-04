"use client";
import { useEffect, useState } from "react";

export default function UserCard() {
  const [data, setData] = useState({
    studentsCount: 0,
    teachersCount: 0,
    coursesCount: 0,
    lessonsCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/adminDashboard/homePage/homePageCards");
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
          border: "3px solid #00217a",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#00217a",
          }}
        >
          {data.studentsCount}
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
          عدد الطلاب
        </h6>
      </div>

      <div
        className="flex-fill"
        style={{
          borderRadius: "15px",
          width: "100px",
          backgroundColor: "white",
          padding: "10px",
          border: "3px solid #00217a",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#00217a",
          }}
        >
          {data.teachersCount}
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
          عدد المدرسين
        </h6>
      </div>

      <div
        className="flex-fill"
        style={{
          borderRadius: "15px",
          width: "100px",
          backgroundColor: "white",
          padding: "10px",
          border: "3px solid #00217a",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#00217a",
          }}
        >
          {data.coursesCount}
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
          عدد المقررات
        </h6>
      </div>
      <div
        className="flex-fill"
        style={{
          borderRadius: "15px",
          width: "100px",
          backgroundColor: "white",
          padding: "10px",
          border: "3px solid #00217a",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#00217a",
          }}
        >
          {data.lessonsCount}
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
          عدد الدروس
        </h6>
      </div>
    </div>
  );
}
