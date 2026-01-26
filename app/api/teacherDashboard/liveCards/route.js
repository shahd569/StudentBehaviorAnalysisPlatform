import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user || session.user.role !== "TEACHER") {
    //   return NextResponse.json(
    //     { message: "غير مسموح لك بالوصول لهذه البيانات" },
    //     { status: 401 }
    //   );
    // }

    // const teacherId = parseInt(session.user.id);

    const teacherId = 17;
    const [unGradedAssignments, unReadedMessage] = await Promise.all([
      prisma.AssignmentSubmission.count({
        where: {
          status: "SUBMITTED",
          assignment: {
            lesson: {
              course: {
                instructorId: teacherId,
              },
            },
          },
        },
      }),

      prisma.Message.count({
        where: {
          isRead: false,
          receivedId: teacherId,
        },
      }),
    ]);

    return NextResponse.json({
      unGradedAssignments,
      unReadedMessage,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل جلب البيانات" }, { status: 500 });
  }
}
