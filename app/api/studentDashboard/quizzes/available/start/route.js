// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(req) {
//   const session = await getServerSession(authOptions);
//   const { quizId } = await req.json();

//   if (!session)
//     return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

//   try {
//     // إنشاء سجل محاولة جديد بوقت البدء الحالي
//     const attempt = await prisma.quizAttempt.create({
//       data: {
//         quizId: parseInt(quizId),
//         studentId: parseInt(session.user.id),
//         // studentId: 15,
//         startTime: new Date(),
//         submittedAnswers: [],
//       },
//     });

//     return NextResponse.json({ attemptId: attempt.id }, { status: 201 });
//   } catch (error) {
//     const existingAttempt = await prisma.quizAttempt.findUnique({
//       where: {
//         studentId_quizId: {
//           studentId: parseInt(session.user.id),
//           //   studentId: 15,
//           quizId: parseInt(quizId),
//         },
//       },
//     });
//     return NextResponse.json(
//       { attemptId: existingAttempt.id },
//       { status: 200 },
//     );
//   }
// }

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  // تأكدي أن القيمة قادمة بشكل صحيح من الـ request
  const body = await req.json();
  console.log("البيانات الواصلة للـ API:", body); // فحص البيانات في Terminal السيرفر

  const quizId = parseInt(body.quizId);

  if (!session)
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  if (isNaN(quizId)) {
    return NextResponse.json(
      { message: "معرف الاختبار غير صالح" },
      { status: 400 },
    );
  }

  const studentId = parseInt(session.user.id);

  try {
    // محاولة إنشاء سجل جديد
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quizId,
        studentId: studentId,
        startTime: new Date(),
        submittedAnswers: [],
      },
    });

    return NextResponse.json({ attemptId: attempt.id }, { status: 201 });
  } catch (error) {
    // في حال وجود خطأ (غالباً بسبب وجود المحاولة مسبقاً)
    // هنا كان الخطأ: يجب تمرير quizId داخل studentId_quizId
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        studentId_quizId: {
          studentId: studentId,
          quizId: quizId, // تأكدي من إضافة هذا السطر هنا ✅
        },
      },
    });

    if (existingAttempt) {
      return NextResponse.json(
        { attemptId: existingAttempt.id },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "حدث خطأ أثناء بدء الاختبار" },
      { status: 500 },
    );
  }
}
