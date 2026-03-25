import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const course = formData.get("course")?.toString() || "";
    const receiver = formData.get("receiver")?.toString() || "";
    const notify = formData.get("notify") === "true";

    const file = formData.get("file");

    let attachementUrl = null;

    if (file && typeof file === "object") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName,
      );

      await writeFile(uploadPath, buffer);

      attachementUrl = `/uploads/${fileName}`;
    }
    const newAnnouncement = await prisma.Announcement.create({
      data: {
        title,
        content,
        courseId: receiver === "طلاب المادة" ? parseInt(course) : null,
        attachmentURL: attachementUrl,
      },
    });

    if (notify) {
      // جلب معرفات الطلاب المستهدفين
      let targetStudentIds = [];

      if (receiver === "طلاب المادة") {
        const enrollments = await prisma.Enrollment.findMany({
          where: { courseId: parseInt(course) },
          select: { studentId: true },
        });
        targetStudentIds = enrollments.map((e) => e.studentId);
      } else {
        const allStudents = await prisma.Users.findMany({
          where: { role: "STUDENT" },
          select: { id: true },
        });
        targetStudentIds = allStudents.map((s) => s.id);
      }

      // إنشاء إشعارات في جدول التنبيهات لجميع الطلاب المستهدفين
      await prisma.alertAndRecommendations.createMany({
        data: targetStudentIds.map((id) => ({
          studentId: id,
          alertType: "ANNOUNCEMENT",
          triggerReason: "NEW_CONTENT",
          content: `قام الأستاذ بنشر إعلان جديد بخصوص ${content}`,
          title: `إعلان جديد: ${title}`,
          isRead: false,
        })),
      });
    }

    return NextResponse.json(
      { message: " تم النشر والإخطار بنجاح", newAnnouncement },
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
