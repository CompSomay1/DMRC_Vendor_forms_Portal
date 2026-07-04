import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

// Simple in-memory rate limiter for upload (5 files per minute per IP)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 5;
  const windowMs = 60 * 1000;

  const ipData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - ipData.lastReset > windowMs) {
    ipData.count = 1;
    ipData.lastReset = now;
  } else {
    ipData.count++;
  }

  rateLimitMap.set(ip, ipData);

  return ipData.count > limit;
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many upload attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Only allow PDFs for registration documents
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF documents are allowed" }, { status: 400 });
    }

    // Enforce max file size of 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set up local uploads directory inside public/uploads/registration
    const uploadDir = join(process.cwd(), "public", "uploads", "registration");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique name to prevent collisions
    const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filePath = join(uploadDir, uniqueFileName);

    // Save file locally
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/registration/${uniqueFileName}`;

    return NextResponse.json({ fileUrl, fileName: file.name }, { status: 201 });
  } catch (error) {
    console.error("Registration upload error:", error);
    return NextResponse.json(
      { error: "Unable to upload document" },
      { status: 500 }
    );
  }
}
