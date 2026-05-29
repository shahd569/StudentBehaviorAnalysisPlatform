import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    // }

    const { id } = await params;
    const courseId = parseInt(id);

    let fileContent = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return NextResponse.json(
          { error: "لم يتم رفع أي ملف." },
          { status: 400 },
        );
      }

      if (typeof file.arrayBuffer === "function") {
        //  قراءة محتوى الملف وتحويله إلى نصوص
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fileContent = buffer.toString("utf-8");
      } else {
        fileContent = file.toString();
      }
    } else {
      fileContent = await request.text();
    }

    if (!fileContent || fileContent.trim().length === 0) {
      return NextResponse.json(
        { error: "الملف فارغ أو لم يتم إرسال بيانات." },
        { status: 400 },
      );
    }

    //  استخراج الأرقام الجامعية من الأسطر وتنظيفها
    // تقسيم النص بناءً على السطور وتجنب السطر الأول إذا كان يحتوي على اسم العمود
    const lines = fileContent.split(/\r?\n/);
    const universityIds = lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.includes("universityId")); // تصفية الأسطر الفارغة والعناوين

    if (universityIds.length === 0) {
      return NextResponse.json(
        { error: "الملف فارغ أو لا يحتوي على أرقام جامعية صحيحة." },
        { status: 400 },
      );
    }

    //  جلب الـ IDs الحقيقية للطلاب من قاعدة البيانات بناءً على أرقامهم الجامعية المرفوعة
    const students = await prisma.Users.findMany({
      where: {
        universityId: { in: universityIds },
        role: "STUDENT",
      },
      select: { id: true, universityId: true },
    });

    if (students.length === 0) {
      return NextResponse.json(
        {
          error:
            "لم يتم العثور على أي طالب في قاعدة البيانات يطابق الأرقام المرفوعة.",
        },
        { status: 404 },
      );
    }

    //  جلب الطلاب المسجلين مسبقاً في هذا المقرر لمنع التكرار وأخطاء قاعدة البيانات
    const existingEnrollments = await prisma.Enrollment.findMany({
      where: {
        courseId: courseId,
        studentId: { in: students.map((s) => s.id) },
      },
      select: { studentId: true },
    });

    const existingStudentIds = new Set(
      existingEnrollments.map((e) => e.studentId),
    );

    //  تصفية الطلاب الجدد غير المسجلين بعد
    const newEnrollmentsData = students
      .filter((student) => !existingStudentIds.has(student.id))
      .map((student) => ({
        studentId: student.id,
        courseId: courseId,
      }));

    if (newEnrollmentsData.length === 0) {
      return NextResponse.json(
        { message: "جميع الطلاب في الملف مسجلون بالفعل في هذا المقرر." },
        { status: 200 },
      );
    }

    const createdEnrollments = await prisma.Enrollment.createMany({
      data: newEnrollmentsData,
      skipDuplicates: true, // حماية إضافية لمنع أخطاء التكرار
    });

    return NextResponse.json(
      {
        message: `تم تسجيل الطلاب بنجاح.`,
        statistics: {
          totalInFile: universityIds.length,
          foundInSystem: students.length,
          newlyEnrolled: createdEnrollments.count,
          alreadyEnrolled: existingStudentIds.size,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in bulk enrollment:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم أثناء معالجة الملف." },
      { status: 500 },
    );
  }
}
