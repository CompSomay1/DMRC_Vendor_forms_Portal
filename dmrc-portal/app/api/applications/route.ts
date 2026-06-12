import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createApplicationSchema = z.object({
  category: z.enum(["CIVIL", "ELECTRICAL", "ARCHITECTURE"]),
  companyName: z.string().trim().optional(),
  formData: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = createApplicationSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { category, companyName, formData } = parsedBody.data;

    // Enforce business limit: Max 3 applications in UNDER_REVIEW status per category per vendor
    const underReviewCount = await db.vendorApplication.count({
      where: {
        userId: session.user.id,
        category,
        status: "UNDER_REVIEW",
      },
    });

    if (underReviewCount >= 3) {
      return NextResponse.json(
        { error: `Maximum of 3 applications under review allowed for the ${category} category` },
        { status: 403 }
      );
    }

    // Create the application in DRAFT status
    const application = await db.vendorApplication.create({
      data: {
        userId: session.user.id,
        category,
        status: "DRAFT",
        companyName: companyName || null,
        formData: (formData || {}) as any,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Unable to create new vendor application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await db.vendorApplication.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        documents: true,
      },
      orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("List applications error:", error);
    return NextResponse.json(
      { error: "Unable to fetch vendor applications" },
      { status: 500 }
    );
  }
}
