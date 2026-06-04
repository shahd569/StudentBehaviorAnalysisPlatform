"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import image from "@/public/uploads/megaphone.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import AddAnnouncement from "@/components/AnnouncementModal";

export default function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/adminDashboard/announcements/get");
        const data = await res.json();

        if (res.ok) {
          setAnnouncements(data.announcements || []);
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
      <div style={{ display: "flex", justifyContent: "end" }}>
        <AddAnnouncement></AddAnnouncement>
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
                {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#e6befd",
                          width: "150px",
                          height: "120px",
                          borderRadius: "20px",
                        }}
                      > */}
                <Image
                  src={image}
                  width={100}
                  height={100}
                  style={{ borderRadius: "50%", border: "4px solid #00217a" }}
                  alt="Announcement"
                />
                {/* </div> */}

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
