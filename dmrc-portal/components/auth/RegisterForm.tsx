"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { toast } from "@/components/ui/sonner";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      panCard: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = useWatch({
    control,
    name: "password",
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panCard: values.panCard,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed. Please try again.");
        return;
      }

      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* PAN Card Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-700" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            PAN Number
          </label>
          <input
            type="text"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition uppercase tracking-wider focus:bg-white focus:ring-2 ${
              errors.panCard
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
            style={{ fontSize: "0.9rem" }}
            {...register("panCard", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
            disabled={isLoading}
          />
          {errors.panCard && (
            <p className="text-red-500" style={{ fontSize: "0.78rem" }}>
              {errors.panCard.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-700" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            Enter Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className={`w-full rounded-lg border bg-gray-50 px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
              style={{ fontSize: "0.9rem" }}
              {...register("password")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          
          {/* Password strength hint */}
          {passwordVal?.length > 0 && (
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      passwordVal.length >= i * 3
                        ? passwordVal.length >= 12
                          ? "#16a34a"
                          : passwordVal.length >= 8
                          ? "#ca8a04"
                          : "#ef4444"
                        : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          )}
          {errors.password && (
            <p className="text-red-500 mt-1" style={{ fontSize: "0.78rem" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-700" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className={`w-full rounded-lg border bg-gray-50 px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
              style={{ fontSize: "0.9rem" }}
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500" style={{ fontSize: "0.78rem" }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex items-center justify-center w-full rounded-lg py-3 text-white transition hover:opacity-90 active:opacity-80 shadow-sm disabled:opacity-70"
          style={{ backgroundColor: "#1d4ed8", fontSize: "0.95rem", fontWeight: 600 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>OR</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <p className="mt-5 text-center text-gray-500" style={{ fontSize: "0.875rem" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-700 transition"
          style={{ fontWeight: 600 }}
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
