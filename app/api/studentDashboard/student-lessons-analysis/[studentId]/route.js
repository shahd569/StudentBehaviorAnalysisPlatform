import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { studentId } = await params;
  const id = parseInt(studentId);

  //  جلب البيانات

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

  //  تجميع حسب الدرس

  const lessonMap = {};

  interactions.forEach((i) => {
    const lesson = i.video?.lesson;
    if (!lesson) return;

    const lessonId = lesson.id;

    if (!lessonMap[lessonId]) {
      lessonMap[lessonId] = {
        lessonName: lesson.title,
        interactions: [],
        videos: {},
      };
    }

    lessonMap[lessonId].interactions.push(i);

    const vid = i.videoId;

    if (!lessonMap[lessonId].videos[vid]) {
      lessonMap[lessonId].videos[vid] = {
        duration: i.video?.duration || 1,
        watched: 0,
      };
    }

    lessonMap[lessonId].videos[vid].watched += i.currentTimeSeconds || 0;
  });

  //  تحليل كل درس + AI

  const lessons = [];

  for (const lessonId in lessonMap) {
    const data = lessonMap[lessonId];
    const interactions = data.interactions;

    const pause_count = interactions.filter(
      (i) => i.interactionType === "PAUSE",
    ).length;
    const rewind_count = interactions.filter(
      (i) => i.interactionType === "SEEK",
    ).length;
    const speed_change_count = interactions.filter(
      (i) => i.interactionType === "RATE_CHANGE",
    ).length;

    //  فيديو
    let totalRatio = 0;
    let completed = 0;
    let earlyExit = 0;
    let count = 0;

    Object.values(data.videos).forEach((v) => {
      const ratio = v.watched / v.duration;

      totalRatio += ratio;

      if (ratio >= 0.8) completed++;
      if (ratio < 0.3) earlyExit++;

      count++;
    });

    const watch_time_ratio = totalRatio / (count || 1);
    const completion_rate = completed / (count || 1);
    const early_exit = earlyExit;

    const totalWatch = interactions.reduce(
      (sum, i) => sum + (i.currentTimeSeconds || 0),
      0,
    );

    const avg_watch_time = totalWatch / (interactions.length || 1);

    const engagement_score =
      completion_rate * 0.5 +
      watch_time_ratio * 0.3 +
      (1 / (pause_count + 1)) * 0.2;

    const aiRes = await fetch("http://localhost:5000/predict-behavior", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        features: [
          watch_time_ratio,
          pause_count,
          rewind_count,
          speed_change_count,
          early_exit,
          1, // ما عنا جلسات لكل درس
          avg_watch_time,
          completion_rate,
          engagement_score,
        ],
      }),
    });

    const aiData = await aiRes.json();
    const risk = aiData.risk;

    //  اكتشاف مشاكل الدرس

    const detectedProblems = [];

    if (risk === 2) detectedProblems.push("HIGH_RISK");
    if (risk === 1) detectedProblems.push("MEDIUM_RISK");

    if (completion_rate < 0.5) detectedProblems.push("LOW_COMPLETION");

    if (watch_time_ratio < 0.5) detectedProblems.push("LOW_WATCH");

    if (rewind_count > 5) detectedProblems.push("HIGH_REWIND");

    if (pause_count > 10) detectedProblems.push("HIGH_PAUSE");

    //  توصيات مركبة (Advanced AI)

    const advancedRecommendations = [];

    if (
      detectedProblems.includes("HIGH_RISK") &&
      detectedProblems.includes("LOW_COMPLETION")
    ) {
      advancedRecommendations.push(
        `🚨 في درس "${data.lessonName}" أنت لا تكمل الفيديو وهذا سبب صعوبة الفهم — شاهد الدرس كاملًا ثم أعده مرة أخرى.`,
      );
    }

    if (
      detectedProblems.includes("HIGH_RISK") &&
      detectedProblems.includes("HIGH_REWIND")
    ) {
      advancedRecommendations.push(
        `🔁 في درس "${data.lessonName}" تعيد المشاهدة كثيرًا وهذا يدل على صعوبة المحتوى — حاول تدوين ملاحظات أثناء المشاهدة.`,
      );
    }

    if (
      detectedProblems.includes("LOW_WATCH") &&
      detectedProblems.includes("LOW_COMPLETION")
    ) {
      advancedRecommendations.push(
        `🎥 في درس "${data.lessonName}" لا تقضي وقتًا كافيًا — حاول مشاهدة الفيديو كاملًا بدون تخطي.`,
      );
    }

    if (
      detectedProblems.includes("HIGH_PAUSE") &&
      detectedProblems.includes("LOW_WATCH")
    ) {
      advancedRecommendations.push(
        `⏸️ في درس "${data.lessonName}" تتوقف كثيرًا مع وقت مشاهدة قليل — حاول الدراسة في بيئة هادئة بدون مقاطعة.`,
      );
    }

    //  بنك التوصيات

    const recommendationBank = {
      HIGH_RISK: [
        `🚨 هذا الدرس "${data.lessonName}" صعب عليك — أعد مشاهدته بتركيز.`,
        `⚠️ تحتاج مراجعة عميقة لدرس "${data.lessonName}".`,
      ],

      MEDIUM_RISK: [
        `⚠️ فهمك متوسط في "${data.lessonName}" — حاول مراجعته مرة أخرى.`,
      ],

      LOW_COMPLETION: [
        `🎥 لا تكمل فيديوهات "${data.lessonName}" — حاول إنهاء الدرس كاملًا.`,
      ],

      LOW_WATCH: [
        `👀 وقت المشاهدة قليل في "${data.lessonName}" — حاول التركيز أكثر.`,
      ],

      HIGH_REWIND: [
        `🔁 تعيد أجزاء كثيرة في "${data.lessonName}" — حاول كتابة ملاحظات.`,
      ],

      HIGH_PAUSE: [
        `⏸️ تتوقف كثيرًا في "${data.lessonName}" — قلل المشتتات أثناء الدراسة.`,
      ],
    };

    // بناء التوصيات

    let recommendations = [];

    //   التوصيات المركبة
    recommendations.push(...advancedRecommendations);

    //  التوصيات العادية
    detectedProblems.forEach((problem) => {
      const options = recommendationBank[problem];

      if (options && options.length > 0) {
        const randomIndex = Math.floor(Math.random() * options.length);
        recommendations.push(options[randomIndex]);
      }
    });

    // إزالة التكرار
    recommendations = [...new Set(recommendations)];

    // تحديد عدد التوصيات
    recommendations = recommendations.slice(0, 3);

    // fallback
    if (recommendations.length === 0) {
      recommendations.push(`✅ أداؤك جيد في "${data.lessonName}" استمر.`);
    }

    lessons.push({
      lessonId,
      lessonName: data.lessonName,
      risk,
      metrics: {
        completion_rate,
        watch_time_ratio,
        engagement_score,
      },
      recommendations,
    });
  }

  //  ترتيب حسب الخطورة

  lessons.sort((a, b) => b.risk - a.risk);

  return Response.json({
    lessons,
  });
}
