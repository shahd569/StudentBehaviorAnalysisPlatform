// "use client"
// import { useState } from "react";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import Nav from "react-bootstrap/Nav";
// import Tab from "react-bootstrap/Tab";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBook } from "@fortawesome/free-solid-svg-icons";
// export default function DonationModal() {
//   const [show, setShow] = useState(false);

//   return (
//     <>
//       <Button className="shadow-sm" style={{width:"200px", border:"3px solid #a1c9d8", backgroundColor:"white", color:"#4e4e4e", height:"30px", fontSize:"20px", borderRadius:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}} variant="primary" onClick={() => setShow(true)}>
//         رفع محتوى
//         <FontAwesomeIcon icon={faBook} style={{color:"#a1c9d8", fontSize:"20px"}}></FontAwesomeIcon>
//       </Button>

//       <Modal
//         className="modal-lg"
//         show={show}
//         onHide={() => setShow(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//         </Modal.Header>
//         <Modal.Body style={{ padding: '20px',height:"500px", overflow:"hidden" }}>
//           <Tab.Container style={{height:"100%", overflowY:"auto"}} defaultActiveKey="first">
//             <Nav variant="tabs" style={{display:"flex", justifyContent:"space-between" ,width:"100%", margin:"10px"}}>
//               <Nav.Item>
//                 <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="first">معلومات المحتوى</Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="second">رفع الملف</Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="third">الوصف والإعدادات</Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="forth">نشر</Nav.Link>
//               </Nav.Item>
//             </Nav>

//             <Tab.Content>
//               <Tab.Pane eventKey="first">
//                 <p style={{color:"black", fontSize:"20px", margin:"15px"}}>عنوان المحتوى :</p>
//                 <input
//                   placeholder="أدخل عنوان الدرس أو الواجب ..."
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border:"none",
//                     width: "100%",
//                     height: "40px",
//                     padding:"15px",
//                     fontSize:"16px",
//                   }}
//                   type="text"
//                 />
//                 <p style={{color:"black", fontSize:"20px", margin:"15px"}}>نوع المحتوى :</p>
//                      <div style={{display:"flex", flexDirection:"column", paddingRight:"100px"}}>
//                         <label style={{fontSize:"18px"}}><input  type="radio" name="option" value="option1"/> درس </label>
//                         <label style={{fontSize:"18px"}}><input  type="radio" name="option" value="option2"/> واجب </label>
//                      </div>
//                 <p style={{color:"black", fontSize:"20px", margin:"15px"}}>المادة :</p>
//                  <input
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border:"none",
//                     width: "100%",
//                     height: "40px",
//                     marginBottom:"40px",
//                     padding:"10px",
//                     fontSize:"16px"
//                   }}
//                   type="text"
//                 />
//                 <div style={{display:"flex", justifyContent:"end"}}>
//                   <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>التالي</button>
//                 </div>
//               </Tab.Pane>
//               <Tab.Pane eventKey="second">
//                 <p style={{color:"black", fontSize:"20px", margin:"40px", marginBottom:"30px"}}> نوع الملف:</p>
//                 <select  style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border:"none",
//                     width: "100%",
//                     height: "50px",
//                     marginBottom:"40px",
//                     padding:"15px"
//                   }} >
//                   <option>pdf</option>
//                   <option>mp4</option>
//                 </select>
//                 <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
//                   <button style={{borderRadius:"30px",height:"40px", border:"1px solid black", width:"150px", textAlign:"center"}}>رفع الملف</button>
//                 </div>
//                 <div style={{display:"flex", justifyContent:"space-between",marginTop:"120px"}}>
//                   <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>السابق</button>
//                   <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>التالي</button>
//                 </div>
//               </Tab.Pane>
//               <Tab.Pane eventKey="third">
//                 <p style={{color:"black", fontSize:"20px", margin:"15px"}}>الوصف : </p>
//                 <textarea
//                   rows={4}
//                   placeholder="أدخل وصف المحتوى"
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border:"none",
//                     width: "100%",
//                     height: "40px",
//                     padding:"15px",
//                     fontSize:"16px"
//                   }}
//                   type="text"
//                 />
//                 <div style={{display:"flex", flexDirection:"column", paddingRight:"10px", margin:"20px"}}>
//                         <label style={{fontSize:"18px"}}><input  type="radio" name="option" value="option1"/> إرسال إشعار للطلاب عند النشر</label>
//                      </div>
//                       <p style={{color:"black", fontSize:"20px", margin:"30px 15px"}}>آخر موعد للتسليم :</p>
//                       <input
//                       style={{
//                     backgroundColor: "white",
//                     borderRadius: "30px",
//                     border:"none",
//                     width: "100%",
//                     height: "40px",
//                     padding:"15px",
//                     fontSize:"16px"
//                   }} type="date" ></input>
//                   <div style={{display:"flex", justifyContent:"space-between",marginTop:"70px"}}>
//                   <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>السابق</button>
//                   <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>التالي</button>
//                 </div>
//               </Tab.Pane>
//             </Tab.Content>
//           </Tab.Container>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import Nav from "react-bootstrap/Nav";
// import Tab from "react-bootstrap/Tab";
// import Form from "react-bootstrap/Form";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBook, faSpinner } from "@fortawesome/free-solid-svg-icons";

