import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بالقيام بهذا الإجراء" },
        { status: 401 },
      );
    }

    const coursesInfo = await prisma.Course.findMany({
      select: {
        id: true,
        courseName: true,
        description: true,
        academicYear: true,
        semester: true,
        coursePictureUrl: true,
        status: true,
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ coursesInfo });
  } catch (error) {
    console.error(error);
  }
}
