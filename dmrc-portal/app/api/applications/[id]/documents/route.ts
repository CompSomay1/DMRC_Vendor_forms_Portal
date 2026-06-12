import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export async function POST(
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

    // Only DRAFT applications can receive document uploads
    if (application.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft applications can receive document uploads" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = formData.get("documentType") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set up local uploads directory inside public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique name to prevent collisions
    const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filePath = join(uploadDir, uniqueFileName);

    // Save file locally
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${uniqueFileName}`;

    // Create record in ApplicationDocument
    const document = await db.applicationDocument.create({
      data: {
        applicationId: id,
        documentType: documentType || "OTHER",
        fileName: file.name,
        fileUrl,
        mimeType: file.type || null,
        sizeBytes: file.size || null,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Unable to upload document" },
      { status: 500 }
    );
  }
}
