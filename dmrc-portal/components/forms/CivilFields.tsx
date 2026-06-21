"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Upload, Loader2, CheckCircle2, Factory, Building2, Award, Briefcase, Shield, DollarSign, FileCheck, FileSignature } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CIVIL_MATERIALS } from "./materials";
import { CertificateRow } from "./CertificateRow";
import { toast } from "@/components/ui/sonner";

interface CivilFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  applicationId: string;
}

// ─── Reusable inline file upload button ───
function InlineFileUpload({
  label,
  fieldName,
  form,
  applicationId,
  documentType,
}: {
  label: string;
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  applicationId: string;
  documentType: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileUrl = form.watch(fieldName);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("documentType", documentType);

      const response = await fetch(`/api/applications/${applicationId}/documents`, {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "File upload failed.");
        return;
      }

      toast.success("Document uploaded successfully!");
      form.setValue(fieldName, data.document.fileUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormItem className="space-y-1.5">
      <FormLabel className="text-xs font-semibold text-foreground">{label}</FormLabel>
      <div className="flex items-center gap-2">
        {fileUrl ? (
          <div className="flex items-center gap-2 w-full h-10 border border-emerald-200/60 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-md text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate hover:underline flex-1"
            >
              View PDF
            </a>
            <label className="cursor-pointer text-xs font-bold text-dmrc-blue hover:text-dmrc-blue-light transition-colors shrink-0">
              Replace
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-dmrc-blue hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-dmrc-blue" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 text-muted-foreground" />
                Upload PDF
              </>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ fieldState }) =>
          fieldState.error ? (
            <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p>
          ) : <></>
        }
      />
    </FormItem>
  );
}

// ─── Client Type Select Options ───
const CLIENT_TYPE_OPTIONS = [
  { value: "METRO_RAILWAYS", label: "Metro / Railways" },
  { value: "RDSO", label: "RDSO" },
  { value: "GOVT", label: "Government / Semi Govt." },
  { value: "PSU", label: "PSU / SPV / Govt. Undertaking" },
  { value: "GOVT_INSTITUTION", label: "Govt. Owned Institution" },
  { value: "PRIVATE_LISTED", label: "Private (NSE/BSE Listed)" },
];

// ─── Agency Type Select Options ───
const AGENCY_TYPE_OPTIONS = [
  { value: "METRO", label: "Metro" },
  { value: "RAILWAYS", label: "Railways" },
  { value: "RDSO", label: "RDSO" },
  { value: "GOVT", label: "Government / Semi Govt." },
  { value: "PSU", label: "PSU / SPV" },
  { value: "GOVT_INSTITUTION", label: "Govt. Owned Institution" },
  { value: "PRIVATE_LISTED", label: "Private (NSE/BSE Listed)" },
];

