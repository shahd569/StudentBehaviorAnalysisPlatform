import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    // 1. await params لاستخراج المتغيرات بأمان في Next.js الحديثة
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const { finalScore, teacherComment } = body;

    const updatedSubmission = await prisma.assignmentSubmission.update({
      where: { id: Number(id) },
      data: {
        finalScore: parseFloat(finalScore),
        teacherComment: teacherComment || null,
        status: "GRADED",
      },
    });

    return NextResponse.json(updatedSubmission, { status: 200 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ التصحيح" },
      { status: 500 },
    );
  }
}
