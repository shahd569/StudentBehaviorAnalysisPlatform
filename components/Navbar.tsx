"use client";

import {
  faSearch,
  faCommentDots,
  faBullhorn,
  faUserAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NavbarData {
  fullName: string;
  avatar: string;
  role: string;
  notifications: {
    messagesCount: number;
    alertsCount: number;
    announcementsCount: number;
  };
}

const Navbar = () => {
  const { data, error } = useSWR<NavbarData>("/api/navbar", fetcher, {
    refreshInterval: 30000,
  });

  if (error)
    return <div className="p-4 text-danger">خطأ في تحميل البيانات</div>;

  return (
    <div
      className="d-flex align-items-center justify-content-between p-4 shadow-sm"
      style={{ height: "60px" }}
    >
      {/* أيقونة الرسائل */}
      <div
        className="rounded-circle d-flex align-items-center justify-content-center m-3 position-relative"
        style={{
          width: "28px",
          height: "24px",
          cursor: "pointer",
          backgroundColor: "white",
        }}
      >
        <FontAwesomeIcon
          icon={faBell}
          style={{ color: "gray", width: "18px" }}
        />
        {/* إظهار عدد الرسائل فقط إذا كان أكبر من صفر */}
        {data?.notifications?.alertsCount ? (
          <div
            className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white"
            style={{
              width: "18px",
              height: "18px",
              top: "-10px",
              right: "-10px",
              backgroundColor: "rgba(250, 49, 49, 1)",
              fontSize: "10px",
            }}
          >
            {data?.notifications.alertsCount}
          </div>
        ) : null}
      </div>

      {/* أيقونة التنبيهات */}
      <div
        className="rounded-circle d-flex align-items-center justify-content-center position-relative"
        style={{ width: "28px", height: "24px", cursor: "pointer" }}
      >
        <FontAwesomeIcon
          icon={faBullhorn}
          style={{ color: "gray", width: "18px" }}
        />
        {/* إظهار عدد التنبيهات فقط إذا كان أكبر من صفر */}
        {data?.notifications?.announcementsCount ? (
          <div
            className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white"
            style={{
              width: "18px",
              height: "18px",
              top: "-10px",
              right: "-10px",
              backgroundColor: "rgba(250, 49, 49, 1)",
              fontSize: "10px",
            }}
          >
            {data?.notifications.announcementsCount}
          </div>
        ) : null}
      </div>

      {/* معلومات المستخدم */}
      <div className="d-flex align-items-center justify-content-end gap-4 w-100">
        <div className="d-flex flex-column">
          <span
            className="fw-medium text-end"
            style={{ fontWeight: "bold", fontSize: "16px", color: "black" }}
          >
            {data?.fullName || "جاري التحميل..."}
          </span>
          <span
            className="text-secondary text-end"
            style={{ fontSize: "12px", color: "black" }}
          >
            {data?.role || "Teacher"}
          </span>
        </div>

        {/* الصورة الشخصية */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
          style={{
            backgroundColor: "rgb(160, 49, 250)",
            width: "45px",
            height: "45px",
          }}
        >
          {data?.avatar ? (
            <img
              src={data.avatar}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserAlt}
              style={{ width: "25px", color: "white" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
