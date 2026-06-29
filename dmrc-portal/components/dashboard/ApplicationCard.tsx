"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Building2, Calendar, Tag, ChevronRight, Edit, Paperclip, Trash2, Loader2, FileText } from "lucide-react";
import { VendorApplication, Category } from "@/types/application";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApplicationCardProps {
  application: VendorApplication;
  onDelete?: () => void;
}

const categoryLabels: Record<Category, string> = {
  [Category.CIVIL]: "Civil Works",
  [Category.ELECTRICAL]: "Electrical Works",
  [Category.ARCHITECTURE]: "Architecture",
};

const categoryColors: Record<Category, string> = {
  [Category.CIVIL]: "bg-blue-50 text-blue-800 border-blue-200",
  [Category.ELECTRICAL]: "bg-blue-50 text-blue-800 border-blue-200",
  [Category.ARCHITECTURE]: "bg-blue-50 text-blue-800 border-blue-200",
};

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formData = application.formData as Record<string, unknown> | null;
  const isDraft = application.status === "DRAFT";

  const dateLabel = isDraft ? "Created on" : "Submitted on";
  const dateValue = application.submittedAt ?? application.createdAt;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Draft application deleted successfully.");
        setShowDeleteDialog(false);
        if (onDelete) {
          onDelete();
        }
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete draft.");
      }
    } catch {
      toast.error("Failed to delete draft.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Top accent bar */}
      <div className="h-1.5 bg-dmrc-blue" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">
              {application.companyName || `New ${categoryLabels[application.category]} Draft`}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {dateLabel}{" "}
              {new Date(dateValue).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </div>
          <StatusBadge status={application.status} size="md" />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category */}
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-dmrc-blue/10">
              <Tag className="h-4 w-4 text-dmrc-blue" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Category
              </p>
              <p className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${categoryColors[application.category]}`}>
                {categoryLabels[application.category]}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-dmrc-gold/10">
              <Building2 className="h-4 w-4 text-dmrc-gold-dark" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Role</p>
              <p className="text-sm font-semibold">
                {(formData?.role as string)?.replace("_", " ") || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Attached Documents Indicator */}
        {application.documents && application.documents.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/20 border border-border/40 p-2 rounded-lg w-fit">
            <Paperclip className="h-3.5 w-3.5 text-dmrc-blue" />
            <span>{application.documents.length} document(s) uploaded</span>
          </div>
        )}

        {/* Form data summary */}
        {formData && Object.keys(formData).length > 0 && (
          <div className="mt-4 rounded-lg border border-border/50 bg-muted/20 p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-1.5">
              <ChevronRight className="h-4 w-4 text-dmrc-blue" />
              Application Details
            </h4>
            <div className="grid gap-2 text-sm">
              {!!formData.manufacturingPeriod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manufacturing Period</span>
                  <span className="font-medium">{String(formData.manufacturingPeriod)} years</span>
                </div>
              )}
              {!!formData.productionCapacity && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Production Capacity</span>
                  <span className="font-medium">
                    {String(formData.productionCapacity)} {String(formData.productionCapacityUnit)}
                  </span>
                </div>
              )}
              {!!formData.lifespan && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Lifespan</span>
                  <span className="font-medium">{String(formData.lifespan)} years</span>
                </div>
              )}
              {formData.madeInIndia !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Made in India</span>
                  <span className="font-medium">{formData.madeInIndia ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isDraft ? (
          <div className="mt-5 flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-1.5 border-destructive/30 hover:border-destructive hover:bg-destructive/5 text-destructive font-semibold transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Draft
            </Button>
            <Link href={`/dashboard/apply?id=${application.id}`}>
              <Button
                size="sm"
                className="gap-1.5 bg-dmrc-blue hover:bg-dmrc-blue-light text-white font-semibold shadow-md shadow-dmrc-blue/20"
              >
                <Edit className="h-3.5 w-3.5" />
                Resume Application
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-end">
            <Link href={`/dashboard/view/${application.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-dmrc-blue/30 text-dmrc-blue hover:bg-dmrc-blue/5 hover:text-dmrc-blue-light font-semibold transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                View Application
              </Button>
            </Link>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete Draft Application?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this draft application for{" "}
                <strong className="text-foreground">
                  {application.companyName || `New ${categoryLabels[application.category]} Draft`}
                </strong>
                ? This action cannot be undone and will permanently remove all entered data and uploaded files.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-4 sm:gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
