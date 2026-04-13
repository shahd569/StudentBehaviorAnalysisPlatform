import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { assignmentId } = await params;
    const id = parseInt(assignmentId);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    // const studentId = parseInt(session.user.id);
    const studentId = 15;
    // جلب تفاصيل الواجب المحدد
    const assignment = await prisma.Assignment.findFirst({
      where: {
        id,
        submissions: {
          some: {
            studentId,
          },
        },
      },
      include: {
        resources: {
          select: {
            id: true,
            resourceURL: true,
          },
          orderBy: { id: "asc" },
        },
        lesson: {
          include: {
            course: {
              select: {
                courseName: true,
              },
            },
          },
        },
        submissions: {
          where: {
            studentId,
          },
          take: 1,
        },
      },
    });
    if (!assignment || assignment.submissions.length === 0) {
      return NextResponse.json(
        { message: "الواجب غير موجود" },
        { status: 404 },
      );
    }

    const submission = assignment.submissions[0];

    const assignmentInfo = {
      courseName: assignment.lesson.course.courseName,
      content: assignment.content,
      title: assignment.title,
      maxScore: assignment.maxScore,
      deliveryDate: assignment.deliveryDate,
      createdAt: assignment.createdAt,
      allowedExtensions: assignment.allowedExtensions,
      notes: submission?.notes ?? null,
      submissionUrl: submission?.submissionUrl ?? null,
      submittedAt: submission?.submittedAt ?? null,
      finalScore: submission.finalScore,
      teacherComment: submission.teacherComment,
      status: submission.status == "GRADED" ? "مصحح" : "غير مصحح",
      resourceURL: assignment.resources.map((r) => r.resourceURL),
    };

    return NextResponse.json({ assignmentInfo }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب أسئلة الاختبار" },
      { status: 500 },
    );
  }
}
