"use client";

import { useEffect, useState } from "react";

const Announcements = () => {
  const [AlertAndRecommendation, setAlertAndRecommendation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlertAndRecommendation = async () => {
      try {
        const res = await fetch("/api/studentDashboard/homePageRecentFeed");
        const data = await res.json();

        const formatted = (data.recentAlertAndRecommendation || []).map(
          (item, index) => ({
            id: item.id,

            time: item.createdAt,

            Name: "🔔 تنبيه",

            action: item.content || "لا يوجد وصف",
          }),
        );

        setAlertAndRecommendation(formatted);
      } catch (error) {
        console.error("Error loading activities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertAndRecommendation();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className="d-flex items-center justify-content-between">
        <h4 style={{ marginBottom: "2px", marginTop: "2px", color: "black" }}>
          التوصيات والتنبيهات
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
        {loading && <p style={{ fontSize: "13px" }}>جاري تحميل التوصيات..</p>}

        {!loading &&
          AlertAndRecommendation.map((item, index) => (
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
                    padding: "1px",
                    color: "gray",
                    backgroundColor: "#D7E2F5",
                    borderRadius: "5px",
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
                {item.action}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Announcements;
