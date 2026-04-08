import Image from "next/image";
import Hero from "@/public/image/hero.png";
import Books from "@/public/image/Picture1.png";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "space-between",
        backgroundImage: "url('/image/background.jpg')",
      }}
    >
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        <h1
          style={{
            fontSize: "160px",
            color: "#c198e0",
            position: "absolute",
            left: "650px",
            marginBottom: "90px",
          }}
        >
          <span style={{ color: "white" }}>E</span>.learning
        </h1>
        <div
          style={{
            width: "400px",
            margin: "90px 40px",
            marginTop: "300px",
            padding: "0px 20px",
            // marginRight: "140px",
          }}
        >
          <h4>منصة ذكية لتحليل سلوك الطلاب في التعليم الإلكتروني </h4>
          <p
            style={{
              color: "gray",
              fontWeight: "bold",
              fontSize: "18px",
              marginTop: "20px",
            }}
          >
            نساعد الأساتذة والطلاب على فهم الأداء، متابعة التفاعل، واتخاذ قرارات
            تعليمية أفضل من خلال التحليل الذكي للبيانات
          </p>
        </div>
        <button
          style={{
            margin: "0px 60px",
            background: "linear-gradient(to right, #c198e0, #E7DDF3, #fefeff)",
            width: "120px",
            height: "50px",
            textAlign: "center",
            color: "black",
            borderRadius: "10px",
            border: "2px solid #fdf14c",
            // marginRight: "160px",
          }}
        >
          <Link href={"/login"}>تسجيل الدخول</Link>
        </button>
      </div>
      <div
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          background: "linear-gradient(to left, #c198e0, #f2f2f200)",
        }}
      >
        <Image
          style={{ position: "absolute", bottom: "-65px", right: "40%" }}
          width={350}
          height={350}
          src={Books}
          alt=""
        ></Image>
        <Image width={500} height={700} src={Hero} alt="hero section"></Image>
      </div>
    </div>
  );
}
