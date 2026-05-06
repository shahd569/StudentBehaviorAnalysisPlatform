"use client";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      //  إبلاغ قاعدة البيانات أن الجلسة انتهت الآن
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("فشل تحديث الجلسة في قاعدة البيانات", error);
    } finally {
      await signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        margin: "10px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        textDecoration: "none",
        color: "gray",
        fontSize: "20px",
        fontWeight: "400 ",
        width: "200px",
        marginTop: "50px",
      }}
    >
      <FontAwesomeIcon
        icon={faSignOutAlt}
        style={{ width: "15", marginLeft: "10px" }}
      ></FontAwesomeIcon>
      <span>تسجيل الخروج</span>
    </button>
  );
};

export default LogoutButton;
