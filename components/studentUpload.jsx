"use client";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function StudentUploadModal() {
  const [show, setShow] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [universityId, setUniversityId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/adminDashboard/settings/single-student-upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            universityId,
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
          padding: "5px",
          color: "black",
        }}
        onClick={() => setShow(true)}
      >
        إضافة طالب
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#ddd7f5" }} />

        <Modal.Body
          style={{
            padding: "20px",
            overflow: "hidden",
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
