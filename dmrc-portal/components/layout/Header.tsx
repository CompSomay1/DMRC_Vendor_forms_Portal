"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Train, LogOut, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dmrc-blue shadow-md">
            <Train className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-dmrc-blue">
              DMRC
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Vendor Registration Portal
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/dashboard/apply">
            <Button
              variant={pathname === "/dashboard/apply" ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Apply</span>
            </Button>
          </Link>
          <div className="mx-2 h-6 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
