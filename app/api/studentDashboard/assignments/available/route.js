import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "غير مسموح لك بالوصول لهذه البيانات" },
        { status: 401 },
      );
    }

    const studentId = parseInt(session?.user.id);
    // const studentId = 18;
    // جلب جميع الدورات المسجل فيها الطالب
    const enrollments = await prisma.Enrollment.findMany({
      where: { studentId: studentId },
      select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    // جلب جميع الواجبات في الدورات المسجل فيها الطالب
    const assignments = await prisma.Assignment.findMany({
      where: { lesson: { courseId: { in: courseIds } } },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
        resources: true,
      },
    });

    // جلب الواجبات التي قدمها الطالب بالفعل
    const studentAssignments = await prisma.AssignmentSubmission.findMany({
      where: { studentId: studentId },
      select: { assignmentId: true },
    });

    const submissionsIds = studentAssignments.map((a) => a.assignmentId);

    // تصفية الواجبات التي لم يقدمها الطالب
    const filteredAssignments = assignments.filter(
      (a) => !submissionsIds.includes(a.id),
    );

    const formattedAssignments = filteredAssignments.map((a) => {
      const currentDate = new Date();
      const isAvailable = currentDate <= a.deliveryDate;
      const status = isAvailable ? "متاح" : "غير متاح";

      return {
        id: a.id,
        title: a.title,
        courseName: a.lesson.course.courseName,
        endDate: a.deliveryDate
          ? a.deliveryDate.toISOString().split("T")[0]
          : "غير محدد",
        status: status,
      };
    });

    return NextResponse.json({
      assignments: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب الواجبات" },
      { status: 500 },
    );
  }
}
