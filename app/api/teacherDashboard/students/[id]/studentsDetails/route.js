import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);

    const [
      studentData,
      recentAssignment,
      recentQuizzes,
      performanceInfo,
      recentAttempts,
    ] = await Promise.all([
      prisma.Users.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePictureUrl: true,
          universityId: true,
          college: true,
          major: true,
          academicYear: true,
          // جلب كل الجلسات لحساب "عدد مرات الدخول" و وقت الجلسة
          sessions: {
            orderBy: { startTime: "desc" },
          },
          // جلب التفاعلات مع المحتوى لملء الجدول
          interactions: {
            include: {
              video: {
                include: {
                  lesson: {
                    include: { course: { select: { courseName: true } } },
                  },
                },
              },
            },
            orderBy: { timestamp: "desc" },
          },
        },
      }),
      prisma.AssignmentSubmission.findMany({
        take: 5,
        orderBy: { submittedAt: "desc" },
        where: {
          studentId: studentId,
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
          assignment: { select: { title: true } },
        },
      }),

      prisma.QuizAttempt.findMany({
        take: 5,
        orderBy: { finishTime: "desc" },
        where: {
          studentId: studentId,
          finishTime: { not: null },
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
          quiz: { select: { title: true } },
        },
      }),
      prisma.studentPerformanceView.findUnique({
        where: { studentId: studentId },
      }),
      prisma.QuizAttempt.findMany({
        where: { studentId: studentId },
        orderBy: { startTime: "desc" },
        take: 2,
      }),
    ]);

    if (!studentData) {
      return NextResponse.json(
        { message: "الطالب غير موجود" },
        { status: 404 },
      );
    }

    const combinedActivity = [
      ...recentAssignment.map((item) => ({
        id: `assign-${item.id}`,
        type: "assignment",
        action: `   سلم واجب  :  ${item.assignment.title}`,
        time: item.submittedAt,
      })),
      ...recentQuizzes.map((item) => ({
        id: `quiz-${item.id}`,
        type: "quiz",
        action: ` انهى اختبار  :  ${item.quiz.title}`,
        time: item.finishTime,
        grade: item.score,
      })),
    ];

    const finalFeed = combinedActivity
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    // حساب عدد مرات تسجيل الدخول
    const loginCount = studentData.sessions.length;

    // حساب متوسط وقت الجلسة (بالدقائق)
    let totalMinutes = 0;
    let sessionsWithEnd = 0;

    studentData.sessions.forEach((session) => {
      if (session.endTime && session.startTime) {
        const diffInMs =
          new Date(session.endTime) - new Date(session.startTime);
        totalMinutes += diffInMs / (1000 * 60); // تحويل من ميلي ثانية لدقائق
        sessionsWithEnd++;
      }
    });
    const avgSessionTime =
      sessionsWithEnd > 0 ? Math.round(totalMinutes / sessionsWithEnd) : 0;

    // حساب عدد الأيام النشطة (تواريخ فريدة)
    const activeDaysSet = new Set(
      studentData.sessions.map((s) => new Date(s.startTime).toDateString()),
    );
    const activeDaysCount = activeDaysSet.size;

    //  تحديد مستوى النشاط
    const recentSessionsCount = studentData.sessions.filter(
      (s) => new Date(s.startTime) >= dateLimit,
    ).length;
    let activityStatus = "غير نشط";
    if (recentSessionsCount >= 3) activityStatus = "نشط";
    else if (recentSessionsCount >= 1) activityStatus = "منخفض";

    // تجميع التفاعلات حسب المادة
    const courseStats = {};
    studentData.interactions.forEach((inter) => {
      const courseName =
        inter.video?.lesson?.course?.courseName || "مادة عامة/غير محددة";
      if (!courseStats[courseName]) {
        courseStats[courseName] = {
          courseName: courseName,
          accessCount: 0,
          totalSecondsWatched: 0,
          lastActive: inter.timestamp,
        };
      }
      courseStats[courseName].accessCount++;

      // حساب الوقت المستغرق
      if (
        inter.currentTimeSeconds > courseStats[courseName].totalSecondsWatched
      ) {
        // : نعتبر أن أقصى ثانية وصل لها هي مجموع ما شاهده
        courseStats[courseName].totalSecondsWatched = inter.currentTimeSeconds;
      }

      // تحديث آخر نشاط إذا كان هذا التفاعل أحدث
      if (
        new Date(inter.timestamp) > new Date(courseStats[courseName].lastActive)
      ) {
        courseStats[courseName].lastActive = inter.timestamp;
      }
    });

    // تحويل الكائن إلى مصفوفة وتنسيق الوقت
    const formattedInteractions = Object.values(courseStats).map((stat) => ({
      course: stat.courseName,
      accessCount: stat.accessCount,
      totalTime: Math.round(stat.totalSecondsWatched / 60) + " دقيقة",
      lastActive: new Date(stat.lastActive),
    }));

    //  مصفوفة الأيام بالترتيب
    const daysOrder = [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];

    //  كائن أولي يحتوي على الأيام وقيمة صفر لكل يوم
    const dailyActivity = {
      Saturday: 0,
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    };

    //  حساب عدد الأنشطة لكل يوم
    //المرور على الجلسات
    studentData.sessions.forEach((session) => {
      //هذه الدالة تأخذ تاريخ الجلسة وتستخرج منه اسم اليوم بالإنجليزية
      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(new Date(session.startTime));
      // إذا كان اليوم موجوداً في المجموعة، نزيد العداد
      if (dailyActivity.hasOwnProperty(dayName)) {
        dailyActivity[dayName]++;
      }
    });

    const chartData = daysOrder.map((day) => ({
      day:
        day === "Saturday"
          ? "السبت"
          : day === "Sunday"
            ? "الأحد"
            : day === "Monday"
              ? "الاثنين"
              : day === "Tuesday"
                ? "الثلاثاء"
                : day === "Wednesday"
                  ? "الأربعاء"
                  : day === "Thursday"
                    ? "الخميس"
                    : "الجمعة",
      count: dailyActivity[day],
    }));

    // معلومات الأداء
    if (!performanceInfo) {
      return NextResponse.json(
        { message: "بيانات الأداء غير موجودة" },
        { status: 404 },
      );
    }

    const academic = performanceInfo.academicScore || 0;
    const commitment = performanceInfo.commitmentScore || 0;

    const activity = performanceInfo.activityScore
      ? Number(performanceInfo.activityScore)
      : 0;

    const rawTotalScore = academic + commitment + activity;

    const MAX_SCORE = 220;

    // حساب النسبة المئوية
    let percentageScore = 0;
    if (rawTotalScore > 0) {
      percentageScore = Math.round((rawTotalScore / MAX_SCORE) * 100);
    }

    // تحديد المستوى بناءً على النسبة
    let performanceStatus = "";
    if (percentageScore >= 85) performanceStatus = "ممتاز";
    else if (percentageScore >= 65) performanceStatus = "جيد";
    else performanceStatus = "ضعيف";

    // حساب التقدير المتوقع
    let trend = "مستقر";
    if (recentAttempts.length === 2) {
      const currentScore = recentAttempts[0].score; // الاختبار الأحدث
      const previousScore = recentAttempts[1].score; // الاختبار الذي قبله

      const difference = currentScore - previousScore;

      if (difference > 5) {
        trend = "في ارتفاع 📈"; // تحسن ملحوظ
      } else if (difference < -5) {
        trend = "في انخفاض 📉"; // تراجع ملحوظ
      } else {
        trend = "مستقر"; // الفرق بسيط
      }
    }

    return NextResponse.json(
      {
        personalInfo: {
          name: `${studentData.firstName} ${studentData.lastName}`,
          img: studentData.profilePictureUrl || "/image/student.png",
          universityId: studentData.universityId,
          college: studentData.college,
          major: studentData.major,
          academicYear: studentData.academicYear,
        },
        statistics: {
          loginCount: loginCount,
          avgSessionTime: avgSessionTime,
          activeDays: activeDaysCount,
          activityStatus: activityStatus,
        },
        contentInteraction: formattedInteractions,
        weeklyChart: chartData,
        recentActivities: finalFeed,
        performance: {
          performanceStatus,
          percentageScore,
          trend,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching student info:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب تفاصيل الطالب" },
      { status: 500 },
    );
  }
}
