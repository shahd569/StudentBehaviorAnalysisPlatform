import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { hash } from "bcrypt";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    // التأكد من إدخال جميع الحقول
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          message: "جميع الحقول مطلوبة (الإيميل، الرمز، وكلمة المرور الجديدة)",
        },
        { status: 400 },
      );
    }

    // 1. البحث عن الرمز في جدول PasswordReset
    const resetRequest = await prisma.PasswordReset.findFirst({
      where: {
        email: email.toLowerCase(),
        otp: otp,
      },
    });

    // إذا لم يتم العثور على الرمز
    if (!resetRequest) {
      return NextResponse.json(
        { message: "رمز التحقق غير صحيح، يرجى التأكد منه" },
        { status: 400 },
      );
    }

    // 2. التحقق من صلاحية الرمز (هل انتهت الـ 15 دقيقة؟)
    const now = new Date();
    if (resetRequest.expiresAt < now) {
      // حذف الرمز المنتهي لكي لا يمتلئ الجدول بركام قديم
      await prisma.PasswordReset.delete({ where: { id: resetRequest.id } });

      return NextResponse.json(
        { message: "انتهت صلاحية هذا الرمز، يرجى طلب رمز جديد" },
        { status: 400 },
      );
    }

    // 3. تشفير كلمة المرور الجديدة

    const hashedPassword = await hash(String(newPassword), 10);

    // 4. تحديث كلمة المرور في جدول المستخدمين (Users)
    await prisma.Users.update({
      where: { email: email.toLowerCase() },
      data: {
        hashedPassword: hashedPassword,
      },
    });

    // 5. حذف الرمز من قاعدة البيانات لضمان عدم استخدامه مجدداً
    await prisma.PasswordReset.delete({
      where: { id: resetRequest.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي أثناء إعادة تعيين كلمة المرور" },
      { status: 500 },
    );
  }
}
