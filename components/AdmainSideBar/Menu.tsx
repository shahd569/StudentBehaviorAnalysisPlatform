import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { links } from "./AdmainMenu";
import Link from "next/link";

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          style={{
            margin: "10px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            textDecoration: "none",
            color: "white",
            fontSize: "20px",
            fontWeight: "400 ",
            width: "200px",
          }}
        >
          <FontAwesomeIcon
            icon={link.icon}
            style={{ width: "15", marginLeft: "10px" }}
          ></FontAwesomeIcon>
          {link.title}{" "}
        </Link>
      ))}
    </div>
  );
}
