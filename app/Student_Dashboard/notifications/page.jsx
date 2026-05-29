"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import image from "@/public/image/image.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser, faFileAlt } from "@fortawesome/free-solid-svg-icons";

const NotificationCard = ({ item, index, setNotifications }) => {
  useEffect(() => {
    if (item.isRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timer = setTimeout(async () => {
              try {
                await fetch("/api/studentDashboard/notifications/read", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ notificationId: item.id }),
                });

                setNotifications((prev) =>
                  prev.map((a) =>
                    a.id === item.id ? { ...a, isRead: true } : a,
                  ),
                );
              } catch (err) {
                console.error("خطأ:", err);
              }
            }, 5000);

            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.8 },
    );

    const element = document.getElementById(`alert-${item.id}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [item.id, item.isRead, setNotifications]);

  return (
    <div
      id={`alert-${item.id}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        // alignItems: "end",
        width: "80%",
        borderRadius: "10px",
        boxShadow: "0 3px 3px 3px #ccc",
        padding: "20px",
        position: "relative",
        alignItems: "center",
        gap: "25px",
      }}
    >
      {!item.isRead && (
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background: "#F32727",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "bold",
            padding: "4px 8px",
            borderRadius: "6px",
            zIndex: 10,
          }}
        >
          NEW
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#cfe3ec",
          width: "150px",
          height: "120px",
          borderRadius: "20px",
          flexShrink: 0,
        }}
      >
        <Image
          src={
            item.alertType === "NEW_CONTENT"
              ? "/image/new-content.png"
              : "/image/alert.png"
          }
          alt="announcement"
          width={130}
          height={130}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          textAlign: "right",
        }}
      >
        <h4>{item.title}</h4>

        <p style={{ color: "#646464", maxWidth: "500px" }}>{item.content}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "start",
            // flexGrow: "1",
            // marginRight: "20px",
            gap: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faClock} style={{ color: "#646464" }} />

            <p style={{ fontSize: "15px", color: "#646464" }}>
              تاريخ النشر : {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faUser} style={{ color: "#9f04f8" }} />

            <p style={{ fontSize: "15px", color: "#646464" }}>
              {item.teacherName}
            </p>
          </div> */}
        </div>
      </div>

      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "45px",
          paddingLeft: "10px",
        }}
      >
        {item.attachmentURL && (
          <a
            href={item.attachmentURL}
            target="_blank"
            style={{
              textDecoration: "none",
              marginTop: item.isRead ? "0px" : "45px",
            }}
          >
            <div>
              <FontAwesomeIcon
                icon={faFileAlt}
                style={{
                  fontSize: "60px",
                  alignItems: "center",
                  color: "#fabd4b",
                  cursor: "pointer",
                }}
              />
            </div>
          </a>
        )}
      </div> */}
    </div>
  );
};
export default function Announcement() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/studentDashboard/notifications");
        const data = await res.json();

        if (res.ok) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("خطأ في جلب الإعلانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  //   const colors = ["#DAC1ED", "#FFD8F3", "#91FF82"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        gap: "3px",
        padding: "20px 40px",
        fontSize: "18px",
      }}
    >
      <h1 style={{ fontWeight: "bold" }}>التنبيهات</h1>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "gray",
        }}
      >
        قائمة التنبيهات الخاصة بك
      </p>

      {loading && <p>جاري تحميل الإعلانات...</p>}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "30px",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {notifications?.map((item, index) => (
          <NotificationCard
            key={item.id}
            item={item}
            // colors={colors}
            index={index}
            setNotifications={setNotifications}
          />
        ))}
      </div>
    </div>
  );
}
