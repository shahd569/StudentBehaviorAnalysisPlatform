import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك للقيام بهذا الإجراء." },
        { status: 401 },
      );
    }

    let fileContent = "";

    // 1. التحقق من وجود الملف واستخراج محتواه النصي
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return NextResponse.json(
          { message: "لم يتم رفع أي ملف." },
          { status: 400 },
        );
      }

      if (typeof file.arrayBuffer === "function") {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fileContent = buffer.toString("utf-8");
      } else {
        fileContent = file.toString();
      }
    } else {
      fileContent = await request.text();
    }

    if (!fileContent.trim()) {
      return NextResponse.json(
        { message: "ملف CSV فارغ أو غير صالح." },
        { status: 400 },
      );
    }

    const lines = fileContent.split(/\r?\n/).map((line) => line.trim());

    const studentUniversityIds = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue; // تخطي الأسطر الفارغة

      // تقسيم السطر بناءً على الفاصلة (في حال كان هناك حقول أخرى كالاسم)
      const columns = line.split(",").map((col) => col.trim());
      const universityId = columns[0]; // نفترض أن الرقم الجامعي هو العمود الأول

      if (universityId && !isNaN(universityId)) {
        studentUniversityIds.push(universityId.toString());
      }
    }

    if (studentUniversityIds.length === 0) {
      return NextResponse.json(
        { message: "لم يتم العثور على أرقام جامعية صالحة في ملف CSV." },
        { status: 400 },
      );
    }

    const students = await prisma.Users.findMany({
      where: {
        universityId: { in: studentUniversityIds },
      },
      select: {
        id: true,
      },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { message: "لم يتم العثور على أي من هؤلاء الطلاب في النظام." },
        { status: 404 },
      );
    }

    // استخراج مصفوفة تحتوي على الـ IDs الرقمية فقط للطلاب
    const studentIdsArray = students.map((s) => s.id);

    // 4. تنفيذ عملية الحذف الجماعي لإلغاء تسجيلهم من كااااافة المواد دفعة واحدة
    const deleteResult = await prisma.Enrollment.deleteMany({
      where: {
        studentId: { in: studentIdsArray },
      },
    });

    return NextResponse.json(
      {
        message: `تم إلغاء تسجيل الطلاب بنجاح من كافة المقررات الدراسية.`,
        statistics: {
          totalInFile: studentUniversityIds.length,
          foundInSystem: students.length,
          deletedEnrollmentsCount: deleteResult.count,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in mass unenrollment:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي في السيرفر أثناء إلغاء التسجيل الجماعي." },
      { status: 500 },
    );
  }
}
