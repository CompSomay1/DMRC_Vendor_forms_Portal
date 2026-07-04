import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your DMRC vendor account using your PAN Card number.",
};

const bgUrl = "/dmrc-train-bg2.jpg";

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen flex-1 items-center justify-center px-4 py-16 relative"
      style={{
        paddingTop: "100px",
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(15, 30, 80, 0.55)" }}
      />
      <div className="relative z-10 w-full max-w-md">
        {/* Page heading */}
        <div className="text-center mb-8">

          <h1
            className="text-white"
            style={{ fontSize: "1.6rem", fontWeight: 700 }}
          >
            Welcome Back
          </h1>
          <p
            className="mt-1"
            style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.75)" }}
          >
            Sign in to your Vendor Portal account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
