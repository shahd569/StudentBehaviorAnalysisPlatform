// "use client";

// import Style from "@/components/table.module.css";
// import { faEye } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const Table = ({ data }) => {
//   if (!data) return <p>لا توجد بيانات متوفرة</p>;

//   return (
//     <table
//       className={Style.table}
//       style={{
//         borderCollapse: "separate",
//         borderSpacing: "0 10px",
//         color: "#626262",
//         width: "100%",
//         textAlign: "center",
//       }}
//     >
//       <thead>
//         <tr
//           style={{
//             backgroundColor: "#D9D9D9",
//             border: "1px solid #eee",
//           }}
//         >
//           <th
//             style={{
//               padding: "10px",
//               borderTopRightRadius: "10px",
//               borderBottomRightRadius: "10px",
//             }}
//           >
//             الطالب
//           </th>
//           <th> حالة التسليم </th>
//           <th>تاريخ التسليم </th>
//           <th>الملف</th>
//           <th>العلامة</th>
//           <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
//         </tr>
//       </thead>

//       <tbody>
//         {data.map((item, index) => (
//           <tr key={index}>
//             <td
//               style={{
//                 padding: "10px",
//                 borderTopRightRadius: "10px",
//                 borderBottomRightRadius: "10px",
//               }}
//             >
//               {item.studentName}
//             </td>

//             <td>{item.status}</td>
//             <td>
//               {item.submittedAt
//                 ? new Date(item.submittedAt)
//                     .toLocaleDateString("en-GB")
//                     .replace(/\//g, "-")
//                 : "لا يوجد تسليم"}
//             </td>
//             <td>
//               {item.fileUrl ? (
//                 <a
//                   href={item.fileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   // style={{ color: "#e672fd", textDecoration: "underline" }}
//                 >
//                   🗂️
//                 </a>
//               ) : (
//                 "لا يوجد ملف"
//               )}
//             </td>
//             <td>{item.score}</td>
//             <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
//               <FontAwesomeIcon
//                 icon={faEye}
//                 style={{ color: "gray" }}
//               ></FontAwesomeIcon>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default Table;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Style from "@/components/table.module.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Table = ({ data }) => {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(data || []);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تحديث الـ State إذا تغيرت الـ Props القادمة من الصفحة الأم
  useEffect(() => {
    setSubmissions(data || []);
  }, [data]);

  if (!data || data.length === 0) return <p>لا توجد بيانات متوفرة</p>;

  // فحص ما إذا كانت الحالة مصححة (يدعم القيمتين بالإنجليزية والعربية)
  const checkIsGraded = (status) => {
    return status === "GRADED" || status === "تم التصحيح";
  };

  const handleOpenModal = (item) => {
    if (checkIsGraded(item.status)) return;

    setSelectedSubmission(item);
    setGrade(item.score !== null && item.score !== undefined ? item.score : "");
    setComment(item.teacherComment || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
    setGrade("");
    setComment("");
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/teacherDashboard/assignments/${selectedSubmission.id}/submissions/graded`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            finalScore: grade,
            teacherComment: comment,
          }),
        },
      );

      if (res.ok) {
        // تحديث الواجهة فوراً بنص "تم التصحيح" ليتطابق مع العرض
        setSubmissions((prev) =>
          prev.map((item) =>
            item.id === selectedSubmission.id
              ? {
                  ...item,
                  score: grade,
                  teacherComment: comment,
                  status: "تم التصحيح",
                }
              : item,
          ),
        );
        handleCloseModal();
        // إعادة تنشيط مكونات Server Components للواجهة خلف الكواليس
        router.refresh();
      } else {
        alert("فشل في حفظ التقييم");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التواصل مع الخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
        <thead>
          <tr
            style={{
              backgroundColor: "#D9D9D9",
              border: "1px solid #eee",
            }}
          >
            <th
              style={{
                padding: "10px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              الطالب
            </th>
            <th>حالة التسليم</th>
            <th>تاريخ التسليم</th>
            <th>الملف</th>
            <th>العلامة</th>
            <th style={{ borderRadius: "10px 0 0 10px" }}>إجراء</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((item, index) => {
            const isGraded = checkIsGraded(item.status);

            return (
              <tr key={item.id || index}>
                <td
                  style={{
                    padding: "10px",
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  {item.studentName}
                </td>

                <td>{item.status}</td>
                <td>
                  {item.submittedAt
                    ? new Date(item.submittedAt)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")
                    : "لا يوجد تسليم"}
                </td>
                <td>
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🗂️
                    </a>
                  ) : (
                    "لا يوجد ملف"
                  )}
                </td>
                <td>
                  {item.score !== null && item.score !== undefined
                    ? item.score
                    : "-"}
                </td>
                <td style={{ padding: "10px", borderRadius: "10px 0 0 10px" }}>
                  <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => handleOpenModal(item)}
                    style={{
                      color: isGraded ? "#ccc" : "#e672fd",
                      cursor: isGraded ? "not-allowed" : "pointer",
                      fontSize: "18px",
                      opacity: isGraded ? 0.6 : 1,
                    }}
                    title={
                      isGraded ? "تم تصحيح هذا الواجب" : "عرض التفاصيل والتصحيح"
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* المودال */}
      {isModalOpen && selectedSubmission && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "24px",
              width: "420px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              direction: "rtl",
              textAlign: "right",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "16px",
                borderBottom: "2px solid #e672fd",
                paddingBottom: "8px",
              }}
            >
              تصحيح واجب الطالب
            </h2>

            <form
              onSubmit={handleSubmitGrade}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  ملاحظات الطالب:
                </label>
                <div
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "4px",
                    fontSize: "14px",
                    color: "#374151",
                    minHeight: "40px",
                  }}
                >
                  {selectedSubmission.notes || "لا توجد ملاحظات من الطالب"}
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  تعليق المدرس:
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="أدخل تعليقك هنا..."
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "4px",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  العلامة:
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="ضع العلامة هنا"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "4px",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f3f4f6",
                    color: "#4b5563",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#e672fd",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? "جاري الحفظ..." : "حفظ التقييم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
