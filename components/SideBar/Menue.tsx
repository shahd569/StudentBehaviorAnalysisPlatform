import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { links } from "./Menu";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3">
      {links.map((link) => (
        <Link
          className="d-flex align-items-center gap-3 me-5"
          key={link.id}
          href={link.url}
          style={{
            textDecoration: "none",
            color: "gray",
            fontSize: "20px",
            fontWeight: "400 ",
            width: "200px",
            marginRight: "60px",
          }}
        >
          <FontAwesomeIcon
            icon={link.icon}
            style={{ width: "15" }}
          ></FontAwesomeIcon>
          {link.title}{" "}
        </Link>
      ))}
    </div>
  );
}
