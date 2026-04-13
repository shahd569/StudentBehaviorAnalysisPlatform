import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { availableAssignmentId } = await params;
    const assignmentId = parseInt(availableAssignmentId);
    if (isNaN(assignmentId)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }
    // جلب تفاصيل الواجب المحدد
    const assignment = await prisma.Assignment.findUnique({
      where: {
        id: assignmentId,
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
      },
    });
    if (!assignment) {
      return NextResponse.json(
        { message: "الواجب غير موجود" },
        { status: 404 },
      );
    }

    const assignmentInfo = {
      courseName: assignment.lesson.course.courseName,
      content: assignment.content,
      title: assignment.title,
      maxScore: assignment.maxScore,
      deliveryDate: assignment.deliveryDate,
      createdAt: assignment.createdAt,
      allowedExtensions: assignment.allowedExtensions,
      resourceURL: assignment.resources.map((r) => r.resourceURL),
    };

    return NextResponse.json({ assignmentInfo }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب تفاصيل الواجب" },
      { status: 500 },
    );
  }
}
