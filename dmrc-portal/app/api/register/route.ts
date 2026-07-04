import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";

// Simple in-memory rate limiter for development (10 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 10;
  const windowMs = 60 * 1000; // 1 minute

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
        { error: "Too many registration attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    // 2. Request body parsing
    const body = await req.json();

    // 3. Validation and Sanitization (Zod handles everything)
    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsedData.data;
    const { panCard, password } = data;

    // 4. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { panCard },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this PAN Card is already registered" },
        { status: 409 }
      );
    }

    // 5. Hash password (12 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Create user in database with all form fields
    await db.user.create({
      data: {
        panCard,
        password: hashedPassword,
        role: "VENDOR",

        // Section A: Company Details
        companyName: data.companyName,
        businessStructure: data.businessStructure,
        businessStructureOther: data.businessStructureOther || null,
        registeredAddress: data.registeredAddress,
        city: data.city,
        state: data.state,
        country: data.country,
        pinCode: data.pinCode,
        gstNumber: data.gstNumber,
        gstDocUrl: data.gstDocUrl,
        panDocUrl: data.panDocUrl,
        cinNumber: data.cinNumber || null,
        cinDocUrl: data.cinDocUrl || null,
        dateOfRegistration: data.dateOfRegistration ? new Date(data.dateOfRegistration) : null,
        contactCountryCode: data.contactCountryCode || "+91",
        contactNumber: data.contactNumber,
        companyEmail: data.companyEmail,

        // Section B: Authorised Representative
        repName: data.repName,
        repDesignation: data.repDesignation,
        repAuthDocUrl: data.repAuthDocUrl,
        repCountryCode: data.repCountryCode || "+91",
        repMobile: data.repMobile,
        repEmail: data.repEmail,
      },
    });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
