import styles from "./dash.module.css";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menue from "@/components/SideBar/Menue";
import Navbar from "@/components/Navbar";
export default function Teacher_DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <div className="vh-100 d-flex bg-light">
        {/* right */}
        <div
          className={`p-4 ${styles.gradientBackground} ${styles.sidebar}`}
          style={{ width: "var(--sidebar-width)" }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
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
          className="bg-light d-flex flex-column"
          style={{ overflow: "scroll", flex: 1 }}
        >
          <Navbar></Navbar>
          {children}
        </div>
      </div>
    </html>
  );
}
