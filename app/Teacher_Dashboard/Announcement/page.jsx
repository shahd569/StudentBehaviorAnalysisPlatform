"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import image from "@/public/image/image.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUser,
  faFileAlt,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import CreateAnnouncement from "@/components/Announcement";

export default function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/announcements");
        const data = await res.json();

        if (res.ok) {
          setAnnouncements(data.myAnnouncements || []);
          setAdminAnnouncements(data.adminAnnouncements || []);
        }
      } catch (error) {
        console.error("خطأ في جلب الإعلانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

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
      <h1 style={{ fontWeight: "bold" }}>الإعلانات</h1>
      {/* قسم إعلانات الإدارة في الأعلى */}
      {/* <div style={{ marginBottom: "40px" }}>
        <h3
          style={{
            color: "#333",
            fontSize: "22px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: "#2563eb" }}>📢</span> التعميمات والإعلانات
          الإدارية
        </h3>

        {adminAnnouncements.length === 0 ? (
          <p style={{ color: "#666", fontSize: "14px", italic: "true" }}>
            لا توجد تعميمات إدارية جديدة حالياً.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {adminAnnouncements.map((adminAcc) => (
              <div
                key={adminAcc.id}
                style={{
                  backgroundColor: "#eff6ff", // خلفية زرقاء ناعمة جداً لتمييزها عن كروت المدرس البيضاء
                  borderLeft: "6px solid #2563eb", // خط جانبي أزرق عريض يعطي شعوراً بالرسمية
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  position: "relative",
                }}
              > */}
      {/* شارة إعلان غير مقروء */}
      {/* {!adminAcc.isRead && (
                  <span
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "15px",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#ef4444",
                      borderRadius: "50%",
                    }}
                  />
                )}

                {/* الرأس: العنوان والمصدر */}
      {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4
                    style={{
                      color: "#1e3a8a",
                      fontSize: "18px",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {adminAcc.title}
                  </h4>
                  <span
                    style={{
                      backgroundColor: "#dbeafe",
                      color: "#2563eb",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {adminAcc.senderName}
                  </span>
                </div> */}

      {/* المحتوى */}
      {/* <p
                  style={{
                    color: "#4b5563",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    margin: "0 0 15px 0",
                  }}
                >
                  {adminAcc.content}
                </p> */}

      {/* أسفل الكرت: التاريخ والمرفقات */}
      {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  <span>
                    🗓️{" "}
                    {new Date(adminAcc.createdAt).toLocaleDateString("ar-SY")}
                  </span>

                  {adminAcc.attachmentURL && (
                    <a
                      href={adminAcc.attachmentURL}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      📎 تحميل المرفق البري
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* // <hr
      //   style={{
      //     border: "0",
      //     height: "1px",
      //     backgroundColor: "#e5e7eb",
      //     margin: "30px 0",
      //   }}
      // /> */}

      {/* هنا يتبع كودكِ الحالي تماماً: عنوان "الاعلانات الصادرة عني" وزر الإنشاء والكروت البيضاء */}
      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "gray",
        }}
      >
        قائمة الإعلانات الخاصة بك
      </p>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <CreateAnnouncement></CreateAnnouncement>
      </div>

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
        {!loading &&
          announcements.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "80%",
                borderRadius: "10px",
                boxShadow: "0 3px 3px 3px #ccc",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", gap: "50px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#e6befd",
                    width: "150px",
                    height: "120px",
                    borderRadius: "20px",
                  }}
                >
                  <Image
                    src="/uploads/megaphone.png"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                    alt="Announcement"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h4>{item.title}</h4>

                  <p style={{ color: "#646464", maxWidth: "500px" }}>
                    {item.content}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
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
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{ color: "#646464" }}
                      />

                      <p style={{ fontSize: "15px", color: "#646464" }}>
                        تاريخ النشر :{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        alignContent: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBook}
                        style={{ color: "#9f04f8" }}
                      />

                      <p style={{ fontSize: "15px", color: "#646464" }}>
                        {item.courseName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {item.attachmentURL && (
                  <a
                    href={item.attachmentURL}
                    target="_blank"
                    style={{
                      textDecoration: "none",
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
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
