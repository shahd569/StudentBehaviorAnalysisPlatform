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
      allAttempts,
      assignments,
      quizzes,
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
          attempt: true,
          assignmentSubmission: true,
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
      prisma.QuizAttempt.findMany({
        where: { studentId: studentId },
        select: {
          score: true,
          startTime: true,
        },
        orderBy: { startTime: "asc" },
      }),
      prisma.AssignmentSubmission.findMany({
        where: { studentId: studentId },
        include: {
          assignment: {
            select: {
              title: true,
              maxScore: true,
              lesson: {
                select: {
                  course: {
                    select: {
                      courseName: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.QuizAttempt.findMany({
        where: {
          studentId: studentId,
        },
        include: {
          quiz: {
            select: {
              title: true,
              maxScore: true,
              lesson: {
                select: {
                  course: {
                    select: {
                      courseName: true,
                    },
                  },
                },
              },
            },
          },
        },
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
      .slice(0, 6);

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
    // احتساب متوسط الوقت لكل جلسة بالـدقائق (للتوافق مع الواجهة الحالية)
    const avgMinutesPerSession =
      sessionsWithEnd > 0 ? totalMinutes / sessionsWithEnd : 0;

    // رقم بالدقائق (مقرب) للحقل القديم
    const avgSessionTime = Math.round(avgMinutesPerSession);

    // نفس القيمة بالساعات (عشري بدقة خانة عشرية)
    const avgSessionTimeHours =
      sessionsWithEnd > 0 ? Number((avgMinutesPerSession / 60).toFixed(1)) : 0;

    // تمثيل نصي عربي مثل: "2 ساعة و 15 دقيقة"
    const hoursPart = Math.floor(avgMinutesPerSession / 60);
    const minutesPart = Math.round(avgMinutesPerSession % 60);
    const avgSessionTimeLabel = `${hoursPart} ساعة و ${minutesPart} دقيقة`;

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
    // let trend = "مستقر";
    // if (recentAttempts.length === 2) {
    //   const currentScore = recentAttempts[0].score; // الاختبار الأحدث
    //   const previousScore = recentAttempts[1].score; // الاختبار الذي قبله

    //   const difference = currentScore - previousScore;

    //   if (difference > 5) {
    //     trend = "في ارتفاع 📈"; // تحسن ملحوظ
    //   } else if (difference < -5) {
    //     trend = "في انخفاض 📉"; // تراجع ملحوظ
    //   } else {
    //     trend = "مستقر 📊"; // الفرق بسيط
    //   }
    // }

    // مخطط الاداء
    // معالجة البيانات لتجميعها حسب الشهر
    const monthlyDataMap = allAttempts.reduce((acc, attempt) => {
      const date = new Date(attempt.startTime);
      // إنشاء مفتاح يمثل الشهر والسنة (مثلاً: "2026-04")
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { totalScore: 0, count: 0 };
      }

      acc[monthKey].totalScore += attempt.score;
      acc[monthKey].count += 1;

      return acc;
    }, {});

    //  تحويل الكائن إلى مصفوفة جاهزة للمخطط
    const monthsNames = [
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

    const charData = Object.keys(monthlyDataMap).map((key) => {
      const [year, month] = key.split("-");
      const avg = Math.round(
        monthlyDataMap[key].totalScore / monthlyDataMap[key].count,
      );

      return {
        month: `${monthsNames[parseInt(month) - 1]}`,
        average: avg,
      };
    });

    /// ****************************************  ////////
    // 1. تحديد تواريخ الأيام السبعة الماضية (من الأقدم للأحدث)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i)); // من اليوم - 6 إلى اليوم الحالي
      d.setHours(0, 0, 0, 0);
      return d;
    });

    // 2. تحضير المصفوفة التي ستُرسل للذكاء الاصطناعي
    const chartData7Days = last7Days.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // أ. حساب تفاعلات الفيديو في هذا اليوم
      const videoInteractionsCount = studentData.interactions.filter(
        (inter) => {
          const interDate = new Date(inter.timestamp);
          return interDate >= date && interDate < nextDate;
        },
      ).length;

      // ب. حساب جلسات الدخول للمنصة في هذا اليوم (مؤشر النشاط الأساسي)
      const sessionsCount = studentData.sessions.filter((session) => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= date && sessionDate < nextDate;
      }).length;

      // ج. حساب محاولات الكويزات في هذا اليوم
      const quizAttemptsCount = studentData.attempt.filter((att) => {
        const attDate = new Date(att.startTime);
        return attDate >= date && attDate < nextDate;
      }).length;

      // د. حساب تسليمات الواجبات في هذا اليوم
      const assignmentSubmissionsCount =
        studentData.assignmentSubmission.filter((sub) => {
          const subDate = new Date(sub.submittedAt); // تأكدي من مسمى الحقل في النموذج الخاص بكِ (غالباً submittedAt أو createdAt)
          return subDate >= date && subDate < nextDate;
        }).length;

      // المجموع الإجمالي للنشاط في هذا اليوم المحدد
      const totalDailyActivity =
        videoInteractionsCount +
        sessionsCount +
        quizAttemptsCount +
        assignmentSubmissionsCount;

      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }), // أو أي صيغة للتشارت
        count: totalDailyActivity, // هذا الرقم الفعلي للنشاط
      };
    });

    // 3. بناء مصفوفة الخصائص (Features) لنموذج Flask بالترتيب الصحيح
    const aiFeatures = chartData7Days.map((item) => item.count);
    // ستنتج مصفوفة مثل: [2, 0, 5, 1, 3, 0, 4] تعبر عن النشاط الحقيقي بكل المنصة

    // 4. إرسال الطلب إلى Flask بيقين تام بالبيانات
    const aiProgressResponse = await fetch(
      "http://127.0.0.1:5000/predict-progress",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day_1: aiFeatures[0],
          day_2: aiFeatures[1],
          day_3: aiFeatures[2],
          day_4: aiFeatures[3],
          day_5: aiFeatures[4],
          day_6: aiFeatures[5],
          day_7: aiFeatures[6],
        }),
      },
    );

    const aiProgressResult = await aiProgressResponse.json();

    // تحويل مخرجات الذكاء الاصطناعي إلى نصوص برمجية تتوافق مع واجهتكِ (مستقر - في ارتفاع - في انخفاض)
    let predictedTrend = "مستقر";
    if (aiProgressResult.prediction === "Good") predictedTrend = "في ارتفاع";
    if (aiProgressResult.prediction === "At Risk") predictedTrend = "في انخفاض";

    /// ****************************************  ////////

    //Assignments
    const formattedAssignments = assignments.map((a) => {
      return {
        title: a.assignment.title,
        courseName: a.assignment.lesson.course.courseName,
        date: a.submittedAt,
        status: a.status === "SUBMITTED" ? "تم التسليم ⏰" : "تم التصحيح ✅",
        score: a.finalScore
          ? `${a.finalScore} / ${a.assignment.maxScore}`
          : "غير محدد",
      };
    });

    //Quizzes
    const formattedQuizzes = quizzes.map((q) => {
      let duration = "غير محدد";

      if (q.startTime && q.finishTime) {
        const diffInMs = new Date(q.finishTime) - new Date(q.startTime);
        const totalMinutes = Math.round(diffInMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) {
          duration = `${hours} ساعة و${minutes} دقائق`;
        } else {
          duration = `${minutes} دقيقة`;
        }
      }

      return {
        title: q.quiz.title,
        courseName: q.quiz.lesson.course.courseName,
        date: q.startTime,
        score: `${q.score} / ${q.quiz.maxScore}`,
        duration: duration,
      };
    });

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
          avgSessionTimeHours: avgSessionTimeHours,
          avgSessionTimeLabel: avgSessionTimeLabel,
          activeDays: activeDaysCount,
          activityStatus: activityStatus,
          recentSessionsCount: recentSessionsCount,
        },
        contentInteraction: formattedInteractions,
        weeklyChart: chartData,
        recentActivities: finalFeed,
        performance: {
          performanceStatus,
          percentageScore,
          // trend,
          trend: predictedTrend, // القيمة القادمة ديناميكياً من تنبؤ الذكاء الاصطناعي الحالي
          confidence: aiProgressResult.confidence * 100, // نسبة اليقين مئوية
          reasons: aiProgressResult.reasons,
          charData,
        },
        formattedAssignments,
        formattedQuizzes,
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
