import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. التحقق من هوية المستخدم المسجل
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح بالدخول" },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id);
    // const userId = 17;

    // 2. جلب البيانات الشخصية مع عداد الإشعارات والرسائل في استعلام واحد
    const userData = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        profilePictureUrl: true,
        role: true,
        // استخدام _count لجلب الأرقام التي ستظهر فوق الأيقونات
        _count: {
          select: {
            // عد الرسائل المستلمة التي لم تُقرأ بعد
            receivedMessages: {
              where: { isRead: false },
            },
            // عد التنبيهات والتوصيات التي لم تُشاهد بعد
            alerts: {
              where: { isRead: false },
            },
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 },
      );
    }

    // 3. تنسيق البيانات المرسلة للفرونت إند
    return NextResponse.json({
      fullName: `${userData.firstName} ${userData.lastName}`,
      avatar: userData.profilePictureUrl || "/default-avatar.png",
      role: userData.role,
      notifications: {
        messagesCount: userData._count.receivedMessages,
        alertsCount: userData._count.alerts,
      },
    });
  } catch (error) {
    console.error("Navbar API Error:", error);
    return NextResponse.json({ message: "خطأ في الخادم" }, { status: 500 });
  }
}
