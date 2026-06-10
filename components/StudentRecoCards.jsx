"use client";

export default function Cards({ stats }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
    >
      {/* توقع الأداء النهائي*/}

      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid #dad9d9",
          width: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>توقع الأداء النهائي</p>
        <p>{stats.performancePrediction}</p>
      </div>

      {/* مستوى التفاعل*/}

      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid #dad9d9",
          width: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>مستوى التفاعل</p>
        <p>{stats.engagementLevel}</p>
      </div>

      {/* مستوى الخطر */}

      <div
        style={{
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid #dad9d9",
          width: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>مستوى الأداء الحالي</p>
        <p>{stats.riskLevel}</p>
      </div>
    </div>
  );
}
