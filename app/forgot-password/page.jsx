"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  // التحكم في الخطوة الحالية (1 أو 2 أو 3)
  const [step, setStep] = useState(1);

  // تخزين مدخلات المستخدم
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // حالات التحميل والأخطاء
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // --- الخطوة 1: إرسال الإيميل وطلب الرمز ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setStep(2); // الانتقال لخطوة إدخال الرمز
      } else {
        setError(data.message || "حدث خطأ ما");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  // --- الخطوة 2 و 3: التحقق من الرمز وتغيير كلمة المرور ---
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // التحقق من تطابق كلمتي المرور في الخطوة الثالثة
    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setStep(4); // خطوة النجاح النهائية
        // توجيه المستخدم لصفحة تسجيل الدخول بعد 3 ثوانٍ
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "حدث خطأ ما");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#F8F9FA",
        fontFamily: "sans-serif",
        direction: "rtl",
      }}
    >
      <div
        style={{
          background: "#FFF",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        <h2
          style={{ color: "#7A41DC", fontWeight: "700", marginBottom: "10px" }}
        >
          إعادة تعيين كلمة المرور
        </h2>

        {/* عرض رسائل الخطأ والنجاح */}
        {error && (
          <div
            style={{
              color: "#F32727",
              background: "#FFEEEE",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            style={{
              color: "#22C55E",
              background: "#EEFBF2",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        {/* ---------------- الخطوة 1: طلب الإيميل ---------------- */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <p
              style={{
                color: "#6E6E6E",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              أدخل بريدك الإلكتروني الأكاديمي وسنرسل لك رمزاً رقمياً لإعادة
              تعيين كلمة المرور.
            </p>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
            </button>
          </form>
        )}

        {/* ---------------- الخطوة 2: إدخال الرمز ---------------- */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
          >
            <p
              style={{
                color: "#6E6E6E",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              تم إرسال رمز التحقق إلى إيميلك. يرجى إدخاله أدناه للمتابعة.
            </p>
            <input
              type="text"
              placeholder="رمز التحقق (OTP)"
              required
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                ...inputStyle,
                letterSpacing: "8px",
                textAlign: "center",
                fontSize: "20px",
              }}
            />
            <button type="submit" style={buttonStyle}>
              التالي
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                ...buttonStyle,
                background: "none",
                color: "#6E6E6E",
                marginTop: "5px",
              }}
            >
              تغيير البريد الإلكتروني
            </button>
          </form>
        )}

        {/* ---------------- الخطوة 3: تعيين كلمة المرور الجديدة ---------------- */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p
              style={{
                color: "#6E6E6E",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              قم بكتابة كلمة المرور الجديدة الخاصة بحسابك.
            </p>
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? "جاري التحديث..." : "حفظ وتغيير كلمة المرور"}
            </button>
          </form>
        )}

        {/* ---------------- الخطوة 4: خطوة النجاح وتنبيه التوجيه ---------------- */}
        {step === 4 && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "50px", color: "#22C55E" }}>✓</div>
            <p
              style={{ color: "#6E6E6E", fontSize: "14px", marginTop: "10px" }}
            >
              جاري توجيهك إلى صفحة تسجيل الدخول تلقائياً...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// تنسيقات مشتركة للحقول والأزرار
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #DADADA",
  marginBottom: "15px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "93%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#7A41DC",
  color: "#FFF",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.2s",
};
