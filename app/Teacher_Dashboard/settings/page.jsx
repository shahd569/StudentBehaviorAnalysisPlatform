// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser , faCamera, faPen} from "@fortawesome/free-solid-svg-icons";
// import Image from "next/image";
// import Teacher from "@/public/image/teacher.png"
// import ChangePassword from "@/components/changePassword"
// import ContactInfo from "@/components/contactInfo"
// export default function TeacherDashboard(){
//   return (
//     <div style={{display:"flex", flexDirection:"column",padding:"20px 40px", gap:"40px"}}>
//       <div>
//         <h1 style={{ fontWeight: "bold" }}>الحساب الشخصي</h1>
//       <p
//         style={{
//           fontSize: "18px",
//           fontWeight: "bold",
//           color: "gray",
//         }}
//       >
//        إدارة معلوماتك الشخصية وإعدادات الحساب
//       </p>
//       </div>

//       <div style={{display:"flex", gap:"20px"}}>
//         <div style={{display:"flex", flexDirection:"column", backgroundColor:"#F5D7F4", flex:"1", padding:"20px", borderRadius:"15px"}}>
//           <h3 style={{marginBottom:"20px"}}>ملخص الحساب</h3>
//           <div style={{display:"flex", justifyContent:"space-between"}}>
//           <p>عدد المقررات</p>
//           <p>12</p>
//         </div>
//         <hr></hr>
//         <div style={{display:"flex", justifyContent:"space-between"}}>
//           <p>عدد الطلاب</p>
//           <p>12</p>
//         </div>
//         <hr></hr>
//         <div style={{display:"flex", justifyContent:"space-between"}}>
//           <p>عدد المحاضرات المنشورة </p>
//           <p>12</p>
//         </div>
//       </div>
//       <div style={{padding:"20px", borderRadius:"15px",border:"2px solid #dad9d9",flex:"4"}}>
//         <div style={{display:"flex", gap:"20px"}}>
//           <FontAwesomeIcon
//             icon={faUser}
//             style={{ color: "#9f04f8", fontSize:"30px" }}
//             />
//             <h3>المعلومات الشخصية</h3>
//         </div>
//         <div style={{display:"flex", gap:"40px"}}>
//           {/* User Info */}
//           <div style={{flex:"2"}}>
//             <div style={{
//               display: "grid",
//               gridTemplateColumns:" repeat(auto-fill, minmax(210px, 1fr))",
//               gap: "20px" ,
//               padding: "20px",
//              }}>
//               <div>
//                 <label>الاسم الكامل</label>
//                 <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px" ,display:"flex", justifyContent:"space-between"}}>
//                    د.فدا جهجاه
//                    <FontAwesomeIcon icon={faPen} style={{}}></FontAwesomeIcon>
//                    </p>
//               </div>
//               <div>
//                 <label>البريد الإلكتروني </label>
//                 <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px" ,display:"flex", justifyContent:"space-between"}}></p>
//               </div>
//               <div>
//                 <label>رقم التوظيف</label>
//                 <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px"}}>د.فدا جهجاه</p>
//               </div>

//         </div>
//           </div>
//           {/* User Image */}
//           <div style={{flex:"1"}}>
//             <Image src={Teacher} width={200} height={200} alt="teacher" style={{borderRadius:"50%", border:"5px solid #e4bafc",position:"relative"}}></Image>
//             <div style={{position:"relative", border:"1px solid #ccc",backgroundColor:"white", borderRadius:"50%",top:"-50px", width:"50px", height:"50px", display:"flex", justifyContent:"center", alignItems:"center"}}>
//               <FontAwesomeIcon icon={faCamera} style={{fontSize:"25px", color:"#9f04f8"}}></FontAwesomeIcon>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div style={{display:"flex", gap:"20px"}}>
//       <ChangePassword></ChangePassword>
//       <ContactInfo></ContactInfo>
//     </div>
//     </div>
//   )
// }
"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera, faPen } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import Teacher from "@/public/image/teacher.png";

