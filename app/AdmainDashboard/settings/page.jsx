"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera, faPen } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import Teacher from "@/public/image/teacher.png";

import ChangePassword from "@/components/adminChangePass";

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  // حالات التعديل
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  // القيم
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // الصورة
  const [avatar, setAvatar] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/settings/updateProfile");
        const result = await res.json();

        if (res.ok) {
          setData(result);
          setFirstName(result.firstName);
          setLastName(result.lastName);
          setEmail(result.email);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await fetch("/api/teacherDashboard/settings/updateProfile", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("تم تحديث البيانات الشخصية بنجاح!");
        setEditName(false);
        setEditEmail(false);
        if (result.profilePictureUrl) {
          setData((prev) => ({
            ...prev,
            profilePictureUrl: result.profilePictureUrl,
          }));
        }
      } else {
        alert(result.message || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("خطأ في الاتصال بالخادم");
    }
  };

  if (!data)
    return (
      <p style={{ padding: "20px", textAlign: "center" }}>
        جاري تحميل البيانات...
      </p>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px 40px",
        gap: "30px",
      }}
    >
      <div>
        <h1 style={{ fontWeight: "bold" }}>الحساب الشخصي</h1>
        <p style={{ fontSize: "16px", fontWeight: "bold", color: "gray" }}>
          إدارة معلوماتك الشخصية وإعدادات الحساب
        </p>
      </div>

      {/* الحاوية الرئيسية التي تجمع الكاردين بجانب بعضهما أفقياً بـ Flexbox */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "25px",
          alignItems: "stretch",
        }}
      >
        {/* 1. كارد المعلومات الشخصية المحسن */}
        <div
          style={{
            padding: "25px",
            borderRadius: "15px",
            border: "2px solid #dad9d9",
            flex: "1.6", // إعطاء مساحة أكبر قليلاً للمعلومات الشخصية لتستقر الحقول براحة
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* الهيدر الخاص بالكارد */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: "#19417a", fontSize: "24px" }}
              />
              <h3 style={{ margin: 0, fontWeight: "bold" }}>
                المعلومات الشخصية
              </h3>
            </div>

            {/* تنظيم المحتوى الداخلي: الحقول والصورة متجاورين */}
            <div
              style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}
            >
              {/* قسم الحقول مرتبة داخل شبكة مرنة (Grid) تشغل المساحة العرضية */}
              <div
                style={{
                  flex: "1",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr", // تقسيم الحقول إلى عمودين متساويين
                  gap: "20px 25px", // مسافة فاصلة بين الحقول (رأسياً وأفقياً)
                }}
              >
                {/* الصف الأول: الاسم الأول واسم العائلة */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold", color: "#555" }}>
                    الاسم الأول
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="text"
                      disabled={!editName}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        width: "100%",
                        backgroundColor: editName ? "#fff" : "#f9f9f9",
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faPen}
                      onClick={() => setEditName(!editName)}
                      style={{ cursor: "pointer", color: "gray" }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold", color: "#555" }}>
                    اسم العائلة
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="text"
                      disabled={!editName}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        width: "100%",
                        backgroundColor: editName ? "#fff" : "#f9f9f9",
                      }}
                    />
                  </div>
                </div>

                {/* الصف الثاني: البريد الإلكتروني والرقم الجامعي */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold", color: "#555" }}>
                    البريد الإلكتروني
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="email"
                      disabled={!editEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        width: "100%",
                        backgroundColor: editEmail ? "#fff" : "#f9f9f9",
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faPen}
                      onClick={() => setEditEmail(!editEmail)}
                      style={{ cursor: "pointer", color: "gray" }}
                    />
                  </div>
                </div>

                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold", color: "#555" }}>
                    الرقم الجامعي
                  </label>
                  <input
                    type="text"
                    disabled
                    value={data.universityId || "لا يوجد"}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      backgroundColor: "#f5f5f5",
                      color: "#777",
                    }}
                  />
                </div> */}

                {/* الصف الثالث: الكلية والمسار الدراسي/التخصص */}
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold", color: "#555" }}>
                    الكلية
                  </label>
                  <input
                    type="text"
                    disabled
                    value={data.college || "الهندسة المعلوماتية"}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      backgroundColor: "#f5f5f5",
                      color: "#777",
                    }}
                  />
                </div> */}

                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold", color: "#555" }}>
                    التخصص / السنة الدراسية
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${data.major || "برمجيات"} - ${data.academicYear || "السنة الخامسة"}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      backgroundColor: "#f5f5f5",
                      color: "#777",
                    }}
                  />
                </div> */}
              </div>

              {/* قسم الصورة الشخصية المعدل ليحافظ على مكانه المتناسق جهة اليسار */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid #19417a",
                    position: "relative",
                  }}
                >
                  <Image
                    src={
                      avatar
                        ? URL.createObjectURL(avatar)
                        : data.profilePictureUrl || Teacher
                    }
                    alt="Profile"
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    marginTop: "-18px",
                    zIndex: 2,
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCamera}
                    style={{ fontSize: "16px", color: "#19417a" }}
                  />
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => setAvatar(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* زر حفظ التعديلات يتموضّع بأسفل الكارد بشكل نظيف */}
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#19417a",
              color: "white",
              borderRadius: "10px",
              padding: "10px 25px",
              border: "none",
              marginTop: "30px",
              alignSelf: "flex-start",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            حفظ التعديلات
          </button>
        </div>

        {/* 2. كارد تغيير كلمة المرور */}
        <div
          style={{
            display: "flex",
            flex: "1", // توزيع متناسق للمساحة المتبقية
            border: "2px solid #dad9d9",
            borderRadius: "15px",
            gap: "20px",
            // backgroundColor: "#fff",
            padding: "20px",
          }}
        >
          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
