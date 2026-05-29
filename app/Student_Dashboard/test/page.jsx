"use client";

import { useState, useRef, useEffect } from "react";

export default function CourseDetails() {
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("/uploads/video.mp4"); // رابط الفيديو الخاص بكِ
  const [currentSpeed, setCurrentSpeed] = useState(1); // لتتبع السرعة الحالية وتلوين الزر النشط
  const videoRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // دالة إرسال التفاعلات إلى السيرفر
  const sendVideoInteraction = async (eventType, extraData = {}) => {
    try {
      const currentTime = videoRef.current ? videoRef.current.currentTime : 0;

      const payload = {
        interactionType: eventType,
        videoTime: Math.round(currentTime),
        ...extraData,
      };

      console.log(`📡 تم إرسال الحدث [${eventType}] بنجاح:`, payload);

      await fetch("/api/studentDashboard/video-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("خطأ أثناء إرسال التفاعل:", error);
    }
  };

  // دالة مخصصة لتغيير السرعة برمجياً وتحديث الواجهة
  const changePlaybackSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed; // تغيير سرعة الفيديو الحقيقية
      setCurrentSpeed(speed); // تحديث حالة الزر ليصبح ملوناً
    }
  };

  if (!hasMounted) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "gray" }}>
        جاري تهيئة مشغل المحاضرات...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>
        مشغل المحاضرات الذكي
      </h2>

      {/* حاوية الفيديو */}
      <div
        style={{
          position: "relative",
          paddingTop: "56.25%",
          borderRadius: "12px 12px 0 0", // تدوير الحواف العلوية فقط ليتناسق مع شريط السرعة
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backgroundColor: "#000",
        }}
      >
        <video
          ref={videoRef}
          src={selectedVideo}
          controls
          controlsList="nodownload"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          onPlay={() => sendVideoInteraction("PLAY")}
          onPause={() => sendVideoInteraction("PAUSE")}
          onSeeked={() => sendVideoInteraction("SEEK")}
          // المتصفح سيطلق هذا الحدث فوراً بمجرد الضغط على أزرار السرعة بالأسفل
          onRateChange={() => {
            if (videoRef.current) {
              sendVideoInteraction("RATE_CHANGE", {
                currentSpeed: videoRef.current.playbackRate,
              });
            }
          }}
        />
      </div>

      {/* ⚡ شريط التحكم المتقدم بالسرعة المخصص أسفل الفيديو مباشرة */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#1e1e2f",
          padding: "12px 20px",
          borderRadius: "0 0 12px 12px",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: "500" }}>
          سرعة تشغيل المحاضرة:
        </span>

        <div style={{ display: "flex", gap: "10px" }}>
          {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => changePlaybackSpeed(speed)}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                transition: "all 0.2s ease",
                // تلوين الزر الحالي النشط بلون بنفسجي احترافي، والباقي بلون رمادي
                backgroundColor: currentSpeed === speed ? "#7c3aed" : "#374151",
                color: "#fff",
              }}
              onMouseOver={(e) => {
                if (currentSpeed !== speed)
                  e.target.style.backgroundColor = "#4b5563";
              }}
              onMouseOut={(e) => {
                if (currentSpeed !== speed)
                  e.target.style.backgroundColor = "#374151";
              }}
            >
              {speed === 1 ? "طبيعي (1x)" : `${speed}x`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
