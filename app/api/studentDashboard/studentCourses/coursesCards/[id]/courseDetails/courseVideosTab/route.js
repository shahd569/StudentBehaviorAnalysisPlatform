import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    const videos = await prisma.Video.findMany({
      where: { lesson: { courseId: courseId } },
      select: {
        url: true,
      },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
