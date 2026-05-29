"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { links } from "./StudentMenu";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {links.map((link) => {
        const isActive = pathname === link.url;

        return (
          <Link
            key={link.id}
            href={link.url}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              fontSize: "18px",
              width: "110px",
              padding: "10px 15px",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              backgroundColor: isActive ? "#eef4fe" : "transparent",
              color: isActive ? "#5194f8" : "gray",
              fontWeight: isActive ? "bold" : "400",
              borderRight: isActive
                ? "4px solid #5194f8"
                : "4px solid transparent",
            }}
          >
            <FontAwesomeIcon
              icon={link.icon}
              style={{
                width: "16px",
                marginLeft: "5px",
                color: isActive ? "#5194f8" : "gray",
              }}
            />
            <span>{link.title}</span>
          </Link>
        );
      })}

      {/* زر تسجيل الخروج */}
      <div style={{ marginTop: "20px", padding: "0 10px" }}>
        <LogoutButton />
      </div>
    </div>
  );
}
