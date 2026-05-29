import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بالقيام بهذا الإجراء" },
        { status: 401 },
      );
    }
    const { id } = await params;
    const userId = parseInt(id);

    if (!userId) {
      return NextResponse.json(
        { message: "معرف المستخدم غير صحيح أو غير موجود" },
        { status: 400 },
      );
    }

    if (userId === parseInt(session.user.id)) {
      return NextResponse.json(
        { message: "لا يمكنك حذف حسابك الشخصي الذي تسجل الدخول منه!" },
        { status: 400 },
      );
    }
    const userExists = await prisma.Users.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "المستخدم غير موجود بالفعل" },
        { status: 404 },
      );
    }
    await prisma.Users.delete({
      where: { id: userId },
    });
    return NextResponse.json(
      { message: "تم حذف حساب المستخدم وكل متعلقاته بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting user by admin:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي في السيرفر أثناء محاولة الحذف" },
      { status: 500 },
    );
  }
}