// export default function ContentModal() {
//   const [show, setShow] = useState(false);
//   const [activeTab, setActiveTab] = useState("first");
//   const [loading, setLoading] = useState(false);
//   const [uploadingFile, setUploadingFile] = useState(false);

//   // قوائم المواد والدروس
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState("");
//   const [lessons, setLessons] = useState([]);
//   const [selectedLessonId, setSelectedLessonId] = useState("");

//   // حالات البيانات
//   const [contentType, setContentType] = useState("LESSON"); // LESSON أو ASSIGNMENT
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [fileUrl, setFileUrl] = useState("");

//   // حقول الدرس
//   const [sequenceNumber, setSequenceNumber] = useState(1);
//   const [videoUrl, setVideoUrl] = useState("");

//   // حقول الواجب
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [maxScore, setMaxScore] = useState(100);

//   // 1. جلب قائمة المواد الخاصة بالمدرس عند فتح المودال
//   useEffect(() => {
//     if (show) {
//       fetch("/api/teacherDashboard/coursesList") // تأكدي من مسار الروت الذي يجلب مواد المدرس لديكم
//         .then((res) => res.json())
//         .then((data) => {
//           if (Array.isArray(data)) setCourses(data);
//         })
//         .catch((err) => console.error("خطأ في جلب المواد:", err));
//     }
//   }, [show]);

//   // 2. عند تغيير المادة المختارة، نجلب الدروس التابعة لها
//   useEffect(() => {
//     if (selectedCourseId) {
//       fetch(`/api/teacherDashboard/lessonsList/${selectedCourseId}/lessons`) // تأكدي من وجود روت يجلب دروس المادة
//         .then((res) => res.json())
//         .then((data) => {
//           if (Array.isArray(data)) setLessons(data);
//         })
//         .catch((err) => console.error("خطأ في جلب الدروس:", err));
//     } else {
//       setLessons([]);
//     }
//   }, [selectedCourseId]);

