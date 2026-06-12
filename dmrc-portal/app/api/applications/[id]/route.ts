import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { validateApplicationFormData } from "@/lib/validations/application";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const application = await db.vendorApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        documents: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error("Get application error:", error);
    return NextResponse.json(
      { error: "Unable to fetch vendor application details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const application = await db.vendorApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Only DRAFT applications can be edited
    if (application.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft applications can be updated" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { companyName, formData, status } = body;

    // Strict validation on submission
    if (status === "SUBMITTED") {
      if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
        return NextResponse.json(
          { error: "Company name is required for submission" },
          { status: 400 }
        );
      }

      const validatedFormData = validateApplicationFormData(
        application.category,
        formData || {}
      );

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

      // Update application to SUBMITTED and log submittedAt
      const updatedApplication = await db.vendorApplication.update({
        where: { id },
        data: {
          companyName,
          formData: validatedFormData.data as any,
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
        include: {
          documents: true,
        },
      });

      return NextResponse.json({ application: updatedApplication }, { status: 200 });
    }

    // Save draft update (partial details allowed)
    const updatedApplication = await db.vendorApplication.update({
      where: { id },
      data: {
        companyName: companyName !== undefined ? companyName : application.companyName,
        formData: formData !== undefined ? (formData as any) : application.formData || {},
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json({ application: updatedApplication }, { status: 200 });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Unable to update vendor application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const application = await db.vendorApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Only DRAFT applications can be deleted
    if (application.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft applications can be deleted" },
        { status: 400 }
      );
    }

    await db.vendorApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete application error:", error);
    return NextResponse.json(
      { error: "Unable to delete vendor application" },
      { status: 500 }
    );
  }
}
