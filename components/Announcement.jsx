"use client";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";

export default function DonationModal() {
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [course, setCourse] = useState("");
  const [receiver, setReceiver] = useState("");
  const [notify, setNotify] = useState(false);
  const [file, setFile] = useState(null);
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/teacherCourses");
      const data = await res.json();
      setCoursesList(data);
    };
    fetchCourses();
  }, []);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("course", course);
      formData.append("receiver", receiver);
      formData.append("notify", notify);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/announcements", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ");
      }

      alert("تم إنشاء الإعلان بنجاح ✅");
      setShow(false);

      // reset
      setTitle("");
      setContent("");
      setCourse("");
      setReceiver("");
      setNotify(false);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("فشل إنشاء الإعلان ❌");
    }
  };

  return (
    <>
      <Button
        className="shadow-sm"
        style={{
          width: "200px",
          border: "3px solid rgb(253, 123, 199)",
          backgroundColor: "white",
          color: "#4e4e4e",
          height: "30px",
          fontSize: "20px",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="primary"
        onClick={() => setShow(true)}
      >
        إنشاء إعلان
        <FontAwesomeIcon
          icon={faBullhorn}
          style={{ color: "rgb(253, 123, 199)", fontSize: "20px" }}
        ></FontAwesomeIcon>
      </Button>

      <Modal
        className="modal-lg"
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Body
          style={{ padding: "20px", height: "500px", overflow: "hidden" }}
        >
          <h3
            style={{ fontWeight: "bold", color: "black", textAlign: "center" }}
          >
            إنشاء إعلان جديد
          </h3>

          {/* العنوان */}
          <label style={{ color: "black", fontSize: "20px", margin: "15px" }}>
            العنوان :
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان الإعلان"
            type="text"
            style={{
              backgroundColor: "white",
              borderRadius: "30px",
              border: "none",
              width: "100%",
              height: "40px",
              padding: "15px",
              fontSize: "16px",
            }}
          />

          {/* التفاصيل */}
          <label style={{ color: "black", fontSize: "20px", margin: "15px" }}>
            تفاصيل الإعلان :
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{
              backgroundColor: "white",
              borderRadius: "30px",
              border: "none",
              width: "100%",
              height: "40px",
              padding: "15px",
              fontSize: "16px",
            }}
          />

          {/* select */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <div>
              <label
                style={{ color: "black", fontSize: "20px", margin: "15px" }}
              >
                اختر المادة
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  width: "200px",
                  margin: "10px",
                  border: "none",
                  height: "40px",
                  padding: "10px",
                  fontSize: "16px",
                }}
              >
                <option value="">اختر</option>
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{ color: "black", fontSize: "20px", margin: "15px" }}
              >
                المستلمون
              </label>
              <select
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  width: "200px",
                  margin: "10px",
                  border: "none",
                  height: "40px",
                  padding: "10px",
                  fontSize: "16px",
                }}
              >
                <option value="">اختر</option>
                <option>جميع الطلاب</option>
                <option>طلاب المادة</option>
              </select>
            </div>
          </div>

          {/* إشعار */}
          <div>
            <label
              style={{ color: "black", fontSize: "18px", margin: "15px 10px" }}
            >
              إرسال إشعار للطلاب
            </label>
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
            />
          </div>

          {/* ملف */}
          <div>
            <label
              style={{ color: "black", fontSize: "18px", margin: "15px 10px" }}
            >
              إرفاق ملف
            </label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          {/* زر النشر */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#a855f7",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              نشر الإعلان
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
