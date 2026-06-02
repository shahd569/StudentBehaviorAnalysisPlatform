"use client";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function TeacherUploadModal() {
  const [show, setShow] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [teacherOverview, setTeacherOverview] = useState("");
  const [teacherSpecialization, setTeacherSpecialization] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/adminDashboard/settings/single-stuff-upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            firstName,
            lastName,
            teacherOverview,
            teacherSpecialization,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      setFirstName("");
      setLastName("");
      setEmployeeId("");
      setTeacherOverview("");
      setTeacherSpecialization("");

      setShow(false);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إضافة المدرس");
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
          padding: "5px",
          color: "black",
        }}
        onClick={() => setShow(true)}
      >
        إضافة مدرس
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#ddd7f5" }} />

        <Modal.Body
          style={{
            padding: "20px",
            backgroundColor: "#ddd7f5",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>الاسم الأول</label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="الاسم الأول"
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
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
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>الرقم الوظيفي</label>

              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="الرقم الوظيفي"
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>التخصص</label>

              <input
                type="text"
                value={teacherSpecialization}
                onChange={(e) => setTeacherSpecialization(e.target.value)}
                placeholder="التخصص"
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>نبذة عن المدرس</label>

              <textarea
                value={teacherOverview}
                onChange={(e) => setTeacherOverview(e.target.value)}
                placeholder="نبذة مختصرة عن المدرس"
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  minHeight: "100px",
                  resize: "none",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: "#0111a1",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  height: "40px",
                  width: "120px",
                  textAlign: "center",
                }}
              >
                {loading ? "جاري الإضافة..." : "إضافة المدرس"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
