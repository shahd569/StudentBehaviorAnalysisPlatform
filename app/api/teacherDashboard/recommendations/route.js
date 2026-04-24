// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//   try {
//     // const session = await getServerSession(authOptions);

//     // if (!session || !session.user || session.user.role !== "STUDENT") {
//     //   return NextResponse.json(
//     //     { message: "غير مسموح لك بالوصول لهذه البيانات" },
//     //     { status: 401 },
//     //   );
//     // }

//     // const teacherId = parseInt(session?.user.id);
//     const teacherId = 17;

//     const recommendations = await prisma.Recommendation.findMany({
//       where: { teacherId: teacherId },
//       include: {
//         course: true,
//       },
//     });
//     return NextResponse.json({ recommendations });
//   } catch (error) {
//     console.error("Error fetching recommendations:", error);
//     return NextResponse.json(
//       { message: "حدث خطأ أثناء جلب التوصيات" },
//       { status: 500 },
//     );
//   }
// }
