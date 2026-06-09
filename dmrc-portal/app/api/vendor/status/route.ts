import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await db.vendorApplication.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
    });

    if (!application) {
      return NextResponse.json({ error: "No application found" }, { status: 404 });
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error("Vendor status error:", error);
    return NextResponse.json(
      { error: "Unable to fetch vendor application status" },
      { status: 500 }
    );
  }
}
