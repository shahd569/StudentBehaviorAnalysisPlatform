// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLock, faShield,} from "@fortawesome/free-solid-svg-icons";
// export default function ChangePassword() {
//     return(
//         <div style={{padding:"20px", borderRadius:"15px",border:"2px solid #dad9d9",flex:"2"}}>
//          <div style={{display:"flex", gap:"20px"}}>
//           <FontAwesomeIcon
//             icon={faLock}
//             style={{ color: "#9f04f8", fontSize:"30px" }}
//             />
//             <h3>تغيير كلمة المرور</h3>
//         </div>
//         <div style={{display:"flex", justifyContent:"space-between", gap:"30px"}}>
//             <div style={{flex:"1"}}>
//                 <p style={{color:"gray", marginRight:"50px", fontWeight:"bold"}}>قم بتحديث كلمة المرور الخاصة بك</p>
//                 <label>كلمة المرور الحالية </label>
//                 <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px"}}>د.فدا جهجاه</p>
//                 <label>كلمة المرور الجديدة </label>
//                 <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px"}}>د.فدا جهجاه</p>
//                 <label>تأكيد كلمة المرور الجديدة </label>
//                 <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px"}}>د.فدا جهجاه</p>
//             </div>
//             <div style={{backgroundColor:"#fcf1fc", flex:"1", padding:"15px", borderRadius:"10px" ,border:"1px solid #e2a2ff"}}>
//                 <div style={{display:"flex", gap:"10px"}}>
//                     <FontAwesomeIcon
//                         icon={faShield}
//                         style={{ color: "#9f04f8", fontSize:"20px" }}
//                      />
//                     <h5>نصائح لإنشاء كلمة مرور قوية</h5>
//                 </div>
//                 <ul style={{color:"#5f5f5f", padding:"15px"}}>
//                     <li>استخدام 8 أحرف على الأقل </li>
//                     <li>تضمين حرف كبير وصغير</li>
//                     <li>تضمين رقم أو رمز خاص</li>
//                     <li>تجنب استخدام معلومات شخصية </li>
//                 </ul>
//             </div>
//         </div>
//         <button style={{backgroundColor:"#9f04f8", borderRadius:"10px", height:"40px", color:"white", textAlign:"center", width:"100%", marginTop:"20px"}}>
//             <FontAwesomeIcon
//             icon={faLock}
//             style={{ color: "white", fontSize:"15px", marginLeft:"10px" }}
//             />
//             تحديث كلمة المرور </button>
//         </div>
//     )
// }



"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faShield,
} from "@fortawesome/free-solid-svg-icons";

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
      console.error(error);
      alert(error.message || "فشل تغيير كلمة المرور ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        flex: "2",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <FontAwesomeIcon
          icon={faLock}
          style={{ color: "#9f04f8", fontSize: "30px" }}
        />
        <h3>تغيير كلمة المرور</h3>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
        }}
      >
        <div style={{ flex: "1" }}>
          <p
            style={{
              color: "gray",
              marginRight: "50px",
              fontWeight: "bold",
            }}
          >
            قم بتحديث كلمة المرور الخاصة بك
          </p>

          <label>كلمة المرور الحالية </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "100%",
              marginBottom: "10px",
            }}
          />

          <label>كلمة المرور الجديدة </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "100%",
              marginBottom: "10px",
            }}
          />

          <label>تأكيد كلمة المرور الجديدة </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "100%",
            }}
          />
        </div>

        <div
          style={{
            backgroundColor: "#fcf1fc",
            flex: "1",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #e2a2ff",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <FontAwesomeIcon
              icon={faShield}
              style={{ color: "#9f04f8", fontSize: "20px" }}
            />
            <h5>نصائح لإنشاء كلمة مرور قوية</h5>
          </div>

          <ul style={{ color: "#5f5f5f", padding: "15px" }}>
            <li>استخدام 8 أحرف على الأقل </li>
            <li>تضمين حرف كبير وصغير</li>
            <li>تضمين رقم أو رمز خاص</li>
            <li>تجنب استخدام معلومات شخصية </li>
          </ul>
        </div>
      </div>

      <button
        onClick={handleChangePassword}
        disabled={loading}
        style={{
          backgroundColor: "#9f04f8",
          borderRadius: "10px",
          height: "40px",
          color: "white",
          textAlign: "center",
          width: "100%",
          marginTop: "100px",
          opacity: loading ? "0.7" : "1",
        }}
      >
        <FontAwesomeIcon
          icon={faLock}
          style={{
            color: "white",
            fontSize: "15px",
            marginLeft: "10px",
          }}
        />
        {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
      </button>
    </div>
  );
}