import ChangePassword from "@/components/changePassword";
import ContactInfo from "@/components/contactInfo";

export default function TeacherDashboard() {
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

          setFirstName(result.firstName || "");
          setLastName(result.lastName || "");
          setEmail(result.email || "");
        }
      } catch (error) {
        console.error(error);
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

      if (!res.ok) {
        throw new Error(result.message);
      }

      alert("تم حفظ التعديلات بنجاح");

      setEditName(false);
      setEditEmail(false);

      setData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email,
        profilePictureUrl:
          result.user.profilePictureUrl || prev.profilePictureUrl,
      }));
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  if (!data) return <p>جاري تحميل البيانات...</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px 40px",
        gap: "40px",
      }}
    >
      <div>
        <h1 style={{ fontWeight: "bold" }}>الحساب الشخصي</h1>

        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "gray",
          }}
        >
          إدارة معلوماتك الشخصية وإعدادات الحساب
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F5D7F4",
            flex: "1",
            padding: "20px",
            borderRadius: "15px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>ملخص الحساب</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p>عدد المقررات</p>
            <p>{data.taughtCoursesCount}</p>
          </div>

          <hr></hr>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p>عدد الطلاب</p>
            <p>{data.studentsCount}</p>
          </div>

          <hr></hr>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p>عدد المحاضرات المنشورة </p>
            <p>{data.lessonsCount}</p>
          </div>
        </div>

        <div
          style={{
            padding: "20px",
            borderRadius: "15px",
            border: "2px solid #dad9d9",
            flex: "4",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: "#9f04f8", fontSize: "30px" }}
            />

            <h3>المعلومات الشخصية</h3>
          </div>

          <div style={{ display: "flex", gap: "40px" }}>
            {/* User Info */}
            <div style={{ flex: "2" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: " repeat(auto-fill, minmax(210px, 1fr))",
                  gap: "20px",
                  padding: "20px",
                }}
              >
                {/* الاسم الكامل */}
                <div>
                  <label>الاسم الكامل</label>

                  {editName ? (
                    <div
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        height: "40px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "50%",
                          outline: "none",
                        }}
                      />

                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "50%",
                          outline: "none",
                        }}
                      />
                    </div>
                  ) : (
                    <p
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        height: "40px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {firstName} {lastName}
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{ cursor: "pointer" }}
                        onClick={() => setEditName(true)}
                      />
                    </p>
                  )}
                </div>

                {/* الإيميل */}
                <div>
                  <label>البريد الإلكتروني </label>

                  {editEmail ? (
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        height: "40px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "100%",
                        outline: "none",
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        height: "40px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {email}

                      <FontAwesomeIcon
                        icon={faPen}
                        style={{ cursor: "pointer" }}
                        onClick={() => setEditEmail(true)}
                      />
                    </p>
                  )}
                </div>

                {/* رقم التوظيف */}
                <div>
                  <label>رقم التوظيف</label>

                  <p
                    style={{
                      backgroundColor: "#eee",
                      borderRadius: "10px",
                      height: "40px",
                      border: "1px solid #ccc",
                      padding: "10px",
                    }}
                  >
                    {data.employeeId}
                  </p>
                </div>
              </div>
            </div>

            {/* User Image */}
            <div style={{ flex: "1" }}>
              <Image
                src={data.profilePictureUrl ? data.profilePictureUrl : Teacher}
                width={200}
                height={200}
                alt="teacher"
                style={{
                  borderRadius: "50%",
                  border: "5px solid #e4bafc",
                  position: "relative",
                  objectFit: "cover",
                }}
              />

              <div
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: "relative",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  top: "-50px",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  style={{
                    fontSize: "25px",
                    color: "#9f04f8",
                  }}
                ></FontAwesomeIcon>

                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#9f04f8",
              color: "white",
              borderRadius: "10px",
              padding: "10px 20px",
              border: "none",
              marginTop: "20px",
            }}
          >
            حفظ التعديلات
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <ChangePassword></ChangePassword>

        <ContactInfo data={data}></ContactInfo>
      </div>
    </div>
  );
}
