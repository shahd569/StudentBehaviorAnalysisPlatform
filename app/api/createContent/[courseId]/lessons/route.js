// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "TEACHER") {
//       return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
//     }

//     const { courseId } = await params;
//     const id = parseInt(courseId);
//     const body = await request.json();

//     const {
//       title,
//       // description,
//       sequenceNumber,
//       contentType, // "VIDEO" أو "RESOURCE" أو "BOTH"
//       videosArray, // مصفوفة تحتوي على الفيديوهات المرفوعة [ {url, description, duration}, ... ]
//       resourceData,
//     } = body;

//     if (!title || sequenceNumber === undefined) {
//       return NextResponse.json(
//         { error: "الحقول الأساسية مطلوبة." },
//         { status: 400 },
//       );
//     }

//     const lessonData = {
//       title,
//       // description: description || null,
//       sequenceNumber: parseInt(sequenceNumber),
//       courseId: parseInt(id),
//     };

//     if (videosArray && videosArray.length > 0) {
//       lessonData.videos = {
//         create: videosArray.map((video) => ({
//           url: video.url,
//           description: video.description || null,
//           duration: parseInt(video.duration || 0),
//         })),
//       };
//     }

//     if (resourceData && resourceData.fileUrl) {
//       lessonData.resources = {
//         create: {
//           title: resourceData.title || "ملف الدرس",
//           fileUrl: resourceData.fileUrl,
//         },
//       };
//     }

//     const newLesson = await prisma.lesson.create({
//       data: lessonData,
//       include: {
//         videos: true,
//         resources: true,
//       },
//     });

//     return NextResponse.json(
//       { message: "تم إنشاء الدرس بنجاح", lesson: newLesson },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({ error: "حدث خطأ في السيرفر." }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "TEACHER") {
//       return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
//     }

//     const { courseId } = await params;
//     const cId = parseInt(courseId);
//     const body = await request.json();

//     const {
//       type, // "LESSON" أو "ASSIGNMENT"
//       title,
//       description,
//       // للدرس:
//       sequenceNumber,
//       videoUrl,
//       fileUrl,
//       videoDescription,
//       // للواجب:
//       lessonId, // الدرس التابع له الواجب
//       deliveryDate,
//       maxScore,
//       allowedExtensions,
//     } = body;

//     if (!type || !title) {
//       return NextResponse.json(
//         { error: "نوع المحتوى والعنوان مطلوبان." },
//         { status: 400 },
//       );
//     }

//     // ==================== 1. حالة إضافة درس جديد ====================
//     if (type === "LESSON") {
//       if (sequenceNumber === undefined) {
//         return NextResponse.json(
//           { error: "ترتيب الدرس مطلوب." },
//           { status: 400 },
//         );
//       }

//       const lessonData = {
//         title,
//         description: description || null,
//         sequenceNumber: parseInt(sequenceNumber),
//         courseId: cId,
//       };

//       // إذا رفع فيديو
//       if (videoUrl) {
//         lessonData.videos = {
//           create: [
//             {
//               url: videoUrl,
//               description: videoDescription || null,
//               duration: 0,
//             },
//           ],
//         };
//       }

//       // إذا رفع ملف PDF / ملخص
//       if (fileUrl) {
//         lessonData.resources = {
//           create: {
//             title: `${title} - ملف مرفق`,
//             fileUrl: fileUrl,
//           },
//         };
//       }

//       const newLesson = await prisma.lesson.create({
//         data: lessonData,
//         include: { videos: true, resources: true },
//       });

//       return NextResponse.json(
//         { message: "تم إنشاء الدرس بنجاح", data: newLesson },
//         { status: 201 },
//       );
//     }

//     // ==================== 2. حالة إضافة واجب جديد ====================
//     if (type === "ASSIGNMENT") {
//       if (!lessonId || !deliveryDate || !maxScore) {
//         return NextResponse.json(
//           {
//             error:
//               "الدرس التابع له، تاريخ التسليم، والدرجة العظمى حقول مطلوبة للواجب.",
//           },
//           { status: 400 },
//         );
//       }

//       const assignmentData = {
//         title,
//         content: description || "لا يوجد وصف إضافي",
//         deliveryDate: new Date(deliveryDate),
//         maxScore: parseInt(maxScore),
//         allowedExtensions: allowedExtensions || ["pdf", "zip"],
//         lessonId: parseInt(lessonId),
//       };

//       // إذا أرفق الأستاذ ملفاً للواجب
//       if (fileUrl) {
//         assignmentData.resources = {
//           create: [
//             {
//               resourceURL: fileUrl,
//               resourceType: "PDF/Document",
//               description: "ملف شرح الواجب",
//             },
//           ],
//         };
//       }

//       const newAssignment = await prisma.assignment.create({
//         data: assignmentData,
//         include: { resources: true },
//       });

