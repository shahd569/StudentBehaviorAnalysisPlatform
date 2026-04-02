"use client";
import React, { useEffect, useState, use } from "react";
import Image from "next/image";
// import Student from "@/public/uploads/shahd.jpg";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import ActiveInfo from "@/components/activityInfo";
import ActivityTable from "@/components/activityTable";
import LastActive from "@/components/studentLastActive";
import Performance from "@/components/Performance";
import ActivityChart from "@/components/activity";
import PerformanceChart from "@/components/performanceChart";
import AssignmentsTable from "@/components/StudentAssignments";
import QuizzesTable from "@/components/StudentQuizzes";

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
    <div style={{ display: "flex", paddingLeft: "18px" }}>
      <div className="p-4 d-flex gap-5 flex-column col-md-9">
        <div className="p-4 d-flex gap-5">
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
              width: "70%",
              height: "200px",
              padding: "20px",
            }}
          >
            <p
              style={{ color: "#cc66c9", fontWeight: "bold", fontSize: "24px" }}
            >
              {student.personalInfo.name}
            </p>
            <p
              style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}
            >
              الرقم الجامعي: {student.personalInfo.universityId ?? ""}
            </p>
            <p
              style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}
            >
              {student.personalInfo.major ?? student.personalInfo.college ?? ""}
            </p>
            <p
              style={{ color: "#5f5f5f", fontWeight: "bold", fontSize: "18px" }}
            >
              السنة: {student.personalInfo.academicYear ?? ""}
            </p>
          </div>
        </div>
        <div className="p-4 d-flex gap-5 flex-column">
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
                <div
                  style={{ margin: "30px 0px", display: "flex", gap: "25px" }}
                >
                  <ActiveInfo data={student.statistics} />

                  <ActivityChart data={student.weeklyChart} />
                </div>
                <ActivityTable data={student.contentInteraction} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <div
                  style={{ margin: "30px 0px", display: "flex", gap: "25px" }}
                >
                  <Performance data={student.performance} />
                  <PerformanceChart data={student.performance} />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <AssignmentsTable data={student.formattedAssignments} />
              </Tab.Pane>
              <Tab.Pane eventKey="forth">
                <QuizzesTable data={student.formattedQuizzes} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
      <div className="flex flex-col gap-8 col-md-3" style={{ marginTop: "3%" }}>
        <LastActive data={student.recentActivities}></LastActive>
      </div>
    </div>
  );
};

export default StudentDetails;
