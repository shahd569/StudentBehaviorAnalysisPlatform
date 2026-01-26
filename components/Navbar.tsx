import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
// import{fa}
const Navbar = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-between p-4"
      style={{ height: "60px" }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center m-3"
        style={{
          width: "28px",
          height: "24px",
          cursor: "pointer",
          backgroundColor: "white",
        }}
      >
        <FontAwesomeIcon
          icon={faCommentDots}
          style={{ color: "gray", width: "18px" }}
        ></FontAwesomeIcon>
      </div>
      <div
        className="rounded-circle d-flex align-items-center justify-content-center position-relative"
        style={{ width: "28px", height: "24px", cursor: "pointer" }}
      >
        <FontAwesomeIcon
          icon={faBullhorn}
          style={{ color: "gray", width: "18px" }}
        ></FontAwesomeIcon>
        <div
          className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white"
          style={{
            width: "20px",
            height: "20px",
            top: "-12px",
            right: "-12px",
            backgroundColor: "rgba(250, 49, 49, 1)",
          }}
        >
          1
        </div>
      </div>
      {/* Search bar
            <div className="hidden md:flex items-center gap-2 rounded-full ring-[1.5px] ring-gray-300 px-2" >
               <FontAwesomeIcon icon={faSearch} style={{color:"gray", width:"14px"}}></FontAwesomeIcon>
               <input type="text" placeholder="Search..." className="w-[200px] p-2" ></input>
            </div> */}
      {/*  Icones and user */}
      <div className="d-flex align-items-center justify-content-end gap-4 w-100">
        <div className="d-flex flex-column">
          <span
            className="fw-medium"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            Sara Sobh
          </span>
          <span
            className="text-secondary text-end"
            style={{ fontSize: "12px" }}
          >
            Admin
          </span>
        </div>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgb(160, 49, 250)",
            width: "45px",
            height: "45px",
          }}
        >
          <FontAwesomeIcon
            icon={faUserAlt}
            className=""
            style={{ width: "30px", color: "white" }}
          ></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
