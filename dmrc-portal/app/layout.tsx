import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DMRC Vendor Registration Portal",
    template: "%s | DMRC Vendor Portal",
  },
  description:
    "Delhi Metro Rail Corporation — Secure portal for vendor registration, application submission, and approval tracking.",
  keywords: ["DMRC", "vendor", "registration", "Delhi Metro", "portal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
