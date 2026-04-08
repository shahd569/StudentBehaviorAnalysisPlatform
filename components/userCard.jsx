import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserCard = ({ type, value }) => {
  return (
    <div
      className="flex-fill"
      style={{
        borderRadius: "15px",
        width: "110px",
        backgroundColor: "white",
        padding: "10px",
        border: " 3px solid #e672fdff",
      }}
    >
      <h2
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          fontWeight: "blod",
          color: "#e672fdff",
        }}
      >
        {value}
      </h2>

      <h6
        style={{
          marginTop: "10px",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "center",
          color: " #888888ff",
        }}
      >
        {type}
      </h6>
    </div>
  );
};

export default UserCard;
