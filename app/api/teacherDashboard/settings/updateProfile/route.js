import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(req) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { message: "غير مصرح لك بالوصول" },
    //     { status: 401 },
    //   );
    // }

    // const userId = parseInt(session.user.id);
    const userId = 33;
    const body = await req.json();

    const {
      firstName,
      lastName,
      profilePictureUrl,
      major,
      college,
      academicYear,
    } = body;

    const updatedUser = await prisma.Users.update({
      where: {
        id: userId,
      },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(profilePictureUrl && { profilePictureUrl }),
        ...(college && { college }),
        ...(major && { major }),
        ...(academicYear && { academicYear }),
      },
    });

    const { hashedPassword, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      {
        message: "تم تحديث البيانات بنجاح",
        user: userWithoutPassword,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث البيانات" },
      { status: 500 },
    );
  }
}
