import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function PATCH(req) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { message: "غير مصرح لك بالوصول" },
    //     { status: 401 },
    //   );
    // }
    // const userId = parseInt(session.user.id);
    const userId = 33;

    const { currentPassword, newPassword } = await req.json();

    //  جلب المستخدم من القاعدة للحصول على كلمة المرور المشفرة الحالية
    const user = await prisma.Users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 },
      );
    }

    //  التحقق من أن كلمة المرور الحالية صحيحة
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "كلمة المرور الحالية غير صحيحة" },
        { status: 400 },
      );
    }

    //  تشفير كلمة المرور الجديدة قبل حفظها
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // تحديث كلمة المرور في قاعدة البيانات
    await prisma.users.update({
      where: { id: userId },
      data: {
        hashedPassword: hashedNewPassword,
      },
    });

    return NextResponse.json(
      { message: "تم تغيير كلمة المرور بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تغيير كلمة المرور" },
      { status: 500 },
    );
  }
}
