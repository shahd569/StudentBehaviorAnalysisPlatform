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
import Facebook from "@/public/image/facebook.png";

export default function ContactInfo() {
  const [data, setData] = useState(null);

  // حالات التعديل
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editFacebook, setEditFacebook] = useState(false);
  const [editLinkedIn, setEditLinkedIn] = useState(false);
  const [editTwitter, setEditTwitter] = useState(false);

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

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("contactEmail", contactEmail);
      formData.append("phone", phone);
      formData.append("facebook", facebook);
      formData.append("linkedIn", linkedIn);
      formData.append("twitter", twitter);

      const res = await fetch("/api/teacherDashboard/settings/updateProfile", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      alert("تم حفظ التعديلات بنجاح");

      setEditEmail(false);
      setEditPhone(false);
      setEditFacebook(false);
      setEditLinkedIn(false);
      setEditTwitter(false);

      setData((prev) => ({
        ...prev,
        contactEmail,
        phone,
        facebook,
        linkedIn,
        twitter,
      }));
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

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
            <Image
              src={Linkedin}
              width={40}
              height={40}
              alt="linkedin"
              style={{ borderRadius: "50px", marginBottom: "15px" }}
            />

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
            ) : editLinkedIn ? (
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
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span> {linkedIn}</span>
                <FontAwesomeIcon
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditLinkedIn(true)}
                />
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
            <Image
              src={Facebook}
              width={38}
              height={38}
              alt="facebook"
              style={{ borderRadius: "50px", marginBottom: "15px" }}
            />

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
            ) : editFacebook ? (
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
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span> {facebook}</span>
                <FontAwesomeIcon
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditFacebook(true)}
                />
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
            <Image
              src={Twitter}
              width={40}
              height={40}
              alt="twitter"
              style={{ borderRadius: "50px", marginBottom: "15px" }}
            />

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
            ) : editTwitter ? (
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
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{twitter}</span>
                <FontAwesomeIcon
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditTwitter(true)}
                />
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: "#9f04f8",
            color: "white",
            borderRadius: "10px",
            padding: "10px 20px",
            border: "none",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          حفظ التعديلات
        </button>
      </div>
    </div>
  );
}
