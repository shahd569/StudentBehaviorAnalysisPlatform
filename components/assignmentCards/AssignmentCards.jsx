// import Style from "./cards.module.css"
// export default function AssignmentCards(){
//     return(
//         <div className={Style.cards}>
//             <div style={{borderRadius:"10px", padding:"15px",background:"linear-gradient(to bottom, #E5EFFF, #F2F2F2)", boxShadow:"0 4px 4px #ccc"}}>
//                 <div style={{display:"flex", justifyContent:"space-between"}}>
//                     <p style={{color:"white", borderRadius:"20px", width:"75px", textAlign:"center", backgroundColor:"#28A745", padding:"5px", boxShadow:"0 4px 4px #ccc"}}>متاح</p>
//                     <p style={{color:"gray", backgroundColor:"white", borderRadius:"10px", padding:"5px"}}>موعد التسليم : 22/5/2027</p>
//                 </div>
//                 <div style={{display:"flex", justifyContent:"center"}}>
//                     <h3 style={{fontWeight:"bold"}}>واجب تجارة إلكترونية</h3>
//                 </div>
//                 <p style={{color:"#626262",textAlign:"center"}}>تجارة إلكترونية</p>
//                 <div style={{display:"flex", justifyContent:"end"}}>
//                     <button style={{borderRadius:"5px", backgroundColor:"#5194F8", color:"white", boxShadow:"0 4px 4px #ccc",width:"80px", height:"40px", textAlign:"center", marginTop:"20px"}}>ابدأ الحل </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client";

import { useEffect, useState } from "react";
import Style from "./cards.module.css";
import { useRouter } from "next/navigation";

export default function AssignmentCards({ assignments }) {
  const router = useRouter();

  const handleStartAssignment = async (item) => {
    // 2. التوجه لصفحة الأسئلة مع تمرير معرف المحاولة أو الاختبار
    router.push(`/Student_Dashboard/assignments/available/${item.id}`);
  };
  if (!assignments) return <p>لا يوجد بيانات</p>;
  return (
    <div className={Style.cards}>
      {assignments.map((item, index) => (
        <div
          key={index}
          style={{
            borderRadius: "10px",
            padding: "15px",
            background:
              item.status === "متاح"
                ? "linear-gradient(to bottom, #E5EFFF, #F2F2F2)" // أزرق للمتاح
                : "linear-gradient(to bottom, #F0C2EE, #F2F2F2)", // أحمر للغير متاح
            boxShadow: "0 4px 4px #ccc",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p
              style={{
                color: "white",
                borderRadius: "20px",
                width: "75px",
                textAlign: "center",
                backgroundColor: item.status === "متاح" ? "#28A745" : "#DC3545",
                padding: "5px",
                boxShadow: "0 4px 4px #ccc",
              }}
            >
              {item.status}
            </p>

            <p
              style={{
                color: "gray",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              موعد التسليم : {item.endDate}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <h3 style={{ fontWeight: "bold" }}>{item.title}</h3>
          </div>

          <p style={{ color: "#626262", textAlign: "center" }}>
            {item.courseName}
          </p>

          <div style={{ display: "flex", justifyContent: "end" }}>
            <button
              disabled={item.status !== "متاح"}
              style={{
                borderRadius: "5px",
                backgroundColor: "#5194F8",
                color: "white",
                boxShadow: "0 4px 4px #ccc",
                width: "80px",
                height: "40px",
                textAlign: "center",
                marginTop: "20px",
                cursor: item.status === "متاح" ? "pointer" : "not-allowed",
                opacity: item.status === "متاح" ? 1 : 0.6,
              }}
              onClick={() => handleStartAssignment(item)}
            >
              ابدأ الحل
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
