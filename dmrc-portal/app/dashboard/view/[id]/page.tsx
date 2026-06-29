"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { VendorApplication } from "@/types/application";
import { ViewApplication } from "@/components/dashboard/ViewApplication";

export default function ViewApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [application, setApplication] = useState<VendorApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const response = await fetch(`/api/applications/${id}`);
        if (response.ok) {
          const data = await response.json();
          setApplication(data.application);
        } else {
          toast.error("Failed to load application details.");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching the application.");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchApplication();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-dmrc-blue" />
          <p>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Application not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            View Application
          </h1>
          <p className="text-muted-foreground">
            Read-only view of your submitted details.
          </p>
        </div>
      </div>

      <ViewApplication application={application} />
    </div>
  );
}
