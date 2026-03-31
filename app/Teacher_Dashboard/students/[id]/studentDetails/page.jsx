"use client";
import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import ActiveInfo from "@/components/activityInfo";
import ActivityTable from "@/components/activityTable";
import LastAcivities from "@/components/studentLastActive";

const StudentDetails = ({ params }) => {
  const { id } = use(params);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `/api/teacherDashboard/students/${id}/studentsDetails`,
        );
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;
  if (!student) return <div>لا توجد بيانات للطالب</div>;

  const profileImage = student.personalInfo?.img || "/image/student.png";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="p-4 d-flex gap-5 flex-column flex-md-row col-md-9">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            border: "2px solid #cc66c9",
            width: "200px",
            height: "200px",
          }}
        >
          <Image
            src={profileImage}
            alt="Student Image"
            style={{ borderRadius: "50%", objectFit: "fill" }}
            width={200}
            height={200}
          />
        </div>

        <div
          style={{
            borderRadius: "15px",
            border: "2px solid #ccc",
            width: "600px",
            height: "200px",
            padding: "20px",
          }}
        >
          <p style={{ color: "#cc66c9", fontWeight: "bold", fontSize: "24px" }}>
            {student.personalInfo.name}
          </p>
          <p style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}>
            الرقم الجامعي: {student.personalInfo.universityId ?? ""}
          </p>
          <p style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}>
            {student.personalInfo.major ?? student.personalInfo.college ?? ""}
          </p>
          <p style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}>
            السنة: {student.personalInfo.academicYear ?? ""}
          </p>
        </div>
      </div>
      <div className="p-4 d-flex gap-5 flex-column col-md-9">
        <Tab.Container
          style={{ height: "100%", overflowY: "auto" }}
          defaultActiveKey="first"
        >
          <Nav
            variant="tabs"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "60%",
            }}
          >
            <Nav.Item>
              <Nav.Link
                style={{ color: "gray", fontSize: "18px" }}
                eventKey="first"
              >
                النشاط
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                style={{ color: "gray", fontSize: "18px" }}
                eventKey="second"
              >
                الأداء
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                style={{ color: "gray", fontSize: "18px" }}
                eventKey="third"
              >
                الواجبات
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                style={{ color: "gray", fontSize: "18px" }}
                eventKey="forth"
              >
                الاختبارات
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="first">
              <div style={{ margin: "30px 0px" }}>
                <ActiveInfo data={student.statistics} />
              </div>
              <ActivityTable data={student.contentInteraction} />
              {/* <LastAcivities data={student.recentActivities} /> */}
              <div className="flex flex-col gap-8 col-md-3">
                <LastAcivities data={student.recentActivities} />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <p>الأداء</p>
            </Tab.Pane>
            <Tab.Pane eventKey="third"></Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default StudentDetails;
