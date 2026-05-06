"use client";

import { useEffect, useState } from "react";

const Announcements = () => {
  const [RecentFeed, setRecentFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentFeed = async () => {
      try {
        const res = await fetch("/api/studentDashboard/homePageRecentFeed");
        const data = await res.json();

        const formatted = (data.finalFeed || []).map((item, index) => {
          const score = item.assignmentScore ?? item.quizScore;

          let feedback = "";
          let color = "";

          if (score >= 80) {
            feedback = "ممتاز! استمر 👏";
            color = "green";
          } else if (score < 50) {
            feedback = "تحتاج إلى تحسين، حاول التركيز أكثر 💪";
            color = "red";
          } else {
            feedback = "جيد 👍";
            color = "orange";
          }

          return {
            id: index,
            title: item.assignmentTitle || item.quizTitle,
            score,
            action: item.assignmentTitle
              ? `حصلت على ${score} `
              : `حصلت على ${score} `,
            feedback,
          };
        });

        setRecentFeed(formatted);
      } catch (error) {
        console.error("Error loading activities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFeed();
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
          أخر النتائج
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
        {loading && <p style={{ fontSize: "13px" }}>جاري التحميل...</p>}

        {!loading &&
          RecentFeed.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "rgba(248, 249, 250, 1)",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div
                className="d-flex justify-content-between"
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
                  {item.title}
                </span>
              </div>

              <p
                style={{
                  color: "gray",
                  fontSize: "14px",
                  marginTop: "3px",
                }}
              >
                {item.action} {item.feedback}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Announcements;
