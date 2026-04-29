"use client";

import { useEffect, useState } from "react";
import Style from "@/components/table2.module.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { isTemplateMiddle } from "typescript";

const Table = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleStart = async (item) => {
    console.log(item);
    try {
      if (item.type === "assignment") {
        router.push(`/Student_Dashboard/assignments/available/${item.id}`);
        return;
      }

      if (item.type === "quiz") {
        const res = await fetch(
          "/api/studentDashboard/quizzes/available/start",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quizId: item.id }),
          },
        );

        if (!res.ok) {
          throw new Error("فشل بدء الاختبار");
        }

        const data = await res.json();

        router.push(`/Student_Dashboard/quizzes/available/${data.attemptId}`);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء بدء المهمة");
    }
  };
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/studentDashboard/homePageTimeLine");
        const data = await res.json();

        if (res.ok) {
          const formattedData = data.finalData.map((item, index) => ({
            id: item.id,
            type: item.type,
            title: item.assignmentTitle || item.quizTitle,
            courseName: item.courseName,
            timeRemaining: item.timeRemaining,
          }));

          setAssignments(formattedData);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <p>جاري تحميل الواجبات...</p>;

  return (
    <table
      className={Style.table}
      style={{
        borderCollapse: "separate",
        borderSpacing: "0 10px",
        color: "#626262",
        width: "100%",
        textAlign: "center",
      }}
    >
      <thead
        style={{
          backgroundColor: "#D9D9D9",
          border: "1px solid #eee",
        }}
      >
        <tr>
          <th
            style={{
              padding: "10px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            المهمة
          </th>
          <th>المادة</th>
          <th>الوقت المتبقي</th>
          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {assignments.map((item) => (
          <tr key={item.id}>
            <td
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              {item.title}
            </td>

            <td>{item.courseName}</td>

            <td>{item.timeRemaining}</td>

            <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
              <button onClick={() => handleStart(item)}>
                {" "}
                <FontAwesomeIcon
                  icon={faEye}
                  style={{ color: "gray" }}
                ></FontAwesomeIcon>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
