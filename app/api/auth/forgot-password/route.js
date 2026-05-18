import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "الإيميل مطلوب" }, { status: 400 });
    }

    //  التحقق من وجود المستخدم في قاعدة البيانات
    const user = await prisma.Users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "هذا الحساب غير مسجل لدينا" },
        { status: 404 },
      );
    }

    //  توليد رمز رقمي عشوائي من 4 أرقام
    // توليد رقم عشوائي بين 1000 و 9999
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    //  تحديد وقت انتهاء الصلاحية (بعد 15 دقيقة من الآن)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    //  حفظ الرمز في جدول PasswordReset (create ثم delete لعدم تراكم الرموز القديمة لنفس الإيميل استخدام )
    await prisma.PasswordReset.deleteMany({
      where: { email: email.toLowerCase() },
    });

    await prisma.PasswordReset.create({
      data: {
        email: email.toLowerCase(),
        otp: otp,
        expiresAt: expiresAt,
      },
    });

    // (Nodemailer) إعداد خدمة إرسال الإيميل
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"منصة التعلم الإلكتروني" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: "رمز إعادة تعيين كلمة المرور",
      html: `
        <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #7A41DC;">مرحباً ${user.firstName}،</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
          <p>رمز التحقق الخاص بك هو:</p>
          <div style="background: #f3f3f3; padding: 10px 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; display: inline-block; border-radius: 5px; color: #7A41DC;">
            ${otp}
          </div>
          <p style="color: #6e6e6e; font-size: 12px; margin-top: 20px;">هذا الرمز صالح لمدة 15 دقيقة فقط.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "تم إرسال رمز التحقق إلى إيميلك بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي أثناء إرسال الإيميل" },
      { status: 500 },
    );
  }
}
