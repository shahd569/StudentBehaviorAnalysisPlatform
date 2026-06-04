import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { message: "غير مصرح لك بالقيام بهذا الإجراء" },
    //     { status: 401 },
    //   );
    // }

    const lastRegisteredUsers = await prisma.Users.findMany({
      orderBy: { registrationDate: "desc" },
      take: 4,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    return NextResponse.json({ lastRegisteredUsers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
