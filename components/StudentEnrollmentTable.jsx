"use client";

import Style from "@/components/table2.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import Link from "next/link";

const Table = ({ data }) => {
  if (!data) return <p>لا توجد بيانات للعرض</p>;
  console.log("from table" + data);
  const handleDelete = async (courseId, studentId) => {
    const confirmDelete = window.confirm(
      "هل أنت متأكد من إلغاء تسجيل هذا الطالب في المقرر",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/adminDashboard/studentsEnrollmentInfo/${courseId}/${studentId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <table
      className={Style.table}
      style={{
        marginTop: "20px",
        borderCollapse: "separate",
        borderSpacing: "0 10px",
        color: "#626262",
        textAlign: "center",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#D9D9D9" }}>
          <th
            style={{
              padding: "10px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            الاسم
          </th>

          <th>البريد الإلكتروني</th>

          <th>الرقم الجامعي</th>

          <th>السنة الدراسية</th>

          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, id) => (
          <tr key={id}>
            <td
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              {item.Name}
            </td>

            <td>{item.email}</td>
            {/* اما طالب او مدرس او مدير اذا كان الدور ADMIN يكون مدير */}
            <td>{item.universityId}</td>

            <td>{item.academicYear}</td>

            <td
              style={{
                padding: "10px",
                borderRadius: "10px 0 0 10px",
              }}
            >
              <button
                onClick={() => handleDelete(item.courseId, item.studentId)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{
                    color: "#dc3545",
                    fontSize: "18px",
                  }}
                />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
