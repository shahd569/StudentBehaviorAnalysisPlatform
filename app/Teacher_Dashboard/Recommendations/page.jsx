"use client";
import Cards from "../../../components/recommendationCards";
import List from "@/components/recommendationsList";
import PredictiveList from "@/components/predictiveRecommendations";
import PieRecommendations from "@/components/pieRecommendations";
import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
export default function Recommendations() {
  // const params = useParams();
  // const id = params?.id; // هنا استخرجنا الـ id المتغير من الرابط

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!id) return;

    const fetchAllData = async () => {
      try {
        // نرسل الـ id الديناميكي إلى الروت الخاص بكِ المصلح إملائياً (analysis)
        const res = await fetch(`/api/teacherDashboard/ai-analysis`);
        const result = await res.json();

        if (res.ok) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching recommendations data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  });

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        جاري تحميل التوصيات والتحليلات...
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "20px",
      }}
    >
      <div>
        <h1 style={{ fontWeight: "bold" }}>التوصيات</h1>
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "gray",
          }}
        >
          تحليل أداء الطلاب وتوصيات مخصصة لتحسين نتائجهم
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
        }}
      >
        <Cards
          stats={data?.stats || { borderline: 0, unsafe: 0, safe: 0, total: 0 }}
        />
        <PieRecommendations data={data?.stats} />
      </div>
      <div style={{ display: "flex", gap: "30px" }}>
        <List recommendations={data?.teacherRecommendations || []} />
        <PredictiveList
          predictiveRecommendations={data?.predictiveRecommendations || []}
        />
      </div>
    </div>
  );
}
