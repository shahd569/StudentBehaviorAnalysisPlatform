import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    }
    const formData = await req.formData();

    const courseName = formData.get("courseName")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const academicYear = formData.get("academicYear")
      ? Number(formData.get("academicYear"))
      : undefined;
    const semester = formData.get("semester")?.toString() || "";
    const coursePicture = formData.get("avatar") || "";
    // const status = formData.get("status")?.toString() || "";
    const instructorId = formData.get("instructorId")
      ? Number(formData.get("instructorId"))
      : undefined;

    let coursePictureUrl = formData.get("coursePictureUrl")?.toString() || null;
    if (
      !coursePictureUrl &&
      coursePicture &&
      typeof coursePicture === "object"
    ) {
      const bytes = await coursePicture.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = coursePicture.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName,
      );

      await writeFile(uploadPath, buffer);
      coursePictureUrl = `/uploads/${fileName}`; // حفظ المسار المحلي في قاعدة البيانات
    }

    const newCourse = await prisma.Course.create({
      data: {
        courseName,
        description,
        academicYear,
        semester,
        coursePictureUrl,
        // status,
        instructorId,
      },
    });
    return NextResponse.json(
      { message: " تم إنشاءالمقرر بنجاح." },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المقرر." },
      { status: 500 },
    );
  }
}
