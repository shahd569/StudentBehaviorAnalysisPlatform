import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // التحقق من أن المستخدم معلم
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مسموح لك بإنشاء إعلانات" },
        { status: 401 },
      );
    }

    // جلب بيانات المعلم الكاملة
    const admin = await prisma.Users.findUnique({
      where: { id: parseInt(session.user.id) },
      // where: { id: 46 },
      select: { firstName: true, lastName: true },
    });

    const adminName = admin ? `${admin.firstName} ${admin.lastName}` : "المشرف";

    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const receiver = formData.get("receiver")?.toString() || "";
    const notify = formData.get("notify") === "true";

    const file = formData.get("file");

    let fileUrl = formData.get("fileUrl")?.toString() || null;
    if (!fileUrl && file && typeof file === "object") {
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

      fileUrl = `/uploads/${fileName}`;
    }
    const newAnnouncement = await prisma.Announcement.create({
      data: {
        title,
        content,
        creatorId: parseInt(session.user.id),
        attachmentURL: fileUrl,
      },
    });

    if (notify) {
      // جلب معرفات الطلاب المستهدفين
      let targetIds = [];

      if (receiver === "الطلاب فقط") {
        const students = await prisma.Users.findMany({
          where: { role: "STUDENT" },
          select: { id: true },
        });
        targetIds = students.map((e) => e.id);
      } else if (receiver === "المدرسون فقط") {
        const teachers = await prisma.Users.findMany({
          where: { role: "TEACHER" },
          select: { id: true },
        });
        targetIds = teachers.map((e) => e.id);
      } else {
        const all = await prisma.Users.findMany({
          where: { OR: [{ role: "STUDENT" }, { role: "TEACHER" }] },
          select: { id: true },
        });
        targetIds = all.map((s) => s.id);
      }

      // إنشاء إشعارات في جدول التنبيهات لجميع الطلاب المستهدفين
      await prisma.AlertAndRecommendations.createMany({
        data: targetIds.map((id) => ({
          userId: id,
          alertType: "ANNOUNCEMENT",
          triggerReason: "NEW_CONTENT",
          content: `قام المشرف ${adminName} بنشر إعلان جديد بخصوص ${content}`,
          title: `إعلان جديد من ${adminName}: ${title}`,
          isRead: false,
          announcementId: newAnnouncement.id,
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
