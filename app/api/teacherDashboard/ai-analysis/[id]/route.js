import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = await params;
  const teacherId = parseInt(id);

  //  جلب الطلاب بدون تكرار اذا كانو مسجلين بأكتر من مادة لدى نفس المدرس

  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        instructorId: teacherId,
      },
    },
    distinct: ["studentId"],
    include: {
      student: true,
    },
  });

  const students = enrollments.map((e) => e.student);

  const results = [];

  //  تحليل كل طالب

  for (const student of students) {
    const studentId = student.id;

    const interactions = await prisma.videoInteraction.findMany({
      where: { studentId },
      include: { video: true },
    });

    const attempts = await prisma.quizAttempt.findMany({
      where: { studentId },
    });

    const sessions = await prisma.userSession.count({
      where: { studentId },
    });

    //  حسابات الفيديو

    const pause_count = interactions.filter(
      (i) => i.interactionType === "PAUSE",
    ).length;
    const rewind_count = interactions.filter(
      (i) => i.interactionType === "SEEK",
    ).length;
    const speed_change_count = interactions.filter(
      (i) => i.interactionType === "RATE_CHANGE",
    ).length;

    //  تجميع حسب الفيديو
    const videoMap = {};

    interactions.forEach((i) => {
      const vid = i.videoId;

      if (!videoMap[vid]) {
        videoMap[vid] = {
          duration: i.video?.duration || 1,
          watched: 0,
        };
      }

      videoMap[vid].watched += i.currentTimeSeconds || 0;
    });

    let totalRatio = 0;
    let completed = 0;
    let earlyExit = 0;
    let count = 0;

    Object.values(videoMap).forEach((v) => {
      const ratio = v.watched / v.duration;

      totalRatio += ratio;

      if (ratio >= 0.8) completed++;
      if (ratio < 0.3) earlyExit++;

      count++;
    });

    const watch_time_ratio = totalRatio / (count || 1);
    const completion_rate = completed / (count || 1);
    const early_exit = earlyExit;

    //  وقت المشاهدة
    const totalWatch = interactions.reduce(
      (sum, i) => sum + (i.currentTimeSeconds || 0),
      0,
    );

    const avg_watch_time = totalWatch / (interactions.length || 1);

    //  درجات
    const avg_grade =
      attempts.reduce((sum, a) => sum + (a.score || 0), 0) /
      (attempts.length || 1);

    const engagement_score =
      completion_rate * 0.5 +
      watch_time_ratio * 0.3 +
      (1 / (pause_count + 1)) * 0.2;

    //  Behavior AI

    const behaviorRes = await fetch("http://localhost:5000/predict-behavior", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features: [
          watch_time_ratio,
          pause_count,
          rewind_count,
          speed_change_count,
          early_exit,
          sessions,
          avg_watch_time,
          completion_rate,
          engagement_score,
        ],
      }),
    });

    const behavior_risk = (await behaviorRes.json()).risk;

    // 🧠 Final AI

    const finalRes = await fetch("http://localhost:5000/predict-final", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features: [avg_grade, completion_rate, sessions, behavior_risk, 0],
      }),
    });

    const final_status = (await finalRes.json()).final_status;

    let predictionLabel = "";
    let riskScore = 0;

    if (final_status === 2) {
      predictionLabel = "🔴 سيـرسب";
      riskScore = 0.9;
    } else if (final_status === 1) {
      predictionLabel = "🟡 على الحافة";
      riskScore = 0.6;
    } else {
      predictionLabel = "🟢 آمن";
      riskScore = 0.2;
    }

    //  التصنيف

    let category = "";

    if (final_status === 2) category = "🔴 At Risk";
    else if (final_status === 1) category = "🟡 Average";
    else if (avg_grade > 80) category = "🟢⭐ Excellent";
    else category = "🟢 Good";

    results.push({
      studentId,
      name: student.firstName + " " + student.lastName,
      avg_grade,
      engagement_score,
      behavior_risk,
      final_status,
      category,
      predictionLabel,
      riskScore,
    });
  }

  //  ترتيب

  results.sort((a, b) => b.riskScore - a.riskScore);

  //  إحصائيات

  const atRiskStudents = results.filter((s) => s.category.includes("At Risk"));
  const averageStudents = results.filter((s) => s.category.includes("Average"));
  const excellentStudents = results.filter((s) =>
    s.category.includes("Excellent"),
  );

  //  توصيات المدرس

  const teacherRecommendations = [];

  //  تحليل الخطر العام

  if (atRiskStudents.length > 0) {
    teacherRecommendations.push(
      `🚨 يوجد ${atRiskStudents.length} طلاب معرضين للرسوب → يُنصح بالتدخل الفوري عبر جلسات دعم وإعادة شرح المفاهيم الأساسية.`,
    );
  }

  if (atRiskStudents.length > results.length * 0.4) {
    teacherRecommendations.push(
      `📉 نسبة كبيرة من الطلاب في خطر (${Math.round(
        (atRiskStudents.length / results.length) * 100,
      )}%) → قد يكون المحتوى صعبًا أو طريقة الشرح تحتاج تبسيط.`,
    );
  }

  //  طلاب على الحافة

  if (averageStudents.length > 0) {
    teacherRecommendations.push(
      `⚠️ يوجد ${averageStudents.length} طلاب على وشك الرسوب → ركّز على متابعتهم قبل الاختبارات القادمة.`,
    );
  }

  //  الطلاب المتميزين

  if (excellentStudents.length > 0) {
    teacherRecommendations.push(
      `🌟 لديك ${excellentStudents.length} طلاب متميزين → يمكنك استثمارهم في دعم زملائهم أو إعطائهم مهام متقدمة.`,
    );
  }

  //  أكثر طالب معرض لخطر الرسوب

  const mostRisky = results[0];
  if (mostRisky && mostRisky.riskScore > 0.7) {
    teacherRecommendations.push(
      `🔥 الطالب "${mostRisky.name}" هو الأكثر عرضة للرسوب → يحتاج متابعة شخصية وخطة دراسة واضحة.`,
    );
  }

  //  تحليل الأداء العام

  const lowGrades = results.filter((s) => s.avg_grade < 50);

  if (lowGrades.length > results.length * 0.3) {
    teacherRecommendations.push(
      `📉 عدد كبير من الطلاب يعاني من ضعف في الدرجات → يُنصح بمراجعة نمط الأسئلة أو إعادة شرح الدروس الأساسية.`,
    );
  }

  //  تحليل التفاعل مع الفيديو

  const lowEngagement = results.filter((s) => s.engagement_score < 0.4);

  if (lowEngagement.length > results.length * 0.3) {
    teacherRecommendations.push(
      `🎥 تفاعل الطلاب مع الفيديوهات منخفض → حاول جعل الدروس أكثر تفاعلية أو تقسيمها إلى أجزاء أقصر.`,
    );
  }

  //  سلوك المشاهدة (صعوبة الدروس)

  const highBehaviorRisk = results.filter((s) => s.behavior_risk === 2);

  if (highBehaviorRisk.length > 0) {
    teacherRecommendations.push(
      `🔁 عدد من الطلاب يواجه صعوبة في فهم المحتوى → يُنصح بإضافة أمثلة إضافية أو شرح مبسط.`,
    );
  }

  //  نشاط الطلاب

  const lowActivity = results.filter((s) => s.engagement_score < 0.2);

  if (lowActivity.length > 0) {
    teacherRecommendations.push(
      `📅 هناك طلاب غير نشطين → حاول تحفيزهم عبر تنبيهات أو واجبات دورية.`,
    );
  }

  //  توصيات مركبة

  if (atRiskStudents.length > 0 && lowEngagement.length > 0) {
    teacherRecommendations.push(
      `🧠 الطلاب المعرضون للرسوب يعانون أيضًا من ضعف التفاعل → المشكلة ليست فقط أكاديمية بل سلوكية أيضًا.`,
    );
  }

  if (averageStudents.length > 0 && lowGrades.length > 0) {
    teacherRecommendations.push(
      `📊 الطلاب الذين هم على حافة الرسوب لديهم ضعف في الفهم → ركّز على مراجعة الأخطاء الشائعة في الاختبارات.`,
    );
  }

  if (teacherRecommendations.length === 0) {
    teacherRecommendations.push(
      "✅ أداء الطلاب مستقر ولا توجد مشاكل ملحوظة حالياً",
    );
  }

  const predictiveRecommendations = [];

  //  توقع رسوب
  if (atRiskStudents.length > 0) {
    predictiveRecommendations.push(
      `🚨 النظام يتوقع رسوب ${atRiskStudents.length} طلاب إذا استمر الوضع الحالي.`,
    );
  }

  //  الحافة
  if (averageStudents.length > 0) {
    predictiveRecommendations.push(
      `⚠️ ${averageStudents.length} طلاب قد ينتقلون إلى حالة الرسوب قريبًا.`,
    );
  }

  //  أخطر حالة
  if (mostRisky && mostRisky.riskScore > 0.8) {
    predictiveRecommendations.push(
      `🔥 الطالب "${mostRisky.name}" في حالة حرجة جدًا ويحتاج تدخل فوري.`,
    );
  }

  //  اتجاه عام
  if (atRiskStudents.length > results.length * 0.5) {
    predictiveRecommendations.push(
      `📉 الاتجاه العام يشير إلى تراجع في مستوى الصف بالكامل.`,
    );
  }

  if (atRiskStudents.length > 0 && averageStudents.length > 0) {
    predictiveRecommendations.push(
      `🧠 هناك انتقال واضح لمستوى الطلاب من "متوسط" إلى "خطر" — يجب التدخل قبل تفاقم المشكلة.`,
    );
  }

  return Response.json({
    students: results,
    stats: {
      atRisk: atRiskStudents.length,
      borderline: averageStudents.length,
      safe: results.length - atRiskStudents.length - averageStudents.length,
    },
    teacherRecommendations,
    predictiveRecommendations,
    studentsCount: students.length,
  });
}
