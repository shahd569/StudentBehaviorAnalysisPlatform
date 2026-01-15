import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import z from "zod";

const userSchema = z.object({
  firstName: z.string().min(1, "first name is required").max(100),
  lastName: z.string().min(1, "last name is required").max(100),
  email: z.string().min(1, "email is required").email("Invalid Email"),
  hashedPassword: z
    .string()
    .min(1, "password is required")
    .min(8, "password  must have than 8 characters"),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
  universityId: z.string().optional(),
  college: z.string().optional(),
  major: z.string().optional(),
  academicYear: z.string().optional(),
  profilePictureUrl: z.string().optional(),
  employeeId: z.string().optional(),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      role,
      email,
      hashedPassword,
      firstName,
      lastName,
      profilePictureUrl,
      universityId,
      college,
      major,
      academicYear,
      employeeId,
    } = userSchema.parse(body);

    const existingUserByEmail = await prisma.Users.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { users: null, message: "الايميل موجود مسبقاً" },
        { status: 409 }
      );
    }

    if (role == "STUDENT") {
      if (!universityId)
        return NextResponse.json(
          { message: "الرقم الجامعي مطلوب للطالب" },
          { status: 400 }
        );
      const authStudent = await prisma.AuthorizedStudent.findUnique({
        where: { universityId: universityId },
      });
      if (!authStudent) {
        return NextResponse.json(
          { message: "رقمك الجامعي غير مدرج في سجلات الإدارة" },
          { status: 403 }
        );
      }
      if (authStudent.isRegistered) {
        return NextResponse.json(
          { message: "هذا الرقم الجامعي مسجل به حساب بالفعل" },
          { status: 403 }
        );
      }
    } else if (role == "TEACHER") {
      if (!employeeId)
        return NextResponse.json(
          { message: "الرقم الوظيفي مطلوب للمدرس" },
          { status: 400 }
        );
      const authStaff = await prisma.AuthorizedStuff.findUnique({
        where: { employeeId: employeeId },
      });
      if (!authStaff) {
        return NextResponse.json(
          { message: "الرقم الوظيفي غير صحيح أو غير مفعل من الإدارة" },
          { status: 403 }
        );
      }
      if (authStaff.isRegistered) {
        return NextResponse.json(
          { message: "هذا الرقم الوظيفي مسجل به حساب بالفعل" },
          { status: 403 }
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

      if (role == "STUDENT" && universityId) {
        await tx.AuthorizedStudent.update({
          where: { universityId: universityId },
          data: { isRegistered: true },
        });
      } else if (role == "TEACHER" && employeeId) {
        await tx.AuthorizedStuff.update({
          where: { employeeId: employeeId },
          data: { isRegistered: true },
        });
      }
      return newUser;
    });

    return NextResponse.json(
      {
        Users: result,
        message: "تم إنشاء الحساب بنجاح",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر" },
      { status: 500 }
    );
  }
}
