"use client";

import Style from "@/components/table2.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Table = ({ data }) => {
  if (!data) return <p>لا توجد بيانات للعرض</p>;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المستخدم؟");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/adminDashboard/usersManagement/${id}`, {
        method: "DELETE",
      });

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

          <th>الدور</th>

          <th>تاريخ التسجيل</th>

          <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              {item.firstName} {item.lastName}
            </td>

            <td>{item.email}</td>
            {/* اما طالب او مدرس او مدير اذا كان الدور ADMIN يكون مدير */}
            <td>
              {item.role == "STUDENT"
                ? "طالب"
                : item.role == "TEACHER"
                  ? "مدرس"
                  : "مدير"}
            </td>

            <td>
              {new Date(item.registrationDate).toLocaleDateString("ar-EG")}
            </td>

            <td
              style={{
                padding: "10px",
                borderRadius: "10px 0 0 10px",
              }}
            >
              <button
                onClick={() => handleDelete(item.id)}
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
