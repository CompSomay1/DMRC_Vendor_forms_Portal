"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Plus } from "lucide-react";

import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorApplication } from "@/types/application";

export default function DashboardPage() {
  const [application, setApplication] = useState<VendorApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplication, setHasApplication] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch("/api/vendor/status");

        if (response.ok) {
          const data = await response.json();
          setApplication(data.application);
          setHasApplication(true);
          setLoadError(null);
        } else if (response.status === 404) {
          setApplication(null);
          setHasApplication(false);
          setLoadError(null);
        } else {
          const data = await response.json().catch(() => null);
          setLoadError(data?.error || "Unable to load your application status right now.");
        }
      } catch {
        setLoadError("Unable to load your application status right now.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Vendor Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your application status and manage your vendor profile.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {!isLoading && loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {!isLoading && !loadError && hasApplication && application && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Application</h2>
          </div>
          <ApplicationCard application={application} />
        </div>
      )}

      {!isLoading && !loadError && !hasApplication && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dmrc-blue/10">
            <FileText className="h-8 w-8 text-dmrc-blue" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">No Application Yet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            You haven&apos;t submitted a vendor application yet. Start your application
            to register as a DMRC vendor in one of our categories: Civil, Electrical,
            or Architecture.
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard/apply">
              <Button
                id="dashboard-apply-cta"
                className="gap-2 bg-dmrc-blue text-white shadow-lg shadow-dmrc-blue/25 hover:bg-dmrc-blue-light"
                size="lg"
              >
                <Plus className="h-4 w-4" />
                Start Application
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
