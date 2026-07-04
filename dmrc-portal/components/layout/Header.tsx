"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Train, LogOut, LayoutDashboard, FileText, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeToggle = (
    <Button
      variant="ghost"
      size="icon"
      className="text-white hover:bg-white/20 h-9 w-9 rounded-lg flex items-center justify-center transition-all animate-fadeIn"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle Theme"
    >
      {mounted && theme === "dark" ? (
        <Moon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ) : (
        <Sun className="h-4 w-4 text-white" />
      )}
    </Button>
  );

  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const isAuthPage = isLogin || isRegister;

  // Figma Design Header for Auth Pages
  if (isAuthPage) {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center shadow-md"
        style={{ backgroundColor: "#1d4ed8", height: "100px", paddingLeft: "48px", paddingRight: "48px" }}
      >
        {/* Logo area */}
        <div
          className="flex items-center justify-center mr-4 shrink-0 cursor-pointer overflow-hidden rounded-md bg-white p-1"
          style={{
            height: "70px",
          }}
          onClick={() => router.push("/login")}
        >
          <Image
            src="/logo-final.png"
            alt="DMRC Logo"
            width={180}
            height={70}
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        {/* Site title */}
        <span
          className="text-white tracking-wide select-none cursor-pointer"
          onClick={() => router.push("/login")}
          style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.04em" }}
        >
          DMRC Vendor Portal
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav links */}
        <nav className="flex items-center gap-2">
          {themeToggle}
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 rounded-lg text-white transition"
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              backgroundColor: isLogin ? "rgba(255,255,255,0.2)" : "transparent",
              border: isLogin ? "1px solid rgba(255,255,255,0.35)" : "1px solid transparent",
            }}
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 rounded-lg text-white transition"
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              backgroundColor: isRegister ? "rgba(255,255,255,0.2)" : "transparent",
              border: isRegister ? "1px solid rgba(255,255,255,0.35)" : "1px solid transparent",
            }}
          >
            Register
          </button>
        </nav>
      </header>
    );
  }

  // Standard DMRC Header for Dashboard
  return (
    <header className="sticky top-0 z-50 w-full shadow-md" style={{ backgroundColor: "#1d4ed8" }}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex items-center justify-center shrink-0 overflow-hidden rounded-md bg-white p-1" style={{ height: "56px" }}>
            <Image
              src="/logo-final.png"
              alt="DMRC Logo"
              width={140}
              height={56}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">
              DMRC
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/80">
              Vendor Registration Portal
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {themeToggle}
          <div className="mx-1.5 h-6 w-px bg-white/20" />
          <Link href="/dashboard?view=applications">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 text-white hover:bg-white/20 hover:text-white ${
                pathname === "/dashboard" &&
                typeof window !== "undefined" &&
                window.location.search.includes("view=applications")
                  ? "bg-white/20"
                  : ""
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </Button>
          </Link>
          <div className="mx-2 h-6 w-px bg-white/20" />
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-white border border-red-500 bg-red-500/10 hover:bg-red-600 hover:border-red-600 font-semibold px-4 transition-all rounded-lg"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4 text-red-300" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
