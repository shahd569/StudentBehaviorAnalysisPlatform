"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import BarChart from "@/components/studentChart";
import RecentFeed from "@/components/RecentFeed";
import ContentModal from "@/components/contentModal";
import AnnouncementsModal from "@/components/Announcement";
import TestModal from "@/components/testModal";
import ActivityChart from "@/components/activity";
import PerformanceChart from "@/components/performanceChart";
import Image from "next/image";
import Cards from "@/components/studentUsercard";
import Table from "@/components/SHomeTable";

export default function TeacherDashboard() {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "40px" }}
    >
      <div className=" d-flex gap-5 flex-column flex-md-row col-md-7">
        {/* left */}
        <div
          className="w-100 d-flex flex-column gap-5 col-md-12"
          style={{ padding: "40px" }}
        >
          <Cards></Cards>
          <BarChart></BarChart>
          <div
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 4px #ccc",
              borderRadius: "20px",
              height: "300px",
              padding: "20px",
            }}
          >
            <h5
              style={{ color: "#535353", fontWeight: "bold", fontSize: "20px" }}
            >
              ماذا عليّ أن أفعل الآن ؟؟
            </h5>
            <Table></Table>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-8 col-md-5"
        style={{ backgroundColor: "#eee", padding: "40px" }}
      >
        <div
          style={{
            border: "3px solid #5194F8",
            borderRadius: "20px",
            height: "150px",
            marginBottom: "20px",
          }}
        >
          {/* <Image></Image> */}
          <p>مرحباً بعودتك شهد</p>
        </div>
        <RecentFeed></RecentFeed>
      </div>
    </div>
  );
}
