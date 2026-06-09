import { z } from "zod";

// PAN Card regex: 5 uppercase letters + 4 digits + 1 uppercase letter
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const registerSchema = z
  .object({
    panCard: z
      .string()
      .min(1, "PAN Card number is required")
      .length(10, "PAN Card must be exactly 10 characters")
      .regex(PAN_REGEX, "Invalid PAN Card format (e.g., ABCDE1234F)")
      .transform((val) => val.toUpperCase().trim()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  panCard: z
    .string()
    .min(1, "PAN Card number is required")
    .length(10, "PAN Card must be exactly 10 characters")
    .regex(PAN_REGEX, "Invalid PAN Card format (e.g., ABCDE1234F)")
    .transform((val) => val.toUpperCase().trim()),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
