"use client";
import React, { useEffect, useState, use } from "react";
import Table from "@/components/AssignmentDetails";

const AssignmentDetails = ({ params }) => {
  const { id } = use(params);

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAssignmentData = async () => {
      try {
        const response = await fetch(
          `/api/teacherDashboard/assignments/${id}/submissions`,
        );
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        setAssignment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        padding: "20px 40px",
        fontSize: "18px",
      }}
    >
      <h1 style={{ fontWeight: "bold" }}>الواجبات</h1>
      <p style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>
        إدارة وتتبع واجبات جميع المواد
      </p>
      <div
        style={{
          display: "flex",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          className="shadow-sm"
          style={{
            borderRadius: "15px",
            border: "2px solid #ccc",
            width: "500px",
            height: "200px",
            padding: "20px",
            marginLeft: "50px",
          }}
        >
          <p> نص الواجب : {assignment.assignment.content}</p>
          <p> الدرجة القصوى : {assignment.assignment.maxScore}</p>
          <p>
            موعد التسليم النهائي :{" "}
            {assignment.assignment.deliveryDate
              ? new Date(assignment.assignment.deliveryDate)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")
              : "لا يوجد تسليم"}
          </p>
        </div>

        <div
          className="shadow-sm"
          style={{
            borderRadius: "15px",
            border: "2px solid #ccc",
            height: "200px",
            width: "300px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {assignment.assignment.resources &&
          assignment.assignment.resources.length > 0 ? (
            <div>
              <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                ملف المدرس المرفق
              </p>
              {/* أيقونة تعبيرية للملف */}
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📄</div>
              <a
                href={assignment.assignment.resources[0].resourceURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#e672fd",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                معاينة الملف
              </a>
            </div>
          ) : (
            <p style={{ color: "gray" }}>لا يوجد ملف مرفق من المدرس</p>
          )}
        </div>
      </div>
      <Table data={assignment.submissions} />
    </div>
  );
};
export default AssignmentDetails;
