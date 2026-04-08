"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import UserCard from "@/components/userCard";
import BarChart from "@/components/BarChart";
import Chart from "@/components/pieChart";
import LastActivity from "@/components/LastActive";
import AnnouncementsModal from "@/components/Announcement";
import TestModal from "@/components/testModal";
import ContentModal from "@/components/contentModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StaticCards {
  totalStudents: number;
  excellentStudents: number;
  weakStudents: number;
}

interface LiveCards {
  unGradedAssignments: number;
  unReadedMessage: number;
}

export default function TeacherDashboard() {
  const [staticData, setStaticData] = useState<StaticCards | null>(null);

  useEffect(() => {
    fetch("/api/teacherDashboard/staticCards")
      .then((res) => res.json())
      .then(setStaticData);
  }, []);

  const { data: liveData } = useSWR<LiveCards>(
    "/api/teacherDashboard/liveCards",
    fetcher,
    {
      refreshInterval: 15000,
    },
  );

  if (!staticData) return <p>Loading...</p>;

  return (
    <div className="p-4 d-flex gap-5 flex-column flex-md-row col-md-9">
      {/* left */}
      <div className="w-100 d-flex flex-column gap-5 col-md-12">
        <div className="d-flex gap-4 justify-content-between flex-wrap">
          <UserCard type="إجمالي الطلاب" value={staticData.totalStudents} />
          <UserCard type="طلاب متفوقون" value={staticData.excellentStudents} />
          <UserCard type="طلاب ضعيفو المستوى" value={staticData.weakStudents} />
          <UserCard
            type="واجبات غير مصححة"
            value={liveData?.unGradedAssignments ?? 0}
          />
          <UserCard
            type="رسائل غير مقروئة"
            value={liveData?.unReadedMessage ?? 0}
          />
        </div>

        <div className="d-flex gap-4 flex-column flex-lg-row">
          <div
            className="flex-grow-1 col-md-4"
            style={{ flex: "1", height: "300px" }}
          >
            <Chart />
          </div>
          <div
            className="flex-grow-2 col-md-8"
            style={{ flex: "2", height: "300px" }}
          >
            <BarChart />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ContentModal></ContentModal>
          <AnnouncementsModal></AnnouncementsModal>
          <TestModal></TestModal>
        </div>
      </div>
      <div className="flex flex-col gap-8 col-md-3">
        <LastActivity></LastActivity>
      </div>
    </div>
  );
}
