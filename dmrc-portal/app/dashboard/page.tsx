"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  FileText, 
  Plus, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  FileCheck, 
  FileEdit, 
  ArrowRight, 
  ShieldCheck 
} from "lucide-react";
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

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const isApplicationsView = view === "applications";

  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categorySelection, setCategorySelection] = useState<Category>(Category.CIVIL);
  const [isCreating, setIsCreating] = useState(false);

  // Accordion toggle states
  const [isSubmittedOpen, setIsSubmittedOpen] = useState(true);
  const [isDraftOpen, setIsDraftOpen] = useState(true);

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

  // Segregate applications
  const submittedApps = applications.filter((app) => app.status !== "DRAFT");
  const draftApps = applications.filter((app) => app.status === "DRAFT");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {isApplicationsView && (
        /* 1. Dashboard Header (Shown only on Applications View) */
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-sans">
              My Applications
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              View and manage your draft and submitted vendor registration applications.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : isApplicationsView ? (
        /* ================= APPLICATIONS VIEW ================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Section A: Submitted Applications */}
          <div className="border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/30 shadow-sm">
            <button
              onClick={() => setIsSubmittedOpen(!isSubmittedOpen)}
              className="w-full flex items-center justify-between px-6 py-5 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition border-b border-gray-100 dark:border-zinc-800/80"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100">Submitted & Under Review</h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-400">Applications sent to DMRC for official verification</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 rounded-full border dark:border-emerald-900/30">
                  {submittedApps.length} Form{submittedApps.length !== 1 && "s"}
                </span>
                {isSubmittedOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                )}
              </div>
            </button>

            {isSubmittedOpen && (
              <div className="p-6 bg-white dark:bg-zinc-950/20 gap-4 flex flex-col transition duration-300 border-t dark:border-zinc-800/80">
                {submittedApps.length > 0 ? (
                  <div className="grid gap-4">
                    {submittedApps.map((app) => (
                      <ApplicationCard key={app.id} application={app} onDelete={fetchApplications} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-6">No submitted applications found.</p>
                )}
              </div>
            )}
          </div>

          {/* Section B: Draft Applications */}
          <div className="border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/30 shadow-sm">
            <button
              onClick={() => setIsDraftOpen(!isDraftOpen)}
              className="w-full flex items-center justify-between px-6 py-5 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition border-b border-gray-100 dark:border-zinc-800/80"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileEdit className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100">Draft Applications</h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-400">Forms in progress that you can save and edit later</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-2.5 py-1 rounded-full border dark:border-amber-900/30">
                  {draftApps.length} Draft{draftApps.length !== 1 && "s"}
                </span>
                {isDraftOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                )}
              </div>
            </button>

            {isDraftOpen && (
              <div className="p-6 bg-white dark:bg-zinc-950/20 gap-4 flex flex-col transition duration-300 border-t dark:border-zinc-800/80">
                {draftApps.length > 0 ? (
                  <div className="grid gap-4">
                    {draftApps.map((app) => (
                      <ApplicationCard key={app.id} application={app} onDelete={fetchApplications} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-6">No draft applications in progress.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= CLEAN LANDING HOME VIEW (ONE UP, TWO DOWN) ================= */
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Top Card: Highlighted Vendor Dashboard and About */}
          <div className="border border-blue-100 dark:border-zinc-800/80 rounded-3xl bg-blue-50/10 dark:bg-zinc-900/30 shadow-sm p-8 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-dmrc-blue dark:text-zinc-100 font-sans">
                  Vendor Dashboard
                </h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-dmrc-gold-dark dark:text-amber-500 mt-0.5">
                  Delhi Metro Rail Corporation
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Welcome to the DMRC Vendor Portal. You can register as a vendor for Civil, Electrical, or Architecture works by submitting a registration application. Once submitted, DMRC officials will verify and review your credentials.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-50 dark:border-zinc-800/80">
              <div className="p-4 bg-white/60 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80 rounded-2xl text-center shadow-xs">
                <span className="block text-lg font-bold text-dmrc-blue dark:text-zinc-100">Civil</span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-400 uppercase font-bold tracking-wider mt-1 block">Flooring, Pavers, Civil Works</span>
              </div>
              <div className="p-4 bg-white/60 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80 rounded-2xl text-center shadow-xs">
                <span className="block text-lg font-bold text-dmrc-blue dark:text-zinc-100">Electrical</span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-400 uppercase font-bold tracking-wider mt-1 block">Switchgear, Lighting, Transformers</span>
              </div>
              <div className="p-4 bg-white/60 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80 rounded-2xl text-center shadow-xs">
                <span className="block text-lg font-bold text-dmrc-blue dark:text-zinc-100">Architecture</span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-400 uppercase font-bold tracking-wider mt-1 block">Doors, Cladding, Finishes</span>
              </div>
            </div>
          </div>

          {/* Two Down Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action 1: Create Draft */}
            <div 
              onClick={() => setIsCreateOpen(true)}
              className="group border border-gray-100 dark:border-zinc-800/80 rounded-3xl bg-white dark:bg-zinc-900/30 shadow-sm p-8 flex flex-col justify-between h-[180px] cursor-pointer hover:border-blue-400 dark:hover:border-zinc-700 hover:shadow-md transition duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                  <Plus className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 dark:text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-1 transition duration-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100">New Registration Form</h3>
                <p className="text-xs text-gray-400 dark:text-zinc-400 mt-1">Start a new vendor application</p>
              </div>
            </div>

            {/* Action 2: View Applications */}
            <div 
              onClick={() => router.push("/dashboard?view=applications")}
              className="group border border-gray-100 dark:border-zinc-800/80 rounded-3xl bg-white dark:bg-zinc-900/30 shadow-sm p-8 flex flex-col justify-between h-[180px] cursor-pointer hover:border-emerald-400 dark:hover:border-zinc-700 hover:shadow-md transition duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                  <FileText className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 dark:text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition duration-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100">View Applications</h3>
                <p className="text-xs text-gray-400 dark:text-zinc-400 mt-1">Check progress of {applications.length} submitted & draft form{applications.length !== 1 && "s"}</p>
              </div>
            </div>
          </div>
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
          <DialogFooter className="gap-4 sm:gap-4">
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-dmrc-blue" />
        <p className="text-sm text-muted-foreground font-medium font-sans">Loading Dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
