import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UserCardProps {
  type: string;
  value: number;
}

const UserCard = ({ type, value }: UserCardProps) => {
  return (
    <div
      className="rounded-4 bg-white p-3 flex-fill"
      style={{ minWidth: "110px", height: "110px" }}
    >
      {" "}
      <div className="d-flex justify-content-end align-items-center">
        <FontAwesomeIcon
          icon={faEye}
          style={{ width: "20px", height: "20px", color: "#f0e5ff" }}
        />
      </div>
      <h4 className="my-1 d-flex justify-content-center fw-bold fs-4">
        {value}
      </h4>
      <h6 className="my-2 d-flex justify-content-center small text-secondary">
        {type}
      </h6>
    </div>
  );
};

export default UserCard;