// ─── Section Header Component ───
function SectionHeader({ letter, title, subtitle, icon: Icon, color = "bg-teal-600" }: {
  letter: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color} text-sm font-bold text-white shadow-md`}>
        {letter}
      </div>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-teal-600" />
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function CivilFields({ form, applicationId }: CivilFieldsProps) {
  // ── Field arrays ──
  const { fields: mfgUnits, append: addMfgUnit, remove: removeMfgUnit } = useFieldArray({
    control: form.control,
    name: "categoryFields.manufacturingUnits",
  });

  const { fields: directors, append: addDirector, remove: removeDirector } = useFieldArray({
    control: form.control,
    name: "categoryFields.directorsShareholding",
  });

  const { fields: approvalEntries, append: addApproval, remove: removeApproval } = useFieldArray({
    control: form.control,
    name: "categoryFields.approvals",
  });

  const { fields: qualityCerts, append: addQualityCert, remove: removeQualityCert } = useFieldArray({
    control: form.control,
    name: "categoryFields.qualityCertifications",
  });

  const { fields: appCodes, append: addAppCode, remove: removeAppCode } = useFieldArray({
    control: form.control,
    name: "categoryFields.applicableCodes",
  });

  const { fields: ocsReports, append: addOcsReport, remove: removeOcsReport } = useFieldArray({
    control: form.control,
    name: "categoryFields.ocsComplianceReports",
  });

  // ── Watch toggles ──
  const manufacturedInIndia = form.watch("categoryFields.manufacturedInIndia");
  const inHouseTestingAccredited = form.watch("categoryFields.inHouseTestingAccredited");
  const externalTestingConducted = form.watch("categoryFields.externalTestingConducted");
  const undertakingD = form.watch("categoryFields.undertaking_d");

  // ── Upload state tracking ──
  const [, setUploadingState] = useState<Record<string, boolean>>({});

  // Max date for OCS reports (12 months from today)
  const maxOcsDate = new Date();
  maxOcsDate.setMonth(maxOcsDate.getMonth() + 12);
  const maxOcsDateStr = maxOcsDate.toISOString().split("T")[0];

  // Financial year options
  const currentYear = new Date().getFullYear();
  const fyOptions = [
    { value: `${currentYear - 1}-${String(currentYear).slice(2)}`, label: `${currentYear - 1} – ${String(currentYear).slice(2)}` },
    { value: `${currentYear - 2}-${String(currentYear - 1).slice(2)}`, label: `${currentYear - 2} – ${String(currentYear - 1).slice(2)}` },
    { value: `${currentYear - 3}-${String(currentYear - 2).slice(2)}`, label: `${currentYear - 3} – ${String(currentYear - 2).slice(2)}` },
  ];

  return (
    <div className="space-y-8">
      {/* ════════════════════════════════════════════════════════
          SECTION A: GENERAL INFORMATION
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="A" title="General Information" subtitle="Material details and manufacturing units" icon={Factory} />

        {/* A.1 – Applying as (already in BaseFields) */}
        {/* A.2 – Material / Item / Product */}
        <FormField
          control={form.control}
          name="categoryFields.materialItem"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Material / Item / Product <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 bg-background border-border/80">
                    <SelectValue placeholder="Select material / item / product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-80 overflow-y-auto">
                  {CIVIL_MATERIALS.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="text-xs whitespace-normal h-auto py-2">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* A.3 – Name of material */}
        <FormField
          control={form.control}
          name="categoryFields.materialItemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Name of Material / Item / Product <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter the name of your material / item / product" className="h-11" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* A.4 – Other details */}
        <FormField
          control={form.control}
          name="categoryFields.otherDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Other Details (if any)</FormLabel>
              <FormControl>
                <Input placeholder="Any additional details" className="h-11" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* A.5 – Manufacturing Units */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">5. Details of Manufacturing Unit / Factory</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Submit independent certifications / accreditations (e.g., ISO 9001, ISO 14001). DMRC reserves the right to inspect premises.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addMfgUnit({
                  address: "",
                  certifications: [],
                  licensedCapacity: "",
                  licensedCapacityUnit: "per_month",
                  licensedCapacityDocUrl: "",
                  actualProduction: "",
                  actualProductionUnit: "per_month",
                  actualProductionDocUrl: "",
                })
              }
              className="gap-1.5 h-8 text-xs font-semibold shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Add Unit
            </Button>
          </div>

          <div className="space-y-4">
            {mfgUnits.map((field, unitIdx) => (
              <ManufacturingUnitCard
                key={field.id}
                form={form}
                unitIdx={unitIdx}
                onRemove={() => removeMfgUnit(unitIdx)}
                canRemove={mfgUnits.length > 1}
                applicationId={applicationId}
              />
            ))}
            {mfgUnits.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No manufacturing units added yet. Click &quot;Add Unit&quot; above.
              </p>
            )}
          </div>
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* ════════════════════════════════════════════════════════
          SECTION B: COMPANY PROFILE AND EXPERIENCE
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="B" title="Company Profile & Experience" subtitle="Company details, directors, and organisation" icon={Building2} />

        {/* B.1 – Directors / Share Holding */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">1. Company Details – Directors & Shareholding</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addDirector({ details: "", documentUrl: "" })}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add Row
            </Button>
          </div>

          <div className="space-y-3">
            {directors.map((field, idx) => (
              <div key={field.id} className="relative border border-border/50 bg-muted/5 p-4 rounded-xl space-y-4 md:space-y-0 md:flex md:items-end md:gap-4 transition-all hover:bg-muted/10">
                <div className="flex-1 min-w-[200px]">
                  <FormField
                    control={form.control}
                    name={`categoryFields.directorsShareholding.${idx}.details`}
                    render={({ field: formField }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Details <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Board of Directors / Shareholding details" className="h-10 text-sm" {...formField} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <InlineFileUpload
                    label="Supporting Document"
                    fieldName={`categoryFields.directorsShareholding.${idx}.documentUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="DIRECTOR_SHAREHOLDING_DOC"
                  />
                </div>
                <div className="flex justify-end pt-2 md:pt-0 shrink-0">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDirector(idx)} className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {directors.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No entries added. Click &quot;Add Row&quot; to add director / shareholding details.
              </p>
            )}
          </div>
        </div>

        {/* B.2 – Manufactured in India */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground">2. Is the material / item / product manufactured in India?</h4>
          <FormField
            control={form.control}
            name="categoryFields.manufacturedInIndia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-semibold cursor-pointer">Yes, manufactured in India</FormLabel>
              </FormItem>
            )}
          />
          {!manufacturedInIndia && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/50">
              <FormField
                control={form.control}
                name="categoryFields.countryOfOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Country of Origin <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country name" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <InlineFileUpload
                label="Authorisation Document"
                fieldName="categoryFields.authorisationDocUrl"
                form={form}
                applicationId={applicationId}
                documentType="AUTHORISATION_DOC"
              />
            </div>
          )}
        </div>

        {/* B.3 – Technical Catalogue */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <h4 className="text-sm font-bold text-foreground">3. Technical Catalogue / Brochure</h4>
          <p className="text-xs text-muted-foreground">Maximum size of 5 MB, PDF only.</p>
          <InlineFileUpload
            label="Upload Catalogue (PDF)"
            fieldName="categoryFields.technicalCatalogueUrl"
            form={form}
            applicationId={applicationId}
            documentType="TECHNICAL_CATALOGUE"
          />
        </div>

        {/* B.4 – Manufacturing Ongoing Period */}
        <FormField
          control={form.control}
          name="categoryFields.manufacturingOngoingPeriod"
          render={({ field }) => (
            <FormItem className="rounded-xl border border-border/50 bg-card p-5">
              <FormLabel className="text-sm font-bold text-foreground">
                4. How long has the manufacturing been ongoing? <span className="text-destructive">*</span>
              </FormLabel>
              <div className="flex items-center gap-2 mt-2">
                <FormControl>
                  <Input type="number" min="0" placeholder="Years" className="h-10 w-32" {...field} />
                </FormControl>
                <span className="text-sm text-muted-foreground">years</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* B.5 – Organisation Details */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground">5. Organisation Details of the Manufacturing Company</h4>
          <div className="grid gap-4 sm:grid-cols-3">
            <InlineFileUpload
              label="Organisation Chart"
              fieldName="categoryFields.orgChartUrl"
              form={form}
              applicationId={applicationId}
              documentType="ORG_CHART"
            />
            <InlineFileUpload
              label="Manpower at Various Levels"
              fieldName="categoryFields.manpowerLevelsUrl"
              form={form}
              applicationId={applicationId}
              documentType="MANPOWER_LEVELS"
            />
            <InlineFileUpload
              label="Key Manpower Experience"
              fieldName="categoryFields.keyManpowerUrl"
              form={form}
              applicationId={applicationId}
              documentType="KEY_MANPOWER"
            />
          </div>
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* ════════════════════════════════════════════════════════
          SECTION C: APPROVAL IN OTHER ORGANISATIONS
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="C" title="Approval in Other Organisations" subtitle="Minimum 3 approvals, at least 1 in Metro / Railways (last 3 years)" icon={Award} />

        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Approval / registration / empanelment certificates from Metro / Railways / RDSO / Government bodies.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addApproval({ agencyType: "", agencyName: "", certificateDate: "", validTill: "", certificateUrl: "" })
              }
              className="gap-1.5 h-8 text-xs font-semibold shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Add Approval
            </Button>
          </div>

          <div className="space-y-3">
            {approvalEntries.map((field, idx) => (
              <CertificateRow
                key={field.id}
                form={form}
                index={idx}
                fieldPrefix="categoryFields.approvals"
                textFields={[
                  { name: "agencyName", label: "Agency Name", placeholder: "e.g., Delhi Metro Rail Corp." },
                ]}
                onRemove={() => removeApproval(idx)}
                applicationId={applicationId}
                documentType="APPROVAL_CERTIFICATE"
              />
            ))}
            {approvalEntries.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No approvals added. Click &quot;Add Approval&quot; above. Minimum 3 required.
              </p>
            )}
          </div>
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* ════════════════════════════════════════════════════════
          SECTION D: DETAILS OF EXPERIENCE
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="D" title="Details of Experience" subtitle="Purchase orders, completion certificates, and works executed" icon={Briefcase} />

        {/* D.1 – Purchase / Work Orders (exactly 5) */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div>
            <h4 className="text-sm font-bold text-foreground">1. Purchase / Work Orders (Total 5 nos. in the last 5 years)</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              From Metro / Railways / RDSO / Government bodies. Must be on client letterhead with contact details.
            </p>
          </div>

          <div className="space-y-4">
            {[0, 1, 2, 3, 4].map((idx) => (
              <PurchaseOrderCard
                key={idx}
                form={form}
                idx={idx}
                applicationId={applicationId}
              />
            ))}
          </div>
        </div>

        {/* D.2 – Completion Certificates (exactly 5) */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div>
            <h4 className="text-sm font-bold text-foreground">2. Completion Certificates (Total 5 nos. in the last 5 years)</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              From Metro / Railways / RDSO / Government bodies.
            </p>
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="border border-border/50 bg-muted/5 p-4 rounded-xl space-y-3 hover:bg-muted/10 transition-all">
                <span className="text-xs font-bold text-muted-foreground">Certificate #{idx + 1}</span>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={form.control}
                    name={`categoryFields.completionCertificates.${idx}.clientType`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Client Type <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                          <FormControl>
                            <SelectTrigger className="h-10"><SelectValue placeholder="Select type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CLIENT_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.completionCertificates.${idx}.clientName`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Client Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Client name" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.completionCertificates.${idx}.certificateDate`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Certificate Date <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input type="date" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload Certificate *"
                    fieldName={`categoryFields.completionCertificates.${idx}.certificateUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType={`COMPLETION_CERT_${idx + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* D.3 – Works Executed (exactly 5) */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div>
            <h4 className="text-sm font-bold text-foreground">3. Work Executed in Metro / Railways / Infrastructure Govt. Organisation (Last 5 years, one for each year)</h4>
          </div>

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="border border-border/50 bg-muted/5 p-4 rounded-xl space-y-3 hover:bg-muted/10 transition-all">
                <span className="text-xs font-bold text-muted-foreground">Work #{idx + 1}</span>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={form.control}
                    name={`categoryFields.worksExecuted.${idx}.clientType`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Client Type <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                          <FormControl>
                            <SelectTrigger className="h-10"><SelectValue placeholder="Select type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CLIENT_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.worksExecuted.${idx}.clientName`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Client Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Client name" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.worksExecuted.${idx}.issuanceDate`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Issuance Date <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input type="date" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload Work Order *"
                    fieldName={`categoryFields.worksExecuted.${idx}.workOrderUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType={`WORK_EXECUTED_${idx + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* ════════════════════════════════════════════════════════
          SECTION E: QUALITY PLAN AND CERTIFICATION
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="E" title="Quality Plan & Certification" subtitle="Quality checks, BIS/ISO accreditations, and testing facilities" icon={Shield} />

        {/* E.1 – Quality Plan */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <h4 className="text-sm font-bold text-foreground">1. Quality Plan for Manufacturing</h4>
          <p className="text-xs text-muted-foreground">
            Include quality checks and tests on raw material, bought-out items, stage-wise quality checks, etc.
          </p>
          <FormField
            control={form.control}
            name="categoryFields.qualityPlanDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold">Brief Details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe quality plan..." className="min-h-[80px] resize-y text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <InlineFileUpload
            label="Upload Quality Plan Document"
            fieldName="categoryFields.qualityPlanUrl"
            form={form}
            applicationId={applicationId}
            documentType="QUALITY_PLAN"
          />
        </div>

        {/* E.2 – BIS / IGBC / ISO 17025 Certifications */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">2. BIS / IGBC / Test Reports (ISO/IEC 17025:2017)</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addQualityCert({ certName: "", validTill: "", certificateUrl: "" })}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add Certification
            </Button>
          </div>
          <div className="space-y-3">
            {qualityCerts.map((field, idx) => (
              <CertificateRow
                key={field.id}
                form={form}
                index={idx}
                fieldPrefix="categoryFields.qualityCertifications"
                textFields={[{ name: "certName", label: "Certification Name", placeholder: "e.g., BIS Certificate" }]}
                onRemove={() => removeQualityCert(idx)}
                applicationId={applicationId}
                documentType="QUALITY_CERTIFICATION"
              />
            ))}
            {qualityCerts.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No certifications added yet.
              </p>
            )}
          </div>
        </div>

        {/* E.3 – Applicable Codes */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">3. Reference of Indian / International Codes</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addAppCode({ codeName: "", documentUrl: "" })}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add Code
            </Button>
          </div>
          <div className="space-y-3">
            {appCodes.map((field, idx) => (
              <div key={field.id} className="relative border border-border/50 bg-muted/5 p-4 rounded-xl space-y-4 md:space-y-0 md:flex md:items-end md:gap-4 transition-all hover:bg-muted/10">
                <div className="flex-1 min-w-[200px]">
                  <FormField
                    control={form.control}
                    name={`categoryFields.applicableCodes.${idx}.codeName`}
                    render={({ field: formField }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold">Applicable Code <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g., IS 456:2000" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <InlineFileUpload
                    label="Upload Document"
                    fieldName={`categoryFields.applicableCodes.${idx}.documentUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="APPLICABLE_CODE_DOC"
                  />
                </div>
                <div className="flex justify-end pt-2 md:pt-0 shrink-0">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAppCode(idx)} className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {appCodes.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No codes added yet.
              </p>
            )}
          </div>
        </div>

        {/* E.4a – In-House Testing */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground">4a. In-House Testing Facility</h4>
          <FormField
            control={form.control}
            name="categoryFields.inHouseTestingAccredited"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm cursor-pointer">Yes, the in-house testing facility is accredited by an independent agency</FormLabel>
              </FormItem>
            )}
          />
          {inHouseTestingAccredited && (
            <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border/50">
              <FormField
                control={form.control}
                name="categoryFields.inHouseTestingDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Details <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Accreditation details" className="h-10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <InlineFileUpload
                label="Upload Document"
                fieldName="categoryFields.inHouseTestingDocUrl"
                form={form}
                applicationId={applicationId}
                documentType="IN_HOUSE_TESTING_DOC"
              />
            </div>
          )}
        </div>

        {/* E.4b – External Testing */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground">4b. External Testing Facility</h4>
          <FormField
            control={form.control}
            name="categoryFields.externalTestingConducted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm cursor-pointer">Yes, tests are conducted in an external facility</FormLabel>
              </FormItem>
            )}
          />
          {externalTestingConducted && (
            <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border/50">
              <FormField
                control={form.control}
                name="categoryFields.externalTestingDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Details <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="External testing details" className="h-10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <InlineFileUpload
                label="Upload Document"
                fieldName="categoryFields.externalTestingDocUrl"
                form={form}
                applicationId={applicationId}
                documentType="EXTERNAL_TESTING_DOC"
              />
            </div>
          )}
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* ════════════════════════════════════════════════════════
          SECTION F: FINANCIAL DATA
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="F" title="Financial Data" subtitle="Profit & Loss Statements and Balance Sheets for the last 3 financial years" icon={DollarSign} color="bg-amber-600" />

        <div className="space-y-4">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="border border-border/50 bg-muted/5 p-4 rounded-xl hover:bg-muted/10 transition-all">
              <span className="text-xs font-bold text-muted-foreground mb-3 block">Financial Year #{idx + 1}</span>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`categoryFields.financialData.${idx}.financialYear`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Financial Year <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                        <FormControl>
                          <SelectTrigger className="h-10"><SelectValue placeholder="Select year" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fyOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Balance Sheet *"
                  fieldName={`categoryFields.financialData.${idx}.balanceSheetUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType={`BALANCE_SHEET_${idx + 1}`}
                />
                <InlineFileUpload
                  label="Upload Profit & Loss *"
                  fieldName={`categoryFields.financialData.${idx}.profitLossUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType={`PROFIT_LOSS_${idx + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* ════════════════════════════════════════════════════════
          SECTION G: OCS COMPLIANCE
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="G" title="Compliance with OCS of DMRC" subtitle="Test certificates in compliance with Outline Construction Specifications" icon={FileCheck} color="bg-indigo-600" />

        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground max-w-xl">
              Test Certificates / Reports from ISO/IEC 17025:2017 accredited laboratories in compliance with OCS for Civil works. Tests must have been conducted within the previous 12 months.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addOcsReport({ laboratoryName: "", standardName: "", issuanceDate: "", validTill: "", testReportUrl: "" })
              }
              className="gap-1.5 h-8 text-xs font-semibold shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Add Report
            </Button>
          </div>

          <div className="space-y-3">
            {ocsReports.map((field, idx) => (
              <div key={field.id} className="border border-border/50 bg-muted/5 p-4 rounded-xl space-y-3 hover:bg-muted/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Report #{idx + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeOcsReport(idx)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`categoryFields.ocsComplianceReports.${idx}.laboratoryName`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Laboratory Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Laboratory name" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.ocsComplianceReports.${idx}.standardName`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Standard Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Standard name" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.ocsComplianceReports.${idx}.issuanceDate`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Issuance Date <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input type="date" className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.ocsComplianceReports.${idx}.validTill`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Valid Till <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input type="date" max={maxOcsDateStr} className="h-10 text-sm" {...formField} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload Test Report *"
                    fieldName={`categoryFields.ocsComplianceReports.${idx}.testReportUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType={`OCS_REPORT_${idx + 1}`}
                  />
                </div>
              </div>
            ))}
            {ocsReports.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No OCS compliance reports added yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* ════════════════════════════════════════════════════════
          SECTION H: UNDERTAKINGS
         ════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <SectionHeader letter="H" title="Undertakings" subtitle="Confirm compliance and accept terms" icon={FileSignature} color="bg-rose-600" />

        <div className="space-y-4">
          {/* (a) */}
          <FormField
            control={form.control}
            name="categoryFields.undertaking_a"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border/50 bg-card p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (a) This application is in accordance with the relevant standard(s). <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* (b) */}
          <FormField
            control={form.control}
            name="categoryFields.undertaking_b_servicePeriod"
            render={({ field }) => (
              <FormItem className="rounded-xl border border-border/50 bg-card p-4">
                <FormLabel className="text-sm">
                  (b) The material / item / product is a proven one and has been in service for: <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex items-center gap-2 mt-2">
                  <FormControl>
                    <Input type="number" min="0" placeholder="Years" className="h-10 w-32" {...field} />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">years</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* (c) */}
          <FormField
            control={form.control}
            name="categoryFields.undertaking_c"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border/50 bg-card p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (c) We shall provide technical support during the lifetime of the material / item / product, irrespective of upgradation / phasing-out. <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* (d) + Annexures */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-4">
            <FormField
              control={form.control}
              name="categoryFields.undertaking_d"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm cursor-pointer">
                      (d) We shall comply with all conditions of DMRC&apos;s Vendor Policy including submission of affidavits / documents as per the Annexures A, B, C, D and E. <span className="text-destructive">*</span>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {undertakingD && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-3 border-t border-border/50">
                {["A", "B", "C", "D", "E"].map((letter) => (
                  <InlineFileUpload
                    key={letter}
                    label={`Upload Annexure-${letter} *`}
                    fieldName={`categoryFields.undertaking_d_annexure${letter}Url`}
                    form={form}
                    applicationId={applicationId}
                    documentType={`ANNEXURE_${letter}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* (e) */}
          <FormField
            control={form.control}
            name="categoryFields.undertaking_e"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border/50 bg-card p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (e) We are aware that despite inclusion in the &quot;List of Empanelled Makes / Vendors&quot; we are liable to submit technical compliances in respective contract. <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* (f) */}
          <FormField
            control={form.control}
            name="categoryFields.undertaking_f"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border/50 bg-card p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (f) All statements, information, and answers given above are true and no information has been suppressed. <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Sub-Components
// ══════════════════════════════════════════════════════════════════

// ─── Manufacturing Unit Card (with nested certifications) ───
function ManufacturingUnitCard({
  form,
  unitIdx,
  onRemove,
  canRemove,
  applicationId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  unitIdx: number;
  onRemove: () => void;
  canRemove: boolean;
  applicationId: string;
}) {
  const { fields: certs, append: addCert, remove: removeCert } = useFieldArray({
    control: form.control,
    name: `categoryFields.manufacturingUnits.${unitIdx}.certifications`,
  });

  return (
    <div className="border border-border/50 bg-muted/5 p-5 rounded-xl space-y-4 hover:bg-muted/10 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">Manufacturing Unit #{unitIdx + 1}</span>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Address */}
      <FormField
        control={form.control}
        name={`categoryFields.manufacturingUnits.${unitIdx}.address`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold">Address / Location <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Textarea placeholder="Full address of the manufacturing unit / factory" className="min-h-[60px] resize-y text-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Certifications */}
      <div className="space-y-3 border-t border-border/40 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-teal-700">Certifications (ISO 9001, ISO 14001, etc.)</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addCert({ certName: "", validTill: "", certificateUrl: "" })}
            className="gap-1 h-7 text-xs"
          >
            <Plus className="h-3 w-3" /> Add Cert
          </Button>
        </div>
        {certs.map((cert, certIdx) => (
          <CertificateRow
            key={cert.id}
            form={form}
            index={certIdx}
            fieldPrefix={`categoryFields.manufacturingUnits.${unitIdx}.certifications`}
            textFields={[{ name: "certName", label: "Certification Name", placeholder: "e.g., ISO 9001" }]}
            onRemove={() => removeCert(certIdx)}
            applicationId={applicationId}
            documentType={`MFG_UNIT_${unitIdx}_CERT`}
          />
        ))}
        {certs.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center py-2 bg-muted/20 border border-dashed rounded-lg">
            No certifications added for this unit.
          </p>
        )}
      </div>

      {/* Licensed + Actual Capacity */}
      <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
        <div className="space-y-3">
          <span className="text-xs font-bold text-foreground">Licensed Production Capacity</span>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name={`categoryFields.manufacturingUnits.${unitIdx}.licensedCapacity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Rate <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 5000" className="h-10 text-sm" {...field} /></FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`categoryFields.manufacturingUnits.${unitIdx}.licensedCapacityUnit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Unit <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="per_month">Per Month</SelectItem>
                      <SelectItem value="per_year">Per Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <InlineFileUpload
            label="Upload Document"
            fieldName={`categoryFields.manufacturingUnits.${unitIdx}.licensedCapacityDocUrl`}
            form={form}
            applicationId={applicationId}
            documentType={`MFG_UNIT_${unitIdx}_LICENSED_CAP`}
          />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold text-foreground">Actual Production</span>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name={`categoryFields.manufacturingUnits.${unitIdx}.actualProduction`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Rate <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 3500" className="h-10 text-sm" {...field} /></FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`categoryFields.manufacturingUnits.${unitIdx}.actualProductionUnit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Unit <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="h-10"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="per_month">Per Month</SelectItem>
                      <SelectItem value="per_year">Per Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <InlineFileUpload
            label="Upload Document"
            fieldName={`categoryFields.manufacturingUnits.${unitIdx}.actualProductionDocUrl`}
            form={form}
            applicationId={applicationId}
            documentType={`MFG_UNIT_${unitIdx}_ACTUAL_PROD`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Purchase Order Card ───
function PurchaseOrderCard({
  form,
  idx,
  applicationId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  idx: number;
  applicationId: string;
}) {
  return (
    <div className="border border-border/50 bg-muted/5 p-4 rounded-xl space-y-3 hover:bg-muted/10 transition-all">
      <span className="text-xs font-bold text-muted-foreground">Order #{idx + 1}</span>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.clientType`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Client Type <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                <FormControl>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select type" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CLIENT_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.clientName`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Client Name <span className="text-destructive">*</span></FormLabel>
              <FormControl><Input placeholder="Client name" className="h-10 text-sm" {...formField} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.scopeOfWork`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Scope of Work</FormLabel>
              <FormControl><Input placeholder="Scope of work" className="h-10 text-sm" {...formField} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.materialType`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Type / Model of Material</FormLabel>
              <FormControl><Input placeholder="Type / model" className="h-10 text-sm" {...formField} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.issuanceDate`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Issuance Date <span className="text-destructive">*</span></FormLabel>
              <FormControl><Input type="date" className="h-10 text-sm" {...formField} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <InlineFileUpload
          label="Upload Work Order *"
          fieldName={`categoryFields.purchaseOrders.${idx}.workOrderUrl`}
          form={form}
          applicationId={applicationId}
          documentType={`PURCHASE_ORDER_${idx + 1}`}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-border/30">
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.totalQuantity`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Total Quantity <span className="text-destructive">*</span></FormLabel>
              <FormControl><Input type="number" placeholder="Quantity" className="h-10 text-sm" {...formField} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.unit`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Unit <span className="text-destructive">*</span></FormLabel>
              <FormControl><Input placeholder="e.g., MT, Nos." className="h-10 text-sm" {...formField} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.totalValue`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Total Value <span className="text-destructive">*</span></FormLabel>
              <FormControl><Input type="number" placeholder="Value" className="h-10 text-sm" {...formField} /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`categoryFields.purchaseOrders.${idx}.currency`}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="Currency" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
