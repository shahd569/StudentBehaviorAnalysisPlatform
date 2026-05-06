"use client";

import {
  faClock,
  faPaperclip,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { FaClock } from "react-icons/fa";
// import { FaUser } from "react-icons/fa";

export default function Announcement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/studentDashboard/announcements");
        const data = await res.json();
        if (res.ok) {
          setAnnouncements(data.announcementInfo || []);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  const colors = ["#DAC1ED", "#FFD8F3", "#91FF82"];

  return (
    <div style={{ padding: "20px 40px" }}>
      <h1 style={{ fontWeight: "bold", fontSize: "30px" }}>الإعلانات</h1>
      <h4 style={{ color: "#6E6E6E", marginTop: "5px" }}>
        قائمة الإعلانات الخاصة بك
      </h4>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {announcements?.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FFFF",
              // background: "#F3F3F3",
              borderRadius: "18px",
              padding: "18px 20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              position: "relative",
              transition: "0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.01)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={async () => {
              if (!item.isRead) {
                try {
                  await fetch("/api/studentDashboard/announcements/read", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      announcementId: item.id,
                    }),
                  });

                  // تحديث فوري
                  setAnnouncements((prev) =>
                    prev.map((a) =>
                      a.id === item.id ? { ...a, isRead: true } : a,
                    ),
                  );
                } catch (err) {
                  console.error(err);
                }
              }
            }}
          >
            {/* NEW Badge */}
            {!item.isRead && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "18px",
                  background: "#F32727",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  opacity: item.isRead ? 0 : 1,
                  transform: item.isRead ? "scale(0.5)" : "scale(1)",
                  transition: "all 0.3s ease", // 🔥 الحركة
                }}
              >
                NEW
              </div>
            )}

            {/* Attachment Link */}
            {item.attachmentURL && (
              <a
                href={item.attachmentURL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} //  مهم حتى لا يفعل onClick الكارد
                style={{
                  position: "absolute",
                  top: "60px",
                  left: "18px",
                  fontSize: "18px",
                  color: "#7A41DC",
                  textDecoration: "underline",
                  cursor: "pointer",
                  background: "#fff",
                  padding: "6px 9px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                مرفق <FontAwesomeIcon icon={faPaperclip} />
              </a>
            )}

            {/* الصورة */}
            <div
              style={{
                minWidth: "110px",
                height: "90px",
                borderRadius: "14px",
                background: colors[index % 3],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "20px",
                // marginRight: "20px",
              }}
            >
              <Image
                src="/uploads/megaphone.png"
                alt="announcement"
                // style={{ width: "55px" }}
                width={80}
                height={80}
              />
            </div>

            {/* المحتوى */}
            <div style={{ flex: 1 }}>
              {/* العنوان */}
              <h3
                style={{
                  marginBottom: "6px",
                  fontWeight: "700",
                  fontSize: "22px",
                  // color: "#6E6E6E",
                }}
              >
                {item.title}
              </h3>

              {/* التفاصيل */}
              <p
                style={{
                  color: "#6E6E6E",
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                {item.content}
              </p>

              {/* المدرس + التاريخ */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "60px",
                  fontSize: "14px",
                  color: "#6E6E6E",
                }}
              >
                {/* المدرس */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{
                      fontSize: "12px",
                      color: "#7A41DC",
                    }}
                  />
                  <span>{item.teacherName}</span>
                </div>

                {/* التاريخ */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FontAwesomeIcon
                    icon={faClock}
                    style={{ fontSize: "12px" }}
                  />
                  <span>
                    {new Date(item.createdAt)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
