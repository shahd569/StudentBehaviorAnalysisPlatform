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
    const { id } = await params;
    const courseId = parseInt(id);

    if (!courseId) {
      return NextResponse.json(
        { message: "معرف المقرر غير صحيح أو غير موجود" },
        { status: 400 },
      );
    }

    const courseExists = await prisma.Course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      return NextResponse.json(
        { message: "المقرر غير موجود بالفعل" },
        { status: 404 },
      );
    }
    await prisma.Course.delete({
      where: { id: courseId },
    });
    return NextResponse.json(
      { message: "تم حذف المقرر وكل متعلقاته بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting course by admin:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي في السيرفر أثناء محاولة الحذف" },
      { status: 500 },
    );
  }
}
