"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { VendorApplication, Category } from "@/types/application";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categorySelection, setCategorySelection] = useState<Category>(Category.CIVIL);
  const [isCreating, setIsCreating] = useState(false);

  async function fetchApplications() {
    try {
      const response = await fetch("/api/applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        toast.error("Failed to load applications.");
      }
    } catch {
      toast.error("An error occurred while fetching your applications.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function handleCreateApplication() {
    setIsCreating(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categorySelection }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Unable to start new application.");
        return;
      }

      toast.success("Draft application created!");
      setIsCreateOpen(false);
      router.push(`/dashboard/apply?id=${data.application.id}`);
    } catch {
      toast.error("Failed to connect to the server.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Vendor Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, manage, and submit your vendor registration applications.
          </p>
        </div>
        {!isLoading && applications.length > 0 && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-dmrc-blue hover:bg-dmrc-blue-light text-white shadow-lg shadow-dmrc-blue/25"
          >
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      )}

      {/* Applications list */}
      {!isLoading && applications.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Your Applications ({applications.length})
          </h2>
          <div className="grid gap-4">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </div>
      )}

      {/* No applications — CTA */}
      {!isLoading && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dmrc-blue/10">
            <FileText className="h-8 w-8 text-dmrc-blue" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">
            No Applications Yet
          </h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Get started by creating a vendor application in one of our categories:
            Civil, Electrical, or Architecture.
          </p>
          <Button
            id="dashboard-apply-cta"
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-dmrc-blue hover:bg-dmrc-blue-light text-white shadow-lg shadow-dmrc-blue/25"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Start New Application
          </Button>
        </div>
      )}

      {/* New Application Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start New Application</DialogTitle>
            <DialogDescription>
              Select the category you want to register under. A vendor can submit
              multiple applications across different categories.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                value={categorySelection}
                onChange={(e) => setCategorySelection(e.target.value as Category)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value={Category.CIVIL}>Civil</option>
                <option value={Category.ELECTRICAL}>Electrical</option>
                <option value={Category.ARCHITECTURE}>Architecture</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateApplication}
              disabled={isCreating}
              className="bg-dmrc-blue hover:bg-dmrc-blue-light text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Draft"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
