import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    const lectures = await prisma.Lesson.findMany({
      where: { courseId: courseId },
      orderBy: { sequenceNumber: "asc" },
      include: {
        resources: {
          select: {
            fileUrl: true,
          },
        },
        quiz: true,
        videos: true,
        assignments: true,
      },
    });
    const lessonInfo = lectures.map((lecture) => {
      return {
        lessonTitle: lecture.title,
        lessonSequenceNumber: lecture.sequenceNumber,
        lessonFileUrl:
          lecture.resources.length > 0 ? lecture.resources[0].fileUrl : null,
        lessonVideos: lecture.videos.map((video) => ({
          videoUrl: video.url,
          videoDescription: video.description,
          videoDuration: video.duration,
        })),
      };
    });
    return NextResponse.json(lessonInfo);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
