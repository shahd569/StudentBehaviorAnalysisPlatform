// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser
// } from "@fortawesome/free-solid-svg-icons";
// export default function RecommendationsList() {
//     return(
//         <div style={{
//             width:"50%",
//             padding: "20px",
//             borderRadius: "15px",
//             border: "2px solid #dad9d9",
//             display:"flex",
//             flexDirection:"column"}}>
//         <div style={{ display: "flex", gap: "20px" }}>
//         <FontAwesomeIcon
//           icon={faUser}
//           style={{ color: "#9f04f8", fontSize: "30px" }}
//         />
//         <h4>جدول التوصيات </h4>
//       </div>
//       <hr></hr>
//       <p>يوجد 7 طلاب معرضين للرسوب</p>
//       <hr></hr>
//       <p>يوجد 7 طلاب معرضين للرسوب</p>
//       <hr></hr>
//       <p>يوجد 7 طلاب معرضين للرسوب</p>
//       <hr></hr>

//         </div>
//     )
// }



"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function RecommendationsList() {

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/recommendation");
        const data = await res.json();

        if (res.ok) {
          setRecommendations(data.teacherRecommendations || []);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div
      style={{
        width: "50%",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <FontAwesomeIcon
          icon={faUser}
          style={{ color: "#9f04f8", fontSize: "30px" }}
        />

        <h4>جدول التوصيات </h4>
      </div>

      <hr />

      {recommendations.map((item, index) => (
        <div key={index}>
          <p>{item}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}