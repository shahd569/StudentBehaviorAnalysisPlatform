import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session)
    //   return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

    const { assignmentId, submissionUrl, notes } = await req.json();

    // للتعامل مع الحالة إذا كان الطالب يسلم لأول مرة أو يحدّث تسليمه upsert
    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: parseInt(assignmentId),
          // studentId: parseInt(session.user.id),
          studentId: 15,
        },
      },
      update: {
        submissionUrl: submissionUrl || undefined,
        notes: notes || undefined, // إذا لم يرسل ملاحظة جديدة، لا تغير القديمة
        submittedAt: new Date(), // تحديث وقت التسليم
        status: "SUBMITTED",
      },
      create: {
        assignmentId: parseInt(assignmentId),
        studentId: 15,
        submissionUrl: submissionUrl,
        notes: notes,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json({ message: "خطأ في السيرفر" }, { status: 500 });
  }
}
