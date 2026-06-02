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

    let fileContent = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return NextResponse.json(
          { error: "لم يتم رفع أي ملف." },
          { status: 402 },
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
    const studentsToAuthorize = [];
    const uploadedUniversityIds = [];

    // تخطي السطر الأول (العناوين) ومعالجة بقية الأسطر
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.includes(";") ? line.split(";") : line.split(",");

      if (columns.length >= 3) {
        const universityId = columns[0].trim();
        const firstName = columns[1].trim();
        const lastName = columns[2].trim();

        if (universityId && firstName && lastName) {
          studentsToAuthorize.push({
            universityId: universityId.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            isRegistered: false, // القيمة الافتراضية حتى يسجل الطالب بنفسه لاحقاً
          });
          uploadedUniversityIds.push(universityId.trim());
        }
      }
    }
    if (studentsToAuthorize.length === 0) {
      return NextResponse.json(
        {
          error:
            "لم يتم العثور على بيانات طلاب صحيحة بالصيغة: universityId,firstName,lastName",
        },
        { status: 400 },
      );
    }

    // 4. منع التكرار: جلب الأرقام الجامعية الموجودة مسبقاً في جدول الصلاحيات
    const existingAuthorized = await prisma.AuthorizedStudent.findMany({
      where: { universityId: { in: uploadedUniversityIds } },
      select: { universityId: true },
    });

    const existingIdsSet = new Set(
      existingAuthorized.map((s) => s.universityId),
    );

    // تصفية الطلاب الجدد فقط غير الموجودين مسبقاً
    const newStudentsData = studentsToAuthorize.filter(
      (s) => !existingIdsSet.has(s.universityId),
    );

    if (newStudentsData.length === 0) {
      return NextResponse.json(
        {
          message: "جميع الطلاب في الملف مضافون مسبقاً في النظام.",
          statistics: {
            totalInFile: studentsToAuthorize.length,
            // newlyAdded: result.count,
            alreadyExists: existingIdsSet.size,
          },
        },
        { status: 200 },
      );
    }

    // 5. الإدخال الجماعي لجدول الصلاحيات لقاعدة البيانات
    const result = await prisma.AuthorizedStudent.createMany({
      data: newStudentsData,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        message: "تم رفع قائمة الطلاب المصرح لهم بنجاح.",
        statistics: {
          totalInFile: studentsToAuthorize.length,
          newlyAdded: result.count,
          alreadyExists: existingIdsSet.size,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading authorized students:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم." },
      { status: 500 },
    );
  }
}
