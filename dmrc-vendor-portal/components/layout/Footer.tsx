"use client";

import { Train } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Train className="h-4 w-4 text-dmrc-blue" />
            <span>
              Delhi Metro Rail Corporation Ltd.
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} DMRC. All rights reserved. | Vendor Registration Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
