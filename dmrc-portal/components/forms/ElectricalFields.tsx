"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Upload, Loader2, CheckCircle2, Factory, Building2, Award, Briefcase, Shield, DollarSign, FileCheck, FileSignature, Info, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ELECTRICAL_MATERIALS } from "./materials";
import { toast } from "@/components/ui/sonner";

interface ElectricalFieldsProps {
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
            <label className="cursor-pointer text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors shrink-0">
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
          <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-violet-600 hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
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

// ─── Section Header Component ───
function SectionHeader({ letter, title, subtitle, icon: Icon, color = "bg-violet-600" }: {
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
        <Icon className="h-5 w-5 text-violet-600" />
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Card Wrapper ───
function SubCard({ title, onDelete, index, children }: {
  title: string;
  onDelete?: () => void;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-card/40 p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
          {title} #{index + 1}
        </span>
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

export function ElectricalFields({ form, applicationId }: ElectricalFieldsProps) {
  // Section A.7 Repeatable Factory
  const { fields: factoryFields, append: appendFactory, remove: removeFactory } = useFieldArray({
    control: form.control,
    name: "categoryFields.manufacturingUnits",
  });

  // Section B.1 Repeatable Parent Company
  const { fields: parentCompanyFields, append: appendParent, remove: removeParent } = useFieldArray({
    control: form.control,
    name: "categoryFields.parentCompanyDetails",
  });

  // Section B.1 Repeatable Shareholding / Directors
  const { fields: shareholdingFields, append: appendShareholding, remove: removeShareholding } = useFieldArray({
    control: form.control,
    name: "categoryFields.directorsShareholding",
  });

  // Section D.2 Quality Certifications
  const { fields: qualityCertFields, append: appendQualityCert, remove: removeQualityCert } = useFieldArray({
    control: form.control,
    name: "categoryFields.qualityCertifications",
  });

  // Section D.5 Applicable Codes
  const { fields: codeFields, append: appendCode, remove: removeCode } = useFieldArray({
    control: form.control,
    name: "categoryFields.applicableCodes",
  });

  // Section D.7 a, b, c, d, e arrays
  const { fields: testStdFields, append: appendTestStd, remove: removeTestStd } = useFieldArray({
    control: form.control,
    name: "categoryFields.inHouseTestingAsPerStdDetails",
  });
  const { fields: testProductFields, append: appendTestProduct, remove: removeTestProduct } = useFieldArray({
    control: form.control,
    name: "categoryFields.inHouseTestingAsPerProductStdDetails",
  });
  const { fields: testAccreditedFields, append: appendTestAccredited, remove: removeTestAccredited } = useFieldArray({
    control: form.control,
    name: "categoryFields.inHouseTestingAccreditedDetails",
  });
  const { fields: testAllFields, append: appendTestAll, remove: removeTestAll } = useFieldArray({
    control: form.control,
    name: "categoryFields.inHouseAllTestsConductedDetails",
  });
  const { fields: testExtFields, append: appendTestExt, remove: removeTestExt } = useFieldArray({
    control: form.control,
    name: "categoryFields.externalTestingDetails",
  });

  // Section C Experience Arrays
  const { fields: dmrcProjectFields, append: appendDmrcProject, remove: removeDmrcProject } = useFieldArray({
    control: form.control,
    name: "categoryFields.dmrcProjects",
  });
  const { fields: otherProjectFields, append: appendOtherProject, remove: removeOtherProject } = useFieldArray({
    control: form.control,
    name: "categoryFields.otherProjects",
  });
  const { fields: blacklistFields, append: appendBlacklist, remove: removeBlacklist } = useFieldArray({
    control: form.control,
    name: "categoryFields.blacklistingDetails",
  });
  const { fields: litigationFields, append: appendLitigation, remove: removeLitigation } = useFieldArray({
    control: form.control,
    name: "categoryFields.litigationDetails",
  });

  // Section F Type Test Arrays
  const { fields: typeTestFields, append: appendTypeTest, remove: removeTypeTest } = useFieldArray({
    control: form.control,
    name: "categoryFields.typeTestCertificates",
  });
  const { fields: typeTestLabFields, append: appendTypeTestLab, remove: removeTypeTestLab } = useFieldArray({
    control: form.control,
    name: "categoryFields.typeTestAccreditedLabs",
  });

  // Section G After Sales arrays
  const { fields: afterSalesDelhiFields, append: appendAfterSalesDelhi, remove: removeAfterSalesDelhi } = useFieldArray({
    control: form.control,
    name: "categoryFields.afterSalesDelhiNcr",
  });
  const { fields: afterSalesOutsideFields, append: appendAfterSalesOutside, remove: removeAfterSalesOutside } = useFieldArray({
    control: form.control,
    name: "categoryFields.afterSalesOutsideDelhiNcr",
  });

  // Watches for conditional fields
  const manufacturedInIndia = form.watch("categoryFields.manufacturedInIndia");
  const hasInHouseDesign = form.watch("categoryFields.hasInHouseDesign");
  const hasInHouseTesting = form.watch("categoryFields.hasInHouseTesting");
  const hasInHouseRnd = form.watch("categoryFields.hasInHouseRnd");
  const suppliedToDmrc = form.watch("categoryFields.suppliedToDmrc");
  const suppliedOtherProjects = form.watch("categoryFields.suppliedOtherProjects");
  const hasBlacklisting = form.watch("categoryFields.hasBlacklisting");
  const hasLitigation = form.watch("categoryFields.hasLitigation");

  const inHouseTestingAsPerStd = form.watch("categoryFields.inHouseTestingAsPerStd");
  const inHouseTestingAsPerProductStd = form.watch("categoryFields.inHouseTestingAsPerProductStd");
  const inHouseTestingAccredited = form.watch("categoryFields.inHouseTestingAccredited");
  const inHouseAllTestsConducted = form.watch("categoryFields.inHouseAllTestsConducted");
  const externalTestingConducted = form.watch("categoryFields.externalTestingConducted");

  const typeTestCertificateProvided = form.watch("categoryFields.typeTestCertificateProvided");
  const typeTestFromAccreditedLab = form.watch("categoryFields.typeTestFromAccreditedLab");

  const undertaking_d = form.watch("categoryFields.undertaking_d");
  const undertaking_g = form.watch("categoryFields.undertaking_g");

  return (
    <div className="space-y-12">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION A: GENERAL INFORMATION */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="A" title="General Information" icon={Factory} />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryFields.applyingAs"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Applying As <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select applying category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MANUFACTURER">MANUFACTURER</SelectItem>
                    <SelectItem value="AUTHORISED_RESELLER">AUTHORISED RESELLER</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.materialItem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Item / Product <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select electrical item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-80 overflow-y-auto">
                    {ELECTRICAL_MATERIALS.map((mat) => (
                      <SelectItem key={mat.value} value={mat.value} className="text-xs whitespace-normal h-auto py-2">
                        {mat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.nameOfMake"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Name of Make <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand or manufacturer make name" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="categoryFields.capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Capacity <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 500" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryFields.capacityUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Capacity Unit <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. HP / kVA / kW" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="categoryFields.rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Rating <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 33" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryFields.ratingUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Rating Unit <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. V / kV / A" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoryFields.otherDetails"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-sm font-semibold">Other details if any</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter any extra details" className="min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* FACTORIES LIST */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-md font-bold text-foreground">Details of Manufacturing Unit / Factory <span className="text-destructive">*</span></h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendFactory({
                address: "",
                totalLandArea: "",
                totalLandAreaUnit: "sq_meters",
                landOwnershipDocUrl: "",
                coveredArea: "",
                coveredAreaUnit: "sq_meters",
                licensedCapacity: "",
                licensedCapacityUnit: "per_month",
                licensedCapacityDocUrl: "",
                machineryWriteUp: "",
                machineryDocUrl: "",
                actualProduction: "",
                actualProductionUnit: "per_month",
                actualProductionDocUrl: "",
              })}
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
            >
              <Plus className="h-4 w-4" /> Add Factory
            </Button>
          </div>

          {factoryFields.map((field, idx) => (
            <SubCard key={field.id} title="Manufacturing Unit" onDelete={factoryFields.length > 1 ? () => removeFactory(idx) : undefined} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.manufacturingUnits.${idx}.address`}
                  render={({ field: f }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-xs font-semibold">Factory Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Full address" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.totalLandArea`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Total Land Area <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g. 5000" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.totalLandAreaUnit`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Unit <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g. sq. meters" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <InlineFileUpload
                  label="Land Ownership Document (PDF) *"
                  fieldName={`categoryFields.manufacturingUnits.${idx}.landOwnershipDocUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="LAND_OWNERSHIP_DOC"
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.coveredArea`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Covered Area <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g. 3500" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.coveredAreaUnit`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Unit <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g. sq. meters" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border border-transparent" />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.licensedCapacity`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Licensed Production Capacity <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Quantity" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.licensedCapacityUnit`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Capacity Period <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="per_month">per month</SelectItem>
                            <SelectItem value="per_year">per year</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <InlineFileUpload
                  label="Licensed Production Capacity Document (PDF) *"
                  fieldName={`categoryFields.manufacturingUnits.${idx}.licensedCapacityDocUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="LICENSED_CAPACITY_DOC"
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.manufacturingUnits.${idx}.machineryWriteUp`}
                  render={({ field: f }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-xs font-semibold">Write-up of Machinery / Other Facilities <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe machinery, testing labs and assembly setups at this factory location" className="min-h-[80px]" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InlineFileUpload
                  label="Machinery Supporting Document (PDF) *"
                  fieldName={`categoryFields.manufacturingUnits.${idx}.machineryDocUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="MACHINERY_SUPPORTING_DOC"
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.actualProduction`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Actual Production (ongoing) <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Quantity" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.manufacturingUnits.${idx}.actualProductionUnit`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Production Period <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="per_month">per month</SelectItem>
                            <SelectItem value="per_year">per year</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <InlineFileUpload
                  label="Actual Production Document (PDF) *"
                  fieldName={`categoryFields.manufacturingUnits.${idx}.actualProductionDocUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="ACTUAL_PRODUCTION_DOC"
                />
              </div>
            </SubCard>
          ))}
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION B: COMPANY PROFILE AND EXPERIENCE */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="B" title="Company Profile & Experience" icon={Building2} />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormItem>
            <FormLabel className="text-sm font-semibold">Company Details (Autofilled)</FormLabel>
            <FormControl>
              <Input
                value={form.watch("baseFields.companyName") || ""}
                disabled
                className="h-11 bg-muted text-muted-foreground border-border/80 cursor-not-allowed font-medium"
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">This is autofilled from your registration.</p>
          </FormItem>

          <FormField
            control={form.control}
            name="categoryFields.manufacturedInIndia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 rounded-lg border bg-muted/15 p-4 mt-8">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-semibold cursor-pointer">Manufactured in India?</FormLabel>
                  <p className="text-xs text-muted-foreground">Select Yes if the item is manufactured domestically.</p>
                </div>
              </FormItem>
            )}
          />

          {!manufacturedInIndia && (
            <>
              <FormField
                control={form.control}
                name="categoryFields.countryOfOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Country of Origin <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Country name" className="h-11" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <InlineFileUpload
                label="Authorisation Document for Manufacturing / Business (PDF) *"
                fieldName="categoryFields.authorisationDocUrl"
                form={form}
                applicationId={applicationId}
                documentType="FOREIGN_AUTHORISATION_DOC"
              />
            </>
          )}

          <FormField
            control={form.control}
            name="categoryFields.manufacturingOngoingPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">How long has manufacturing been ongoing? <span className="text-destructive">*</span></FormLabel>
                <div className="flex items-center gap-2 mt-1">
                  <FormControl>
                    <Input placeholder="Years" type="number" min="0" className="h-11 w-32" {...field} />
                  </FormControl>
                  <span className="text-sm font-bold text-muted-foreground">Years</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ORGANISATION DOCUMENTS */}
        <div className="rounded-xl border bg-muted/5 p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 border-b pb-2">
            <Info className="h-4 w-4 text-violet-600" />
            Organisation details of the manufacturing company
          </h4>

          <div className="grid gap-5 sm:grid-cols-2">
            <InlineFileUpload
              label="Organisation Chart (PDF) *"
              fieldName="categoryFields.orgChartUrl"
              form={form}
              applicationId={applicationId}
              documentType="ORG_CHART"
            />
            <InlineFileUpload
              label="Details of Manpower at Various Levels (PDF) *"
              fieldName="categoryFields.manpowerLevelsUrl"
              form={form}
              applicationId={applicationId}
              documentType="MANPOWER_LEVELS"
            />
            <InlineFileUpload
              label="Experience and Competency of Key Manpower (PDF) *"
              fieldName="categoryFields.keyManpowerUrl"
              form={form}
              applicationId={applicationId}
              documentType="KEY_MANPOWER"
            />
            <InlineFileUpload
              label="Additional Org Document (PDF, Optional)"
              fieldName="categoryFields.additionalOrgDocUrl"
              form={form}
              applicationId={applicationId}
              documentType="ADDITIONAL_ORG_DOC"
            />
          </div>
        </div>

        {/* PARENT COMPANY DETAILS */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-md font-bold text-foreground">Parent Company Details</h4>
              <p className="text-xs text-muted-foreground">Fill this if the company is a subsidiary or joint venture.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendParent({
                parentCompanyName: "",
                countryOfOrigin: "",
                manufacturingPeriod: "",
                shareholdingDetails: "",
                shareholdingDocUrl: "",
                directorsDetails: "",
                directorsDocUrl: "",
              })}
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4" /> Add Parent Details
            </Button>
          </div>

          {parentCompanyFields.map((field, idx) => (
            <SubCard key={field.id} title="Parent Company" onDelete={() => removeParent(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.parentCompanyDetails.${idx}.parentCompanyName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Name of Parent Company <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Parent name" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.parentCompanyDetails.${idx}.countryOfOrigin`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Country of Origin <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Country name" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.parentCompanyDetails.${idx}.manufacturingPeriod`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Manufacturing Period <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="e.g. 10 years" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border border-transparent" />

                <FormField
                  control={form.control}
                  name={`categoryFields.parentCompanyDetails.${idx}.shareholdingDetails`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Shareholding Details <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Description / details" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InlineFileUpload
                  label="Shareholding Document (PDF) *"
                  fieldName={`categoryFields.parentCompanyDetails.${idx}.shareholdingDocUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="PARENT_SHAREHOLDING_DOC"
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.parentCompanyDetails.${idx}.directorsDetails`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Board of Directors Details <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Director list summary" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InlineFileUpload
                  label="Directors Document (PDF) *"
                  fieldName={`categoryFields.parentCompanyDetails.${idx}.directorsDocUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="PARENT_DIRECTORS_DOC"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* BOARD OF DIRECTORS / SHAREHOLDING */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-md font-bold text-foreground">Directors & Shareholding (Applicant)</h4>
              <p className="text-xs text-muted-foreground">Add details and proofs for board of directors and holdings.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendShareholding({ details: "", documentUrl: "" })}
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4" /> Add Directors Row
            </Button>
          </div>

          {shareholdingFields.map((field, idx) => (
            <SubCard key={field.id} title="Directors / Shareholding Entry" onDelete={() => removeShareholding(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.directorsShareholding.${idx}.details`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Details / Description <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter details of directors or shareholding percentage" className="h-10" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InlineFileUpload
                  label="Details Document (PDF, Optional)"
                  fieldName={`categoryFields.directorsShareholding.${idx}.documentUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="DIRECTORS_SHAREHOLDING_DOC"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* IN-HOUSE FACILITIES */}
        <div className="space-y-5 pt-4">
          <h4 className="text-md font-bold text-foreground border-b pb-2 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-violet-600" />
            In-House Facilities
          </h4>

          {/* Design facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <FormField
              control={form.control}
              name="categoryFields.hasInHouseDesign"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Is Design facility available in-house?</FormLabel>
                </FormItem>
              )}
            />
            {hasInHouseDesign && (
              <div className="grid gap-5 sm:grid-cols-2 pl-6 border-l-2 border-violet-300">
                <FormField
                  control={form.control}
                  name="categoryFields.inHouseDesignDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Design Facility Details <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Textarea placeholder="Describe design software, engineers, capabilities" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Design Facility Proof / Description (PDF) *"
                  fieldName="categoryFields.inHouseDesignDocUrl"
                  form={form}
                  applicationId={applicationId}
                  documentType="IN_HOUSE_DESIGN_DOC"
                />
              </div>
            )}
          </div>

          {/* Testing facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <FormField
              control={form.control}
              name="categoryFields.hasInHouseTesting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Is Testing facility available in-house?</FormLabel>
                </FormItem>
              )}
            />
            {hasInHouseTesting && (
              <div className="grid gap-5 sm:grid-cols-2 pl-6 border-l-2 border-violet-300">
                <FormField
                  control={form.control}
                  name="categoryFields.inHouseTestingDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Testing Facility Details <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Textarea placeholder="Describe testing machinery, calibrations, labs" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Testing Facility Proof / Description (PDF) *"
                  fieldName="categoryFields.inHouseTestingDocUrl"
                  form={form}
                  applicationId={applicationId}
                  documentType="IN_HOUSE_TESTING_DOC"
                />
              </div>
            )}
          </div>

          {/* R&D facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <FormField
              control={form.control}
              name="categoryFields.hasInHouseRnd"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Is Research & Development (R&D) facility available in-house?</FormLabel>
                </FormItem>
              )}
            />
            {hasInHouseRnd && (
              <div className="grid gap-5 sm:grid-cols-2 pl-6 border-l-2 border-violet-300">
                <FormField
                  control={form.control}
                  name="categoryFields.inHouseRndDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">R&D Facility Details <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Textarea placeholder="Describe R&D initiatives, team size, equipment" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="R&D Facility Proof / Description (PDF) *"
                  fieldName="categoryFields.inHouseRndDocUrl"
                  form={form}
                  applicationId={applicationId}
                  documentType="IN_HOUSE_RND_DOC"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION C: DETAILS OF EXPERIENCE PROVIDING THE ITEM */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="C" title="Experience Details" subtitle="Purchase orders & project references" icon={Briefcase} />

        {/* MANDATORY 5 PURCHASE ORDERS */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h4 className="text-md font-bold text-foreground">Purchase Orders & Performance Certificates (Last 10 Years) <span className="text-destructive">*</span></h4>
            <p className="text-xs text-muted-foreground">It is mandatory to submit details of exactly 5 Purchase/Work Orders and their corresponding Performance Certificates.</p>
          </div>

          {Array.from({ length: 5 }).map((_, idx) => (
            <SubCard key={idx} title="Purchase Order & Performance Certificate" index={idx}>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.clientName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Client Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Client name" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.contractorName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Contractor Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Contractor name" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.contractNumber`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Contract / Work Order Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Contract number" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.scopeOfWork`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Scope of Work <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Brief scope" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.typeModel`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Type / Model of Item / Product <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Type / Model details" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.purchaseOrders.${idx}.totalQuantity`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Total Quantity <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Qty" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.purchaseOrders.${idx}.unit`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Unit <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g. nos / meters" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.purchaseOrders.${idx}.totalValue`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Total Value <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Value" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.purchaseOrders.${idx}.currency`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="INR" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.purchaseOrderDate`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">PO Issuance Date <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InlineFileUpload
                  label="Upload Purchase Order (PDF) *"
                  fieldName={`categoryFields.purchaseOrders.${idx}.purchaseOrderUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="PURCHASE_ORDER"
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.performanceCertificateDate`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Performance Cert Date <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.purchaseOrders.${idx}.performanceCertificateValidTill`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Valid Till <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InlineFileUpload
                  label="Upload Performance Certificate (PDF) *"
                  fieldName={`categoryFields.purchaseOrders.${idx}.performanceCertificateUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="PERFORMANCE_CERTIFICATE"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* DMRC PROJECTS SUPPLY */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="categoryFields.suppliedToDmrc"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Has product been supplied to DMRC in the last 10 years?</FormLabel>
                </FormItem>
              )}
            />
            {suppliedToDmrc && dmrcProjectFields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendDmrcProject({
                  clientName: "",
                  contractorName: "",
                  amount: "",
                  currency: "INR",
                  dateOfIssuance: "",
                  validTill: "",
                  workOrderUrl: "",
                  completionCertUrl: "",
                })}
                className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                <Plus className="h-4 w-4" /> Add DMRC Project
              </Button>
            )}
          </div>

          {suppliedToDmrc && dmrcProjectFields.map((field, idx) => (
            <SubCard key={field.id} title="DMRC Project Details" onDelete={() => removeDmrcProject(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`categoryFields.dmrcProjects.${idx}.clientName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Name of Client / Organisation <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="DMRC or project owner" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.dmrcProjects.${idx}.contractorName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Contractor Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Name of main contractor" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.dmrcProjects.${idx}.amount`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Contract Value <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Value" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.dmrcProjects.${idx}.currency`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="INR" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`categoryFields.dmrcProjects.${idx}.dateOfIssuance`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Work Order Issuance Date <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.dmrcProjects.${idx}.validTill`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Valid Till <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border border-transparent" />

                <InlineFileUpload
                  label="Upload Work Order (PDF) *"
                  fieldName={`categoryFields.dmrcProjects.${idx}.workOrderUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="DMRC_WORK_ORDER"
                />

                <InlineFileUpload
                  label="Upload Completion Certificate (PDF) *"
                  fieldName={`categoryFields.dmrcProjects.${idx}.completionCertUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="DMRC_COMPLETION_CERT"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* OTHER PROJECTS SUPPLY */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="categoryFields.suppliedOtherProjects"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Has product been supplied to other projects (Metro/Railways/etc.) in the last 10 years?</FormLabel>
                </FormItem>
              )}
            />
            {suppliedOtherProjects && otherProjectFields.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendOtherProject({
                  projectType: "Metro",
                  clientName: "",
                  contractorName: "",
                  amount: "",
                  currency: "INR",
                  dateOfIssuance: "",
                  validTill: "",
                  workOrderUrl: "",
                  completionCertUrl: "",
                })}
                className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                <Plus className="h-4 w-4" /> Add Other Project
              </Button>
            )}
          </div>

          {suppliedOtherProjects && otherProjectFields.map((field, idx) => (
            <SubCard key={field.id} title="Other Project Details" onDelete={() => removeOtherProject(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`categoryFields.otherProjects.${idx}.projectType`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Project Type <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={f.onChange} defaultValue={f.value}>
                        <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="Select Type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Metro">Metro</SelectItem>
                          <SelectItem value="Railway">Railway</SelectItem>
                          <SelectItem value="Airport">Airport</SelectItem>
                          <SelectItem value="Central / State Govt.">Central / State Govt.</SelectItem>
                          <SelectItem value="Private Ltd. Organisation">Private Ltd. Organisation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.otherProjects.${idx}.clientName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Organisation Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="e.g. DMRC, IRCON, AAI" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.otherProjects.${idx}.contractorName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Contractor Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Name of main contractor" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.otherProjects.${idx}.amount`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Contract Value <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Value" type="number" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.otherProjects.${idx}.currency`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="INR" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`categoryFields.otherProjects.${idx}.dateOfIssuance`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Work Order Issuance Date <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`categoryFields.otherProjects.${idx}.validTill`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Valid Till <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InlineFileUpload
                  label="Upload Work Order (PDF) *"
                  fieldName={`categoryFields.otherProjects.${idx}.workOrderUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="OTHER_WORK_ORDER"
                />

                <InlineFileUpload
                  label="Upload Completion Certificate (PDF) *"
                  fieldName={`categoryFields.otherProjects.${idx}.completionCertUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="OTHER_COMPLETION_CERT"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* BLACKLISTING */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="categoryFields.hasBlacklisting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Has company/make/factory been blacklisted in the last 3 years?</FormLabel>
                </FormItem>
              )}
            />
            {hasBlacklisting && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendBlacklist({ blacklistedBy: "", reason: "", date: "", documentUrl: "" })}
                className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                <Plus className="h-4 w-4" /> Add Blacklist Row
              </Button>
            )}
          </div>

          {hasBlacklisting && blacklistFields.map((field, idx) => (
            <SubCard key={field.id} title="Blacklisting Entry" onDelete={() => removeBlacklist(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.blacklistingDetails.${idx}.blacklistedBy`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Blacklisted By Agency <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Agency name" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.blacklistingDetails.${idx}.reason`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Reason <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Reason for blacklisting" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.blacklistingDetails.${idx}.date`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Date of Blacklisting <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Document / Order (PDF) *"
                  fieldName={`categoryFields.blacklistingDetails.${idx}.documentUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="BLACKLISTING_ORDER"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* LITIGATION */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="categoryFields.hasLitigation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Has company been involved in litigation / arbitration in the last 3 years?</FormLabel>
                </FormItem>
              )}
            />
            {hasLitigation && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendLitigation({ agencyName: "", reason: "", date: "", documentUrl: "" })}
                className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                <Plus className="h-4 w-4" /> Add Litigation Row
              </Button>
            )}
          </div>

          {hasLitigation && litigationFields.map((field, idx) => (
            <SubCard key={field.id} title="Litigation / Arbitration Entry" onDelete={() => removeLitigation(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.litigationDetails.${idx}.agencyName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Name of Agency / Opponent <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Agency name" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.litigationDetails.${idx}.reason`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Reason / Description of Dispute <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Details of dispute" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.litigationDetails.${idx}.date`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Dispute Start Date <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Document / Status (PDF) *"
                  fieldName={`categoryFields.litigationDetails.${idx}.documentUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="LITIGATION_DOC"
                />
              </div>
            </SubCard>
          ))}
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION D: QUALITY PLAN AND CERTIFICATION */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="D" title="Quality Plan & Certification" icon={Award} />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryFields.qualityPlanDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Brief Quality Plan Details <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe quality checks conducted on raw materials, components and assemblies" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InlineFileUpload
            label="Upload Detailed Quality Plan (PDF) *"
            fieldName="categoryFields.qualityPlanUrl"
            form={form}
            applicationId={applicationId}
            documentType="QUALITY_PLAN_DOC"
          />

          <FormField
            control={form.control}
            name="categoryFields.energySavingMeasures"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Measures for Energy Saving & GHG Emission Reduction <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe energy conservation efforts and carbon footprint reduction" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InlineFileUpload
            label="Energy Saving Measures Proof (PDF) *"
            fieldName="categoryFields.energySavingDocUrl"
            form={form}
            applicationId={applicationId}
            documentType="ENERGY_SAVING_DOC"
          />

          <FormField
            control={form.control}
            name="categoryFields.wasteRecyclingMeasures"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Industrial Waste Recycling Measures <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe recycling or disposal mechanism of industrial wastes" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InlineFileUpload
            label="Waste Recycling Measures Proof (PDF) *"
            fieldName="categoryFields.wasteRecyclingDocUrl"
            form={form}
            applicationId={applicationId}
            documentType="WASTE_RECYCLING_DOC"
          />

          <FormField
            control={form.control}
            name="categoryFields.technicalLiteratureDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Technical Literature & Comparison Properties <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Compare construction/performance properties with respect to standard limits" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InlineFileUpload
            label="Upload Technical Comparison Sheet / Catalogue (PDF) *"
            fieldName="categoryFields.technicalLiteratureDocUrl"
            form={form}
            applicationId={applicationId}
            documentType="TECHNICAL_COMPARISON_SHEET"
          />
        </div>

        {/* QUALITY CERTIFICATIONS (ISO etc) */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-md font-bold text-foreground">Independent Certifications / Accreditations</h4>
              <p className="text-xs text-muted-foreground">List available ISO, BIS, or other factory accreditations.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendQualityCert({ certName: "", validTill: "", certificateUrl: "" })}
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4" /> Add Certification
            </Button>
          </div>

          {qualityCertFields.map((field, idx) => (
            <SubCard key={field.id} title="Certification Details" onDelete={() => removeQualityCert(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`categoryFields.qualityCertifications.${idx}.certName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Certification / Accred Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="e.g. ISO 9001:2015" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.qualityCertifications.${idx}.validTill`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Valid Till Date <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Certificate (PDF) *"
                  fieldName={`categoryFields.qualityCertifications.${idx}.certificateUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="QUALITY_ACC_CERT"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* APPLICABLE CODES */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-md font-bold text-foreground">Reference of IS / International Codes</h4>
              <p className="text-xs text-muted-foreground">List applicable standards conforming to this product.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendCode({ codeName: "", documentUrl: "" })}
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4" /> Add Code
            </Button>
          </div>

          {codeFields.map((field, idx) => (
            <SubCard key={field.id} title="Applicable Standard Code" onDelete={() => removeCode(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.applicableCodes.${idx}.codeName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Standard Reference <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="e.g. IS 3043 (Earthing)" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Code Copy / Extracts (PDF) *"
                  fieldName={`categoryFields.applicableCodes.${idx}.documentUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="APPLICABLE_CODE_DOC"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* IN-HOUSE TESTING SETUP DETAILS */}
        <div className="space-y-5 pt-4 border-t">
          <h4 className="text-md font-bold text-foreground flex items-center gap-1.5 border-b pb-2">
            <HelpCircle className="h-4 w-4 text-violet-600" />
            Details of In-House Testing facilities
          </h4>

          {/* Test std facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="categoryFields.inHouseTestingAsPerStd"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-sm font-semibold cursor-pointer">Are test facilities conforming to Indian / International standards?</FormLabel>
                  </FormItem>
                )}
              />
              {inHouseTestingAsPerStd && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTestStd({ details: "", docUrl: "" })}
                  className="gap-1.5 text-xs text-violet-600 border-violet-200"
                >
                  <Plus className="h-3 w-3" /> Add Standard Entry
                </Button>
              )}
            </div>
            {inHouseTestingAsPerStd && testStdFields.map((field, idx) => (
              <SubCard key={field.id} title="Test facility as per Std details" onDelete={() => removeTestStd(idx)} index={idx}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.inHouseTestingAsPerStdDetails.${idx}.details`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Testing Facility Details <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Details of test facilities" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload Document (PDF) *"
                    fieldName={`categoryFields.inHouseTestingAsPerStdDetails.${idx}.docUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="TEST_STD_DOC"
                  />
                </div>
              </SubCard>
            ))}
          </div>

          {/* Test product facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="categoryFields.inHouseTestingAsPerProductStd"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-sm font-semibold cursor-pointer">Are test facilities as per standard applicable to the item/product?</FormLabel>
                  </FormItem>
                )}
              />
              {inHouseTestingAsPerProductStd && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTestProduct({ details: "", docUrl: "" })}
                  className="gap-1.5 text-xs text-violet-600 border-violet-200"
                >
                  <Plus className="h-3 w-3" /> Add Product Std Entry
                </Button>
              )}
            </div>
            {inHouseTestingAsPerProductStd && testProductFields.map((field, idx) => (
              <SubCard key={field.id} title="Test facility as per Product details" onDelete={() => removeTestProduct(idx)} index={idx}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.inHouseTestingAsPerProductStdDetails.${idx}.details`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Standard Details <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Details of standard compliance" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload Document (PDF) *"
                    fieldName={`categoryFields.inHouseTestingAsPerProductStdDetails.${idx}.docUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="TEST_PRODUCT_STD_DOC"
                  />
                </div>
              </SubCard>
            ))}
          </div>

          {/* Testing accredited facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="categoryFields.inHouseTestingAccredited"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-sm font-semibold cursor-pointer">Is the testing facility accredited by an independent agency?</FormLabel>
                  </FormItem>
                )}
              />
              {inHouseTestingAccredited && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTestAccredited({ details: "", docUrl: "" })}
                  className="gap-1.5 text-xs text-violet-600 border-violet-200"
                >
                  <Plus className="h-3 w-3" /> Add Accred Entry
                </Button>
              )}
            </div>
            {inHouseTestingAccredited && testAccreditedFields.map((field, idx) => (
              <SubCard key={field.id} title="Accredited Facility Details" onDelete={() => removeTestAccredited(idx)} index={idx}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.inHouseTestingAccreditedDetails.${idx}.details`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Accreditation Details <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Accrediting agency and standard" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload Accreditation Certificate (PDF) *"
                    fieldName={`categoryFields.inHouseTestingAccreditedDetails.${idx}.docUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="TEST_ACCREDITED_DOC"
                  />
                </div>
              </SubCard>
            ))}
          </div>

          {/* Routine and type tests facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="categoryFields.inHouseAllTestsConducted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-sm font-semibold cursor-pointer">Can all Routine/Type/Special tests be conducted in-house?</FormLabel>
                  </FormItem>
                )}
              />
              {inHouseAllTestsConducted && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTestAll({ details: "", docUrl: "" })}
                  className="gap-1.5 text-xs text-violet-600 border-violet-200"
                >
                  <Plus className="h-3 w-3" /> Add Test Entry
                </Button>
              )}
            </div>
            {inHouseAllTestsConducted && testAllFields.map((field, idx) => (
              <SubCard key={field.id} title="Conducted Tests Details" onDelete={() => removeTestAll(idx)} index={idx}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.inHouseAllTestsConductedDetails.${idx}.details`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Test Details <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Tests list details" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload Test Facilities Proof (PDF) *"
                    fieldName={`categoryFields.inHouseAllTestsConductedDetails.${idx}.docUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="TEST_FACILITIES_PROOF"
                  />
                </div>
              </SubCard>
            ))}
          </div>

          {/* External tests facility */}
          <div className="space-y-4 rounded-xl border bg-muted/5 p-5">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="categoryFields.externalTestingConducted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-sm font-semibold cursor-pointer">Are any tests conducted in an external facility?</FormLabel>
                  </FormItem>
                )}
              />
              {externalTestingConducted && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTestExt({ details: "", docUrl: "" })}
                  className="gap-1.5 text-xs text-violet-600 border-violet-200"
                >
                  <Plus className="h-3 w-3" /> Add External Entry
                </Button>
              )}
            </div>
            {externalTestingConducted && testExtFields.map((field, idx) => (
              <SubCard key={field.id} title="External Testing Details" onDelete={() => removeTestExt(idx)} index={idx}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.externalTestingDetails.${idx}.details`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">External Laboratory and Tests <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g. CPRI, ERDA tests details" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <InlineFileUpload
                    label="Upload External Lab Copy / Contract (PDF) *"
                    fieldName={`categoryFields.externalTestingDetails.${idx}.docUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="EXTERNAL_TESTING_DOC"
                  />
                </div>
              </SubCard>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION E: FINANCIAL DATA */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="E" title="Financial Data" icon={DollarSign} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="categoryFields.netWorth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Net Worth <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="Net Worth" type="number" className="h-11" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryFields.netWorthCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="h-11"><SelectValue placeholder="INR" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <InlineFileUpload
            label="Upload Net Worth Certificate (PDF) *"
            fieldName="categoryFields.netWorthDocUrl"
            form={form}
            applicationId={applicationId}
            documentType="NET_WORTH_CERTIFICATE"
          />
        </div>

        {/* 3 PREVIOUS FINANCIAL YEARS */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h4 className="text-md font-bold text-foreground font-semibold">Finances for the Last 3 Financial Years <span className="text-destructive">*</span></h4>
            <p className="text-xs text-muted-foreground">It is mandatory to submit CA-audited financials for the last 3 financial years (e.g. 2024–25, 2023–24, 2022–23).</p>
          </div>

          {Array.from({ length: 3 }).map((_, idx) => {
            const currentYear = new Date().getFullYear();
            const yearsList = [
              `${currentYear - 1}-${String(currentYear).slice(2)}`,
              `${currentYear - 2}-${String(currentYear - 1).slice(2)}`,
              `${currentYear - 3}-${String(currentYear - 2).slice(2)}`
            ];
            const defaultYear = yearsList[idx] || "";
            return (
              <SubCard key={idx} title="Financial Year" index={idx}>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`categoryFields.financialData.${idx}.financialYear`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Select Financial Year <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value || defaultYear}>
                          <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="Select Year" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value={yearsList[0]}>{yearsList[0]}</SelectItem>
                            <SelectItem value={yearsList[1]}>{yearsList[1]}</SelectItem>
                            <SelectItem value={yearsList[2]}>{yearsList[2]}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name={`categoryFields.financialData.${idx}.turnover`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Annual Turnover <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input placeholder="Value" type="number" className="h-10" {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`categoryFields.financialData.${idx}.turnoverCurrency`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={f.onChange} defaultValue={f.value}>
                            <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="INR" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name={`categoryFields.financialData.${idx}.revenue`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Annual Revenue <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input placeholder="Value" type="number" className="h-10" {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`categoryFields.financialData.${idx}.revenueCurrency`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={f.onChange} defaultValue={f.value}>
                            <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="INR" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name={`categoryFields.financialData.${idx}.profitLoss`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Profit (+) / Loss (-) <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input placeholder="Value" className="h-10" {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`categoryFields.financialData.${idx}.profitLossCurrency`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={f.onChange} defaultValue={f.value}>
                            <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="INR" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`categoryFields.financialData.${idx}.profitability`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Profitability Percentage (%) <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="e.g. 12.5" type="number" step="0.01" className="h-10" {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <InlineFileUpload
                    label="Upload CA-Audited Annual Report (PDF) *"
                    fieldName={`categoryFields.financialData.${idx}.annualReportUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="ANNUAL_REPORT"
                  />

                  <InlineFileUpload
                    label="Upload CA-Audited Balance Sheet (PDF) *"
                    fieldName={`categoryFields.financialData.${idx}.balanceSheetUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="BALANCE_SHEET"
                  />

                  <InlineFileUpload
                    label="Upload Income Tax Return (ITR) (PDF) *"
                    fieldName={`categoryFields.financialData.${idx}.itrUrl`}
                    form={form}
                    applicationId={applicationId}
                    documentType="ITR_DOC"
                  />
                </div>
              </SubCard>
            );
          })}
        </div>

        {/* LIQUIDITY & SOLVENCY */}
        <div className="grid gap-5 sm:grid-cols-2 pt-4 border-t">
          <FormField
            control={form.control}
            name="categoryFields.liquidity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Liquidity (Current Financial Year) <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="Enter liquidity value" type="number" className="h-11" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InlineFileUpload
            label="Upload Liquidity Support / Statement (PDF) *"
            fieldName="categoryFields.liquidityDocUrl"
            form={form}
            applicationId={applicationId}
            documentType="LIQUIDITY_STATEMENT"
          />

          <div className="sm:col-span-2 grid gap-5 sm:grid-cols-3 rounded-xl border bg-muted/5 p-5">
            <FormField
              control={form.control}
              name="categoryFields.solvencyBankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Solvency Certificate Bank Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input placeholder="Bank Name" className="h-10" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryFields.solvencyDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Certificate Issuance Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="date" className="h-10" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <InlineFileUpload
              label="Upload Solvency Certificate (PDF) *"
              fieldName="categoryFields.solvencyDocUrl"
              form={form}
              applicationId={applicationId}
              documentType="SOLVENCY_CERTIFICATE"
            />

            <FormField
              control={form.control}
              name="categoryFields.solvencyDetails"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel className="text-xs font-semibold">Solvency Certificate Details / Value <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Textarea placeholder="Explain solvency details and value limits" className="min-h-[80px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION F: TYPE TEST CERTIFICATES / REPORTS */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="F" title="Type Test Certificates / Reports" icon={FileCheck} />

        <div className="rounded-xl border bg-muted/5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <FormField
              control={form.control}
              name="categoryFields.typeTestCertificateProvided"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer font-semibold">Are Type Test certificates / reports provided? <span className="text-destructive">*</span></FormLabel>
                </FormItem>
              )}
            />
            {typeTestCertificateProvided && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTypeTest({ details: "", validTill: "", documentUrl: "" })}
                className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Type Test
              </Button>
            )}
          </div>

          {typeTestCertificateProvided && typeTestFields.map((field, idx) => (
            <SubCard key={field.id} title="Type Test Report" onDelete={() => removeTypeTest(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`categoryFields.typeTestCertificates.${idx}.details`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Test Details & Standard Reference <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Standard / Tests Details" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.typeTestCertificates.${idx}.validTill`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Valid Till Date <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Type Test Report (PDF) *"
                  fieldName={`categoryFields.typeTestCertificates.${idx}.documentUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="TYPE_TEST_REPORT"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* ACCREDITED LABS */}
        <div className="rounded-xl border bg-muted/5 p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <FormField
              control={form.control}
              name="categoryFields.typeTestFromAccreditedLab"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel className="text-sm font-semibold cursor-pointer">Are Type Test reports from an accredited laboratory? <span className="text-destructive">*</span></FormLabel>
                </FormItem>
              )}
            />
            {typeTestFromAccreditedLab && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTypeTestLab({ laboratoryName: "", validTill: "", accreditationCertUrl: "" })}
                className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Laboratory
              </Button>
            )}
          </div>

          {typeTestFromAccreditedLab && typeTestLabFields.map((field, idx) => (
            <SubCard key={field.id} title="Accredited Lab details" onDelete={() => removeTypeTestLab(idx)} index={idx}>
              <div className="grid gap-5 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name={`categoryFields.typeTestAccreditedLabs.${idx}.laboratoryName`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Laboratory Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Lab Name" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`categoryFields.typeTestAccreditedLabs.${idx}.validTill`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Accreditation Valid Till <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="date" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Accreditation Certificate (PDF) *"
                  fieldName={`categoryFields.typeTestAccreditedLabs.${idx}.accreditationCertUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="LAB_ACCREDITATION_CERT"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* BOOLEAN VERIFICATIONS */}
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="categoryFields.typeTestProposedModel"
            render={({ field }) => (
              <FormItem className="rounded-xl border bg-muted/5 p-4 flex flex-col justify-between h-32">
                <FormLabel className="text-xs font-semibold leading-normal">
                  3. Is the Type test certificate / report for the proposed model? <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={field.value === true} onChange={() => field.onChange(true)} className="accent-violet-600" /> Yes
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={field.value === false} onChange={() => field.onChange(false)} className="accent-violet-600" /> No
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.typeTestRelevantStandard"
            render={({ field }) => (
              <FormItem className="rounded-xl border bg-muted/5 p-4 flex flex-col justify-between h-32">
                <FormLabel className="text-xs font-semibold leading-normal">
                  4. Is the Type test certificate / report as per the relevant standard? <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={field.value === true} onChange={() => field.onChange(true)} className="accent-violet-600" /> Yes
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={field.value === false} onChange={() => field.onChange(false)} className="accent-violet-600" /> No
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.typeTestLessThan5Years"
            render={({ field }) => (
              <FormItem className="rounded-xl border bg-muted/5 p-4 flex flex-col justify-between h-32">
                <FormLabel className="text-xs font-semibold leading-normal">
                  5. Is the Type test certificate / report less than 5 years old? <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={field.value === true} onChange={() => field.onChange(true)} className="accent-violet-600" /> Yes
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={field.value === false} onChange={() => field.onChange(false)} className="accent-violet-600" /> No
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION G: AFTER SALES SERVICE */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="G" title="After Sales Service" icon={Building2} />

        {/* DELHI AND NCR SUPPORT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-md font-bold text-foreground">Details of After-Sales support in Delhi and NCR <span className="text-destructive">*</span></h4>
              <p className="text-xs text-muted-foreground">Add details of support centers, service personnel, and uploads.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAfterSalesDelhi({ details: "", documentUrl: "" })}
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4" /> Add support Center
            </Button>
          </div>

          {afterSalesDelhiFields.map((field, idx) => (
            <SubCard key={field.id} title="Delhi & NCR support Details" onDelete={afterSalesDelhiFields.length > 1 ? () => removeAfterSalesDelhi(idx) : undefined} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.afterSalesDelhiNcr.${idx}.details`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Support details / Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Service setup details" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Support Proof (PDF) *"
                  fieldName={`categoryFields.afterSalesDelhiNcr.${idx}.documentUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="AFTER_SALES_DELHI_DOC"
                />
              </div>
            </SubCard>
          ))}
        </div>

        {/* OUTSIDE DELHI AND NCR SUPPORT */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="text-md font-bold text-foreground">Details of After-Sales support in India (Outside Delhi/NCR) <span className="text-destructive">*</span></h4>
              <p className="text-xs text-muted-foreground">Add details of support setups outside the NCR region.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAfterSalesOutside({ details: "", documentUrl: "" })}
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4" /> Add support Center
            </Button>
          </div>

          {afterSalesOutsideFields.map((field, idx) => (
            <SubCard key={field.id} title="Outside NCR Support Details" onDelete={afterSalesOutsideFields.length > 1 ? () => removeAfterSalesOutside(idx) : undefined} index={idx}>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`categoryFields.afterSalesOutsideDelhiNcr.${idx}.details`}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Support details / Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="Service setup details" className="h-10" {...f} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InlineFileUpload
                  label="Upload Support Proof (PDF) *"
                  fieldName={`categoryFields.afterSalesOutsideDelhiNcr.${idx}.documentUrl`}
                  form={form}
                  applicationId={applicationId}
                  documentType="AFTER_SALES_INDIA_DOC"
                />
              </div>
            </SubCard>
          ))}
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SECTION H: UNDERTAKINGS */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionHeader letter="H" title="Undertakings" icon={FileSignature} />

        <div className="rounded-xl border bg-yellow-50/10 dark:bg-yellow-950/10 border-yellow-200/40 p-4 mb-4 text-sm text-muted-foreground flex gap-2.5 items-start">
          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p>Please check and accept all the undertakings below. All check boxes must be checked for submission.</p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="categoryFields.undertaking_a"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-muted/15 p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-semibold cursor-pointer">
                    (a) We hereby confirm that this application is in accordance with the relevant standard(s) <span className="text-destructive">*</span>
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">Must be checked.</p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_b_servicePeriod"
            render={({ field }) => (
              <FormItem className="rounded-lg border bg-muted/15 p-4">
                <FormLabel className="text-sm font-semibold">
                  (b) The item/product is a proven one and has been in service for: <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex items-center gap-2 mt-2">
                  <FormControl>
                    <Input type="number" min="0" placeholder="Years" className="h-10 w-28" {...field} />
                  </FormControl>
                  <span className="text-sm text-muted-foreground font-semibold">Years</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_c"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-muted/15 p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-semibold cursor-pointer">
                    (c) We shall provide spares and maintenance support during the lifetime of the product, irrespective of upgradation / phasing-out. <span className="text-destructive">*</span>
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">Must be checked.</p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* UNDERTAKING D (ANNEXURE 2A & 2B UPLOADS) */}
          <div className="space-y-4 rounded-lg border bg-muted/15 p-4">
            <FormField
              control={form.control}
              name="categoryFields.undertaking_d"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-sm font-semibold cursor-pointer">
                      (d) We shall comply with all conditions of DMRC's Vendor Policy, including submission of Vendor warrantee undertaking and tripartite agreement. <span className="text-destructive">*</span>
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">Must be checked.</p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {undertaking_d && (
              <div className="grid gap-5 sm:grid-cols-2 pt-3 pl-6 border-l-2 border-violet-400">
                <InlineFileUpload
                  label="Upload signed Annexure-2A (PDF) *"
                  fieldName="categoryFields.undertaking_d_annexure2AUrl"
                  form={form}
                  applicationId={applicationId}
                  documentType="UNDERTAKING_ANNEXURE_2A"
                />
                <InlineFileUpload
                  label="Upload signed Annexure-2B (PDF) *"
                  fieldName="categoryFields.undertaking_d_annexure2BUrl"
                  form={form}
                  applicationId={applicationId}
                  documentType="UNDERTAKING_ANNEXURE_2B"
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="categoryFields.undertaking_e"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-muted/15 p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-semibold cursor-pointer">
                    (e) We are aware that despite empanelment we are liable to submit technical compliances in respective contract specifications prior to getting confirmed orders. <span className="text-destructive">*</span>
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">Must be checked.</p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_f"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-muted/15 p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-semibold cursor-pointer">
                    (f) We have conducted all Type tests, including special tests, and Test certificates / reports are submitted with the undertaking to repeat them at our own cost if required. <span className="text-destructive">*</span>
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">Must be checked.</p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* UNDERTAKING G (EMI/EMC UPLOAD) */}
          <div className="space-y-4 rounded-lg border bg-muted/15 p-4">
            <FormField
              control={form.control}
              name="categoryFields.undertaking_g"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold">
                    (g) Proposed equipment performance will not be affected by EMI / EMC effect of 25 kV single phase OHE? <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="h-10 w-44"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {undertaking_g === "Yes" && (
              <div className="pt-3 pl-6 border-l-2 border-violet-400">
                <InlineFileUpload
                  label="Upload Report of EMI / EMC Study (PDF) *"
                  fieldName="categoryFields.undertaking_g_emiEmcStudyUrl"
                  form={form}
                  applicationId={applicationId}
                  documentType="EMI_EMC_STUDY_REPORT"
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="categoryFields.undertaking_h"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-muted/15 p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-semibold cursor-pointer">
                    (h) All statements, information, and answers given above are true and no information has been suppressed. DMRC is at liberty to take penal action if found misleading. <span className="text-destructive">*</span>
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">Must be checked.</p>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </section>
    </div>
  );
}
