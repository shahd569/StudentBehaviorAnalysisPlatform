import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlarmClock,
  faBell,
  faBullhorn,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
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
    url: "/Student_Dashboard",
  },
  {
    id: 1,
    icon: faBook,
    title: "مقرراتي",
    url: "/Student_Dashboard/courses",
  },
  {
    id: 3,
    icon: faClipboardList,
    title: "الاختبارات",
    url: "/Student_Dashboard/quizzes",
  },
  {
    id: 4,
    icon: faTasks,
    title: "الواجبات",
    url: "/Student_Dashboard/assignments",
  },
  {
    id: 5,
    icon: faBullhorn,
    title: "الإعلانات",
    url: "/Student_Dashboard/announcements",
  },
  {
    id: 6,
    icon: faLightbulb,
    title: "التوصيات",
    url: "/Student_Dashboard/Recommendations",
  },
  {
    id: 7,
    icon: faBell,
    title: "التنبيهات",
    url: "/Student_Dashboard/notifications",
  },
  {
    id: 8,
    icon: faUser,
    title: "المدرسين",
    url: "/Student_Dashboard/Teachers",
  },

  {
    id: 9,
    icon: faGear,
    title: "الإعدادات",
    url: "/Student_Dashboard/settings",
  },
];
