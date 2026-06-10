import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { message: "غير مصرح لك بالقيام بهذا الإجراء" },
    //     { status: 401 },
    //   );
    // }
    const { studentId } = await params;
    const id = parseInt(studentId);

    const { courseId } = await params;
    const courseIdInt = parseInt(courseId);

    if (!id) {
      return NextResponse.json(
        { message: "معرف الطالب غير صحيح أو غير موجود" },
        { status: 400 },
      );
    }

    const userExists = await prisma.Enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: id,
          courseId: courseIdInt,
        },
      },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "الطالب غير مسجل بالفعل" },
        { status: 404 },
      );
    }
    await prisma.Enrollment.deleteMany({
      where: { studentId: id, courseId: courseIdInt },
    });
    return NextResponse.json(
      { message: "تم الغاء تسجيل الطالب  في هذا المقرر" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting user by admin:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي في السيرفر أثناء محاولة الغاء التسجيل" },
      { status: 500 },
    );
  }
}
