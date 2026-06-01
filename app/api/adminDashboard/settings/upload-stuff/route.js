import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
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
      if (!file)
        return NextResponse.json(
          { error: "لم يتم العثور على الملف" },
          { status: 400 },
        );

      if (typeof file.arrayBuffer === "function") {
        const bytes = await file.arrayBuffer();
        fileContent = Buffer.from(bytes).toString("utf-8");
      } else {
        fileContent = file.toString();
      }
    } else {
      fileContent = await request.text();
    }

    if (!fileContent || fileContent.trim().length === 0) {
      return NextResponse.json({ error: "الملف فارغ." }, { status: 400 });
    }

    const lines = fileContent.split(/\r?\n/);
    const staffToAuthorize = [];
    const uploadedEmployeeIds = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [
        employeeId,
        firstName,
        lastName,
        teacherOverview,
        teacherSpecialization,
      ] = line.split(",");

      if (employeeId && firstName && lastName) {
        staffToAuthorize.push({
          employeeId: employeeId.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          teacherOverview: teacherOverview.trim(),
          teacherSpecialization: teacherSpecialization.trim(),
          isRegistered: false,
        });
        uploadedEmployeeIds.push(employeeId.trim());
      }
    }

    if (staffToAuthorize.length === 0) {
      return NextResponse.json(
        {
          error:
            "لم يتم العثور على بيانات كادر صحيحة بالصيغة: employeeId,firstName,lastName",
        },
        { status: 400 },
      );
    }

    const existingAuthorized = await prisma.AuthorizedStuff.findMany({
      where: { employeeId: { in: uploadedEmployeeIds } },
      select: { employeeId: true },
    });

    const existingIdsSet = new Set(existingAuthorized.map((s) => s.employeeId));
    const newStaffData = staffToAuthorize.filter(
      (s) => !existingIdsSet.has(s.employeeId),
    );

    if (newStaffData.length === 0) {
      return NextResponse.json(
        { message: "جميع الموظفين في الملف مضافون مسبقاً في النظام." },
        { status: 200 },
      );
    }

    const result = await prisma.AuthorizedStuff.createMany({
      data: newStaffData,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        message: "تم رفع قائمة الكادر المصرح له بنجاح.",
        statistics: {
          totalInFile: staffToAuthorize.length,
          newlyAdded: result.count,
          alreadyExists: existingIdsSet.size,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading authorized staff:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم." },
      { status: 500 },
    );
  }
}
