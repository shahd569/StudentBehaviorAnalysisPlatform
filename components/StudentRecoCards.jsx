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
        <p>{stats.analysis.performancePrediction}</p>
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
        <p>{stats.analysis.engagementLevel}</p>
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
        <p>مستوى الخطر</p>
        <p>{stats.analysis.riskLevel}</p>
      </div>
    </div>
  );
}
