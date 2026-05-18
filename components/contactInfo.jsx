// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPhone ,faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import Image from "next/image";
// import Linkedin from "@/public/image/linkedin.png"
// import Twitter from "@/public/image/twitter.png"
// export default function ContactInfo() {
//     return(
//         <div style={{padding:"20px", borderRadius:"15px",border:"2px solid #dad9d9", flex:"2"}}>
//         <div style={{display:"flex", gap:"20px"}}>
//           <FontAwesomeIcon
//             icon={faPhone}
//             style={{ color: "#9f04f8", fontSize:"30px" }}
//             />
//             <h3>معلومات التواصل </h3>
//         </div>
//         <p style={{color:"gray", marginRight:"50px", fontWeight:"bold"}}>تحديث معلومات التواصل الخاصة بك </p>
//         <div>
//            <label>البريد الإلكتروني </label>
//            <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px"}}>
//             <FontAwesomeIcon
//             icon={faEnvelope}
//             style={{ color: "#8b8a8a", fontSize:"20px", marginLeft:"5px"}}
//             />
//             feda@gmail.com
//            </p>
//         </div>
//         <div>
//             <label>رقم الهاتف</label>
//             <p style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px"}}>
//              <FontAwesomeIcon
//             icon={faPhone}
//             style={{ color: "#8b8a8a", fontSize:"20px", marginLeft:"5px"}}
//             />
//              د.فدا جهجاه
//              </p>
//              <div style={{display:"flex", flexDirection:"column",gap:"10px"}}>
//              <label>وسائل التواصل الاجتماعي </label>
//              <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
//                 <Image src={Linkedin} width={50} height={50}></Image>
//               <input type="text" style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px", width:"100%"}}/>
//              </div>
//              <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
//                 <Image src={Twitter} width={50} height={50}></Image>
//               <input type="text" style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px", width:"100%"}}/>
//              </div>
//              <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
//                 <Image src={Twitter} width={50} height={50}></Image>
//               <input type="text" style={{backgroundColor:"#eee", borderRadius:"10px", height:"40px", border:"1px solid #ccc", padding:"10px", width:"100%"}}/>
//              </div>
//              </div>
//         </div>
//         </div>
//     )
// }

"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faPen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import Linkedin from "@/public/image/linkedin.png";
import Twitter from "@/public/image/twitter.png";

export default function ContactInfo() {
  const [data, setData] = useState(null);

  // حالات التعديل
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  // القيم
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [twitter, setTwitter] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/teacherDashboard/settings/updateProfile");
        const result = await res.json();

        if (res.ok) {
          setData(result);

          setPhone(result.contactInfo?.phone || "");
          setContactEmail(result.contactInfo?.contactEmail || "");
          setFacebook(result.contactInfo?.facebook || "");
          setLinkedIn(result.contactInfo?.linkedIn || "");
          setTwitter(result.contactInfo?.twitter || "");
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchProfile();
  }, []);

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
          style={{ color: "#9f04f8", fontSize: "30px" }}
        />
        <h3>معلومات التواصل </h3>
      </div>

      <p
        style={{
          color: "gray",
          marginRight: "50px",
          fontWeight: "bold",
        }}
      >
        تحديث معلومات التواصل الخاصة بك
      </p>

      {/* البريد الإلكتروني */}

      <div>
        <label>البريد الإلكتروني </label>

        {!contactEmail ? (
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "100%",
            }}
          />
        ) : editEmail ? (
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "100%",
            }}
          />
        ) : (
          <p
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{
                  color: "#8b8a8a",
                  fontSize: "20px",
                  marginLeft: "5px",
                }}
              />
              {contactEmail}
            </span>

            <FontAwesomeIcon
              icon={faPen}
              style={{ cursor: "pointer" }}
              onClick={() => setEditEmail(true)}
            />
          </p>
        )}
      </div>

      {/* رقم الهاتف */}

      <div>
        <label>رقم الهاتف</label>
        {!phone ? (
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "100%",
            }}
          />
        ) : editPhone ? (
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              width: "100%",
            }}
          />
        ) : (
          <p
            style={{
              backgroundColor: "#eee",
              borderRadius: "10px",
              height: "40px",
              border: "1px solid #ccc",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <FontAwesomeIcon
                icon={faPhone}
                style={{
                  color: "#8b8a8a",
                  fontSize: "20px",
                  marginLeft: "5px",
                }}
              />
              {phone}
            </span>

            <FontAwesomeIcon
              icon={faPen}
              style={{ cursor: "pointer" }}
              onClick={() => setEditPhone(true)}
            />
          </p>
        )}

        {/* وسائل التواصل */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label>وسائل التواصل الاجتماعي </label>

          {/* LinkedIn */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Image src={Linkedin} width={50} height={50} alt="linkedin" />

            {!linkedIn ? (
              <input
                type="text"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "100%",
                }}
              />
            ) : (
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
                {linkedIn}
              </p>
            )}
          </div>

          {/* Twitter */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Image src={Twitter} width={50} height={50} alt="twitter" />

            {!twitter ? (
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "100%",
                }}
              />
            ) : (
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
                {twitter}
              </p>
            )}
          </div>

          {/* Facebook */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Image src={Twitter} width={50} height={50} alt="facebook" />

            {!facebook ? (
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "10px",
                  height: "40px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "100%",
                }}
              />
            ) : (
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
                {facebook}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
