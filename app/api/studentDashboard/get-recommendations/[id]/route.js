import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);
    //  جلب كل الأنشطة الخاصة بالطالب
    const activities = await prisma.platformActivity.findMany({
      where: {
        session: {
          studentId: studentId,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    if (!activities.length) {
      return Response.json({
        recommendations: ["لا يوجد نشاط حتى الآن"],
      });
    }

    //  تحليل البيانات

    let inactivityDetected = false;
    let fastExitDetected = false;

    //  تحليل الفروقات الزمنية
    for (let i = 1; i < activities.length; i++) {
      const prev = activities[i - 1];
      const current = activities[i];

      const diff =
        new Date(current.timestamp).getTime() -
        new Date(prev.timestamp).getTime();

      // خمول (أكثر من 10 دقائق)
      if (diff > 10 * 60 * 1000) {
        inactivityDetected = true;
      }

      // خروج سريع (أقل من 5 ثواني)
      if (diff < 5000) {
        fastExitDetected = true;
      }
    }

    //  حساب تكرار الصفحات
    const pageVisits = {};

    activities.forEach((a) => {
      pageVisits[a.pageUrl] = (pageVisits[a.pageUrl] || 0) + 1;
    });

    const repeatedPages = Object.values(pageVisits).some((count) => count >= 3);

    //  توليد التوصيات

    const recommendations = [];

    if (inactivityDetected) {
      recommendations.push("يبدو أنك تتوقف لفترات طويلة، حاول التركيز أكثر");
    }

    if (fastExitDetected) {
      recommendations.push("تغادر الصفحات بسرعة، حاول قراءة المحتوى بتركيز");
    }

    if (repeatedPages) {
      recommendations.push(
        "قمت بزيارة نفس الدرس عدة مرات، ننصحك بمراجعته جيدًا",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("أداءك جيد 👏 استمر!");
    }

    return Response.json({ recommendations });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
