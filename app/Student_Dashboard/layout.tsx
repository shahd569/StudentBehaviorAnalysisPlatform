import styles from "./dash.module.css";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menue from "@/components/studentSideBar/Menu";
import Navbar from "@/components/Navbar";
import ActivityTracker from "@/components/ActivityTracker"; // 1. استيراد المتتبع الجديد

export default function Teacher_DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="vh-100 d-flex" style={{ backgroundColor: "#fafafae3" }}>
      {/* right */}
      <div
        className={`p-4 ${styles.gradientBackground} ${styles.sidebar}`}
        style={{ width: "14%" }}
      >
        <div className="d-flex align-items-center justify-content-center gap-2 mb-5">
          <span
            className="d-none d-lg-block"
            style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
          >
            E-Learning
          </span>
          <FontAwesomeIcon
            style={{ color: "white", fontSize: "36px" }}
            icon={faGraduationCap}
          ></FontAwesomeIcon>
        </div>
        <Menue></Menue>
      </div>
      {/* leftt */}
      <div
        className="d-flex flex-column"
        style={{
          backgroundColor: "#fafafae3",
          overflow: "scroll",
          flex: 1,
          width: "86%",
        }}
      >
        <Navbar></Navbar>
        <ActivityTracker>{children}</ActivityTracker>
      </div>
    </div>
  );
}
