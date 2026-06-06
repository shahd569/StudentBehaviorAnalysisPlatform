"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faShield } from "@fortawesome/free-solid-svg-icons";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("يرجى تعبئة جميع الحقول");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("كلمتا المرور غير متطابقتين");
        return;
      }

      setLoading(true);

      const res = await fetch("/api/teacherDashboard/settings/changePassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ");
      }

      alert("تم تغيير كلمة المرور بنجاح ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // يضمن بقاء زر الحفظ بأسفل الكارد تماماً
        width: "100%",
        height: "100%",
      }}
    >
      <div>
        {/* الهيدر: جعل الأيقونة والنص على نفس السطر ومتناسقين */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <FontAwesomeIcon
            icon={faLock}
            style={{ color: "#19417a", fontSize: "24px" }}
          />
          <h3 style={{ margin: 0, fontWeight: "bold" }}>تغيير كلمة المرور</h3>
        </div>

        {/* توزيع الحقول وكارد النصائح بجانب بعضهما بشكل متناسق ومحاذاة علوية متساوية */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
            alignItems: "flex-start", // يمنع ارتفاع كارد النصائح من الشذوذ للأعلى
          }}
        >
          {/* قسم حقول الإدخال */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              flex: "1.2", // مساحة أكبر قليلاً للمدخلات لراحة الكتابة
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                style={{ fontWeight: "bold", color: "#555", fontSize: "14px" }}
              >
                كلمة المرور الحالية
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                style={{ fontWeight: "bold", color: "#555", fontSize: "14px" }}
              >
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                style={{ fontWeight: "bold", color: "#555", fontSize: "14px" }}
              >
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* كارد النصائح الجانبي المحسن */}
          <div
            style={{
              backgroundColor: "#eaf1f6",
              flex: "1",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #19417a",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faShield}
                style={{ color: "#19417a", fontSize: "18px" }}
              />
              <h5 style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                نصائح للحماية
              </h5>
            </div>

            <ul
              style={{
                color: "#5f5f5f",
                paddingRight: "20px",
                margin: 0,
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              <li>استخدام 8 أحرف على الأقل.</li>
              <li>تضمين حرف كبير وصغير (A, a).</li>
              <li>تضمين رقم أو رمز خاص (#, $, 1).</li>
              <li>تجنب استخدام معلومات شخصية مألوفة.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* زر التحديث المستقر بأسفل الكارد بمظهر احترافي ومتجاوب */}
      <button
        onClick={handleChangePassword}
        disabled={loading}
        style={{
          backgroundColor: "#19417a",
          borderRadius: "10px",
          height: "42px",
          color: "white",
          textAlign: "center",
          width: "100%",
          marginTop: "30px", // مسافة علوية ناعمة بدلاً من 100px الطويلة السابقة
          border: "none",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? "0.7" : "1",
          transition: "all 0.2s ease",
        }}
      >
        {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
      </button>
    </div>
  );
}
