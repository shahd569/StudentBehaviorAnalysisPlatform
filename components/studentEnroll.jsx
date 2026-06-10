"use client";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function StudentUploadModal({ courseId, fetchCourses }) {
  const [show, setShow] = useState(false);

  //   const [courseName, setCourseName] = useState("");
  //   const [lastName, setLastName] = useState("");
  const [universityId, setUniversityId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!universityId) {
      alert("الرجاء إدخال الرقم الجامعي للطالب");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "/api/adminDashboard/coursesManagement/single-student-enroll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: courseId,
            // lastName,
            universityId: universityId,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      //   setCourseName("");
      //   setLastName("");
      setUniversityId("");

      setShow(false);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إضافة الطالب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="shadow-sm"
        style={{
          backgroundColor: "#d7dff5",
          border: "none",
          borderRadius: "10px",
          padding: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          color: "black",
          marginTop: "20px",
          width: "400px",
        }}
        onClick={() => setShow(true)}
      >
        تسجيل طالب بشكل فردي
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#d7dff5" }} />

        <Modal.Body
          style={{
            padding: "20px",
            overflow: "hidden",
            backgroundColor: "#d7dff5",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* <div style={{ display: "flex", flexDirection: "column" }}>
              <label>اسم المقرر</label>

              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="الاسم الأول"
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </div> */}

            {/* <div style={{ display: "flex", flexDirection: "column" }}>
              <label>الاسم الأخير</label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="الاسم الأخير"
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </div> */}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>الرقم الجامعي</label>

              <input
                type="text"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                placeholder="الرقم الجامعي"
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: "#0111a1",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  height: "40px",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                {loading ? "جاري الإضافة..." : "إضافة الطالب"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
