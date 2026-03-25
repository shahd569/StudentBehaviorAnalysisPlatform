import { Prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "غير مسموح لك بالقيام بهذا الإجراء" },
        { status: 401 },
      );
    }

    const teacherId = parseInt(session.user.id);

    //   const teacherId = 17;

    const body = await req.json();
  } catch (error) {}
}

