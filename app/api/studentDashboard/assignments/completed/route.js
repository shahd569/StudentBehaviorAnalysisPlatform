import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ message: "غير مسموح" }, { status: 401 });
    }
    const studentId = parseInt(session.user.id);
    // const studentId = 15;
    const assignments = await prisma.AssignmentSubmission.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        assignment: {
          select: {
            title: true,
            maxScore: true,
            deliveryDate: true,
            lesson: {
              select: {
                course: {
                  select: {
                    courseName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedAssignments = assignments.map((a) => {
      return {
        id: a.id,
        title: a.assignment.title,
        courseName: a.assignment.lesson.course.courseName,
        date: a.submittedAt,
        status: a.status === "SUBMITTED" ? "تم التسليم ⏰" : "تم التصحيح ✅",
        score: a.finalScore
          ? `${a.finalScore} / ${a.assignment.maxScore}`
          : "غير محدد",
        deliveryDate: a.assignment.deliveryDate,
      };
    });

    return NextResponse.json(
      { completedAssignments: formattedAssignments },
      { status: 201 },
    );
  } catch (error) {}
}
