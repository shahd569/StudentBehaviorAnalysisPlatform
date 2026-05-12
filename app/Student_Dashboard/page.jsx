"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import BarChart from "@/components/studentChart";
import RecentFeed from "@/components/RecentFeed";
import ResultRecentFeed from "@/components/ResultRecentFeed";
import ContentModal from "@/components/contentModal";
import AnnouncementsModal from "@/components/Announcement";
import TestModal from "@/components/testModal";
import ActivityChart from "@/components/activity";
import PerformanceChart from "@/components/performanceChart";
import Image from "next/image";
import Cards from "@/components/studentUsercard";
import Table from "@/components/SHomeTable";
import { useSession } from "next-auth/react";

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.firstName
    ? `${session.user.firstName}`.trim()
    : session?.user?.name || "زائر";

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
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
        className="col-md-5"
        style={{
          // backgroundColor: "#eee",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            border: "3px solid #5194F8",
            borderRadius: "20px",
            height: "100px",
            // marginBottom: "20px",
            display: "flex",
            flexDirection: "row-reverse",
            overflow: "visible",
          }}
        >
          <Image
            src="/uploads/welcome-card.png"
            width={200}
            height={240}
            alt=""
            style={{
              alignItems: "flex-end",
              top: "10px",
              paddingLeft: "20px",
              paddingBottom: "105px",
              position: "relative",
              top: "-40px",
            }}
          />
          <p
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              alignContent: "center",
              paddingLeft: "60px",
              color: "#5194F8",
            }}
          >
            مرحباً بعودتك {userName}
          </p>
        </div>
        <div>
          <RecentFeed></RecentFeed>
        </div>
        <div>
          <ResultRecentFeed></ResultRecentFeed>
        </div>
      </div>
    </div>
  );
}
