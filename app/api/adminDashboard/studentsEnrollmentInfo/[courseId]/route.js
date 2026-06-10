import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { message: "غير مصرح لك بالقيام بهذا الإجراء" },
    //     { status: 401 },
    //   );
    // }
    const { courseId } = await params;
    const id = parseInt(courseId);

    const courseInfo = await prisma.Course.findUnique({
      where: {
        id: id,
      },
      select: {
        enrollments: {
          select: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                universityId: true,
                academicYear: true,
              },
            },
          },
        },
      },
    });

    const flatStudents = courseInfo.enrollments.map((e) => {
      return {
        courseId: id,
        studentId: e.student.id,
        Name: `${e.student.firstName} ${e.student.lastName}`,
        email: e.student.email,
        universityId: e.student.universityId,
        academicYear: e.student.academicYear,
      };
    });

    return NextResponse.json({ studentsInfo: flatStudents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students enrollment info:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي في السيرفر أثناء جلب معلومات التسجيل" },
      { status: 500 },
    );
  }
}
