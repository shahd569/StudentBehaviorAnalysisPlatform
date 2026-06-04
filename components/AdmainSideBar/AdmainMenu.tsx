import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
export const links = [
  {
    id: 0,
    icon: faHome,
    title: "الرئيسية",
    url: "/AdmainDashboard",
  },
  {
    id: 1,
    icon: faBook,
    title: "إدارة المستخدمين",
    url: "/AdmainDashboard/UserManagement",
  },
  {
    id: 3,
    icon: faClipboardList,
    title: "إدارة المقررات ",
    url: "/AdmainDashboard/CoursesManagement",
  },
  {
    id: 4,
    icon: faTasks,
    title: "الإعلانات",
    url: "/AdmainDashboard/Announcement",
  },
  {
    id: 7,
    icon: faGear,
    title: "الإعدادات",
    url: "/Student_Dashboard/settings",
  },
];
