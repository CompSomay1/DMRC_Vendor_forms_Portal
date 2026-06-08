"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { VendorApplication, Status, Category } from "@/types/application";

// Mock data for development — will be replaced with actual API call
const MOCK_APPLICATION: VendorApplication = {
  id: "mock-1",
  userId: "user-1",
  category: Category.CIVIL,
  status: Status.PENDING,
  companyName: "ABC Infrastructure Pvt. Ltd.",
  formData: {
    role: "MANUFACTURER",
    manufacturingPeriod: "12",
    madeInIndia: true,
    productionCapacity: "5000",
    productionCapacityUnit: "units/month",
    lifespan: "25",
  },
  submittedAt: new Date().toISOString(),
};

export default function DashboardPage() {
  const [application, setApplication] = useState<VendorApplication | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplication, setHasApplication] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch("/api/vendor/status");
        if (response.ok) {
          const data = await response.json();
          setApplication(data.application);
          setHasApplication(true);
        } else if (response.status === 404) {
          setHasApplication(false);
        }
      } catch {
        // If API not yet available (Person 2 hasn't built it),
        // show mock data for development
        setApplication(MOCK_APPLICATION);
        setHasApplication(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStatus();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Vendor Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your application status and manage your vendor profile.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {/* Application exists */}
      {!isLoading && hasApplication && application && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Application</h2>
          </div>
          <ApplicationCard application={application} />
        </div>
      )}

      {/* No application — CTA */}
      {!isLoading && !hasApplication && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dmrc-blue/10">
            <FileText className="h-8 w-8 text-dmrc-blue" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">
            No Application Yet
          </h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            You haven&apos;t submitted a vendor application yet. Start your
            application to register as a DMRC vendor in one of our categories:
            Civil, Electrical, or Architecture.
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard/apply">
              <Button
                id="dashboard-apply-cta"
                className="gap-2 bg-dmrc-blue hover:bg-dmrc-blue-light text-white shadow-lg shadow-dmrc-blue/25"
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
