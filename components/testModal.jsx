"use client";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA } from "@fortawesome/free-solid-svg-icons";

export default function TestModal() {
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);

  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [marks, setMarks] = useState("");
  const [questions, setQuestions] = useState("");

  useEffect(() => {
    if (!show) return;

    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/teacherCourses");
        const data = await res.json();
        if (res.ok) setSubjectsList(data);
      } catch (error) {
        console.error("خطأ في جلب المواد:", error);
      }
    };

    fetchSubjects();
  }, [show]);

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
    } catch (error) {
      console.error("خطأ في إرسال البيانات:", error);
    }
  };

  return (
    <>
      <Button
        className="shadow-sm"
        style={{
          width: "200px",
          border: "3px solid #e672fdff",
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
        إنشاء اختبار
        <FontAwesomeIcon
          icon={faA}
          style={{ color: "#e672fdff", fontSize: "20px" }}
        ></FontAwesomeIcon>
      </Button>

      <Modal
        className="modal-lg"
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body
          style={{ padding: "20px", height: "500px", overflow: "auto" }}
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
                    height: "40px",
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
                  type="Number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "30px",
                    border: "none",
                    width: "100%",
                    height: "40px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                  placeholder="ادخل مدة الاختبار بالدقائق"
                />
                <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
                  الدرجة النهائية :
                </p>
                <input
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
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
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
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
                      تاريخ الانتهاء :
                    </label>
                    <input
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
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
                <div style={{ display: "flex", gap: "25px" }}>
                  <div style={{ flex: "2", flexGrow: "2" }}>
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      rows={4}
                      placeholder="أكتب السؤال هنا ..."
                      style={{
                        backgroundColor: "white",
                        borderRadius: "30px",
                        border: "none",
                        width: "95%",
                        height: "40px",
                        padding: "15px",
                        fontSize: "16px",
                      }}
                      type="text"
                    />
                    {options.map((opt, index) => (
                      <div key={index}>
                        <label
                          style={{
                            color: "black",
                            fontSize: "16px",
                            margin: "10px 5px",
                          }}
                        >
                          الخيار {index + 1}
                        </label>
                        <input
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                          }}
                          style={{
                            backgroundColor: "white",
                            borderRadius: "15px",
                            border: "1px solid #ccc",
                            width: "84%",
                            height: "30px",
                          }}
                        />
                      </div>
                    ))}
                    <p
                      style={{
                        color: "black",
                        fontSize: "20px",
                        marginTop: "20px",
                      }}
                    >
                      أختيار الإجابة الصحيحة :
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      {options.map((opt, index) => (
                        <label key={index} style={{ fontSize: "18px" }}>
                          <input
                            type="radio"
                            name="correct"
                            value={index}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                          />
                          الخيار {index + 1}
                        </label>
                      ))}
                    </div>
                    <label
                      style={{
                        color: "black",
                        fontSize: "20px",
                        margin: "5px",
                      }}
                    >
                      درجة السؤال :
                    </label>
                    <input
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "15px",
                        border: "1px solid #ccc",
                        width: "70%",
                        height: "30px",
                      }}
                    ></input>

                    <button
                      style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        width: "85%",
                        textAlign: "center",
                        marginTop: "15px",
                      }}
                      onClick={() => {
                        if (!questionText || !marks || correctAnswer === "") {
                          alert("يرجى تعبئة جميع الحقول");
                          return;
                        }

                        const newQuestion = {
                          question: questionText,
                          options,
                          correctAnswer,
                          marks,
                        };

                        setQuestions([...questions, newQuestion]);

                        setQuestionText("");
                        setOptions(["", "", "", ""]);
                        setCorrectAnswer("");
                        setMarks("");
                      }}
                    >
                      ➕ إضافة السؤال
                    </button>
                  </div>
                  <div
                    style={{
                      flexGrow: "1",
                      flex: "1",
                      border: "1px solid #ccc",
                      padding: "10px 20px",
                    }}
                  >
                    <h5>أسئلة الاختبار</h5>
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "5px",
                        borderRadius: "10px",
                      }}
                    >
                      <p>ماهو html</p>
                      <p>الإجابة الصحيحة</p>
                    </div>
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "5px",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <p>ماهو html</p>
                      <p>الإجابة الصحيحة</p>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
