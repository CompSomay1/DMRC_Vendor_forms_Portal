import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  applicationSubmitSchema,
  validateApplicationFormData,
} from "@/lib/validations/application";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = applicationSubmitSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message || "Invalid application payload" },
        { status: 400 }
      );
    }

    const { category, companyName, formData } = parsedBody.data;
    const validatedFormData = validateApplicationFormData(category, formData);

    if (!validatedFormData.success) {
      return NextResponse.json(
        {
          error:
            validatedFormData.error.issues[0]?.message ||
            "Submitted application data is invalid",
        },
        { status: 400 }
      );
    }

    const existingApplication = await db.vendorApplication.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already submitted an application" },
        { status: 409 }
      );
    }

    const application = await db.vendorApplication.create({
      data: {
        userId: session.user.id,
        category,
        status: "SUBMITTED",
        companyName,
        formData: validatedFormData.data,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Vendor apply error:", error);
    return NextResponse.json(
      { error: "Unable to submit vendor application" },
      { status: 500 }
    );
  }
}
