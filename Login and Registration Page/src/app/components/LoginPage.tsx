import { useState } from "react";
import { useNavigate } from "react-router";

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

export function LoginPage() {
  const navigate = useNavigate();
  const [pan, setPan] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const bgUrl =
    "https://images.unsplash.com/photo-1758208974170-3a3037da0c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBidXNpbmVzcyUyMG9mZmljZSUyMGFic3RyYWN0JTIwYmx1ZXxlbnwxfHx8fDE3ODA4NTA2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div
      className="flex flex-1 items-center justify-center px-4 py-16 min-h-full relative"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15, 30, 80, 0.55)" }} />
      <div className="relative z-10 w-full max-w-md">
        {/* Page heading */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center rounded-2xl mb-4"
            style={{ width: "56px", height: "56px", backgroundColor: "#eff6ff" }}
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#1d4ed8" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-white" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
            Welcome Back
          </h1>
          <p className="mt-1" style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.75)" }}>
            Sign in to your Vendor Portal account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* PAN Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                PAN Number
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                style={{ fontSize: "0.9rem" }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-700" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  Enter Password
                </label>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 transition"
                  style={{ fontSize: "0.8rem" }}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  style={{ fontSize: "0.9rem" }}
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
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-lg py-3 text-white transition hover:opacity-90 active:opacity-80 shadow-sm"
              style={{ backgroundColor: "#1d4ed8", fontSize: "0.95rem", fontWeight: 600 }}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="mt-5 text-center text-gray-500" style={{ fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 transition"
              style={{ fontWeight: 600 }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
