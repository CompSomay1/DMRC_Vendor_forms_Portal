"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Building2, Calendar, Tag, ChevronRight } from "lucide-react";
import { VendorApplication, Category } from "@/types/application";

interface ApplicationCardProps {
  application: VendorApplication;
}

const categoryLabels: Record<Category, string> = {
  [Category.CIVIL]: "Civil Works",
  [Category.ELECTRICAL]: "Electrical Works",
  [Category.ARCHITECTURE]: "Architecture",
};

const categoryColors: Record<Category, string> = {
  [Category.CIVIL]: "bg-blue-50 text-blue-700 border-blue-200",
  [Category.ELECTRICAL]: "bg-purple-50 text-purple-700 border-purple-200",
  [Category.ARCHITECTURE]: "bg-teal-50 text-teal-700 border-teal-200",
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const formData = application.formData as Record<string, unknown>;

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-dmrc-blue via-dmrc-blue-light to-dmrc-gold" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">
              {application.companyName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Submitted on{" "}
              {new Date(application.submittedAt).toLocaleDateString("en-IN", {
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
      </CardContent>
    </Card>
  );
}
