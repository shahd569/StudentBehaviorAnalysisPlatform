"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import Linkedin from "@/public/image/linkedin.png";
import Twitter from "@/public/image/twitter.png";
import Facebook from "@/public/image/facebook.png";

export default function ContactInfo({ data }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #dad9d9",
        flex: "2",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <FontAwesomeIcon
          icon={faPhone}
          style={{ color: "#5194F8", fontSize: "30px" }}
        />

        <h3>معلومات التواصل </h3>
      </div>
      {data.map((info, index) => (
        <div key={index}>
          <div>
            <label>البريد الإلكتروني </label>

            <p
              style={{
                backgroundColor: "#eee",
                borderRadius: "10px",
                height: "40px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{
                  color: "#8b8a8a",
                  fontSize: "20px",
                  marginLeft: "5px",
                }}
              />

              {info.contactEmail || "لا يوجد"}
            </p>
          </div>

          <div>
            <label>رقم الهاتف</label>

            <p
              style={{
                backgroundColor: "#eee",
                borderRadius: "10px",
                height: "40px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={faPhone}
                style={{
                  color: "#8b8a8a",
                  fontSize: "20px",
                  marginLeft: "5px",
                }}
              />

              {info.phone || "لا يوجد"}
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label>وسائل التواصل الاجتماعي </label>

              {/* Linkedin */}

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Image
                  src={Linkedin}
                  width={50}
                  height={50}
                  alt="linkedin"
                  style={{ marginBottom: "10px" }}
                />

                <p
                  style={{
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    height: "40px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  {info.linkedIn || "لا يوجد حساب"}
                </p>
              </div>

              {/* Facebook */}

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Image
                  src={Facebook}
                  width={50}
                  height={43}
                  alt="facebook"
                  style={{ marginBottom: "20px" }}
                />

                <p
                  style={{
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    height: "40px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  {info.facebook || "لا يوجد حساب"}
                </p>
              </div>
              {/* Twitter */}

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Image
                  src={Twitter}
                  width={50}
                  height={50}
                  alt="twitter"
                  style={{ marginBottom: "10px" }}
                />

                <p
                  style={{
                    backgroundColor: "#eee",
                    borderRadius: "10px",
                    height: "40px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  {info.twitter || "لا يوجد حساب"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
