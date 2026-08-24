// "use client";
// import { useState, useEffect } from "react";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import Nav from "react-bootstrap/Nav";
// import Tab from "react-bootstrap/Tab";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faA } from "@fortawesome/free-solid-svg-icons";

// export default function TestModal() {
//   const [show, setShow] = useState(false);

//   const [title, setTitle] = useState("");
//   const [subject, setSubject] = useState("");
//   const [description, setDescription] = useState("");
//   const [subjectsList, setSubjectsList] = useState([]);

//   const [duration, setDuration] = useState("");
//   const [totalMarks, setTotalMarks] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [questionText, setQuestionText] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctAnswer, setCorrectAnswer] = useState("");
//   const [marks, setMarks] = useState("");
//   const [questions, setQuestions] = useState("");

//   useEffect(() => {
//     if (!show) return;

//     const fetchSubjects = async () => {
//       try {
//         const res = await fetch("/api/teacherCourses");
//         const data = await res.json();
//         if (res.ok) setSubjectsList(data);
//       } catch (error) {
//         console.error("خطأ في جلب المواد:", error);
//       }
//     };

//     fetchSubjects();
//   }, [show]);

//   const handleNext = async () => {
//     try {
//       const res = await fetch("/api/quiz", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           subject,
//           description,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "فشل إنشاء الاختبار");
//       console.log("تم إرسال البيانات:", data);
//     } catch (error) {
//       console.error("خطأ في إرسال البيانات:", error);
//     }
//   };

//   return (
//     <>
//       <Button
//         className="shadow-sm"
//         style={{
//           width: "200px",
//           border: "3px solid #e672fdff",
//           backgroundColor: "white",
//           color: "#4e4e4e",
//           height: "30px",
//           fontSize: "20px",
//           borderRadius: "10px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//         variant="primary"
//         onClick={() => setShow(true)}
//       >
//         إنشاء اختبار
//         <FontAwesomeIcon
//           icon={faA}
//           style={{ color: "#e672fdff", fontSize: "20px" }}
//         ></FontAwesomeIcon>
//       </Button>

//       <Modal
//         className="modal-lg"
//         show={show}
//         onHide={() => setShow(false)}
//         centered
//       >
//         <Modal.Header closeButton></Modal.Header>
//         <Modal.Body
//           style={{ padding: "20px", height: "500px", overflow: "auto" }}
//         >
//           <Tab.Container defaultActiveKey="first">
//             <Nav
//               variant="tabs"
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 width: "100%",
//                 margin: "10px",
//               }}
//             >
//               <Nav.Item>
//                 <Nav.Link
//                   style={{ color: "gray", fontSize: "18px" }}
//                   eventKey="first"
//                 >
//                   معلومات الاختبار
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link
//                   style={{ color: "gray", fontSize: "18px" }}
//                   eventKey="second"
//                 >
//                   الإعدادات
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link
//                   style={{ color: "gray", fontSize: "18px" }}
//                   eventKey="third"
//                 >
//                   إضافة سؤال
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link
//                   style={{ color: "gray", fontSize: "18px" }}
//                   eventKey="forth"
//                 >
//                   نشر
//                 </Nav.Link>
//               </Nav.Item>
//             </Nav>

//             <Tab.Content>
//               <Tab.Pane eventKey="first">
//                 <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
//                   عنوان الاختبار :
//                 </p>
//                 <input
//                   placeholder="أدخل عنوان الاختبار..."
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border: "none",
//                     width: "100%",
//                     height: "40px",
//                     padding: "15px",
//                     fontSize: "16px",
//                   }}
//                   type="text"
//                 />
//                 <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
//                   المادة :
//                 </p>
//                 <select
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border: "none",
//                     width: "100%",
//                     height: "40px",
//                     padding: "10px",
//                     fontSize: "16px",
//                   }}
//                 >
//                   <option value="">اختر المادة</option>
//                   {subjectsList.map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.courseName}
//                     </option>
//                   ))}
//                 </select>

