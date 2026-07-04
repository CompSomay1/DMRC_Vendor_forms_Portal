"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { toast } from "@/components/ui/sonner";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

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

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      panCard: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        panCard: values.panCard,
        password: values.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        toast.error("Invalid PAN Card or password. Please try again.");
        return;
      }

      toast.success("Login successful! Redirecting...");
      router.replace(result.url ?? "/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* PAN Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-700 dark:text-zinc-300" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
            PAN Number
          </label>
          <input
            type="text"
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-3 text-gray-800 dark:text-zinc-100 placeholder-gray-400 outline-none transition uppercase tracking-wider focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
              errors.panCard
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-100"
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

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-zinc-300" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Enter Password
            </label>
            <button
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
              style={{ fontSize: "0.8rem" }}
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-3 pr-11 text-gray-800 dark:text-zinc-100 placeholder-gray-400 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-100"
              }`}
              style={{ fontSize: "0.9rem" }}
              {...register("password")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-350 transition"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500" style={{ fontSize: "0.78rem" }}>
              {errors.password.message}
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
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>OR</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <p className="mt-5 text-center text-gray-500" style={{ fontSize: "0.875rem" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:text-blue-700 transition"
          style={{ fontWeight: 600 }}
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
