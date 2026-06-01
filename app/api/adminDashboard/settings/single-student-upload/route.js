import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, universityId } = body;

    const existingStudent = await prisma.AuthorizedStudent.findUnique({
      where: {
        universityId: universityId,
      },
    });
    if (existingStudent) {
      return NextResponse.json(
        {
          message: "هذا الرقم الجامعي مضاف ومصرح له مسبقاً في النظام",
        },
        { status: "400" },
      );
    }
    const newStudent = await prisma.AuthorizedStudent.create({
      data: {
        firstName,
        lastName,
        universityId,
      },
    });
    return NextResponse.json(
      { message: "تم إضافة الطالب المصرح له بنجاح", student: newStudent },
      { status: 201 },
    );
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر" },
      { status: 500 },
    );
  }
}
