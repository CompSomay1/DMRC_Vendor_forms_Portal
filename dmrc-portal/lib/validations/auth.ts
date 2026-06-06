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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