//   // دالة رفع الملف إلى Cloudinary
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadingFile(true);
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append(
//       "upload_preset",
//       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
//     );

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
//         { method: "POST", body: formData },
//       );
//       const data = await res.json();
//       if (data.secure_url) {
//         setFileUrl(data.secure_url);
//         alert("تم رفع الملف بنجاح!");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("فشل رفع الملف.");
//     } finally {
//       setUploadingFile(false);
//     }
//   };

//   // دالة إرسال البيانات للروت
//   const handleSubmit = async () => {
//     if (!selectedCourseId) {
//       alert("يرجى اختيار المادة أولاً.");
//       return;
//     }
//     if (!title) {
//       alert("يرجى إدخال عنوان المحتوى.");
//       return;
//     }

//     if (contentType === "ASSIGNMENT" && (!selectedLessonId || !deliveryDate)) {
//       alert("يرجى اختيار الدرس وتاريخ التسليم للواجب.");
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       type: contentType,
//       title,
//       description,
//       fileUrl,
//       ...(contentType === "LESSON"
//         ? { sequenceNumber, videoUrl }
//         : {
//             lessonId: selectedLessonId,
//             deliveryDate,
//             maxScore,
//             allowedExtensions: ["pdf", "zip", "docx"],
//           }),
//     };

//     try {
//       const res = await fetch(
//         `/api/createContent/${selectedCourseId}/lessons`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );

//       const result = await res.json();

//       if (res.ok) {
//         alert(
//           contentType === "LESSON"
//             ? "تم إضافة الدرس بنجاح!"
//             : "تم إضافة الواجب بنجاح!",
//         );
//         setShow(false);
//         window.location.reload();
//       } else {
//         alert(result.error || "حدث خطأ أثناء الحفظ.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("حدث خطأ في الاتصال بالخادم.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button
//         className="shadow-sm"
//         style={{
//           width: "200px",
//           border: "3px solid #a1c9d8",
//           backgroundColor: "white",
//           color: "#4e4e4e",
//           height: "40px",
//           fontSize: "18px",
//           borderRadius: "10px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "0 15px",
//         }}
//         onClick={() => setShow(true)}
//       >
//         <span>رفع محتوى</span>
//         <FontAwesomeIcon
//           icon={faBook}
//           style={{ color: "#a1c9d8", fontSize: "20px" }}
//         />
//       </Button>

//       <Modal
//         className="modal-lg"
//         show={show}
//         onHide={() => setShow(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: "20px", fontWeight: "bold" }}>
//             إضافة محتوى جديد
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ padding: "20px", minHeight: "450px" }}>
//           <Tab.Container
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//           >
//             <Nav variant="tabs" className="mb-4 d-flex justify-content-between">
//               <Nav.Item>
//                 <Nav.Link eventKey="first">1. معلومات المحتوى</Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link eventKey="second">2. رفع الملفات</Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link eventKey="third">3. إعدادات النشر</Nav.Link>
//               </Nav.Item>
//             </Nav>

//             <Tab.Content>
//               {/* TAB 1: المعلومات الأساسية */}
//               <Tab.Pane eventKey="first">
//                 {/* اختيار المادة */}
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">المادة الدراسية:</Form.Label>
//                   <Form.Select
//                     value={selectedCourseId}
//                     onChange={(e) => setSelectedCourseId(e.target.value)}
//                   >
//                     <option value="">-- اختر المادة --</option>
//                     {courses.map((course) => (
//                       <option key={course.id} value={course.id}>
//                         {course.courseName}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">نوع المحتوى:</Form.Label>
//                   <div>
//                     <Form.Check
//                       inline
//                       type="radio"
//                       label="درس تعليمي"
//                       name="contentType"
//                       value="LESSON"
//                       checked={contentType === "LESSON"}
//                       onChange={() => setContentType("LESSON")}
//                     />
//                     <Form.Check
//                       inline
//                       type="radio"
//                       label="واجب / تكليف"
//                       name="contentType"
//                       value="ASSIGNMENT"
//                       checked={contentType === "ASSIGNMENT"}
//                       onChange={() => setContentType("ASSIGNMENT")}
//                     />
//                   </div>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">العنوان:</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder={
//                       contentType === "LESSON"
//                         ? "أدخل عنوان الدرس..."
//                         : "أدخل عنوان الواجب..."
//                     }
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                   />
//                 </Form.Group>

