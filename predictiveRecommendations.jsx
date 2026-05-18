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
//         <h4>توصيات النظام التنبؤية </h4>
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

export default function PredictiveRecommendations() {
  const [predictiveRecommendations, setPredictiveRecommendations] = useState(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/recommendation");
        const data = await res.json();

        setPredictiveRecommendations(
          data.predictiveRecommendations || [],
        );
      } catch (error) {
        console.error("Error fetching predictive recommendations:", error);
      }
    };

    fetchData();
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
        <h4>توصيات النظام التنبؤية </h4>
      </div>

      {predictiveRecommendations.length > 0 ? (
        predictiveRecommendations.map((item, index) => (
          <div key={index}>
            <hr />
            <p>{item}</p>
          </div>
        ))
      ) : (
        <p style={{ marginTop: "20px", color: "gray" }}>
          لا توجد توصيات حالياً
        </p>
      )}
    </div>
  );
}