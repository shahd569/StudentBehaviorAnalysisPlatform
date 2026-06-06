import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MONTH_NAMES = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const ACADEMIC_YEAR_MAP = new Map([
  ["1", "السنة الأولى"],
  ["2", "السنة الثانية"],
  ["3", "السنة الثالثة"],
  ["4", "السنة الرابعة"],
  ["5", "السنة الخامسة"],
  ["الأولى", "السنة الأولى"],
  ["الثانية", "السنة الثانية"],
  ["الثالثة", "السنة الثالثة"],
  ["الرابعة", "السنة الرابعة"],
  ["الخامسة", "السنة الخامسة"],
]);

function normalizeAcademicYear(value) {
  if (!value) return null;
  const formatted = String(value).trim().toLowerCase();
  if (ACADEMIC_YEAR_MAP.has(formatted)) return ACADEMIC_YEAR_MAP.get(formatted);
  if (/^1/.test(formatted)) return "السنة الأولى";
  if (/^2/.test(formatted)) return "السنة الثانية";
  if (/^3/.test(formatted)) return "السنة الثالثة";
  if (/^4/.test(formatted)) return "السنة الرابعة";
  if (/^5/.test(formatted)) return "السنة الخامسة";
  return null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بالقيام بهذا الإجراء" },
        { status: 401 },
      );
    }

    const now = new Date();
    const monthlyCounts = [];

    for (let i = 11; i >= 0; i -= 1) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyCounts.push({
        month: `${MONTH_NAMES[targetDate.getMonth()]} ${targetDate.getFullYear()}`,
        year: targetDate.getFullYear(),
        monthIndex: targetDate.getMonth(),
        count: 0,
      });
    }

    const earliestMonth = monthlyCounts[0];
    const earliestDate = new Date(
      earliestMonth.year,
      earliestMonth.monthIndex,
      1,
    );

    const users = await prisma.Users.findMany({
      where: {
        registrationDate: {
          gte: earliestDate,
        },
        role: {
          in: ["STUDENT", "TEACHER"],
        },
      },
      select: {
        registrationDate: true,
        role: true,
      },
    });

    const countsMap = new Map();

    users.forEach((user) => {
      const registeredAt = new Date(user.registrationDate);
      const key = `${registeredAt.getFullYear()}-${registeredAt.getMonth()}`;
      const current = countsMap.get(key) ?? { students: 0, teachers: 0 };

      if (user.role === "STUDENT") {
        current.students += 1;
      } else if (user.role === "TEACHER") {
        current.teachers += 1;
      }

      countsMap.set(key, current);
    });

    const formattedCounts = monthlyCounts.map((item) => {
      const key = `${item.year}-${item.monthIndex}`;
      const counts = countsMap.get(key) ?? { students: 0, teachers: 0 };
      return {
        month: item.month,
        studentsCount: counts.students,
        teachersCount: counts.teachers,
      };
    });

    const topCourses = await prisma.Course.findMany({
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      take: 7,
      select: {
        id: true,
        courseName: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    const topCoursesData = topCourses.map((course) => ({
      courseId: course.id,
      courseName: course.courseName,
      studentsCount: course._count.enrollments,
    }));

    const academicYears = [
      "السنة الأولى",
      "السنة الثانية",
      "السنة الثالثة",
      "السنة الرابعة",
      "السنة الخامسة",
    ];

    const academicYearCounts = {
      "السنة الأولى": 0,
      "السنة الثانية": 0,
      "السنة الثالثة": 0,
      "السنة الرابعة": 0,
      "السنة الخامسة": 0,
    };

    const academicYearGroups = await prisma.Users.groupBy({
      by: ["academicYear"],
      where: {
        academicYear: {
          not: null,
        },
      },
      _count: {
        _all: true,
      },
    });

    academicYearGroups.forEach((group) => {
      const normalizedYear = normalizeAcademicYear(group.academicYear);
      if (normalizedYear && academicYearCounts[normalizedYear] !== undefined) {
        academicYearCounts[normalizedYear] += group._count._all;
      }
    });

    const academicYearDistribution = academicYears.map((year) => ({
      academicYear: year,
      studentsCount: academicYearCounts[year],
    }));

    return NextResponse.json(
      {
        monthlyCounts: formattedCounts,
        topCourses: topCoursesData,
        academicYearDistribution,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
