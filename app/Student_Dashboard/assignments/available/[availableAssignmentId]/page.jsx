"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "@/lib/supabaseClient";

import {
  faTasks,
  faCalendar,
  faStar,
  faCloudUpload,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

// دالة تحاول الرفع للسحابة مع خاصية إعادة المحاولة
const uploadToCloudWithRetry = async (file, bucket, retries = 3) => {
  const fileName = `${Date.now()}_${file.name}`;

  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false });

      if (error) throw error;

      // إذا نجح الرفع، نجلب الرابط العام
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error(`المحاولة رقم ${i + 1} فشلت:`, err.message);

      //لنبدأ الرفع المحلي null إذا كانت هذه آخر محاولة، نرجع
      if (i === retries - 1) return null;
      // انتظار بسيط قبل إعادة المحاولة (مثلاً 1 ثانية)
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
  return null; //null في حال فشل جميع المحاولات، نرجع
};

export default function Assignment() {
  const params = useParams();
  // const { availableAssignmentId } = useParams();
  const router = useRouter();
  const attemptId = params.availableAssignmentId;

  const [assignmentId, setAssignmentId] = useState();
  const [notes, setNotes] = useState();
  const [submissionUrl, setSubmissionUrl] = useState();
  const [data, setData] = useState();
  // const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `/api/studentDashboard/assignments/available/${attemptId}/assignmentDetails`,
        );
        const result = await res.json();
        if (res.ok) {
          setData(result.assignmentInfo);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    if (attemptId) {
      fetchAssignment();
    }
  }, [attemptId]);

  if (!data) return <p>جاري التحميل...</p>;

  const handleSubmit = async () => {
    try {
      let fileUrl = null;
      let fallbackFile = null; // سنحتاجه في حال فشل السحابة

      if (submissionUrl) {
        // محاولة الرفع للسحابة بـ 3 محاولات
        fileUrl = await uploadToCloudWithRetry(submissionUrl, "assignments");

        //هذا يعني فشل السحابة بعد 3 محاولات null اذا عادت الدالة ب
        if (!fileUrl) {
          console.warn("فشل الرفع للسحابة نهائياً، سيتم التخزين محلياً.");
          fallbackFile = submissionUrl;
        }
      }
      const formData = new FormData();
      // formData.append("assignmentId", assignmentId);
      formData.append("notes", notes);
      formData.append("assignmentId", attemptId);
      if (fileUrl) {
        formData.append("fileUrl", fileUrl);
      } else if (fallbackFile) {
        formData.append("submissionUrl", fallbackFile); // إرسال الملف الخام في حال فشل السحابة
      }

      const res = await fetch(
        `/api/studentDashboard/assignments/available/submit`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ");
      }

      alert("تم إرسال الواجب بنجاح ✅");
      setSubmissionUrl("");
      setNotes("");
      router.push("/Student_Dashboard/assignments");
    } catch (err) {
      console.error(err);
      alert("فشل إرسال الواجب❌");
    }
  };
  // const extensions = Array.isArray(data.allowedExtensions)
  //   ? data.allowedExtensions
  //   : JSON.parse(data.allowedExtensions || "[]");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "end" }}>
        <button
          style={{
            border: "3px solid #ccc",
            textAlign: "center",
            width: "60px",
            borderRadius: "10px",
            boxShadow: "0 4px 4px #ccc",
          }}
          onClick={() => router.push("/Student_Dashboard/assignments")}
        >
          رجوع
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "10px",
          // height: "160px",
          minHeight: "160px",
        }}
      >
        <div style={{ display: "flex", padding: "10px", alignItems: "center" }}>
          <FontAwesomeIcon
            icon={faTasks}
            style={{
              width: "30px",
              height: "30px",
              color: "blue",
              marginLeft: "20px",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{data.title}</span>
            <span>مقرر : {data.courseName}</span>
          </div>
        </div>

        <div
          style={{
            border: "1px solid gray",
            backgroundColor: "#eee",
            display: "flex",
            justifyContent: "start",
            gap: "100px",
            padding: "10px",
            // height: "70px",
            minHeight: "70px",
          }}
        >
          <div>
            <div style={{ display: "flex" }}>
              <FontAwesomeIcon icon={faCalendar} />
              <p style={{ fontSize: "14px" }}>تاريخ الإنشاء</p>
            </div>
            <p style={{ fontSize: "14px", marginRight: "4px" }}>
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <div style={{ display: "flex" }}>
              <FontAwesomeIcon icon={faCalendar} />
              <p style={{ fontSize: "14px", marginRight: "4px" }}>
                أخر موعد للتسليم
              </p>
            </div>
            <p style={{ fontSize: "14px" }}>
              {new Date(data.deliveryDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <div style={{ display: "flex" }}>
              <FontAwesomeIcon icon={faStar} />
              <p style={{ fontSize: "14px", marginRight: "4px" }}>
                الدرجة العظمى
              </p>
            </div>
            <p style={{ fontSize: "14px" }}>{data.maxScore}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "10px",
            // height: "120px",
            minHeight: "120px",
            width: "60%",
          }}
        >
          <p>{data.content}</p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "10px",
            // height: "120px",
            minHeight: "120px",
            width: "40%",
          }}
        >
          <p>الملفات المرفقة :</p>

          {data.resourceURL?.map((file, index) => (
            <a
              key={index}
              href={file}
              target="_blank"
              style={{ display: "block", color: "blue" }}
            >
              ملف {index + 1}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "10px",
          // height: "120px",
          minHeight: "120px",
        }}
      >
        <FontAwesomeIcon
          icon={faCloudUpload}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            color: "#5194F8",
            fontSize: "30px",
          }}
        />
        <button style={{ marginLeft: "auto", marginRight: "auto" }}>
          <input
            type="file"
            onChange={(e) => setSubmissionUrl(e.target.files[0])}
          />
        </button>
        {/* <p>{JSON.stringify(data.allowedExtensions)}</p> */}
        <p style={{ marginLeft: "auto", marginRight: "auto", color: "gray" }}>
          الأنواع المسموحة :{" "}
          {data.allowedExtensions && data.allowedExtensions.length > 0 ? (
            data.allowedExtensions.map((ex, index) => (
              <span key={index} style={{ marginRight: "9px" }}>
                {ex}
              </span>
            ))
          ) : (
            <p>لا يوجد لواحق</p>
          )}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "10px",
          // height: "120px",
          minHeight: "120px",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <FontAwesomeIcon icon={faPen} />
          <p>ملاحظاتك</p>
        </div>
        <textarea
          value={notes || ""}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            border: "1px solid #eee",
            // height: "40px",
            minHeight: "40px",
            padding: "5px",
          }}
          placeholder="اكتب ملاحظاتك هنا..."
        />
      </div>

      <div style={{ display: "flex", justifyContent: "end" }}>
        <button
          style={{
            textAlign: "center",
            width: "80px",
            // height: "40px",
            minHeight: "40px",
            borderRadius: "5px",
            boxShadow: "0 4px 4px #ccc",
            backgroundColor: "#5194F8",
            color: "white",
          }}
          onClick={handleSubmit}
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
