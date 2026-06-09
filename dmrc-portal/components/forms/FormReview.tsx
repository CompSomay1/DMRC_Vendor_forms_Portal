"use client";

import { Category } from "@/types/application";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

interface FormReviewProps {
  category: Category;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues: Record<string, any>;
}

const categoryLabels: Record<Category, string> = {
  [Category.CIVIL]: "Civil Works",
  [Category.ELECTRICAL]: "Electrical Works",
  [Category.ARCHITECTURE]: "Architecture",
};

const roleLabels: Record<string, string> = {
  MANUFACTURER: "Manufacturer",
  AUTHORISED_RESELLER: "Authorised Reseller",
  FABRICATOR: "Fabricator",
};

export function FormReview({ category, formValues }: FormReviewProps) {
  const baseFields = formValues.baseFields || {};
  const categoryFields = formValues.categoryFields || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <h3 className="font-semibold text-emerald-800">
            Ready to Submit
          </h3>
          <p className="text-sm text-emerald-700">
            Please review all the details below before submitting your application.
          </p>
        </div>
      </div>

      {/* Company Information */}
      <section className="rounded-lg border border-border/50 bg-card p-5">
        <h4 className="mb-4 text-base font-bold text-foreground">
          Company Information
        </h4>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <ReviewItem label="Company Name" value={baseFields.companyName} />
          <ReviewItem label="Category" value={categoryLabels[category]} />
          <ReviewItem label="Role" value={roleLabels[baseFields.role] || baseFields.role} />
          <ReviewItem
            label="Manufacturing Period"
            value={baseFields.manufacturingPeriod ? `${baseFields.manufacturingPeriod} years` : undefined}
          />
          <ReviewItem
            label="Made in India"
            value={baseFields.madeInIndia ? "Yes" : "No"}
          />
          {!baseFields.madeInIndia && baseFields.countryName && (
            <ReviewItem label="Country" value={baseFields.countryName} />
          )}
          <ReviewItem
            label="Production Capacity"
            value={
              baseFields.productionCapacity
                ? `${baseFields.productionCapacity} ${baseFields.productionCapacityUnit || ""}`
                : undefined
            }
          />
          <ReviewItem
            label="Product Lifespan"
            value={baseFields.lifespan ? `${baseFields.lifespan} years` : undefined}
          />
        </div>
      </section>

      <Separator />

      {/* Category-specific fields */}
      <section className="rounded-lg border border-border/50 bg-card p-5">
        <h4 className="mb-4 text-base font-bold text-foreground">
          {categoryLabels[category]} — Category Details
        </h4>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          {categoryFields.isCodeConformance && (
            <ReviewItem label="IS Code" value={categoryFields.isCodeConformance} />
          )}
          {categoryFields.internationalCodeConformance && (
            <ReviewItem label="International Code" value={categoryFields.internationalCodeConformance} />
          )}
          <ReviewItem
            label="NABL Accredited"
            value={categoryFields.nablAccredited ? "Yes" : "No"}
          />
          <ReviewItem
            label="ISO Certified"
            value={categoryFields.isoCertified ? "Yes" : "No"}
          />

          {/* Architecture-specific */}
          {category === Category.ARCHITECTURE && categoryFields.materialItem && (
            <ReviewItem
              label="Material / Item"
              value={categoryFields.materialItem.replace(/_/g, " ")}
            />
          )}
          {category === Category.ARCHITECTURE && categoryFields.applicationArea && (
            <ReviewItem label="Application Area" value={categoryFields.applicationArea} />
          )}
        </div>

        {/* Purchase Orders summary */}
        {categoryFields.purchaseOrders && categoryFields.purchaseOrders.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Purchase / Work Orders: {categoryFields.purchaseOrders.length} entries
            </p>
            <div className="space-y-2">
              {categoryFields.purchaseOrders.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (po: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-md bg-muted/30 p-3 text-xs grid grid-cols-2 gap-2"
                  >
                    <span>
                      <strong>Client:</strong> {po.clientName || "—"}
                    </span>
                    <span>
                      <strong>Value:</strong> {po.totalValue} {po.currency}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Completion Certificates summary */}
        {categoryFields.completionCertificates && categoryFields.completionCertificates.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Completion Certificates: {categoryFields.completionCertificates.length} entries
            </p>
          </div>
        )}

        {/* Projects summary (Architecture) */}
        {categoryFields.projects && categoryFields.projects.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Projects: {categoryFields.projects.length} entries
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value || "—"}</span>
    </div>
  );
}
