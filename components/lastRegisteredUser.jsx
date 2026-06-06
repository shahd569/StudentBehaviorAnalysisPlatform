"use client";

import { useEffect, useState } from "react";

const RecentUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const res = await fetch(
          "/api/adminDashboard/homePage/lastRegisteredUsers",
        );

        const data = await res.json();

        if (res.ok) {
          setUsers(data.lastRegisteredUsers || []);
        }
      } catch (error) {
        console.error("Error loading recent users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        height: "50%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4
          style={{
            margin: 0,
            // color: "#00217a",
            fontWeight: "bold",
          }}
        >
          آخر المستخدمين المسجلين
        </h4>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        {loading && <p>جاري التحميل...</p>}

        {!loading && users.length === 0 && (
          <p style={{ color: "#666" }}>لا يوجد مستخدمون مسجلون حديثاً</p>
        )}

        {!loading &&
          users.map((user) => (
            <div
              key={user.id}
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={
                    {
                      // fontWeight: "bold",
                      // color: "#00217a",
                    }
                  }
                >
                  {user.firstName} {user.lastName}
                </span>

                <span
                  style={{
                    backgroundColor:
                      user.role === "STUDENT" ? "#D7E2F5" : "#E8D7F5",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  {user.role === "STUDENT"
                    ? "طالب"
                    : user.role === "TEACHER"
                      ? "مدرس"
                      : "ادمن"}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentUsers;
