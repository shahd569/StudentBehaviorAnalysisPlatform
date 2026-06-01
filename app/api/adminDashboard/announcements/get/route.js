import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مسموح لك بالوصول لهذه البيانات" },
        { status: 401 },
      );
    }

    const adminId = parseInt(session?.user.id);
    // const adminId = 46;

    const adminAnnouncements = await prisma.Announcement.findMany({
      where: { creatorId: adminId },
    });

    const announcements = adminAnnouncements.map((a) => {
      return {
        title: a.title,
        content: a.content,
        createdAt: a.createdAt.toISOString().split("T")[0],
        attachmentURL: a.attachmentURL,
      };
    });
    return NextResponse.json({ announcements }, { status: 201 });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { message: "خطأ في جلب الإعلانات" },
      { status: 500 },
    );
  }
}
