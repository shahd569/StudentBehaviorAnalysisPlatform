import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { studentId } = await params;
  const id = parseInt(studentId);
  console.log("studentId:", id);
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

  const allAssignments = await prisma.assignment.findMany({
    where: {
      lesson: {
        course: {
          enrollments: {
            some: {
              studentId: id,
            },
          },
        },
      },
    },
  });

  // فقط الواجبات المنتهية
  const finishedAssignments = allAssignments.filter(
    (a) => new Date(a.deliveryDate) < new Date(),
  );

  // الواجبات التي سلمها الطالب
  const studentSubmissions = await prisma.assignmentSubmission.findMany({
    where: { studentId: id },
  });

  // عدد الواجبات التي سلمها من المنتهية
  const submittedFinished = studentSubmissions.filter((s) =>
    finishedAssignments.some((a) => a.id === s.assignmentId),
  );

  // المعدل الصحيح
  const assignment_completion_rate =
    submittedFinished.length / (finishedAssignments.length || 1);

  const comments = studentSubmissions
    .map((s) => s.teacherComment)
    .filter((c) => c); // حذف القيم الفارغة

  let sentiment = 0;

  if (comments.length > 0) {
    try {
      const res = await fetch("http://127.0.0.1:5000/predict-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: comments.join(" "),
        }),
      });

      if (!res.ok) {
        console.error("Sentiment API error:", res.status, res.statusText);
        sentiment = 0;
      } else {
        const data = await res.json();
        sentiment = data.sentiment || 0;
      }
    } catch (error) {
      console.error("Sentiment prediction failed:", error);
      sentiment = 0;
    }
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

  const watch_time_ratio = Math.min(totalRatio / (count || 1), 1);

  const completion_rate = Math.min(completed / (count || 1), 1);

  const normalizedPause = 1 / (pause_count + 1);

  const early_exit = earlyExit / (count || 1);

  //  Engagement Score

  const engagement_score =
    completion_rate * 0.4 +
    watch_time_ratio * 0.3 +
    normalizedPause * 0.2 +
    (1 - early_exit) * 0.1;

  const final_engagement_score = Math.max(0, Math.min(engagement_score, 1));

  const avg_grade =
    attempts.reduce((sum, a) => sum + (a.score || 0), 0) /
    (attempts.length || 1);

  const login_frequency = session_count;

  let behavior_risk = 0;

  try {
    const behaviorRes = await fetch("http://127.0.0.1:5000/predict-behavior", {
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
          final_engagement_score,
        ],
      }),
    });

    if (!behaviorRes.ok) {
      console.error(
        "Behavior API error:",
        behaviorRes.status,
        behaviorRes.statusText,
      );
      behavior_risk = 0;
    } else {
      const data = await behaviorRes.json();
      behavior_risk = data.risk || 0;
    }
  } catch (error) {
    console.error("Behavior prediction failed:", error);
    behavior_risk = 0;
  }

  let final_status = 0;

  try {
    const finalRes = await fetch("http://127.0.0.1:5000/predict-final", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features: [
          avg_grade,
          assignment_completion_rate,
          login_frequency,
          behavior_risk,
          sentiment,
        ],
      }),
    });

    if (!finalRes.ok) {
      console.error("Final API error:", finalRes.status, finalRes.statusText);
      final_status = 0;
    } else {
      const data = await finalRes.json();
      final_status = data.final_status || 0;
    }
  } catch (error) {
    console.error("Final prediction failed:", error);
    final_status = 0;
  }

  //  مستوى التفاعل

  let engagementLevel = "";

  if (final_engagement_score >= 0.7) {
    engagementLevel = "🟢 مرتفع";
  } else if (final_engagement_score >= 0.3) {
    engagementLevel = "🟡 متوسط";
  } else {
    engagementLevel = "🔴 منخفض";
  }

  //  مستوى الخطر

  let riskLevel = "";

  if (behavior_risk === 2) {
    riskLevel = "🔴 مرتفع";
  } else if (behavior_risk === 1) {
    riskLevel = "🟡 متوسط";
  } else {
    riskLevel = "🟢 منخفض";
  }

  //  توقع الأداء النهائي

  let performancePrediction = "";

  if (final_status === 2) {
    performancePrediction = "🔴 متوقع رسوب الطالب";
  } else if (final_status === 1) {
    performancePrediction = "🟡 يحتاج تحسين";
  } else {
    performancePrediction = "🟢 متوقع نجاح الطالب";
  }

  // اكتشاف المشاكل

  const detectedProblems = [];

  if (final_status === 2) detectedProblems.push("AT_RISK");

  if (avg_grade < 50) detectedProblems.push("LOW_PERFORMANCE");

  if (behavior_risk === 2 || completion_rate < 0.5)
    detectedProblems.push("LOW_ENGAGEMENT");

  if (login_frequency < 3) detectedProblems.push("LOW_ACTIVITY");

  if (assignment_completion_rate < 0.5)
    detectedProblems.push("MISSING_ASSIGNMENTS");

  if (sentiment === -1) detectedProblems.push("NEGATIVE_FEEDBACK");

  // توصيات مركبة

  const advancedRecommendations = [];

  //  خطر + ضعف أداء
  if (
    detectedProblems.includes("AT_RISK") &&
    detectedProblems.includes("LOW_PERFORMANCE")
  ) {
    advancedRecommendations.push(
      "🚨 أنت معرض للرسوب بسبب ضعف أدائك. ابدأ فورًا بمراجعة الدروس.",
    );
  }

  //  خطر + ضعف تفاعل
  if (
    detectedProblems.includes("AT_RISK") &&
    detectedProblems.includes("LOW_ENGAGEMENT")
  ) {
    advancedRecommendations.push(
      "🚨 تفاعلك ضعيف وهذا يضعك في خطر. شاهد الفيديوهات كاملة بدون تخطي ثم طبق ما تعلمته.",
    );
  }

  //  أداء ضعيف + تفاعل ضعيف
  if (
    detectedProblems.includes("LOW_PERFORMANCE") &&
    detectedProblems.includes("LOW_ENGAGEMENT")
  ) {
    advancedRecommendations.push(
      "📉 ضعف درجاتك مرتبط بعدم إكمال الفيديوهات. ركّز على مشاهدة الدروس كاملة .",
    );
  }

  //  واجبات + أداء ضعيف
  if (
    detectedProblems.includes("MISSING_ASSIGNMENTS") &&
    detectedProblems.includes("LOW_PERFORMANCE")
  ) {
    advancedRecommendations.push(
      "📚 عدم تسليم الواجبات يؤثر على درجاتك. ابدأ بحل الواجبات فورًا لتحسين مستواك.",
    );
  }

  //  نشاط قليل + خطر
  if (
    detectedProblems.includes("LOW_ACTIVITY") &&
    detectedProblems.includes("AT_RISK")
  ) {
    advancedRecommendations.push(
      "📅 قلة دخولك للمنصة سبب رئيسي في تراجعك. التزم بالدخول يوميًا لمتابعة الدروس.",
    );
  }

  //  تعليقات سلبية + أداء ضعيف
  if (
    detectedProblems.includes("NEGATIVE_FEEDBACK") &&
    detectedProblems.includes("LOW_PERFORMANCE")
  ) {
    advancedRecommendations.push(
      "💬 ملاحظات المدرس تشير لضعف أدائك. اقرأ التعليقات وطبقها لتحسين نتائجك.",
    );
  }

  //  ترتيب الأولوية

  const priorityOrder = [
    "AT_RISK",
    "LOW_PERFORMANCE",
    "LOW_ENGAGEMENT",
    "MISSING_ASSIGNMENTS",
    "LOW_ACTIVITY",
    "NEGATIVE_FEEDBACK",
  ];

  detectedProblems.sort(
    (a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b),
  );

  // بنك التوصيات

  const recommendationBank = {
    AT_RISK: [
      "🚨 أنت معرض للرسوب. ابدأ فورًا بخطة دراسة يومية وركز على الدروس الأساسية.",
      "⚠️ وضعك حرج. راجع الفيديوهات غير المكتملة ثم حل الاختبارات.",
    ],

    LOW_PERFORMANCE: [
      "📉 درجاتك منخفضة. راجع حلول الاختبارات السابقة لفهم الأخطاء.",
      "📘 راجع الدروس المرتبطة بالاختبارات ودوّن ملاحظاتك.",
    ],

    LOW_ENGAGEMENT: [
      "🎥 لا تكمل الفيديوهات. حاول مشاهدة الدروس كاملة بدون تخطي.",
      "👀 ركّز أثناء المشاهدة وابتعد عن المشتتات.",
    ],

    LOW_ACTIVITY: [
      "📅 دخولك قليل. خصص وقت يومي ثابت للدراسة.",
      "⏰ حاول الدخول للمنصة بشكل منتظم لتجنب تراكم الدروس.",
    ],

    MISSING_ASSIGNMENTS: [
      "📚 لم تسلم الواجبات. ابدأ بحل الواجبات المطلوبة.",
      "📝 حل الواجبات يساعدك على فهم الدروس بشكل أفضل.",
    ],

    NEGATIVE_FEEDBACK: [
      "💬 راجع تعليقات المدرس وطبّق الملاحظات.",
      "📢 حسّن أداءك بناءً على ملاحظات المدرس.",
    ],
  };

  //  اختيار التوصيات

  let recommendations = [];

  //  التوصيات المركبة
  recommendations.push(...advancedRecommendations);

  //  التوصيات العادية
  detectedProblems.forEach((problem) => {
    const options = recommendationBank[problem];

    if (options && options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      recommendations.push(options[randomIndex]);
    }
  });

  recommendations = [...new Set(recommendations)];

  recommendations = recommendations.slice(0, 5);

  if (recommendations.length === 0) {
    recommendations.push("✅ أداؤك جيد، استمر بنفس المستوى.");
  }

  //  توصيات حسب الدروس

  // const lessonMap = {};

  // interactions.forEach((i) => {
  //   const lesson = i.video?.lesson;
  //   if (!lesson) return;

  //   if (!lessonMap[lesson.id]) {
  //     lessonMap[lesson.id] = {
  //       name: lesson.title,
  //       interactions: [],
  //     };
  //   }

  //   lessonMap[lesson.id].interactions.push(i);
  // });

  // const lessonRecommendations = [];

  // for (const lessonId in lessonMap) {
  //   const data = lessonMap[lessonId].interactions;
  //   const name = lessonMap[lessonId].name;

  //   const pauses = data.filter((i) => i.interactionType === "PAUSE").length;
  //   const rewinds = data.filter((i) => i.interactionType === "SEEK").length;

  //   const totalWatch = data.reduce(
  //     (sum, i) => sum + (i.currentTimeSeconds || 0),
  //     0,
  //   );

  //   const avgWatch = totalWatch / (data.length || 1);

  //   const recs = [];

  //   if (pauses > 5) {
  //     recs.push(
  //       `⏸️ في درس "${name}" تتوقف كثيرًا → حاول مشاهدة الدرس في بيئة هادئة بدون مقاطعة.`,
  //     );
  //   }

  //   if (rewinds > 3) {
  //     recs.push(
  //       `🔁 في درس "${name}" تعيد المشاهدة كثيرًا → هذا يعني أن الدرس صعب، حاول كتابة ملاحظات أو إعادة شرحه بنفسك.`,
  //     );
  //   }

  //   if (avgWatch < 20) {
  //     recs.push(
  //       `👀 في درس "${name}" وقت المشاهدة قليل → حاول إكمال الفيديو للنهاية لفهم المحتوى.`,
  //     );
  //   }

  //   if (pauses === 0 && rewinds === 0 && avgWatch > 50) {
  //     recs.push(`👏 في درس "${name}" تفاعلك ممتاز — استمر بنفس الطريقة.`);
  //   }

  //   if (recs.length === 0) {
  //     recs.push(`📘 راجع درس "${name}" مرة أخرى للتأكد من فهمك الكامل.`);
  //   }

  //   lessonRecommendations.push({
  //     lessonName: name,
  //     recommendations: recs,
  //   });
  // }
  //  توصيات حسب الكويز

  const quizRecommendations = [];

  attempts.forEach((a) => {
    const quizName = a.quiz?.title || "اختبار";

    const score = a.score || 0;

    if (score < 50) {
      quizRecommendations.push(
        `📉 نتيجتك في "${quizName}" ضعيفة → ارجع للدرس المرتبط به وراجع حل الأسئلة لفهم الأخطاء.`,
      );
    }

    if (score >= 50 && score < 80) {
      quizRecommendations.push(
        `📊 نتيجتك في "${quizName}" متوسطة → حاول مراجعة النقاط التي أخطأت بها لتحسين مستواك.`,
      );
    }

    if (score >= 80) {
      quizRecommendations.push(
        `🌟 نتيجتك في "${quizName}" ممتازة — استمر بنفس الأداء.`,
      );
    }

    if (a.finishTime && a.startTime) {
      const duration = (new Date(a.finishTime) - new Date(a.startTime)) / 1000;

      if (duration < 30) {
        quizRecommendations.push(
          `⏱️ أنهيت "${quizName}" بسرعة كبيرة → تأكد أنك قرأت الأسئلة جيدًا قبل الإجابة.`,
        );
      }
    }
  });

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
      final_engagement_score,
      avg_grade,
      // assignment_on_time_rate,
      assignment_completion_rate,
      login_frequency,
    },
    ai: {
      behavior_risk,
      sentiment,
      final_status,
    },
    analysis: {
      engagementLevel,
      riskLevel,
      performancePrediction,
    },
    generalRecommendations: recommendations,
    // lessonRecommendations,
    quizRecommendations,
  });
}
