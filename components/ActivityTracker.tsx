"use client"; //ان هذا المكون يعمل في المتصفح Nextjs إخبار

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ActivityTracker({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // لمراقبة أي تغيير في الرابط (الانتقال بين الصفحات)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // مرجع لساعة التوقيت الخاصة بالخمول

  // من الرابط lessonId استخراج
  const getLessonId = () => {
    const match = pathname.match(/lesson\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  // --- 1. دالة تسجيل النشاط في قاعدة البيانات ---
  const logActivity = async (type: string, details = "") => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return; // إذا لم توجد جلسة نشطة، لا يسجل شيئاً

    const lessonId = getLessonId();
    try {
      await fetch("/api/track-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: parseInt(sessionId),
          activityType: type,
          pageUrl: window.location.href,
          lessonId,
        }),
      });
    } catch (err) {
      console.error("خطأ في تسجيل النشاط:", err);
    }
  };

  // --- 2. دالة إنشاء جلسة جديدة تلقائياً ---
  const createNewSession = async () => {
    try {
      const res = await fetch("/api/create-new-session", { method: "POST" });
      const data = await res.json();
      if (data.sessionId) {
        // تخزين رقم الجلسة الجديد في المتصفح
        sessionStorage.setItem("currentSessionId", data.sessionId.toString());
        // تسجيل نشاط يوضح أن هذه الجلسة بدأت بعد خمول
        logActivity("SESSION_START", "تجديد تلقائي للجلسة بعد خمول");
      }
    } catch (err) {
      console.error("فشل في تجديد الجلسة:", err);
    }
  };

  // --- 3. دالة معالجة الخمول (إغلاق الجلسة في القاعدة فقط) ---
  const handleInactivityLimit = async () => {
    const sessionId = sessionStorage.getItem("currentSessionId");
    if (!sessionId) return;

    // إرسال طلب للسيرفر لإغلاق الجلسة الحالية
    await fetch("/api/close-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    // حذف الرقم القديم من المتصفح (لنعرف عند العودة أننا نحتاج جلسة جديدة)
    sessionStorage.removeItem("currentSessionId");
    console.log(
      "تم إغلاق الجلسة في القاعدة بسبب الخمول. بانتظار حركة الطالب للتجديد.",
    );
  };

  // --- 4. دالة إعادة ضبط العداد (تُستدعى مع كل حركة) ---
  const resetInactivityTimer = async () => {
    //ننشئ واحد جديد فورا sessionId، اذا عاد الطالب للحركة ولا نملك
    if (!sessionStorage.getItem("currentSessionId")) {
      await createNewSession();
    }

    // تصفير عداد الـ 15 دقيقة والبدء من جديد
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleInactivityLimit, 15 * 60 * 1000);
  };

  // --- 5. المحرك الرئيسي للأحداث (EventListeners) ---
  useEffect(() => {
    // تسجيل الدخول لأي صفحة جديدة
    logActivity("PAGE_VIEW");

    // التنصت على النقر وحركة الماوس
    const handleInteraction = () => {
      resetInactivityTimer(); // تحديث الوقت أو إنشاء جلسة جديدة
    };

    const handleClick = (e: MouseEvent) => {
      handleInteraction();
      //للحصول على اسمه HTML نتحقق ان الهدف الذي نقر عليه هو عنصر
      const target = e.target as HTMLElement;
      if (target) {
        // تسجيل نوع العنصر المنقور (زر، رابط، إلخ)
        logActivity(`CLICK_${target.tagName}`);
      }
    };

    // دالة التعامل مع إشارة الفيديو
    const handleVideoHeartbeat = () => {
      resetInactivityTimer(); // إعادة ضبط مؤقت الـ 15 دقيقة
    };

    // إضافة المتنصتات للنافذة
    // التنصت على حدث مخصص يأتي من مشغل الفيديو
    window.addEventListener("video-active", handleVideoHeartbeat);
    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("keydown", handleInteraction); // لوحة المفاتيح أيضاً

    resetInactivityTimer(); // بدء العد التنازلي الأول

    // تنظيف الذاكرة عند مغادرة المكون
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("video-active", handleVideoHeartbeat);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]); // إعادة التشغيل عند كل تغيير في المسار

  return <>{children}</>; // السماح بعرض محتوى الصفحة بشكل طبيعي
}
