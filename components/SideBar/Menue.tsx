"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { links } from "./Menu";
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
              gap: "20px",
              textDecoration: "none",
              fontSize: "18px",
              width: "130px",
              padding: "10px 15px",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              backgroundColor: isActive ? "#fbe9fa" : "transparent",
              color: isActive ? "#b834a7" : "gray",
              fontWeight: isActive ? "bold" : "400",
              borderRight: isActive
                ? "4px solid #b834a7"
                : "4px solid transparent",
            }}
          >
            <FontAwesomeIcon
              icon={link.icon}
              style={{
                width: "16px",
                marginLeft: "5px",
                color: isActive ? "#b834a7" : "gray",
              }}
            />
            <span>{link.title}</span>
          </Link>
        );
      })}

      {/* زر تسجيل الخروج */}
      <div style={{ padding: "0 10px" }}>
        <LogoutButton />
      </div>
    </div>
  );
}
