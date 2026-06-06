"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { links } from "./AdmainMenu";
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
        gap: "12px",
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
              width: "145px",
              padding: "8px 13px",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              backgroundColor: isActive ? "#ffff" : "transparent",
              color: isActive ? "#0135c3" : "white",
              fontWeight: isActive ? "bold" : "400",
              borderRight: isActive
                ? "4px solid #1e40af"
                : "4px solid transparent",
            }}
          >
            <FontAwesomeIcon
              icon={link.icon}
              style={{
                width: "16px",
                marginLeft: "5px",
                color: isActive ? "#00217a" : "white",
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
