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
        id :0,
        icon:faHome,
        title : "الرئيسية",
        url : "/"
    },
    {
        id : 1,
        icon:faUserGraduate,
        title : "الطلاب",
        url: "/Teacher_Dashboard/students"
    },
    {
        id : 2,
        icon:faBook,
        title : "إدارة المقررات",
        url: "/Teacher_Dashboard/courseManagement"
    },
    {
        id : 3,
        icon:faClipboardList,
        title :"الاختبارات",
        url: "/orphans"
    },
    {
        id : 4,
        icon:faTasks,
        title :"الواجبات",
        url: "/Teacher_Dashboard/assignments"
    },
    {
        id : 5,
        icon:faLightbulb,
        title :"التوصيات",
        url: "/contact"
    },
    {
        id : 6,
        icon:faEnvelope,
        title :"الرسائل",
        url: "/Teacher_Dashboard/message"
    },
    {
        id : 7,
        icon:faGear,
        title :"الإعدادات",
        url: "/Teacher_Dashboard/settings"
    }
]