//                 {contentType === "LESSON" ? (
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">
//                       ترتيب الدرس (Sequence):
//                     </Form.Label>
//                     <Form.Control
//                       type="number"
//                       value={sequenceNumber}
//                       onChange={(e) => setSequenceNumber(e.target.value)}
//                     />
//                   </Form.Group>
//                 ) : (
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">
//                       الدرس التابع له هذا الواجب:
//                     </Form.Label>
//                     <Form.Select
//                       value={selectedLessonId}
//                       onChange={(e) => setSelectedLessonId(e.target.value)}
//                       disabled={!selectedCourseId}
//                     >
//                       <option value="">-- اختر الدرس --</option>
//                       {lessons.map((l) => (
//                         <option key={l.id} value={l.id}>
//                           {l.title}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 )}

//                 <div className="d-flex justify-content-end mt-4">
//                   <Button
//                     variant="primary"
//                     onClick={() => setActiveTab("second")}
//                   >
//                     التالي
//                   </Button>
//                 </div>
//               </Tab.Pane>

//               {/* TAB 2: الملفات والروابط */}
//               <Tab.Pane eventKey="second">
//                 {contentType === "LESSON" && (
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">
//                       رابط فيديو الدرس (Video URL):
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="https://..."
//                       value={videoUrl}
//                       onChange={(e) => setVideoUrl(e.target.value)}
//                     />
//                   </Form.Group>
//                 )}

//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">
//                     {contentType === "LESSON"
//                       ? "ملف مرفق للدرس (PDF/Doc):"
//                       : "ملف شرح الواجب (إن وجد):"}
//                   </Form.Label>
//                   <Form.Control
//                     type="file"
//                     onChange={handleFileUpload}
//                     disabled={uploadingFile}
//                   />
//                   {uploadingFile && (
//                     <p className="text-info mt-1">
//                       <FontAwesomeIcon icon={faSpinner} spin /> جاري رفع
//                       الملف...
//                     </p>
//                   )}
//                   {fileUrl && (
//                     <p className="text-success mt-1">✓ تم رفع الملف بنجاح</p>
//                   )}
//                 </Form.Group>

//                 <div className="d-flex justify-content-between mt-4">
//                   <Button
//                     variant="secondary"
//                     onClick={() => setActiveTab("first")}
//                   >
//                     السابق
//                   </Button>
//                   <Button
//                     variant="primary"
//                     onClick={() => setActiveTab("third")}
//                   >
//                     التالي
//                   </Button>
//                 </div>
//               </Tab.Pane>

//               {/* TAB 3: التفاصيل والإعدادات والنشر */}
//               <Tab.Pane eventKey="third">
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">
//                     الوصف / التعليمات:
//                   </Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     placeholder="أدخل وصف المحتوى أو الشروط المطلوبة..."
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                   />
//                 </Form.Group>

//                 {contentType === "ASSIGNMENT" && (
//                   <>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="fw-bold">
//                         تاريخ ووقت التسليم (Due Date):
//                       </Form.Label>
//                       <Form.Control
//                         type="datetime-local"
//                         value={deliveryDate}
//                         onChange={(e) => setDeliveryDate(e.target.value)}
//                       />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                       <Form.Label className="fw-bold">
//                         الدرجة العظمى (Max Score):
//                       </Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={maxScore}
//                         onChange={(e) => setMaxScore(e.target.value)}
//                       />
//                     </Form.Group>
//                   </>
//                 )}

//                 <div className="d-flex justify-content-between mt-4">
//                   <Button
//                     variant="secondary"
//                     onClick={() => setActiveTab("second")}
//                   >
//                     السابق
//                   </Button>
//                   <Button
//                     variant="success"
//                     onClick={handleSubmit}
//                     disabled={loading}
//                   >
//                     {loading ? "جاري النشر..." : "نشر المحتوى"}
//                   </Button>
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
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabaseClient";

