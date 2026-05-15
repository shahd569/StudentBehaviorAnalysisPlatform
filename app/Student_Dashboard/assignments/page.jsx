"use client";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Table from "@/components/complitedAssignment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cards from "@/components/assignmentCards/AssignmentCards";

export default function Assignment() {
  const [allAssignments, setAllAssignments] = useState([]);
  const [displayedAssignments, setDisplayedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [objectFilter, setObjectFilter] = useState("الكل");
  const [courses, setCourses] = useState([]);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [filteredAvailable, setFilteredAvailable] = useState([]);

  const searchParams = useSearchParams();

  const activeTab =
    searchParams.get("tab") === "available" ? "second" : "first";

  const lessonId = Number(searchParams.get("lessonId"));
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/studentDashboard/assignments/completed");
        const data = await res.json();

        const res2 = await fetch("/api/studentDashboard/assignments/available");
        const data2 = await res2.json();

        setAvailableAssignments(data2.assignments || []);
        setFilteredAvailable(data2.assignments || []);

        if (res.ok) {
          setAllAssignments(data.completedAssignments || []);
          setDisplayedAssignments(data.completedAssignments || []);
          // console.log(objectFilter);
          // console.log(availableAssignments.map((a) => a.courseName));
        }

        const allCourses = data2.assignments.flatMap((s) => {
          if (!s.courseName) return [];
          const courseArray = Array.isArray(s.courseName)
            ? s.courseName
            : s.courseName.split("،").map((item) => item.trim());
          return courseArray;
        });

        const uniqeCourses = [...new Set(allCourses)];

        setCourses(uniqeCourses);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // 2. تحديث الفلترة عند تغيير نص البحث أو البيانات الأصلية
  useEffect(() => {
    let result = allAssignments;

    if (searchQuery) {
      result = allAssignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "الكل") {
      result = result.filter(
        (assignment) => assignment.status === statusFilter,
      );
    }

    if (objectFilter !== "الكل") {
      result = result.filter((assignment) => {
        if (!assignment.courses) return false;

        const assignmentsCoursesText = Array.isArray(assignment.courses)
          ? assignment.courses.join(" ")
          : assignment.courses;

        return assignmentsCoursesText.includes(objectFilter);
      });
    }
    setDisplayedAssignments(result);
  }, [searchQuery, allAssignments, statusFilter, objectFilter]); // تشغيل الفلترة فقط عند تغير البحث

  useEffect(() => {
    let result = availableAssignments;
    // فلترة حسب المقرر
    if (lessonId) {
      result = result.filter(
        (quiz) => Number(quiz.lessonId) === Number(lessonId),
      );
    }
    if (searchQuery) {
      result = result.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "الكل") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (objectFilter !== "الكل") {
      result = result.filter((a) => a.courseName.includes(objectFilter));
    }

    setFilteredAvailable(result);
  }, [searchQuery, statusFilter, objectFilter, availableAssignments, lessonId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        padding: "20px 40px",
        fontSize: "18px",
      }}
    >
      <h1 style={{ fontWeight: "bold" }}>الواجبات</h1>
      <Tab.Container defaultActiveKey={activeTab}>
        <Nav
          variant="tabs"
          style={{
            display: "flex",
            justifyContent: "start",
            width: "100%",
            margin: "10px",
          }}
        >
          <Nav.Item>
            <Nav.Link
              style={{ color: "gray", fontSize: "18px" }}
              eventKey="first"
            >
              مكتملة
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              style={{ color: "gray", fontSize: "18px" }}
              eventKey="second"
            >
              متاحة
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="first">
            {/* بحث بالاسم */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "end",
                marginTop: "20px",
              }}
            >
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "265px",
                  color: "gray",
                }}
              ></FontAwesomeIcon>
              <input
                style={{
                  border: "1px solid #eee",
                  borderRadius: "50px",
                  padding: "5px 35px",
                }}
                type="text"
                placeholder="بحث ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              ></input>
            </div>
            <Table data={displayedAssignments} loading={loading} />
          </Tab.Pane>
          <Tab.Pane eventKey="second">
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "20px",
                justifyContent: "end",
                marginTop: "10px",
              }}
            >
              {/* بحث بالاسم */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "265px",
                    color: "gray",
                  }}
                ></FontAwesomeIcon>
                <input
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "50px",
                    padding: "5px 35px",
                  }}
                  type="text"
                  placeholder="بحث ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                ></input>
              </div>
              {/* فلتر الحالة*/}
              <select
                style={{
                  backgroundColor: "#B1CAF4",
                  border: "none",
                  borderRadius: "10px",
                  padding: "5px",
                  width: "100px",
                  textAlign: "center",
                  height: "40px",
                }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="الكل">الحالة</option>
                <option value="متاح">متاح</option>
                <option value="غير متاح">غير متاح</option>
              </select>
              {/* فلتر المادة */}
              <select
                style={{
                  backgroundColor: "#B1CAF4",
                  border: "none",
                  borderRadius: "10px",
                  padding: "5px",
                }}
                value={objectFilter}
                onChange={(e) => setObjectFilter(e.target.value)}
              >
                          <option value="الكل">المادة</option>
                         {" "}
                {courses.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
                       {" "}
              </select>
            </div>
            <Cards assignments={filteredAvailable} />{" "}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
