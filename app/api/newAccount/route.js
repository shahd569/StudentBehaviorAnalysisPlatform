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
  role: z.string().optional(),
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

    const existingUserByEmail = await prisma.users.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { users: null, message: "الايميل موجود مسبقاً" },
        { status: 409 }
      );
    }

    const existingUserByUniversityId = await prisma.Users.findUnique({
      where: { universityId: universityId },
    });

    if (existingUserByUniversityId) {
      return NextResponse.json(
        { users: null, message: "الرقم الجامعي موجود مسبقاً" },
        { status: 409 }
      );
    }

    const hashedPass = await hash(hashedPassword, 10);
    const newUser = await prisma.users.create({
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
    return NextResponse.json(
      {
        users: newUser,
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
