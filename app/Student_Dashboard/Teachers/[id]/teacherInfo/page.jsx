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
//       </div>
//       <div style={{display:"flex", gap:"20px"}}>
//       <div style={{padding:"20px", borderRadius:"15px",border:"2px solid #dad9d9",flex:"3"}}>
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
//       <ContactInfo></ContactInfo>
//     </div>

//     </div>
//   )
// }
"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera, faPen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Teacher from "@/public/image/teacher.png";
import ContactInfo from "@/components/contactInformation";
import { useParams } from "next/navigation";

export default function TeacherPage() {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const teacherId = Number(params.id);
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`/api/studentDashboard/teachers/${teacherId}`);

        const data = await res.json();
        console.log(data);
        setTeacherData(data.teachers || []);
      } catch (error) {
        console.log("Error fetching teacher profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  if (loading) {
    return <p style={{ padding: "30px" }}>جاري تحميل البيانات...</p>;
  }

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
        <h1 style={{ fontWeight: "bold" }}>معلومات المدرس</h1>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            padding: "20px",
            borderRadius: "15px",
            border: "2px solid #dad9d9",
            flex: "3",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: "#5194F8", fontSize: "30px" }}
            />
            <h3>المعلومات الشخصية</h3>
          </div>
          {teacherData.map((teacher, index) => (
            <div key={index} style={{ display: "flex", gap: "40px" }}>
              {/* User Info */}

              <div style={{ flex: "2" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      " repeat(auto-fill, minmax(210px, 1fr))",
                    gap: "20px",
                    padding: "20px",
                  }}
                >
                  <div>
                    <label>الاسم الكامل</label>

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
                      {teacher?.teacherName}
                    </p>
                  </div>

                  <div>
                    <label>البريد الإلكتروني </label>

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
                      {teacher?.contactEmail}
                    </p>
                  </div>
                  <div>
                    <label>التخصص</label>

                    <p
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        minHeight: "40px",
                        border: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      {teacher?.teacherSpecialization || "لا يوجد تخصص"}
                    </p>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label>النبذة التعريفية</label>

                    <p
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px",
                        minHeight: "80px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        lineHeight: "1.8",
                      }}
                    >
                      {teacher?.teacherOverview || "لا توجد نبذة تعريفية"}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Image */}

              <div style={{ flex: "1" }}>
                <Image
                  src={teacher?.profilePictureUrl || Teacher}
                  width={200}
                  height={200}
                  alt="teacher"
                  style={{
                    borderRadius: "50%",
                    border: "5px solid #5194F8",
                    position: "relative",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <ContactInfo data={teacherData} />
      </div>
    </div>
  );
}
