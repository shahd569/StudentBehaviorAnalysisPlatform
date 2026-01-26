"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import UserCard from "@/components/userCard";
import BarChart from "@/components/BarChart";
import Chart from "@/components/pieChart";

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
    <div className="p-4 d-flex gap-3 flex-column flex-md-row w-75">
      <div className="w-100 d-flex flex-column gap-4">
        <div className="d-flex gap-3 justify-content-between flex-wrap">
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

        <div className="d-flex gap-3 flex-column flex-lg-row">
          <div className="w-100" style={{ height: "250px" }}>
            <Chart />
          </div>
          <div className="w-100" style={{ height: "250px" }}>
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
}
