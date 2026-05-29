import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import path from "path";
import { writeFile } from "fs/promises";
import crypto from "crypto";

// جلب البيانات والإحصائيات

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "غير مصرح لك بالوصول" },
      { status: 401 },
    );
  }

  const userId = parseInt(session.user.id);
  // const userId = 17;

  try {
    // جلب معلومات المدرس الأساسية والتواصل
    const userInfo = await prisma.Users.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        profilePictureUrl: true,
        employeeId: true,
        universityId: true,
        college: true,
        major: true,
        academicYear: true,
        contactInfo: {
          select: {
            phone: true,
            contactEmail: true,
            facebook: true,
            linkedIn: true,
            twitter: true,
          },
        },
      },
    });

    // جلب المقررات والدروس
    const taughtCourses = await prisma.Course.findMany({
      where: { instructorId: userId },
      select: {
        id: true,
        _count: {
          select: { lessons: true },
        },
      },
    });

    const studentsCount = await prisma.Enrollment.count({
      where: {
        course: { instructorId: userId },
      },
    });

    const taughtCoursesCount = taughtCourses.length;
    const lessonsCount = taughtCourses.reduce(
      (total, course) => total + course._count.lessons,
      0,
    );

    return NextResponse.json(
      {
        ...userInfo,
        taughtCoursesCount,
        studentsCount,
        lessonsCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Profile Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}

//  تحديث البيانات

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id);
    // const userId = 17;
    const formData = await req.formData();

    const firstName = formData.get("firstName")?.toString() || undefined;
    const lastName = formData.get("lastName")?.toString() || undefined;
    const email = formData.get("email")?.toString() || undefined;

    // معلومات التواصل
    const phone = formData.get("phone")?.toString() || undefined;
    const contactEmail = formData.get("contactEmail")?.toString() || undefined;
    const facebook = formData.get("facebook")?.toString() || undefined;
    const linkedIn = formData.get("linkedIn")?.toString() || undefined;
    const twitter = formData.get("twitter")?.toString() || undefined;

    const avatar = formData.get("avatar");
    let profilePictureUrl =
      formData.get("profilePictureUrl")?.toString() || undefined;

    if (avatar && typeof avatar === "object" && avatar.name) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = avatar.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName,
      );
      await writeFile(uploadPath, buffer);
      profilePictureUrl = `/uploads/${fileName}`;
    }

    // تحديث بيانات المستخدم
    const updatedUser = await prisma.Users.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        profilePictureUrl,
      },
    });

    //  تحديث أو إنشاء معلومات التواصل
    const updatedContact = await prisma.ContactInfo.upsert({
      where: { userId: userId },
      update: {
        phone,
        contactEmail,
        facebook,
        linkedIn,
        twitter,
      },
      create: {
        userId: userId,
        phone: phone || "",
        contactEmail: contactEmail || "",
        facebook: facebook || "",
        linkedIn: linkedIn || "",
        twitter: twitter || "",
      },
    });

    // حذف كلمة المرور من الكائن الراجع لزيادة الأمان
    const { hashedPassword, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      {
        message: "تم تحديث البيانات بنجاح",
        user: userWithoutPassword,
        contactInfo: updatedContact,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث البيانات" },
      { status: 500 },
    );
  }
}
