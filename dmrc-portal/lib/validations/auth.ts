import { z } from "zod";

// PAN Card regex: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
export const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const loginSchema = z.object({
  panCard: z
    .string()
    .min(1, { message: "PAN Card is required" })
    .trim()
    .toUpperCase()
    .regex(panRegex, { message: "Invalid PAN card format (expected e.g. ABCDE1234F)" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z
  .object({
    // Section A: Company Details
    companyName: z.string().min(1, "Company Name is required"),
    businessStructure: z.enum(["SOLE_PROPRIETORSHIP", "LLP", "PUBLIC_LIMITED", "PRIVATE_LIMITED", "OTHER"], {
      message: "Please select business structure",
    }),
    businessStructureOther: z.string().optional().default(""),
    registeredAddress: z.string().min(1, "Registered Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    pinCode: z.string().regex(/^\d{6}$/, "PIN Code must be a 6-digit number"),
    gstNumber: z.string().min(1, "GST Number is required"),
    gstDocUrl: z.string().min(1, "GST document PDF is required"),
    panDocUrl: z.string().min(1, "PAN document PDF is required"),
    cinNumber: z.string().optional().default(""),
    cinDocUrl: z.string().optional().default(""),
    dateOfRegistration: z.string().min(1, "Date of Registration is required"),
    contactCountryCode: z.string().default("+91"),
    contactNumber: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
    companyEmail: z.string().email("Invalid company email address"),

    // Section B: Authorised Representative
    repName: z.string().min(1, "Representative name is required"),
    repDesignation: z.string().min(1, "Designation is required"),
    repAuthDocUrl: z.string().min(1, "Authorisation document PDF is required"),
    repCountryCode: z.string().default("+91"),
    repMobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    repEmail: z.string().email("Invalid representative email address"),

    // Section C: Credentials & Declaration
    panCard: z
      .string()
      .min(1, { message: "PAN Card is required" })
      .trim()
      .toUpperCase()
      .regex(panRegex, { message: "Invalid PAN card format (expected e.g. ABCDE1234F)" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters" }),
    declaration: z.boolean().refine((val) => val === true, "You must accept the declaration"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.businessStructure === "OTHER" && (!data.businessStructureOther || data.businessStructureOther.trim() === "")) {
      return false;
    }
    return true;
  }, {
    message: "Please specify other business structure",
    path: ["businessStructureOther"],
  })
  .refine((data) => {
    if (data.cinNumber && data.cinNumber.trim() !== "" && (!data.cinDocUrl || data.cinDocUrl.trim() === "")) {
      return false;
    }
    return true;
  }, {
    message: "CIN document PDF is required when CIN is provided",
    path: ["cinDocUrl"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.input<typeof registerSchema>;
