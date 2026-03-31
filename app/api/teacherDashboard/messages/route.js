import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "TEACHER") {
    //   return NextResponse.json({ message: "غير مسموح" }, { status: 401 });
    // }

    // const teacherId = parseInt(session.user.id);

    const teacherId = 17;

    const messages = await prisma.Message.findMany({
      where: {
        OR: [{ senderId: teacherId }, { receivedId: teacherId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // منطق تجميع الرسائل في محادثات
    //يظهر اسم الطالب مرة واحدة مع آخر رسالة بينه وبين الأستاذ
    const conversations = [];
    const viewedUsers = new Set();

    messages.forEach((msg) => {
      const otherUser = msg.senderId === teacherId ? msg.receiver : msg.sender;

      if (!viewedUsers.has(otherUser.id)) {
        viewedUsers.add(otherUser.id);
        conversations.push({
          userId: otherUser.id,
          userName: `${otherUser.firstName} ${otherUser.lastName}`,
          userImage: otherUser.profilePictureUrl,
          userRole: otherUser.role,
          lastMessage: msg.content,
          time: msg.createdAt,
          isRead: msg.senderId === teacherId ? true : msg.isRead, // إذا كان الأستاذ هو المرسل نعتبرها مقروءة بالنسبة له
        });
      }
    });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error("Messages Error:", error);
    return NextResponse.json(
      { message: "خطأ في جلب الرسائل" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { content, receivedId } = await req.json();

    const newMessage = await prisma.Message.create({
      data: {
        content: content,
        senderId: parseInt(session.user.id),
        // senderId: 17,
        receivedId: parseInt(receivedId),
      },
    });
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل إرسال الرسالة" }, { status: 500 });
  }
}
