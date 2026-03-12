import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAudit } from "@/lib/utils";

export async function GET() {
  const settingsList = await prisma.siteSetting.findMany();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = settingsList.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const updatedKeys = [];

    for (const [key, value] of Object.entries(data)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
      updatedKeys.push(key);
    }

    await logAudit(session.user.id, "UPDATE_SETTINGS_API", "SiteSetting", "Bulk", { keys: updatedKeys });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
