"use client";

import List from "@/components/studentRecommendation";
import Card from "@/components/StudentRecoCards";
import GeneralRecommendations from "@/components/generalRecommendation";
import QuizRecommendations from "@/components/quizRecommendation";

import { useEffect, useState } from "react";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [generalRecommendations, setGeneralRecommendations] = useState([]);
  const [quizRecommendations, setQuizRecommendations] = useState([]);
  const [fullAnalysis, setFullAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch(
          "/api/studentDashboard/student-lessons-analysis",
        );
        const result = await res.json();

        if (res.ok) {
          const allRecommendations =
            result.lessons?.flatMap((lesson) => lesson.recommendations || []) ||
            [];

          setRecommendations(allRecommendations);
        }
      } catch (error) {
        console.error("Error fetching recommendations data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/studentDashboard/ai-full-analysis");
        const result = await res.json();

        if (res.ok) {
          setFullAnalysis(result.analysis);

          setGeneralRecommendations(result.generalRecommendations || []);

          setQuizRecommendations(result.quizRecommendations || []);
        }
      } catch (error) {
        console.error("Error fetching recommendations data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        جاري تحميل التوصيات...
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
        <h1 style={{ fontWeight: "bold" }}>التوصيات الذكية</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Card stats={fullAnalysis} />
        <div style={{ flex: "2" }}></div>
      </div>
      <div style={{ display: "flex", gap: "30px" }}>
        <List recommendations={recommendations} />
        <GeneralRecommendations
          generalRecommendation={generalRecommendations}
        />
      </div>
      <QuizRecommendations quizRecommendations={quizRecommendations} />
    </div>
  );
}
