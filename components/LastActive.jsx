"use client";

import { useEffect, useState } from "react";

const Announcements = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/recentActivityFeed");
        const data = await res.json();
        setActivities(data.activities || []);
      } catch (error) {
        console.error("Error loading activities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "10px",
        width: "280px",
      }}
    >
      <div className="d-flex items-center justify-content-between">
        <h4
          style={{
            marginBottom: "2px",
            marginTop: "2px",
            color: "black",
          }}
        >
          أحدث النشاطات
        </h4>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "2px",
        }}
      >
        {loading && <p style={{ fontSize: "13px" }}>جاري تحميل النشاطات...</p>}

        {!loading &&
          activities.map((item, index) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "rgba(248, 249, 250, 1)",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                className="d-flex  justify-content-between"
                style={{ alignItems: "center" }}
              >
                <span
                  style={{
                    padding: "2px",
                    color: "gray",
                    backgroundColor: "#f3d0faff",
                    borderRadius: "5px",
                    fontSize: "15px",
                  }}
                >
                  {new Date(item.time).toLocaleDateString()}
                </span>
              </div>

              <p
                style={{
                  color: "gray",
                  fontSize: "15px",
                  marginTop: "3px",
                }}
              >
                {item.studentName} {item.action}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Announcements;
