"use client";
import Cards from "@/components/AdminCards"
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function AdminDashboard() {
  return (
   <div style={{display:"flex", justifyContent:"space-between", gap:"40px"}}>
     <div className=" d-flex gap-5 flex-column flex-md-row col-md-9">
      {/* left */}
      <div className="w-100 d-flex flex-column gap-5 col-md-12" style={{padding:"40px"}}>
       <Cards></Cards>
       {/* <BarChart></BarChart> */}
        </div>
    </div>
      <div className="flex flex-col gap-8 col-md-3" style={{ padding:"40px"}}>
        </div>
   </div>
  )
}