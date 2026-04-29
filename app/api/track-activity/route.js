import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { sessionId, activityType, pageUrl, lessonId } = body;

    // التأكد من وجود الجلسة وصلاحيتها قبل التسجيل
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 },
      );
    }

    // إنشاء سجل النشاط وربطه بالجلسة
    const activity = await prisma.PlatformActivity.create({
      data: {
        sessionId: parseInt(sessionId),
        activityType,
        pageUrl,
        timestamp: new Date(), // الوقت الحالي للنشاط
        lessonId: lessonId || null,
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error("TRACKING_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
