"use client";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Table from "@/components/completedQuizzes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Cards from "@/components/quizCards/QuizCards";

export default function Quiz() {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [displayedQuizzes, setDisplayedQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [objectFilter, setObjectFilter] = useState("الكل");
  const [courses, setCourses] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [filteredAvailable, setFilteredAvailable] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/studentDashboard/quizzes/completed"); // تأكدي من المسار
        const data = await res.json();

        const res2 = await fetch("/api/studentDashboard/quizzes/available");
        const data2 = await res2.json();

        setAvailableQuizzes(data2.quizzes || []);
        setFilteredAvailable(data2.quizzes || []);

        if (res.ok) {
          setAllQuizzes(data.completedQuizzes || []);
          setDisplayedQuizzes(data.completedQuizzes || []);
        }

        const allCourses = data2.quizzes.flatMap((s) => {
          if (!s.courseName) return [];
          const courseArray = Array.isArray(s.courseName)
            ? s.courseName
            : s.courseName.split("،").map((item) => item.trim());
          return courseArray;
        });

        const uniqeCourses = [...new Set(allCourses)];

        setCourses(uniqeCourses);
      } catch (error) {
        console.error("خطأ في الجلب:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let result = allQuizzes;

    if (searchQuery) {
      result = allQuizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "الكل") {
      result = result.filter((quiz) => quiz.status === statusFilter);
    }

    if (objectFilter !== "الكل") {
      result = result.filter((quiz) => {
        if (!quiz.courses) return false;

        const quizzesCoursesText = Array.isArray(quiz.courses)
          ? quiz.courses.join(" ")
          : quiz.courses;

        return quizzesCoursesText.includes(objectFilter);
      });
    }
    setDisplayedQuizzes(result);
  }, [searchQuery, allQuizzes, statusFilter, objectFilter]);
  useEffect(() => {
    let result = availableQuizzes;

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
  }, [searchQuery, statusFilter, objectFilter, availableQuizzes]);

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
      <h1 style={{ fontWeight: "bold" }}>الاختبارات</h1>
      <Tab.Container defaultActiveKey="first">
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
            <Table quizzes={displayedQuizzes} />
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
            <Cards quizzes={filteredAvailable} />{" "}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
