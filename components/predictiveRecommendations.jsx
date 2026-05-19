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

export default function PredictiveRecommendations({
  predictiveRecommendations,
}) {
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
      <hr />
      {predictiveRecommendations.length > 0 ? (
        predictiveRecommendations.map((item, index) => (
          <div key={index}>
            <p>{item.content || item}</p>
            {index < predictiveRecommendations.length - 1 && <hr />}
          </div>
        ))
      ) : (
        <p style={{ color: "gray", textAlign: "center" }}>
          لا توجد توصيات تنبؤية حالياً.
        </p>
      )}
    </div>
  );
}
