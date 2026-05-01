import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { studentId } = await params;
  const id = parseInt(studentId);

  // جلب البيانات
  const interactions = await prisma.videoInteraction.findMany({
    where: { studentId: id },
    include: {
      video: {
        include: {
          lesson: true,
        },
      },
    },
  });

  const sessions = await prisma.userSession.count({
    where: { studentId: id },
  });

  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId: id },
    include: {
      quiz: true,
    },
  });

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { studentId: id },
    include: { assignment: true },
  });

  const comments = submissions.map((s) => s.teacherComment).filter((c) => c); // حذف القيم الفارغة

  let sentiment = 0;

  if (comments.length > 0) {
    const res = await fetch("http://localhost:5000/predict-sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: comments.join(" "),
      }),
    });

    const data = await res.json();
    sentiment = data.sentiment;
  }
  //  Features

  const pause_count = interactions.filter(
    (i) => i.interactionType === "PAUSE",
  ).length;

  const rewind_count = interactions.filter(
    (i) => i.interactionType === "SEEK",
  ).length;

  const speed_change_count = interactions.filter(
    (i) => i.interactionType === "RATE_CHANGE",
  ).length;

  const session_count = sessions;

  const totalWatchTime = interactions.reduce(
    (sum, i) => sum + (i.currentTimeSeconds || 0),
    0,
  );

  const avg_watch_time = totalWatchTime / (interactions.length || 1);

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

  const engagement_score =
    completion_rate * 0.5 +
    watch_time_ratio * 0.3 +
    (1 / (pause_count + 1)) * 0.2;

  const avg_grade =
    attempts.reduce((sum, a) => sum + (a.score || 0), 0) /
    (attempts.length || 1);

  const onTime = submissions.filter(
    (s) => s.submittedAt <= s.assignment.deliveryDate,
  ).length;

  const assignment_on_time_rate = onTime / (submissions.length || 1);

  const login_frequency = session_count;

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
        session_count,
        avg_watch_time,
        completion_rate,
        engagement_score,
      ],
    }),
  });

  const behavior_risk = (await behaviorRes.json()).risk;

  const finalRes = await fetch("http://localhost:5000/predict-final", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      features: [
        avg_grade,
        assignment_on_time_rate,
        login_frequency,
        behavior_risk,
        sentiment,
      ],
    }),
  });

  const final_status = (await finalRes.json()).final_status;

  //  توصيات عامة

  const recommendations = [];

  if (final_status === 2)
    recommendations.push("⚠️ أنت في خطر، يجب عليك مراجعة الدروس");

  if (avg_grade < 50) recommendations.push("📉 درجاتك منخفضة");

  if (login_frequency < 3) recommendations.push("📅 دخولك قليل للمنصة");

  if (recommendations.length === 0) recommendations.push("✅ أداؤك جيد");

  //  توصيات حسب الدروس

  const lessonMap = {};

  interactions.forEach((i) => {
    const lesson = i.video?.lesson;
    if (!lesson) return;

    if (!lessonMap[lesson.id]) {
      lessonMap[lesson.id] = {
        name: lesson.title,
        interactions: [],
      };
    }

    lessonMap[lesson.id].interactions.push(i);
  });

  const lessonRecommendations = [];

  for (const lessonId in lessonMap) {
    const data = lessonMap[lessonId].interactions;
    const name = lessonMap[lessonId].name;

    const pauses = data.filter((i) => i.interactionType === "PAUSE").length;
    const rewinds = data.filter((i) => i.interactionType === "SEEK").length;

    const recs = [];

    if (pauses > 5) recs.push(`⏸️ في درس "${name}" تتوقف كثيرًا`);

    if (rewinds > 3) recs.push(`🔁 في درس "${name}" تعيد المشاهدة كثيرًا`);

    if (recs.length === 0) recs.push(`✅ أداؤك جيد في "${name}"`);

    lessonRecommendations.push({
      lessonName: name,
      recommendations: recs,
    });
  }

  //  توصيات حسب الكويز

  const quizRecommendations = [];

  attempts.forEach((a) => {
    const quizName = a.quiz?.title || "اختبار";

    if ((a.score || 0) < 50) {
      quizRecommendations.push(`📉 أداؤك ضعيف في اختبار "${quizName}"`);
    }

    if ((a.score || 0) > 80) {
      quizRecommendations.push(`🌟 أداؤك ممتاز في اختبار "${quizName}"`);
    }

    if (a.finishTime && a.startTime) {
      const duration = (new Date(a.finishTime) - new Date(a.startTime)) / 1000;

      if (duration < 30) {
        quizRecommendations.push(`⏱️ أنهيت اختبار "${quizName}" بسرعة كبيرة`);
      }
    }
  });

  //  FINAL RESPONSE

  return Response.json({
    features: {
      watch_time_ratio,
      pause_count,
      rewind_count,
      speed_change_count,
      early_exit,
      session_count,
      avg_watch_time,
      completion_rate,
      engagement_score,
      avg_grade,
      assignment_on_time_rate,
      login_frequency,
    },
    ai: {
      behavior_risk,
      sentiment,
      final_status,
    },
    generalRecommendations: recommendations,
    lessonRecommendations,
    quizRecommendations,
  });
}
