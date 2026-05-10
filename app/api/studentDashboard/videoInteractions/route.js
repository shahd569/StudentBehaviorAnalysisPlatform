import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received video interaction:", body);
    const { videoId, interactionType, currentTimeSeconds, value } = body;

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || !session.user || !session.user.id) {
      console.error("No valid session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = parseInt(session.user.id);
    console.log("Student ID:", studentId);

    const interaction = await prisma.VideoInteraction.create({
      data: {
        studentId,
        videoId: parseInt(videoId),
        interactionType,
        currentTimeSeconds: parseFloat(currentTimeSeconds) || 0,
        value: value ? parseFloat(value) : null,
      },
    });

    console.log("Interaction created:", interaction);

    return NextResponse.json({
      success: true,
      interaction,
    });
  } catch (error) {
    console.error("Error in videoInteractions:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
