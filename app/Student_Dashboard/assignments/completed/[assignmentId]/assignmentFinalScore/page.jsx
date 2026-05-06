"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "@/lib/supabaseClient";

import {
  faTasks,
  faCalendar,
  faStar,
  faCloudUpload,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

const getColor = (score, max) => {
  const percent = (score / max) * 100;

  if (percent >= 75) return "#28A745";
  if (percent >= 50) return "#FFA500";
  return "#DC3545";
};

export default function Assignment() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.assignmentId;

  const [assignmentId, setAssignmentId] = useState();
  const [notes, setNotes] = useState();
  const [submissionUrl, setSubmissionUrl] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `/api/studentDashboard/assignments/completed/${attemptId}/studentAssignmentScore`,
        );
        const result = await res.json();
        if (res.ok) {
          setData(result.assignmentInfo);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    if (attemptId) {
      fetchAssignment();
    }
  }, [attemptId]);

  if (!data) return <p>جاري التحميل...</p>;
  const score = data?.finalScore || 0;
  const maxScore = data?.maxScore || 100;

  const progress = maxScore ? score / maxScore : 0;

  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - progress * circumference;

  const getGradeText = (score, max) => {
    const percent = (score / max) * 100;

    if (percent >= 90) return "ممتاز";
    if (percent >= 80) return "جيد جداً";
    if (percent >= 70) return "جيد";
    return "ضعيف";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "end" }}>
        <button
          style={{
            border: "3px solid #ccc",
            textAlign: "center",
            width: "60px",
            borderRadius: "10px",
            boxShadow: "0 4px 4px #ccc",
          }}
          onClick={() => router.push("/Student_Dashboard/assignments")}
        >
          رجوع
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "10px",
          // height: "160px",
          minHeight: "160px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{ display: "flex", padding: "10px", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={faTasks}
              style={{
                width: "30px",
                height: "30px",
                color: "blue",
                marginLeft: "20px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{data.title}</span>
              <span>مقرر : {data.courseName}</span>
            </div>
          </div>
          <p
            style={{
              color: "white",
              borderRadius: "20px",
              width: "100px",
              textAlign: "center",
              backgroundColor: data.status === "مصحح" ? "#28A745" : "#dc3545",
              padding: "5px",
              boxShadow: "0 4px 4px #ccc",
              height: "40px",
            }}
          >
            {data.status}
          </p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            backgroundColor: "#eee",
            display: "flex",
            justifyContent: "start",
            gap: "100px",
            padding: "10px",
            // height: "70px",
            minHeight: "70px",
          }}
        >
          <div>
            <div style={{ display: "flex" }}>
              <FontAwesomeIcon icon={faCalendar} />
              <p style={{ fontSize: "14px" }}>تاريخ الإنشاء</p>
            </div>
            <p style={{ fontSize: "14px", marginRight: "4px" }}>
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <div style={{ display: "flex" }}>
              <FontAwesomeIcon icon={faCalendar} />
              <p style={{ fontSize: "14px", marginRight: "4px" }}>
                أخر موعد للتسليم
              </p>
            </div>
            <p style={{ fontSize: "14px" }}>
              {new Date(data.deliveryDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <div style={{ display: "flex" }}>
              <FontAwesomeIcon icon={faStar} />
              <p style={{ fontSize: "14px", marginRight: "4px" }}>
                الدرجة العظمى
              </p>
            </div>
            <p style={{ fontSize: "14px" }}>{data.maxScore}</p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
        }}
      >
        <div
          className=" d-flex gap-5 flex-column flex-md-row col-md-3"
          // style={{ backgroundColor: "#D7E2F5" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              borderRadius: "5px",
              backgroundColor: "#D7E2F5",
              width: "100%",
              padding: "20px",
            }}
          >
            <h3>نتيجة الطالب :</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <svg height={radius * 2} width={radius * 2}>
                {/* الخلفية */}
                <circle
                  stroke="#eee"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />

                {/* التقدم */}
                <circle
                  stroke={getColor(score, maxScore)}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />

                {/* العلامة الحقيقية */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="20px"
                  fontWeight="bold"
                  fill={getColor(score, maxScore)}
                >
                  {score}
                </text>
              </svg>

              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  // color: getColor(score, maxScore),
                  color: "black",
                }}
              >
                {getGradeText(score, maxScore)}
              </p>
            </div>

            <div
              style={{
                width: "90%",
                backgroundColor: "white",
                border: "2px solid #5194F8",
                borderRadius: "10px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                padding: "15px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <h3 style={{ color: "#5194F8" }}>تعليق الأستاذ</h3>
              <p> {data.teacherComment} </p>
            </div>
          </div>
        </div>

        <div className=" d-flex gap-5 flex-column flex-md-row col-md-9">
          <div className="w-100 d-flex flex-column gap-5 col-md-12">
            <div style={{ display: "flex", gap: "20px" }}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "10px",
                  // height: "120px",
                  minHeight: "120px",
                  width: "60%",
                }}
              >
                <p>{data.content}</p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "10px",
                  // height: "120px",
                  minHeight: "120px",
                  width: "40%",
                }}
              >
                <p>الملفات المرفقة :</p>

                {data.resourceURL?.map((file, index) => (
                  <a
                    key={index}
                    href={file}
                    target="_blank"
                    style={{ display: "block", color: "blue" }}
                  >
                    {/* {decodeURIComponent(file.split("/").pop())} */}
                    الملف الذي رفعه المدرس 📄
                  </a>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "10px",
                // height: "120px",
                minHeight: "120px",
              }}
            >
              <p>الملفات المرفقة الخاصة بالطالب </p>
              <a
                style={{ display: "block", color: "blue" }}
                href={data.submissionUrl}
                target="_blank"
              >
                📄 {decodeURIComponent(data.submissionUrl.split("/").pop())}
              </a>
            </div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "10px",
                // height: "120px",
                minHeight: "120px",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <FontAwesomeIcon icon={faPen} />
                <p>ملاحظاتك</p>
              </div>
              <p style={{ marginRight: "10px" }}> {data.notes} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
