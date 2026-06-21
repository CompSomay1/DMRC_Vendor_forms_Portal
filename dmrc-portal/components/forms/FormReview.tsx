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
          {category !== Category.ARCHITECTURE && categoryFields.isCodeConformance && (
            <ReviewItem label="IS Code" value={categoryFields.isCodeConformance} />
          )}
          {category !== Category.ARCHITECTURE && categoryFields.internationalCodeConformance && (
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
            <ReviewItem
              label="Application Area"
              value={[
                categoryFields.applicationArea.interior ? "Interior" : null,
                categoryFields.applicationArea.exterior ? "Exterior" : null,
              ].filter(Boolean).join(" & ") || "—"}
            />
          )}

          {category === Category.ARCHITECTURE && categoryFields.isCodes && categoryFields.isCodes.length > 0 && (
            <div className="col-span-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">IS Codes Conformance</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {categoryFields.isCodes.map((c: any, idx: number) => (
                  <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50">
                    {c.code} (Valid: {c.validTill})
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === Category.ARCHITECTURE && categoryFields.internationalCodes && categoryFields.internationalCodes.length > 0 && (
            <div className="col-span-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">International Codes Conformance</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {categoryFields.internationalCodes.map((c: any, idx: number) => (
                  <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50">
                    {c.code} (Valid: {c.validTill})
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === Category.ARCHITECTURE && categoryFields.nablAccredited && categoryFields.nablEntries && categoryFields.nablEntries.length > 0 && (
            <div className="col-span-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">NABL Labs Tested</span>
              <div className="flex flex-col gap-1.5 mt-1.5">
                {categoryFields.nablEntries.map((c: any, idx: number) => (
                  <span key={idx} className="text-xs text-foreground bg-muted/40 p-2 rounded-md border">
                    <strong>Lab:</strong> {c.labName} | <strong>Valid Till:</strong> {c.validTill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === Category.ARCHITECTURE && categoryFields.internationalLabTested && categoryFields.internationalLabEntries && categoryFields.internationalLabEntries.length > 0 && (
            <div className="col-span-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">International Labs Tested</span>
              <div className="flex flex-col gap-1.5 mt-1.5">
                {categoryFields.internationalLabEntries.map((c: any, idx: number) => (
                  <span key={idx} className="text-xs text-foreground bg-muted/40 p-2 rounded-md border">
                    <strong>Lab:</strong> {c.labName} | <strong>Test:</strong> {c.testName} | <strong>Valid Till:</strong> {c.validTill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === Category.ARCHITECTURE && categoryFields.isoCertified && categoryFields.isoEntries && categoryFields.isoEntries.length > 0 && (
            <div className="col-span-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">ISO Certifications</span>
              <div className="flex flex-col gap-1.5 mt-1.5">
                {categoryFields.isoEntries.map((c: any, idx: number) => (
                  <span key={idx} className="text-xs text-foreground bg-muted/40 p-2 rounded-md border">
                    <strong>Details:</strong> {c.isoDetails} | <strong>Valid Till:</strong> {c.validTill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === Category.ARCHITECTURE && categoryFields.greenCertified && categoryFields.greenEntries && categoryFields.greenEntries.length > 0 && (
            <div className="col-span-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">Green Certifications</span>
              <div className="flex flex-col gap-1.5 mt-1.5">
                {categoryFields.greenEntries.map((c: any, idx: number) => (
                  <span key={idx} className="text-xs text-foreground bg-muted/40 p-2 rounded-md border">
                    <strong>Organisation:</strong> {c.orgName} | <strong>Valid Till:</strong> {c.validTill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === Category.ARCHITECTURE && categoryFields.govRegistered && categoryFields.govEntries && categoryFields.govEntries.length > 0 && (
            <div className="col-span-2 mt-2">
              <span className="text-xs font-semibold text-muted-foreground">Govt / PSU Registrations</span>
              <div className="flex flex-col gap-1.5 mt-1.5">
                {categoryFields.govEntries.map((c: any, idx: number) => (
                  <span key={idx} className="text-xs text-foreground bg-muted/40 p-2 rounded-md border">
                    <strong>Organisation:</strong> {c.orgName} | <strong>Valid Till:</strong> {c.validTill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === Category.ARCHITECTURE && categoryFields.sriApplicable && (
            <div className="col-span-2 grid grid-cols-2 gap-3 mt-2">
              <ReviewItem label="SRI Value" value={categoryFields.sriValue} />
              <ReviewItem label="SRI Valid Till" value={categoryFields.sriValidTill} />
            </div>
          )}

          {/* ── Civil-specific review items ── */}
          {category === Category.CIVIL && categoryFields.materialItem && (
            <ReviewItem
              label="Material / Item"
              value={categoryFields.materialItem.replace(/_/g, " ")}
            />
          )}
          {category === Category.CIVIL && categoryFields.materialItemName && (
            <ReviewItem label="Material Name" value={categoryFields.materialItemName} />
          )}
          {category === Category.CIVIL && categoryFields.manufacturingOngoingPeriod && (
            <ReviewItem label="Manufacturing Ongoing" value={`${categoryFields.manufacturingOngoingPeriod} years`} />
          )}
          {category === Category.CIVIL && (
            <ReviewItem
              label="Manufactured in India"
              value={categoryFields.manufacturedInIndia ? "Yes" : `No (${categoryFields.countryOfOrigin || "—"})`}
            />
          )}

          {/* ── Electrical-specific review items ── */}
          {category === Category.ELECTRICAL && categoryFields.applyingAs && (
            <ReviewItem label="Applying As" value={categoryFields.applyingAs} />
          )}
          {category === Category.ELECTRICAL && categoryFields.materialItem && (
            <ReviewItem
              label="Material / Item"
              value={categoryFields.materialItem.replace(/_/g, " ")}
            />
          )}
          {category === Category.ELECTRICAL && categoryFields.nameOfMake && (
            <ReviewItem label="Name of Make" value={categoryFields.nameOfMake} />
          )}
          {category === Category.ELECTRICAL && categoryFields.capacity && (
            <ReviewItem label="Capacity" value={`${categoryFields.capacity} ${categoryFields.capacityUnit || ""}`} />
          )}
          {category === Category.ELECTRICAL && categoryFields.rating && (
            <ReviewItem label="Rating" value={`${categoryFields.rating} ${categoryFields.ratingUnit || ""}`} />
          )}
          {category === Category.ELECTRICAL && categoryFields.manufacturingOngoingPeriod && (
            <ReviewItem label="Manufacturing Ongoing" value={`${categoryFields.manufacturingOngoingPeriod} years`} />
          )}
          {category === Category.ELECTRICAL && (
            <ReviewItem
              label="Manufactured in India"
              value={categoryFields.manufacturedInIndia ? "Yes" : `No (${categoryFields.countryOfOrigin || "—"})`}
            />
          )}
        </div>

        {/* Manufacturing Units (Civil) */}
        {category === Category.CIVIL && categoryFields.manufacturingUnits && categoryFields.manufacturingUnits.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Manufacturing Units: {categoryFields.manufacturingUnits.length} entries
            </p>
            <div className="space-y-2">
              {categoryFields.manufacturingUnits.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (unit: any, i: number) => (
                  <div key={i} className="rounded-md bg-muted/30 p-3 text-xs">
                    <strong>Unit {i + 1}:</strong> {unit.address || "—"}
                    {unit.certifications && unit.certifications.length > 0 && (
                      <span className="ml-2 text-muted-foreground">
                        ({unit.certifications.length} certifications)
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Manufacturing Units (Electrical) */}
        {category === Category.ELECTRICAL && categoryFields.manufacturingUnits && categoryFields.manufacturingUnits.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Manufacturing Units: {categoryFields.manufacturingUnits.length} entries
            </p>
            <div className="space-y-2">
              {categoryFields.manufacturingUnits.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (unit: any, i: number) => (
                  <div key={i} className="rounded-md bg-muted/30 p-3 text-xs border border-border/40">
                    <strong>Unit {i + 1}:</strong> {unit.address || "—"}
                    <div className="grid grid-cols-2 gap-2 mt-1 text-muted-foreground">
                      <span><strong>Total Land Area:</strong> {unit.totalLandArea} {unit.totalLandAreaUnit}</span>
                      <span><strong>Covered Area:</strong> {unit.coveredArea} {unit.coveredAreaUnit}</span>
                      <span><strong>Licensed Capacity:</strong> {unit.licensedCapacity} {unit.licensedCapacityUnit}</span>
                      <span><strong>Actual Production:</strong> {unit.actualProduction} {unit.actualProductionUnit}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Parent Company Details (Electrical) */}
        {category === Category.ELECTRICAL && categoryFields.parentCompanyDetails && categoryFields.parentCompanyDetails.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Parent Company Details: {categoryFields.parentCompanyDetails.length} entries
            </p>
            <div className="space-y-2">
              {categoryFields.parentCompanyDetails.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (p: any, i: number) => (
                  <div key={i} className="rounded-md bg-muted/30 p-3 text-xs border border-border/40">
                    <strong>Parent Company {i + 1}:</strong> {p.parentCompanyName || "—"} ({p.countryOfOrigin || "—"})
                    <div className="text-muted-foreground mt-1">
                      <span><strong>Manufacturing Period:</strong> {p.manufacturingPeriod}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* In-House Facilities (Electrical) */}
        {category === Category.ELECTRICAL && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">In-House Facilities</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <span><strong>Design:</strong> {categoryFields.hasInHouseDesign ? "✅ Available" : "❌ Not available"}</span>
              <span><strong>Testing:</strong> {categoryFields.hasInHouseTesting ? "✅ Available" : "❌ Not available"}</span>
              <span><strong>R&D:</strong> {categoryFields.hasInHouseRnd ? "✅ Available" : "❌ Not available"}</span>
            </div>
          </div>
        )}

        {/* Approvals (Civil) */}
        {category === Category.CIVIL && categoryFields.approvals && categoryFields.approvals.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Approvals: {categoryFields.approvals.length} entries
            </p>
            <div className="space-y-2">
              {categoryFields.approvals.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (a: any, i: number) => (
                  <div key={i} className="rounded-md bg-muted/30 p-3 text-xs grid grid-cols-2 gap-2">
                    <span><strong>Agency:</strong> {a.agencyName || "—"}</span>
                    <span><strong>Valid Till:</strong> {a.validTill || "—"}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

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

        {/* Works Executed (Civil) */}
        {category === Category.CIVIL && categoryFields.worksExecuted && categoryFields.worksExecuted.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Works Executed: {categoryFields.worksExecuted.length} entries
            </p>
          </div>
        )}

        {/* Financial Data (Civil) */}
        {category === Category.CIVIL && categoryFields.financialData && categoryFields.financialData.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Financial Data: {categoryFields.financialData.length} years
            </p>
            <div className="flex flex-wrap gap-2">
              {categoryFields.financialData.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (fd: any, i: number) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50">
                    {fd.financialYear || "—"}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Financial Data (Electrical) */}
        {category === Category.ELECTRICAL && categoryFields.financialData && categoryFields.financialData.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Financial Data: {categoryFields.financialData.length} years
            </p>
            <div className="space-y-2">
              {categoryFields.financialData.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (fd: any, i: number) => (
                  <div key={i} className="rounded-md bg-muted/30 p-3 text-xs grid grid-cols-3 gap-2 border border-border/40">
                    <span><strong>Year:</strong> {fd.financialYear || "—"}</span>
                    <span><strong>Turnover:</strong> {fd.turnover} {fd.turnoverCurrency}</span>
                    <span><strong>Revenue:</strong> {fd.revenue} {fd.revenueCurrency}</span>
                    <span><strong>P/L:</strong> {fd.profitLoss} {fd.profitLossCurrency}</span>
                    <span><strong>Profitability:</strong> {fd.profitability}%</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Type Test Certificates (Electrical) */}
        {category === Category.ELECTRICAL && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Type Test Information</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <span><strong>Provided:</strong> {categoryFields.typeTestCertificateProvided ? "✅ Yes" : "❌ No"}</span>
              <span><strong>From Accredited Lab:</strong> {categoryFields.typeTestFromAccreditedLab ? "✅ Yes" : "❌ No"}</span>
              <span><strong>Proposed Model:</strong> {categoryFields.typeTestProposedModel ? "✅ Yes" : "❌ No"}</span>
              <span><strong>Relevant Standard:</strong> {categoryFields.typeTestRelevantStandard ? "✅ Yes" : "❌ No"}</span>
              <span><strong>Less than 5 years old:</strong> {categoryFields.typeTestLessThan5Years ? "✅ Yes" : "❌ No"}</span>
            </div>
          </div>
        )}

        {/* OCS Compliance (Civil) */}
        {category === Category.CIVIL && categoryFields.ocsComplianceReports && categoryFields.ocsComplianceReports.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              OCS Compliance Reports: {categoryFields.ocsComplianceReports.length} entries
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

        {/* Undertakings summary (Civil) */}
        {category === Category.CIVIL && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Undertakings</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span><strong>(a)</strong> {categoryFields.undertaking_a ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(b) Service Period:</strong> {categoryFields.undertaking_b_servicePeriod || "—"} years</span>
              <span><strong>(c)</strong> {categoryFields.undertaking_c ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(d)</strong> {categoryFields.undertaking_d ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(e)</strong> {categoryFields.undertaking_e ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(f)</strong> {categoryFields.undertaking_f ? "✅ Accepted" : "❌ Not accepted"}</span>
            </div>
          </div>
        )}

        {/* Undertakings summary (Electrical) */}
        {category === Category.ELECTRICAL && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Undertakings</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span><strong>(a)</strong> {categoryFields.undertaking_a ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(b) Service Period:</strong> {categoryFields.undertaking_b_servicePeriod || "—"} years</span>
              <span><strong>(c)</strong> {categoryFields.undertaking_c ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(d)</strong> {categoryFields.undertaking_d ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(e)</strong> {categoryFields.undertaking_e ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(f)</strong> {categoryFields.undertaking_f ? "✅ Accepted" : "❌ Not accepted"}</span>
              <span><strong>(g) EMI / EMC:</strong> {categoryFields.undertaking_g || "—"}</span>
              <span><strong>(h)</strong> {categoryFields.undertaking_h ? "✅ Accepted" : "❌ Not accepted"}</span>
            </div>
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
