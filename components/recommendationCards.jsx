// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faShield} from "@fortawesome/free-solid-svg-icons";
// export default function Cards(){
//     return(
//         <div style={{display:"flex", justifyContent:"space-between", gap:"20px"}}>
//             <div style={{
//                 padding: "20px",
//                 borderRadius: "15px",
//                 border: "2px solid #dad9d9",
//                 width:"200px"}}>
//                     <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
//                         <p>طلاب في خطر</p>
//                         <div style={{borderRadius:"50%", backgroundColor:"#fcc6c6", display:"flex", justifyContent:"center", alignItems:"center", width:"40px", height:"40px"
//                         }}>
//                             <FontAwesomeIcon icon={faShield} style={{color:"red"}}></FontAwesomeIcon>
//                         </div>
//                     </div>
//                     <p>7</p>
//                     <p>77.8% من الصف</p>
//             </div>
//             <div style={{
//                 padding: "20px",
//                 borderRadius: "15px",
//                 border: "2px solid #dad9d9",
//                 width:"200px"}}>
//                     <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
//                         <p>طلاب على الحافة </p>
//                         <div style={{borderRadius:"50%", backgroundColor:"#fcefc6", display:"flex", justifyContent:"center", alignItems:"center", width:"40px", height:"40px"
//                         }}>
//                             <FontAwesomeIcon icon={faShield} style={{color:"#ffce46"}}></FontAwesomeIcon>
//                         </div>
//                     </div>
//                     <p>7</p>
//                     <p>77.8% من الصف</p>
//             </div>
//             <div style={{
//                 padding: "20px",
//                 borderRadius: "15px",
//                 border: "2px solid #dad9d9",
//                 width:"200px"}}>
//                     <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
//                         <p>طلاب آمنون</p>
//                         <div style={{borderRadius:"50%", backgroundColor:"#cffcc6", display:"flex", justifyContent:"center", alignItems:"center", width:"40px", height:"40px"
//                         }}>
//                             <FontAwesomeIcon icon={faShield} style={{color:"green"}}></FontAwesomeIcon>
//                         </div>
//                     </div>
//                     <p>7</p>
//                     <p>77.8% من الصف</p>
//             </div>
//         </div>
//     )
// }

"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function Cards() {
  const [stats, setStats] = useState({
    atRisk: 0,
    borderline: 0,
    safe: 0,
  });

  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/ai-analysis");
        const data = await res.json();

        if (res.ok) {
          setStats(data.stats);

          const total =
            data.stats.atRisk + data.stats.borderline + data.stats.safe;

          setTotalStudents(total);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  const getPercentage = (count) => {
    if (totalStudents === 0) return 0;
    return ((count / totalStudents) * 100).toFixed(1);
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
    >
      {/* طلاب في خطر */}

      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid #dad9d9",
          width: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>طلاب في خطر</p>

          <div
            style={{
              borderRadius: "50%",
              backgroundColor: "#fcc6c6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
            }}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ color: "red" }}
            />
          </div>
        </div>

        <p>{stats.atRisk}</p>

        <p>{getPercentage(stats.atRisk)}% من الصف</p>
      </div>

      {/* طلاب على الحافة */}

      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid #dad9d9",
          width: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>طلاب على الحافة </p>

          <div
            style={{
              borderRadius: "50%",
              backgroundColor: "#fcefc6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
            }}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ color: "#ffce46" }}
            />
          </div>
        </div>

        <p>{stats.borderline}</p>

        <p>{getPercentage(stats.borderline)}% من الصف</p>
      </div>

      {/* طلاب آمنون */}

      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid #dad9d9",
          width: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>طلاب آمنون</p>

          <div
            style={{
              borderRadius: "50%",
              backgroundColor: "#cffcc6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
            }}
          >
            <FontAwesomeIcon icon={faShield} style={{ color: "green" }} />
          </div>
        </div>

        <p>{stats.safe}</p>

        <p>{getPercentage(stats.safe)}% من الصف</p>
      </div>
    </div>
  );
}
