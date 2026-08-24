import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // تأكدي من مسار استيراد prisma في مشروعك

export async function GET(request, { params }) {
  try {
    const { courseId } = await params;
    const id = parseInt(courseId);
    // const courseId = parseInt(params.courseId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "معرّف المادة غير صالحة" },
        { status: 400 },
      );
    }

    // جلب جميع الدروس التابعة للمادة مرتبة حسب الترتيب (sequenceNumber)
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: id,
      },
      select: {
        id: true,
        title: true,
        sequenceNumber: true,
      },
      orderBy: {
        sequenceNumber: "asc",
      },
    });

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error("خطأ أثناء جلب الدروس:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم أثناء جلب الدروس" },
      { status: 500 },
    );
  }
}
