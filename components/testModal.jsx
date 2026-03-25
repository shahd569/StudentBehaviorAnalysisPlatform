"use client";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

export default function TestModal() {
  const [show, setShow] = useState(false);

  // الحالات الخاصة بالـ API
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [subjectsList, setSubjectsList] = useState([]); // لجلب المواد من API

  // عند فتح المودال أو تحميل الصفحة يمكن جلب المواد
  useEffect(() => {
    if (!show) return;

    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/teacherCourses"); // عدلي حسب مسار API الخاص بالمواد
        const data = await res.json();
        if (res.ok) setSubjectsList(data);
      } catch (error) {
        console.error("خطأ في جلب المواد:", error);
      }
    };

    fetchSubjects();
  }, [show]);

  // دالة إرسال البيانات للـ API عند الضغط على التالي
  const handleNext = async () => {
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل إنشاء الاختبار");
      console.log("تم إرسال البيانات:", data);
      // ممكن الانتقال للتاب التالي هنا
    } catch (error) {
      console.error("خطأ في إرسال البيانات:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        إنشاء اختبار
      </Button>

      <Modal
        className="modal-lg"
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body
          style={{ padding: "20px", height: "500px", overflow: "hidden" }}
        >
          <Tab.Container defaultActiveKey="first">
            <Nav
              variant="tabs"
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                margin: "10px",
              }}
            >
              <Nav.Item>
                <Nav.Link
                  style={{ color: "gray", fontSize: "18px" }}
                  eventKey="first"
                >
                  معلومات الاختبار
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{ color: "gray", fontSize: "18px" }}
                  eventKey="second"
                >
                  الإعدادات
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{ color: "gray", fontSize: "18px" }}
                  eventKey="third"
                >
                  إضافة سؤال
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  style={{ color: "gray", fontSize: "18px" }}
                  eventKey="forth"
                >
                  نشر
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="first">
                <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
                  عنوان الاختبار :
                </p>
                <input
                  placeholder="أدخل عنوان الاختبار..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    height: "40px",
                    padding: "15px",
                    fontSize: "16px",
                  }}
                  type="text"
                />
                <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
                  المادة :
                </p>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    height: "40px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                >
                  <option value="">اختر المادة</option>
                  {subjectsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.courseName}
                    </option>
                  ))}
                </select>

                <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
                  الوصف (اختياري) :
                </p>
                <textarea
                  rows={4}
                  placeholder="أدخل وصف المحتوى"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    marginBottom: "40px",
                  }}
                ></textarea>

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button
                    style={{
                      border: "1px solid black",
                      width: "150px",
                      height: "45px",
                      textAlign: "center",
                      fontSize: "18px",
                      borderRadius: "5px",
                    }}
                    onClick={handleNext}
                  >
                    التالي
                  </button>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
                  {" "}
                  مدة الاختبار (اختياري):
                </p>
                <input
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    height: "40px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                  type="time"
                ></input>
                <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
                  الدرجة النهائية :
                </p>
                <input
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    height: "40px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                ></input>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                    marginBottom: "60px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "black",
                        fontSize: "20px",
                        margin: "15px",
                      }}
                    >
                      تاريخ البدء :
                    </label>
                    <input
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
                      type="date"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: "black",
                        fontSize: "20px",
                        margin: "15px",
                      }}
                    >
                      تاريخ البدء :
                    </label>
                    <input
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
                      type="date"
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button
                    style={{
                      border: "1px solid black",
                      width: "150px",
                      height: "45px",
                      textAlign: "center",
                      fontSize: "18px",
                      borderRadius: "5px",
                    }}
                  >
                    التالي
                  </button>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
                  الوصف :{" "}
                </p>
                <textarea
                  rows={4}
                  placeholder="أدخل وصف المحتوى"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    height: "40px",
                    padding: "15px",
                    fontSize: "16px",
                  }}
                  type="text"
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingRight: "10px",
                    margin: "20px",
                  }}
                >
                  <label style={{ fontSize: "18px" }}>
                    <input type="radio" name="option" value="option1" /> إرسال
                    إشعار للطلاب عند النشر
                  </label>
                </div>
                <p
                  style={{
                    color: "black",
                    fontSize: "20px",
                    margin: "30px 15px",
                  }}
                >
                  آخر موعد للتسليم :
                </p>
                <input
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    height: "40px",
                    padding: "15px",
                    fontSize: "16px",
                  }}
                  type="date"
                ></input>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "70px",
                  }}
                >
                  <button
                    style={{
                      border: "1px solid black",
                      width: "150px",
                      height: "45px",
                      textAlign: "center",
                      fontSize: "18px",
                      borderRadius: "5px",
                    }}
                  >
                    السابق
                  </button>
                  <button
                    style={{
                      border: "1px solid black",
                      width: "150px",
                      height: "45px",
                      textAlign: "center",
                      fontSize: "18px",
                      borderRadius: "5px",
                    }}
                  >
                    التالي
                  </button>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