//                 <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
//                   الوصف (اختياري) :
//                 </p>
//                 <textarea
//                   rows={4}
//                   placeholder="أدخل وصف المحتوى"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border: "none",
//                     width: "100%",
//                     height: "40px",
//                     padding: "10px",
//                     fontSize: "16px",
//                     marginBottom: "40px",
//                   }}
//                 ></textarea>

//                 <div style={{ display: "flex", justifyContent: "end" }}>
//                   <button
//                     style={{
//                       border: "1px solid black",
//                       width: "150px",
//                       height: "45px",
//                       textAlign: "center",
//                       fontSize: "18px",
//                       borderRadius: "5px",
//                     }}
//                     onClick={handleNext}
//                   >
//                     التالي
//                   </button>
//                 </div>
//               </Tab.Pane>
//               <Tab.Pane eventKey="second">
//                 <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
//                   {" "}
//                   مدة الاختبار (اختياري):
//                 </p>
//                 <input
//                   type="Number"
//                   value={duration}
//                   onChange={(e) => setDuration(e.target.value)}
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border: "none",
//                     width: "100%",
//                     height: "40px",
//                     padding: "10px",
//                     fontSize: "16px",
//                   }}
//                   placeholder="ادخل مدة الاختبار بالدقائق"
//                 />
//                 <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
//                   الدرجة النهائية :
//                 </p>
//                 <input
//                   value={totalMarks}
//                   onChange={(e) => setTotalMarks(e.target.value)}
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border: "none",
//                     width: "100%",
//                     height: "40px",
//                     padding: "10px",
//                     fontSize: "16px",
//                   }}
//                 ></input>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginTop: "20px",
//                     marginBottom: "60px",
//                   }}
//                 >
//                   <div>
//                     <label
//                       style={{
//                         color: "black",
//                         fontSize: "20px",
//                         margin: "15px",
//                       }}
//                     >
//                       تاريخ البدء :
//                     </label>
//                     <input
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       style={{
//                         backgroundColor: "white",
//                         borderRadius: "10px",
//                         width: "200px",
//                         margin: "10px",
//                         border: "none",
//                         height: "40px",
//                         padding: "10px",
//                         fontSize: "16px",
//                       }}
//                       type="date"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       style={{
//                         color: "black",
//                         fontSize: "20px",
//                         margin: "15px",
//                       }}
//                     >
//                       تاريخ الانتهاء :
//                     </label>
//                     <input
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       style={{
//                         backgroundColor: "white",
//                         borderRadius: "10px",
//                         width: "200px",
//                         margin: "10px",
//                         border: "none",
//                         height: "40px",
//                         padding: "10px",
//                         fontSize: "16px",
//                       }}
//                       type="date"
//                     />
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "end" }}>
//                   <button
//                     style={{
//                       border: "1px solid black",
//                       width: "150px",
//                       height: "45px",
//                       textAlign: "center",
//                       fontSize: "18px",
//                       borderRadius: "5px",
//                     }}
//                   >
//                     التالي
//                   </button>
//                 </div>
//               </Tab.Pane>
//               <Tab.Pane eventKey="third">
//                 <div style={{ display: "flex", gap: "25px" }}>
//                   <div style={{ flex: "2", flexGrow: "2" }}>
//                     <textarea
//                       value={questionText}
//                       onChange={(e) => setQuestionText(e.target.value)}
//                       rows={4}
//                       placeholder="أكتب السؤال هنا ..."
//                       style={{
//                         backgroundColor: "white",
//                         borderRadius: "30px",
//                         border: "none",
//                         width: "95%",
//                         height: "40px",
//                         padding: "15px",
//                         fontSize: "16px",
//                       }}
//                       type="text"
//                     />
//                     {options.map((opt, index) => (
//                       <div key={index}>
//                         <label
//                           style={{
//                             color: "black",
//                             fontSize: "16px",
//                             margin: "10px 5px",
//                           }}
//                         >
//                           الخيار {index + 1}
//                         </label>
//                         <input
//                           value={opt}
//                           onChange={(e) => {
//                             const newOptions = [...options];
//                             newOptions[index] = e.target.value;
//                             setOptions(newOptions);
//                           }}
//                           style={{
//                             backgroundColor: "white",
//                             borderRadius: "15px",
//                             border: "1px solid #ccc",
//                             width: "84%",
//                             height: "30px",
//                           }}
//                         />
//                       </div>
//                     ))}
//                     <p
//                       style={{
//                         color: "black",
//                         fontSize: "20px",
//                         marginTop: "20px",
//                       }}
//                     >
//                       أختيار الإجابة الصحيحة :
//                     </p>
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "20px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       {options.map((opt, index) => (
//                         <label key={index} style={{ fontSize: "18px" }}>
//                           <input
//                             type="radio"
//                             name="correct"
//                             value={index}
//                             onChange={(e) => setCorrectAnswer(e.target.value)}
//                           />
//                           الخيار {index + 1}
//                         </label>
//                       ))}
//                     </div>
//                     <label
//                       style={{
//                         color: "black",
//                         fontSize: "20px",
//                         margin: "5px",
//                       }}
//                     >
//                       درجة السؤال :
//                     </label>
//                     <input
//                       value={marks}
//                       onChange={(e) => setMarks(e.target.value)}
//                       style={{
//                         backgroundColor: "white",
//                         borderRadius: "15px",
//                         border: "1px solid #ccc",
//                         width: "70%",
//                         height: "30px",
//                       }}
//                     ></input>

//                     <button
//                       style={{
//                         backgroundColor: "#a855f7",
//                         color: "white",
//                         border: "none",
//                         padding: "10px 20px",
//                         borderRadius: "20px",
//                         cursor: "pointer",
//                         width: "85%",
//                         textAlign: "center",
//                         marginTop: "15px",
//                       }}
//                       onClick={() => {
//                         if (!questionText || !marks || correctAnswer === "") {
//                           alert("يرجى تعبئة جميع الحقول");
//                           return;
//                         }

//                         const newQuestion = {
//                           question: questionText,
//                           options,
//                           correctAnswer,
//                           marks,
//                         };

//                         setQuestions([...questions, newQuestion]);

//                         setQuestionText("");
//                         setOptions(["", "", "", ""]);
//                         setCorrectAnswer("");
//                         setMarks("");
//                       }}
//                     >
//                       ➕ إضافة السؤال
//                     </button>
//                   </div>
//                   <div
//                     style={{
//                       flexGrow: "1",
//                       flex: "1",
//                       border: "1px solid #ccc",
//                       padding: "10px 20px",
//                     }}
//                   >
//                     <h5>أسئلة الاختبار</h5>
//                     <div
//                       style={{
//                         backgroundColor: "white",
//                         padding: "5px",
//                         borderRadius: "10px",
//                       }}
//                     >
//                       <p>ماهو html</p>
//                       <p>الإجابة الصحيحة</p>
//                     </div>
//                     <div
//                       style={{
//                         backgroundColor: "white",
//                         padding: "5px",
//                         borderRadius: "10px",
//                         marginTop: "10px",
//                       }}
//                     >
//                       <p>ماهو html</p>
//                       <p>الإجابة الصحيحة</p>
//                     </div>
//                   </div>
//                 </div>
//               </Tab.Pane>
//             </Tab.Content>
//           </Tab.Container>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TestModal() {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("first");

  // التاب الأول
  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [description, setDescription] = useState("");
  const [coursesList, setCoursesList] = useState([]);
  const [lessonsList, setLessonsList] = useState([]);

  // التاب الثاني
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // التاب الثالث (إضافة سؤال)
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState("1"); // 1 إلى 4
  const [scoreValue, setScoreValue] = useState("");
  const [questions, setQuestions] = useState([]);

  // جلب المواد
  useEffect(() => {
    if (!show) return;
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/coursesList");
        const data = await res.json();
        if (res.ok) setCoursesList(data);
      } catch (error) {
        console.error("خطأ في جلب المواد:", error);
      }
    };
    fetchCourses();
  }, [show]);

  // جلب دروس المادة المختارة
  const handleCourseChange = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedLesson("");
    if (!courseId) {
      setLessonsList([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/teacherDashboard/lessonsList/${courseId}/lessons`,
      );
      if (res.ok) {
        const data = await res.json();
        setLessonsList(data);
      }
    } catch (error) {
      console.error("خطأ في جلب الدروس:", error);
    }
  };

  // إضافة سؤال إلى القائمة
  const handleAddQuestion = () => {
    if (
      !questionText.trim() ||
      !scoreValue ||
      options.some((opt) => !opt.trim())
    ) {
      alert("يرجى ملء كافة تفاصيل السؤال والخيارات والدرجة");
      return;
    }

    const newQuestion = {
      questionText,
      options: [...options],
      correctAnswerIndex: parseInt(correctAnswerIndex), // 1-4
      scoreValue: parseInt(scoreValue),
    };

    setQuestions([...questions, newQuestion]);

    // إعادة تعيين نموذج السؤال
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswerIndex("1");
    setScoreValue("");
  };

  // حذف سؤال من القائمة
  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // الإرسال النهائي
  const handleSubmit = async () => {
    if (!title || !selectedLesson || !startDate || !endDate || !totalMarks) {
      alert("يرجى إكمال البيانات الأساسية وتواريخ الاختبار والدرجة النهائية");
      return;
    }

    if (questions.length === 0) {
      alert("يرجى إضافة سؤال واحد على الأقل للاختبار");
      return;
    }

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: selectedLesson,
          title,
          description,
          maxScore: totalMarks,
          timeLimit: duration || null,
          startDate,
          dueDate: endDate,
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "فشل إنشاء الاختبار");

      alert("تم إنشاء الاختبار ونشر الإشعارات بنجاح");
      setShow(false);
      resetForm();
    } catch (error) {
      alert(error.message);
      console.error("خطأ عند الحفظ:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSelectedCourse("");
    setSelectedLesson("");
    setDescription("");
    setDuration("");
    setTotalMarks("");
    setStartDate("");
    setEndDate("");
    setQuestions([]);
    setActiveTab("first");
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
          height: "40px",
          fontSize: "18px",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 15px",
        }}
        onClick={() => setShow(true)}
      >
        <span>إنشاء اختبار</span>
        <FontAwesomeIcon
          icon={faA}
          style={{ color: "#e672fdff", fontSize: "20px" }}
        />
      </Button>

      <Modal
        className="modal-lg"
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>
            إعداد اختبار جديد
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", minHeight: "520px" }}>
          <Tab.Container
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Nav variant="tabs" className="mb-3 justify-content-between">
              <Nav.Item>
                <Nav.Link eventKey="first">المعلومات الأساسية</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">الإعدادات والوقائع</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">
                  الأسئلة ({questions.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* التاب الأول: المعلمومات */}
              <Tab.Pane eventKey="first">
                <label className="fw-bold my-2">عنوان الاختبار:</label>
                <input
                  className="form-control mb-3"
                  placeholder="أدخل عنوان الاختبار..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label className="fw-bold my-2">المادة:</label>
                <select
                  className="form-select mb-3"
                  value={selectedCourse}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">اختر المادة</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseName}
                    </option>
                  ))}
                </select>

                <label className="fw-bold my-2">
                  الدرس التابع له الاختبار:
                </label>
                <select
                  className="form-select mb-3"
                  value={selectedLesson}
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  disabled={!selectedCourse}
                >
                  <option value="">اختر الدرس</option>
                  {lessonsList.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>

                <label className="fw-bold my-2">الوصف (اختياري):</label>
                <textarea
                  className="form-control mb-4"
                  rows={3}
                  placeholder="تعليمات أو وصف الاختبار..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab("second")}
                  >
                    التالي ➔
                  </Button>
                </div>
              </Tab.Pane>

              {/* التاب الثاني: الإعدادات */}
              <Tab.Pane eventKey="second">
                <label className="fw-bold my-2">
                  مدة الاختبار بالدقائق (اختياري):
                </label>
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="مثال: 30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />

                <label className="fw-bold my-2">
                  الدرجة النهائية للاختبار:
                </label>
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="مثال: 100"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="fw-bold my-2">تاريخ ووقت البدء:</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="fw-bold my-2">تاريخ ووقت الانتهاء:</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab("first")}
                  >
                    السابق
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab("third")}
                  >
                    التالي ➔
                  </Button>
                </div>
              </Tab.Pane>

              {/* التاب الثالث: الأسئلة */}
              <Tab.Pane eventKey="third">
                <div className="row">
                  {/* قسم إضافة السؤال (اليمين) */}
                  <div className="col-md-7 border-end">
                    <h6 className="fw-bold mb-3">إضافة سؤال جديد</h6>
                    <textarea
                      className="form-control mb-2"
                      rows={2}
                      placeholder="أكتب نص السؤال هنا..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />

                    {options.map((opt, idx) => (
                      <div key={idx} className="mb-2">
                        <small className="text-muted">الخيار {idx + 1}:</small>
                        <input
                          className="form-control form-control-sm"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...options];
                            newOpts[idx] = e.target.value;
                            setOptions(newOpts);
                          }}
                        />
                      </div>
                    ))}

                    <div className="row my-2">
                      <div className="col-6">
                        <label className="small fw-bold">الخيار الصحيح:</label>
                        <select
                          className="form-select form-select-sm"
                          value={correctAnswerIndex}
                          onChange={(e) =>
                            setCorrectAnswerIndex(e.target.value)
                          }
                        >
                          <option value="1">الخيار 1</option>
                          <option value="2">الخيار 2</option>
                          <option value="3">الخيار 3</option>
                          <option value="4">الخيار 4</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="small fw-bold">درجة السؤال:</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={scoreValue}
                          onChange={(e) => setScoreValue(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      variant="purple"
                      style={{ backgroundColor: "#a855f7", color: "white" }}
                      className="w-100 my-2"
                      onClick={handleAddQuestion}
                    >
                      ➕ إضافة السؤال للقائمة
                    </Button>
                  </div>

                  {/* قسم استعراض الأسئلة (اليسار) */}
                  <div className="col-md-5">
                    <h6 className="fw-bold mb-3">
                      الأسئلة المضافة ({questions.length})
                    </h6>
                    <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                      {questions.length === 0 ? (
                        <p className="text-muted small">
                          لم يتم إضافة أي أسئلة بعد.
                        </p>
                      ) : (
                        questions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-2 mb-2 border rounded bg-light position-relative"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <strong className="small">
                                {idx + 1}. {q.questionText}
                              </strong>
                              <Button
                                variant="link"
                                className="text-danger p-0 ms-2"
                                onClick={() => handleRemoveQuestion(idx)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                            <div className="small text-success mt-1">
                              الإجابة الصحيحة: الخيار {q.correctAnswerIndex} (
                              {q.options[q.correctAnswerIndex - 1]})
                            </div>
                            <div className="small text-muted">
                              الدرجة: {q.scoreValue}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <hr />
                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab("second")}
                  >
                    السابق
                  </Button>
                  <Button variant="success" onClick={handleSubmit}>
                    حفظ ونشر الاختبار 🚀
                  </Button>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
