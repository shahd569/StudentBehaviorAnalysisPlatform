import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بالدخول لهذه الواجهة" },
        { status: 401 },
      );
    }

    const users = await prisma.Users.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        registrationDate: true,
        role: true,
      },
      orderBy: {
        registrationDate: "desc",
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ في الخادم أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