//       return NextResponse.json(
//         { message: "تم إنشاء الواجب بنجاح", data: newAssignment },
//         { status: 201 },
//       );
//     }

//     return NextResponse.json(
//       { error: "نوع المحتوى غير مدعوم." },
//       { status: 400 },
//     );
//   } catch (error) {
//     console.error("Error creating content:", error);
//     return NextResponse.json({ error: "حدث خطأ في السيرفر." }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    }

    // اسم المدرس من الجلسة
    const teacherName =
      `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim() ||
      "المدرس";

    const { courseId } = await params;
    const cId = parseInt(courseId);
    const body = await request.json();

    const {
      type, // "LESSON" أو "ASSIGNMENT"
      title,
      description,
      // للدرس:
      sequenceNumber,
      videoUrl,
      videoDescription,
      duration,
      fileUrl,
      // للواجب:
      lessonId,
      deliveryDate,
      maxScore,
      allowedExtensions,
    } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "نوع المحتوى والعنوان مطلوبان." },
        { status: 400 },
      );
    }

    // جلب الطلاب المسجلين في المادة
    const enrolledStudents = await prisma.enrollment.findMany({
      where: { courseId: cId },
      select: { studentId: true },
    });

    // ==================== 1. حالة إضافة درس جديد ====================
    if (type === "LESSON") {
      if (sequenceNumber === undefined) {
        return NextResponse.json(
          { error: "ترتيب الدرس مطلوب." },
          { status: 400 },
        );
      }

      const lessonData = {
        title,
        description: description || null,
        sequenceNumber: parseInt(sequenceNumber),
        courseId: cId,
      };

      if (videoUrl) {
        lessonData.videos = {
          create: [
            {
              url: videoUrl,
              description: videoDescription || null,
              duration: parseInt(duration),
            },
          ],
        };
      }

      if (fileUrl) {
        lessonData.resources = {
          create: { title: `${title} - ملف مرفق`, fileUrl: fileUrl },
        };
      }

      const newLesson = await prisma.lesson.create({
        data: lessonData,
        include: { videos: true, resources: true },
      });

      // إنشاء إشعارات للطلاب عند نشر الدرس
      if (enrolledStudents.length > 0) {
        const notificationsData = enrolledStudents.map((enrollment) => ({
          userId: enrollment.studentId,
          lessonId: newLesson.id,
          alertType: "NEW_CONTENT",
          triggerReason: "NEW_CONTENT",
          title: `درس جديد: ${title}`,
          content: `تمت إضافة درس جديد بعنوان "${title}" من قبل المدرس ${teacherName}.`,
        }));

        await prisma.alertAndRecommendations.createMany({
          data: notificationsData,
        });
      }

      return NextResponse.json(
        { message: "تم إنشاء الدرس وإرسال الإشعارات بنجاح", data: newLesson },
        { status: 201 },
      );
    }

    // ==================== 2. حالة إضافة واجب جديد ====================
    if (type === "ASSIGNMENT") {
      if (!lessonId || !deliveryDate || !maxScore) {
        return NextResponse.json(
          {
            error:
              "الدرس التابع له، تاريخ التسليم، والدرجة العظمى حقول مطلوبة للواجب.",
          },
          { status: 400 },
        );
      }

      const parsedLessonId = parseInt(lessonId);

      const assignmentData = {
        title,
        content: description || "لا يوجد وصف إضافي",
        deliveryDate: new Date(deliveryDate),
        maxScore: parseInt(maxScore),
        allowedExtensions: allowedExtensions || ["pdf", "zip"],
        lessonId: parsedLessonId,
      };

      if (fileUrl) {
        assignmentData.resources = {
          create: [
            {
              resourceURL: fileUrl,
              resourceType: "PDF/Document",
              description: "ملف شرح الواجب",
            },
          ],
        };
      }

      const newAssignment = await prisma.assignment.create({
        data: assignmentData,
        include: { resources: true },
      });

      // إنشاء إشعارات للطلاب عند نشر الواجب
      if (enrolledStudents.length > 0) {
        const notificationsData = enrolledStudents.map((enrollment) => ({
          userId: enrollment.studentId,
          lessonId: parsedLessonId,
          alertType: "NEW_CONTENT",
          triggerReason: "NEW_CONTENT",
          title: `واجب جديد: ${title}`,
          content: `تم إسناد واجب جديد "${title}" بواسطة المدرس ${teacherName}. آخر موعد للتسليم: ${deliveryDate}`,
        }));

        await prisma.alertAndRecommendations.createMany({
          data: notificationsData,
        });
      }

      return NextResponse.json(
        {
          message: "تم إنشاء الواجب وإرسال الإشعارات بنجاح",
          data: newAssignment,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { error: "نوع المحتوى غير مدعوم." },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر." }, { status: 500 });
  }
}
