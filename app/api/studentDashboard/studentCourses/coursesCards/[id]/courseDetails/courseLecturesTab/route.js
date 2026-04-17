import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    const lectures = await prisma.Lesson.findMany({
      where: { courseId: courseId },
      select: {
        title: true,
      },
    });
    return NextResponse.json(lectures);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
