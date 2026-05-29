import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    }

    const { courseId } = await params;
    const id = parseInt(courseId);
    const body = await request.json();

    const {
      title,
      // description,
      sequenceNumber,
      contentType, // "VIDEO" أو "RESOURCE" أو "BOTH"
      videosArray, // مصفوفة تحتوي على الفيديوهات المرفوعة [ {url, description, duration}, ... ]
      resourceData,
    } = body;

    if (!title || sequenceNumber === undefined) {
      return NextResponse.json(
        { error: "الحقول الأساسية مطلوبة." },
        { status: 400 },
      );
    }

    const lessonData = {
      title,
      // description: description || null,
      sequenceNumber: parseInt(sequenceNumber),
      courseId: parseInt(id),
    };

    if (videosArray && videosArray.length > 0) {
      lessonData.videos = {
        create: videosArray.map((video) => ({
          url: video.url,
          description: video.description || null,
          duration: parseInt(video.duration || 0),
        })),
      };
    }

    if (resourceData && resourceData.fileUrl) {
      lessonData.resources = {
        create: {
          title: resourceData.title || "ملف الدرس",
          fileUrl: resourceData.fileUrl,
        },
      };
    }

    const newLesson = await prisma.lesson.create({
      data: lessonData,
      include: {
        videos: true,
        resources: true,
      },
    });

    return NextResponse.json(
      { message: "تم إنشاء الدرس بنجاح", lesson: newLesson },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر." }, { status: 500 });
  }
}