// دالة الرفع إلى Supabase مع خاصية إعادة المحاولة
const uploadToCloudWithRetry = async (file, bucket, retries = 3) => {
  const fileName = `${Date.now()}_${file.name}`;

  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error(`المحاولة رقم ${i + 1} فشلت:`, err.message);

      if (i === retries - 1) return null;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
  return null;
};

export default function ContentModal() {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("first");
  const [loading, setLoading] = useState(false);

  // قوائم المواد والدروس
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");

  // حالات البيانات الأساسية
  const [contentType, setContentType] = useState("LESSON"); // LESSON أو ASSIGNMENT
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [duration, setDuration] = useState("");

  // حالات الملفات الخام (Files)
  const [file, setFile] = useState(null); // ملف المرفقات أو ملف الواجب
  const [videoFile, setVideoFile] = useState(null); // ملف فيديو الدرس

  // حقول الدرس
  const [sequenceNumber, setSequenceNumber] = useState(1);

  // حقول الواجب
  const [deliveryDate, setDeliveryDate] = useState("");
  const [maxScore, setMaxScore] = useState(100);

  // 1. جلب قائمة المواد الخاصة بالمدرس عند فتح المودال
  useEffect(() => {
    if (show) {
      fetch("/api/teacherDashboard/coursesList")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCourses(data);
        })
        .catch((err) => console.error("خطأ في جلب المواد:", err));
    }
  }, [show]);

  // 2. جلب الدروس عند اختيار المادة
  useEffect(() => {
    if (selectedCourseId) {
      fetch(`/api/teacherDashboard/lessonsList/${selectedCourseId}/lessons`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setLessons(data);
        })
        .catch((err) => console.error("خطأ في جلب الدروس:", err));
    } else {
      setLessons([]);
    }
  }, [selectedCourseId]);

  // دالة الحفظ والإرسال
  const handleSubmit = async () => {
    if (!selectedCourseId) {
      alert("يرجى اختيار المادة أولاً.");
      return;
    }
    if (!title) {
      alert("يرجى إدخال عنوان المحتوى.");
      return;
    }

    if (contentType === "ASSIGNMENT") {
      if (!selectedLessonId) {
        alert("يرجى اختيار الدرس الذي يتبع له الواجب.");
        return;
      }
      if (!deliveryDate) {
        alert("يرجى تحديد تاريخ التسليم للواجب.");
        return;
      }
    }

    setLoading(true);

    try {
      let attachmentUrl = null;
      let videoUrl = null;

      // 1. رفع ملف الفيديو إذا كان المحتوى درساً وتحدّد ملف فيديو
      if (contentType === "LESSON" && videoFile) {
        videoUrl = await uploadToCloudWithRetry(videoFile, "course-materials");
        if (!videoUrl) {
          console.warn("فشل رفع فيديو الدرس إلى Supabase Storage.");
        }
      }

      // 2. رفع الملف المرفق (شرح الواجب أو مرفق الدرس)
      if (file) {
        attachmentUrl = await uploadToCloudWithRetry(file, "course-materials");
        if (!attachmentUrl) {
          console.warn("فشل رفع الملف المرفق إلى Supabase Storage.");
        }
      }

      // 3. تجهيز بيانات الإرسال
      const payload = {
        type: contentType,
        title,
        description,

        fileUrl: attachmentUrl,
        ...(contentType === "LESSON"
          ? {
              sequenceNumber,
              videoUrl: videoUrl,
              videoDescription: videoDescription,
              duration: duration,
            }
          : {
              lessonId: selectedLessonId,
              deliveryDate,
              maxScore,
              allowedExtensions: ["pdf", "zip", "docx"],
            }),
      };

      const res = await fetch(
        `/api/createContent/${selectedCourseId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      if (res.ok) {
        alert(
          contentType === "LESSON"
            ? "تم إضافة الدرس بنجاح! ✅"
            : "تم إضافة الواجب بنجاح! ✅",
        );
        setShow(false);

        // إعادة ضبط الحقول
        setTitle("");
        setDescription("");
        setVideoDescription("");
        setDuration("");
        setFile(null);
        setVideoFile(null);
        setSelectedCourseId("");
        setSelectedLessonId("");
      } else {
        alert(result.error || "حدث خطأ أثناء الحفظ ❌");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الاتصال بالخادم ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="shadow-sm"
        style={{
          width: "200px",
          border: "3px solid #a1c9d8",
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
        <span>رفع محتوى</span>
        <FontAwesomeIcon
          icon={faBook}
          style={{ color: "#a1c9d8", fontSize: "20px" }}
        />
      </Button>

      <Modal
        className="modal-lg"
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px", fontWeight: "bold" }}>
            إضافة محتوى جديد
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", minHeight: "450px" }}>
          <Tab.Container
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Nav variant="tabs" className="mb-4 d-flex justify-content-between">
              <Nav.Item>
                <Nav.Link eventKey="first">معلومات المحتوى</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">رفع الملفات</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">التفاصيل</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* TAB 1: المعلومات الأساسية */}
              <Tab.Pane eventKey="first">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">المادة الدراسية:</Form.Label>
                  <Form.Select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                  >
                    <option value="">-- اختر المادة --</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">نوع المحتوى:</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="درس تعليمي"
                      name="contentType"
                      value="LESSON"
                      checked={contentType === "LESSON"}
                      onChange={() => setContentType("LESSON")}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="واجب / تكليف"
                      name="contentType"
                      value="ASSIGNMENT"
                      checked={contentType === "ASSIGNMENT"}
                      onChange={() => setContentType("ASSIGNMENT")}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">العنوان:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={
                      contentType === "LESSON"
                        ? "أدخل عنوان الدرس..."
                        : "أدخل عنوان الواجب..."
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>

                {contentType === "LESSON" ? (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      ترتيب الدرس (Sequence):
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={sequenceNumber}
                      onChange={(e) => setSequenceNumber(e.target.value)}
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      الدرس التابع له هذا الواجب:
                    </Form.Label>
                    <Form.Select
                      value={selectedLessonId}
                      onChange={(e) => setSelectedLessonId(e.target.value)}
                      disabled={!selectedCourseId}
                    >
                      <option value="">-- اختر الدرس --</option>
                      {lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab("second")}
                  >
                    التالي
                  </Button>
                </div>
              </Tab.Pane>

              {/* TAB 2: رفع الملفات والفيديو */}
              <Tab.Pane eventKey="second">
                {contentType === "LESSON" && (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      ملف فيديو الدرس (MP4 / WebM):
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0] || null)}
                    />
                    {videoFile && (
                      <small className="text-success d-block mt-1">
                        تم اختيار الفيديو: {videoFile.name}
                      </small>
                    )}
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {contentType === "LESSON"
                      ? "ملف مرفق للدرس (PDF/Doc):"
                      : "ملف شرح الواجب (إن وجد):"}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                  />
                  {file && (
                    <small className="text-success d-block mt-1">
                      تم اختيار الملف: {file.name}
                    </small>
                  )}
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
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
                    التالي
                  </Button>
                </div>
              </Tab.Pane>

              {/* TAB 3: التفاصيل والإعدادات والنشر */}
              <Tab.Pane eventKey="third">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    الوصف / التعليمات:
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="أدخل وصف المحتوى أو الشروط المطلوبة..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Form.Label className="fw-bold">وصف الفيديو :</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder=" أدخل وصف الفيديو... "
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                  />
                  <Form.Label className="fw-bold">
                    مدة الفيديو بالدقائق:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Form.Group>

                {contentType === "ASSIGNMENT" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        تاريخ التسليم (Due Date):
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        الدرجة العظمى (Max Score):
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab("second")}
                  >
                    السابق
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="me-2"
                        />
                        جاري الرفع والنشر...
                      </>
                    ) : (
                      "نشر المحتوى"
                    )}
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
