"use client";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Table from "@/components/completedQuizzes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Quiz() {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [displayedQuizzes, setDisplayedQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/studentDashboard/quizzes/completed"); // تأكدي من المسار
        const data = await res.json();
        if (res.ok) {
          setAllQuizzes(data.completedQuizzes || []);
          setDisplayedQuizzes(data.completedQuizzes || []);
        }
      } catch (error) {
        console.error("خطأ في الجلب:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // 2. تحديث الفلترة عند تغيير نص البحث أو البيانات الأصلية
  useEffect(() => {
    const result = allQuizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setDisplayedQuizzes(result);
  }, [searchQuery, allQuizzes]); // تشغيل الفلترة فقط عند تغير البحث
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
            <p style={{ color: "black", fontSize: "20px", margin: "15px" }}>
              {" "}
              مدة الاختبار (اختياري):
            </p>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
