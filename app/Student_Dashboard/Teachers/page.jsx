// import Image from "next/image"
// import Teacher from "@/public/image/teacher.png"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// export default function Teachers() {
//     return(
//         <div style={{display:"flex", flexDirection:"column",alignContent:"center", gap:"3px",padding:"20px 40px" ,fontSize:"18px"}}>
//             <h1 style={{fontWeight:"bold"}}>الأساتذة </h1>
//             <p style={{fontSize:"18px", fontWeight:"bold", color:"gray"}}>يمكنك التعرف على معلومات أساتذتك والتواصل معهم </p>
//             <div style={{
//                 display: "grid",
//                 gridTemplateColumns:" repeat(auto-fill, minmax(370px, 1fr))",
//                 gap: "50px",
//                 marginTop:"15px"
//              }}>
//             <div style={{boxShadow:"2px 2px 2px #ccc", borderRadius:"20px", padding:"20px", border:"1px solid #ccc", display:"flex", gap:"30px", alignItems:"center"}}>
//                 <Image src={Teacher} width={100} height={100} alt="teacher" style={{borderRadius:"50%", border:"3px solid #ccc"} }></Image>
//                 <div>
//                     <p style={{fontWeight:"bold",color:"#01053b", fontSize:"20px"}}>الدكتورة فدا جهجاه</p>
//                     <p style={{fontSize:"16px", color:"gray"}}>المواد : تجارة إلكترونية ، هندسة نظم المعلومات </p>
//                     <p style={{fontSize:"16px", color:"gray"}}>حاصلة على إجازة دكتوراه في هندسة نظم المعلومات والبرمجيات </p>
//                     <div style={{display:"flex", justifyContent:"end"}}>
//                         <button style={{border:"1px solid #ccc", borderRadius:"10px", textAlign:"center", fontSize:"16px", width:"120px", height:"35px", color:"#9f04f8", fontWeight:"bold"}}>
//                             زيارة الصفحة
//                             <FontAwesomeIcon icon={faArrowLeft} style={{marginRight:"5px"}}></FontAwesomeIcon>
//                             </button>
//                     </div>
//                 </div>
//             </div>
//             <div style={{boxShadow:"2px 2px 2px #ccc", borderRadius:"20px", padding:"20px", border:"1px solid #ccc", display:"flex", gap:"30px", alignItems:"center"}}>
//                 <Image src={Teacher} width={100} height={100} alt="teacher" style={{borderRadius:"50%", border:"3px solid #ccc"} }></Image>
//                 <div>
//                     <p style={{fontWeight:"bold",color:"#01053b", fontSize:"20px"}}>الدكتورة فدا جهجاه</p>
//                     <p style={{fontSize:"16px", color:"gray"}}>المواد : تجارة إلكترونية ، هندسة نظم المعلومات </p>
//                     <p style={{fontSize:"16px", color:"gray"}}>حاصلة على إجازة دكتوراه في هندسة نظم المعلومات والبرمجيات </p>
//                     <div style={{display:"flex", justifyContent:"end"}}>
//                         <button style={{border:"1px solid #ccc", borderRadius:"10px", textAlign:"center", fontSize:"16px", width:"120px", height:"35px", color:"#9f04f8", fontWeight:"bold"}}>
//                             زيارة الصفحة
//                             <FontAwesomeIcon icon={faArrowLeft} style={{marginRight:"5px"}}></FontAwesomeIcon>
//                             </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </div>

//     )
// }

"use client";

import Image from "next/image";
import Teacher from "@/public/image/teacher.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/studentDashboard/teachers");
        const data = await res.json();

        setTeachers(data.teachers || []);
      } catch (error) {
        console.log("Error fetching teachers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
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
      <h1 style={{ fontWeight: "bold" }}>المدرسين </h1>

      <p style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>
        يمكنك التعرف على معلومات أساتذتك والتواصل معهم
      </p>

      {loading && <p style={{ marginTop: "20px" }}>جاري تحميل الأساتذة...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: " repeat(auto-fill, minmax(370px, 1fr))",
          gap: "50px",
          marginTop: "15px",
        }}
      >
        {!loading &&
          teachers.map((teacher) => (
            <div
              key={teacher.id}
              style={{
                boxShadow: "2px 2px 2px #ccc",
                borderRadius: "20px",
                padding: "20px",
                border: "1px solid #ccc",
                display: "flex",
                gap: "30px",
                alignItems: "center",
              }}
            >
              <Image
                src={teacher.profilePictureUrl || Teacher}
                width={100}
                height={100}
                alt="teacher"
                style={{
                  borderRadius: "50%",
                  border: "3px solid #ccc",
                  objectFit: "cover",
                }}
              />

              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#01053b",
                    fontSize: "20px",
                  }}
                >
                  {teacher.teacherName}
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    color: "gray",
                  }}
                >
                  المواد : {teacher.courses?.join(" ، ")}
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    color: "gray",
                  }}
                >
                  {teacher.teacherOverview ||
                    teacher.teacherSpecialization ||
                    "لا يوجد وصف متاح"}
                </p>

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      textAlign: "center",
                      fontSize: "16px",
                      width: "120px",
                      height: "35px",
                      color: "#9f04f8",
                      fontWeight: "bold",
                    }}
                    onClick={() =>
                      router.push(
                        `/Student_Dashboard/Teachers/${teacher.id}/teacherInfo`,
                      )
                    }
                  >
                    زيارة الصفحة
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      style={{ marginRight: "5px" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
