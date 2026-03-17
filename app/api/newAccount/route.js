import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const hashedPassword = formData.get("hashedPassword")?.toString() || "";
    const role = formData.get("role")?.toString();

    const universityId = formData.get("universityId")?.toString() || null;
    const college = formData.get("college")?.toString() || null;
    const major = formData.get("major")?.toString() || null;
    const academicYear = formData.get("academicYear")?.toString() || null;
    const employeeId = formData.get("employeeId")?.toString() || null;

    const avatar = formData.get("avatar");

    let profilePictureUrl = null;

    if (avatar && typeof avatar === "object") {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = avatar.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName,
      );

      await writeFile(uploadPath, buffer);

      profilePictureUrl = `/uploads/${fileName}`;
    }

    const existingUserByEmail = await prisma.Users.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "الايميل موجود مسبقاً" },
        { status: 409 },
      );
    }

    if (role === "STUDENT") {
      if (!universityId) {
        return NextResponse.json(
          { message: "الرقم الجامعي مطلوب للطالب" },
          { status: 400 },
        );
      }

      const authStudent = await prisma.AuthorizedStudent.findUnique({
        where: { universityId },
      });

      if (!authStudent) {
        return NextResponse.json(
          { message: "رقمك الجامعي غير مدرج في سجلات الإدارة" },
          { status: 403 },
        );
      }

      if (authStudent.isRegistered) {
        return NextResponse.json(
          { message: "هذا الرقم الجامعي مسجل به حساب بالفعل" },
          { status: 403 },
        );
      }
    }

    if (role === "TEACHER") {
      if (!employeeId) {
        return NextResponse.json(
          { message: "الرقم الوظيفي مطلوب للمدرس" },
          { status: 400 },
        );
      }

      const authStaff = await prisma.AuthorizedStuff.findUnique({
        where: { employeeId },
      });

      if (!authStaff) {
        return NextResponse.json(
          { message: "الرقم الوظيفي غير صحيح أو غير مفعل من الإدارة" },
          { status: 403 },
        );
      }

      if (authStaff.isRegistered) {
        return NextResponse.json(
          { message: "هذا الرقم الوظيفي مسجل به حساب بالفعل" },
          { status: 403 },
        );
      }
    }

    const hashedPass = await hash(hashedPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.Users.create({
        data: {
          role,
          email,
          hashedPassword: hashedPass,
          firstName,
          lastName,
          profilePictureUrl,
          universityId,
          college,
          major,
          academicYear,
          employeeId,
        },
      });

      if (role === "STUDENT" && universityId) {
        await tx.AuthorizedStudent.update({
          where: { universityId },
          data: { isRegistered: true },
        });
      }

      if (role === "TEACHER" && employeeId) {
        await tx.AuthorizedStuff.update({
          where: { employeeId },
          data: { isRegistered: true },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", user: result },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر" },
      { status: 500 },
    );
  }
}
