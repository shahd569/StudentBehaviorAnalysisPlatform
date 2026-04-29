import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { teacherId } = await params;
    const id = parseInt(teacherId);

    //  جلب كورسات المدرس
    const courses = await prisma.course.findMany({
      where: {
        instructorId: id,
      },
      select: {
        id: true,
      },
    });

    const courseIds = courses.map((c) => c.id);

    //  جلب الطلاب في هذه الكورسات
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
      },
    });

    const studentIds = enrollments.map((e) => e.studentId);

    //  جلب النشاطات لهؤلاء الطلاب
    const activities = await prisma.platformActivity.findMany({
      where: {
        session: {
          studentId: { in: studentIds },
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    //  تحليل حسب الدروس

    const lessonStats = {};

    for (let i = 1; i < activities.length; i++) {
      const prev = activities[i - 1];
      const current = activities[i];

      const lessonId = prev.lessonId;
      if (!lessonId) continue;

      if (!lessonStats[lessonId]) {
        lessonStats[lessonId] = {
          visits: 0,
          totalTime: 0,
          exits: 0,
        };
      }

      const diff = new Date(current.timestamp) - new Date(prev.timestamp);

      lessonStats[lessonId].visits++;

      lessonStats[lessonId].totalTime += diff;

      if (diff < 5000) {
        lessonStats[lessonId].exits++;
      }
    }

    //  جلب أسماء الدروس

    const lessonIds = Object.keys(lessonStats).map(Number);

    const lessons = await prisma.lesson.findMany({
      where: {
        id: { in: lessonIds },
      },
      select: {
        id: true,
        title: true,
      },
    });

    const lessonMap = {};
    lessons.forEach((l) => {
      lessonMap[l.id] = l.title;
    });

    //  توليد التوصيات

    const recommendations = [];

    Object.entries(lessonStats).forEach(([lessonId, stats]) => {
      const lessonName = lessonMap[lessonId] || `درس ${lessonId}`;

      const avgTime = stats.totalTime / stats.visits;

      //  درس صعب
      if (stats.visits > 20) {
        recommendations.push(
          `الطلاب يكررون زيارة "${lessonName}"، قد يكون صعبًا`,
        );
      }

      //  ممل
      if (avgTime < 10000) {
        recommendations.push(`الطلاب يقضون وقتًا قليلًا في "${lessonName}"`);
      }

      //  خروج سريع
      if (stats.exits > 10) {
        recommendations.push(`الطلاب يغادرون بسرعة من "${lessonName}"`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push("الوضع جيد في جميع الدروس 👏");
    }

    return Response.json({ recommendations });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}
