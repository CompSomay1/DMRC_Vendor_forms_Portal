import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Shield, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="size-8" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">DMRC</h1>
              <p className="text-xs opacity-80">
                Delhi Metro Rail Corporation
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Shield className="size-4" />
            Secure Vendor Portal
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vendor Registration Portal
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Register as a vendor with Delhi Metro Rail Corporation. Submit your
            application for Civil, Electrical, or Architecture categories and
            track your approval status online.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/register">
                <FileText className="size-4" data-icon="inline-start" />
                Register as Vendor
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Already registered? Login</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Delhi Metro Rail Corporation. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
}
