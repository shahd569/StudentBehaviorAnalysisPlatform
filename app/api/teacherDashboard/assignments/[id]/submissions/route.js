import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const assignmentId = parseInt(id);

    if (isNaN(assignmentId)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }

    const [submissions, assignmentInfo] = await Promise.all([
      prisma.AssignmentSubmission.findMany({
        where: {
          assignmentId: assignmentId,
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      }),
      prisma.Assignment.findUnique({
        where: { id: assignmentId },
        select: {
          content: true,
          deliveryDate: true,
          maxScore: true,
          resources: true,
        },
      }),
    ]);
    const formattedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      studentName: `${sub.student.firstName} ${sub.student.lastName}`,
      status: sub.status === "SUBMITTED" ? "تم التسليم" : "تم التصحيح",
      submittedAt: sub.submittedAt,
      fileUrl: sub.submissionUrl,
      score: sub.finalScore ?? "لم يحدد",
    }));
    return NextResponse.json(
      { submissions: formattedSubmissions, assignment: assignmentInfo },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب تسليمات الطلاب" },
      { status: 500 },
    );
  }
}
