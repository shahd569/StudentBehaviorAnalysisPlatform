"use client";
import Cards from "@/components/AdminCards";
import PieChart from "@/components/AdminPieChart";
import BarChart from "@/components/AdminBarChart";
import LineChart from "@/components/AdminLineChart";
import LastRegisteredUser from "@/components/lastRegisteredUser";
import { useEffect, useState } from "react";
import AddCourse from "@/components/addCourseModal";
import AddAnnouncement from "@/components/AnnouncementModal";
import StudentUpload from "@/components/studentUpload";
import TeacherUpload from "@/components/teacherUpload";

export default function AdminDashboard() {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
    >
      <div className=" d-flex gap-5 flex-column flex-md-row col-md-9">
        {/* left */}
        <div
          className="w-100 d-flex flex-column gap-5 col-md-12"
          style={{ padding: "40px" }}
        >
          <Cards></Cards>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "30px",
            }}
          >
            <PieChart></PieChart>
            <BarChart></BarChart>
          </div>
          <LineChart></LineChart>
        </div>
      </div>
      <div
        className=" col-md-3"
        style={{
          padding: "40px",
          gap: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingRight: "20px",
        }}
      >
        <LastRegisteredUser></LastRegisteredUser>
        <div
          style={{
            padding: "15px",
            borderRadius: "15px",
            border: "2px solid #dad9d9",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // padding:"20px 40px",
            alignContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <h4
            style={{
              marginBottom: "20px",
              fontWeight: "bold",
              // color: "gray",
            }}
          >
            إجراءات سريعة
          </h4>
          <AddCourse></AddCourse>
          <AddAnnouncement></AddAnnouncement>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <StudentUpload></StudentUpload>
            <TeacherUpload></TeacherUpload>
          </div>
        </div>
      </div>
    </div>
  );
}
