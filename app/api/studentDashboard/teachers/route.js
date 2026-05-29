import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user || session.user.role !== "STUDENT") {
    //   return NextResponse.json(
    //     { message: "غير مسموح لك بالوصول لهذه البيانات" },
    //     { status: 401 },
    //   );
    // }
    // const studentId = parseInt(session.user.id);
    const studentId = 15; //

    const teachersInfo = await prisma.Users.findMany({
      where: {
        role: "TEACHER",
        taughtCourses: {
          some: {
            enrollments: {
              some: {
                studentId: studentId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePictureUrl: true,
        teacherOverview: true,
        teacherSpecialization: true,
        contactInfo: {
          select: {
            phone: true,
            contactEmail: true,
            facebook: true,
            linkedIn: true,
            twitter: true,
          },
        },
        taughtCourses: {
          where: {
            enrollments: {
              some: {
                studentId: studentId,
              },
            },
          },
          select: {
            courseName: true,
          },
        },
      },
    });

    const teachers = teachersInfo.map((t) => {
      return {
        id: t.id,
        teacherName: `${t.firstName} ${t.lastName}`,
        profilePictureUrl: t.profilePictureUrl,
        teacherOverview: t.teacherOverview,
        teacherSpecialization: t.teacherSpecialization,
        phone: t.contactInfo?.phone || null,
        contactEmail: t.contactInfo?.contactEmail || null,
        facebook: t.contactInfo?.facebook || null,
        linkedIn: t.contactInfo?.linkedIn || null,
        twitter: t.contactInfo?.twitter || null,
        courses: t.taughtCourses.map((c) => c.courseName),
      };
    });

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر" },
      { status: 500 },
    );
  }
}
