"use client";

import { useEffect, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Upload, Loader2, CheckCircle2, Code, FileText, Settings, Layers, Calendar, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MATERIAL_GROUPS } from "./materials";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CertificateRow } from "./CertificateRow";
import { toast } from "@/components/ui/sonner";

interface ArchitectureFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  applicationId: string;
}

export function ArchitectureFields({ form, applicationId }: ArchitectureFieldsProps) {
  // Field arrays for repeatable sections
  const { fields: isCodes, append: addIsCode, remove: removeIsCode } = useFieldArray({
    control: form.control,
    name: "categoryFields.isCodes",
  });

  const { fields: internationalCodes, append: addInternationalCode, remove: removeInternationalCode } = useFieldArray({
    control: form.control,
    name: "categoryFields.internationalCodes",
  });

  const { fields: nablEntries, append: addNablEntry, remove: removeNablEntry } = useFieldArray({
    control: form.control,
    name: "categoryFields.nablEntries",
  });

  const { fields: internationalLabEntries, append: addInternationalLabEntry, remove: removeInternationalLabEntry } = useFieldArray({
    control: form.control,
    name: "categoryFields.internationalLabEntries",
  });

  const { fields: isoEntries, append: addIsoEntry, remove: removeIsoEntry } = useFieldArray({
    control: form.control,
    name: "categoryFields.isoEntries",
  });

  const { fields: greenEntries, append: addGreenEntry, remove: removeGreenEntry } = useFieldArray({
    control: form.control,
    name: "categoryFields.greenEntries",
  });

  const { fields: govEntries, append: addGovEntry, remove: removeGovEntry } = useFieldArray({
    control: form.control,
    name: "categoryFields.govEntries",
  });

  const { fields: projects, append: addProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "categoryFields.projects",
  });

  const { fields: dmrcProjects, append: addDmrcProject, remove: removeDmrcProject } = useFieldArray({
    control: form.control,
    name: "categoryFields.dmrcProjects",
  });

  // Watch boolean toggles
  const nablAccredited = form.watch("categoryFields.nablAccredited");
  const internationalLabTested = form.watch("categoryFields.internationalLabTested");
  const isoCertified = form.watch("categoryFields.isoCertified");
  const greenCertified = form.watch("categoryFields.greenCertified");
  const govRegistered = form.watch("categoryFields.govRegistered");
  const suppliedToDmrc = form.watch("categoryFields.suppliedToDmrc");
  const sriApplicable = form.watch("categoryFields.sriApplicable");

  // Track uploading state for nested fields
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

  const getUploadKey = (isDmrc: boolean, index: number, fieldName: string) =>
    `${isDmrc ? "dmrc" : "proj"}-${index}-${fieldName}`;

  // Automatically append at least one entry when a section toggle is turned on
  useEffect(() => {
    if (nablAccredited && nablEntries.length === 0) {
      addNablEntry({ labName: "", validTill: "", certificateUrl: "" });
    }
  }, [nablAccredited, nablEntries.length, addNablEntry]);

  useEffect(() => {
    if (internationalLabTested && internationalLabEntries.length === 0) {
      addInternationalLabEntry({ labName: "", testName: "", validTill: "", certificateUrl: "" });
    }
  }, [internationalLabTested, internationalLabEntries.length, addInternationalLabEntry]);

  useEffect(() => {
    if (isoCertified && isoEntries.length === 0) {
      addIsoEntry({ isoDetails: "", validTill: "", documentUrl: "" });
    }
  }, [isoCertified, isoEntries.length, addIsoEntry]);

  useEffect(() => {
    if (greenCertified && greenEntries.length === 0) {
      addGreenEntry({ orgName: "", validTill: "", documentUrl: "" });
    }
  }, [greenCertified, greenEntries.length, addGreenEntry]);

  useEffect(() => {
    if (govRegistered && govEntries.length === 0) {
      addGovEntry({ orgName: "", validTill: "", documentUrl: "" });
    }
  }, [govRegistered, govEntries.length, addGovEntry]);

  useEffect(() => {
    if (suppliedToDmrc && dmrcProjects.length === 0) {
      addDmrcProject({
        contractNumber: "",
        contractorName: "",
        amount: "",
        currency: "INR",
        completionDate: "",
        workOrderUrl: "",
        completionCertUrl: "",
      });
    }
  }, [suppliedToDmrc, dmrcProjects.length, addDmrcProject]);

  const handleProjectFileChange = async (
    index: number,
    isDmrc: boolean,
    fieldName: "workOrderUrl" | "completionCertUrl",
    file: File | undefined,
    documentType: string
  ) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    const key = getUploadKey(isDmrc, index, fieldName);
    setUploadingState((prev) => ({ ...prev, [key]: true }));

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
      const prefix = isDmrc ? "categoryFields.dmrcProjects" : "categoryFields.projects";
      form.setValue(`${prefix}.${index}.${fieldName}`, data.document.fileUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file upload.");
    } finally {
      setUploadingState((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSriFileChange = async (file: File | undefined) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setUploadingState((prev) => ({ ...prev, sri: true }));

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("documentType", "SRI_TEST_REPORT");

      const response = await fetch(`/api/applications/${applicationId}/documents`, {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "File upload failed.");
        return;
      }

      toast.success("SRI Test Report uploaded successfully!");
      form.setValue("categoryFields.sriTestReportUrl", data.document.fileUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file upload.");
    } finally {
      setUploadingState((prev) => ({ ...prev, sri: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Section A: Material / Item Details */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white shadow-md shadow-teal-600/20">
            A
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Material / Item Details</h3>
            <p className="text-xs text-muted-foreground">Specify the materials and options relating to this application.</p>
          </div>
        </div>

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
                  {MATERIAL_GROUPS.map((group, groupIdx) => (
                    <SelectGroup key={group.sNo}>
                      <SelectLabel className="text-teal-600 font-bold text-xs px-2 py-1.5 uppercase tracking-wider bg-muted/30">
                        {group.sNo} – {group.category}
                      </SelectLabel>
                      {group.items.map((item) => (
                        <SelectItem key={item.value} value={item.value} className="pl-6 text-xs whitespace-normal h-auto py-2">
                          {item.label}
                        </SelectItem>
                      ))}
                      {groupIdx < MATERIAL_GROUPS.length - 1 && <SelectSeparator />}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <Separator className="border-border/60" />

      {/* Section B: Qualifying Criteria */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white shadow-md shadow-teal-600/20">
            B
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Qualifying Criteria</h3>
            <p className="text-xs text-muted-foreground">Provide compliance, laboratory testing, and certifications.</p>
          </div>
        </div>

        {/* 1. IS Code Conformance */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-teal-600" />
              <h4 className="text-sm font-bold text-foreground">1. Relevant IS Code Conformance</h4>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addIsCode({ code: "", validTill: "", certificateUrl: "" })}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add IS Code
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Specify the list of relevant IS codes conformance along with validity dates and copies of credentials.
          </p>

          <div className="space-y-3">
            {isCodes.map((field, index) => (
              <CertificateRow
                key={field.id}
                form={form}
                index={index}
                fieldPrefix="categoryFields.isCodes"
                textFields={[{ name: "code", label: "IS Code Name", placeholder: "e.g., IS 15622:2006" }]}
                onRemove={() => removeIsCode(index)}
                applicationId={applicationId}
                documentType="IS_CODE_CONFORMANCE"
              />
            ))}
            {isCodes.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No IS codes added yet. Click "Add IS Code" if applicable.
              </p>
            )}
          </div>
        </div>

        {/* 2. International Code Conformance */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-600" />
              <h4 className="text-sm font-bold text-foreground">2. Relevant International Code Conformance</h4>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addInternationalCode({ code: "", validTill: "", certificateUrl: "" })}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add International Code
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Specify international codes conformance (BS, EN, ASTM, etc.) along with validity dates and copy of certificates.
          </p>

          <div className="space-y-3">
            {internationalCodes.map((field, index) => (
              <CertificateRow
                key={field.id}
                form={form}
                index={index}
                fieldPrefix="categoryFields.internationalCodes"
                textFields={[{ name: "code", label: "International Code Name", placeholder: "e.g., BS EN 13964" }]}
                onRemove={() => removeInternationalCode(index)}
                applicationId={applicationId}
                documentType="INTERNATIONAL_CODE_CONFORMANCE"
              />
            ))}
            {internationalCodes.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No international codes added yet. Click "Add International Code" if applicable.
              </p>
            )}
          </div>
        </div>

        {/* 3. NABL Lab Testing */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.nablAccredited"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    3. Tested in NABL accredited laboratory
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check if the product is tested in a NABL accredited lab. If yes, details and credentials must be attached.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {nablAccredited && (
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-teal-700">NABL Laboratory Testing Records</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addNablEntry({ labName: "", validTill: "", certificateUrl: "" })}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add NABL Lab
                </Button>
              </div>

              <div className="space-y-3">
                {nablEntries.map((field, index) => (
                  <CertificateRow
                    key={field.id}
                    form={form}
                    index={index}
                    fieldPrefix="categoryFields.nablEntries"
                    textFields={[{ name: "labName", label: "NABL Lab Name", placeholder: "e.g., National Test House" }]}
                    onRemove={() => removeNablEntry(index)}
                    applicationId={applicationId}
                    documentType="NABL_LAB_TEST_REPORT"
                  />
                ))}
              </div>
              <FormField
                control={form.control}
                name="categoryFields.nablEntries"
                render={({ fieldState }) => (
                  fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                )}
              />
            </div>
          )}
        </div>

        {/* 4. International Lab Testing */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.internationalLabTested"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    4. Tested in International laboratory
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check if the product has testing records with international labs. If yes, specify lab name, test details, dates and PDF.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {internationalLabTested && (
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-teal-700">International Lab Testing Records</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addInternationalLabEntry({ labName: "", testName: "", validTill: "", certificateUrl: "" })}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add Lab Record
                </Button>
              </div>

              <div className="space-y-3">
                {internationalLabEntries.map((field, index) => (
                  <CertificateRow
                    key={field.id}
                    form={form}
                    index={index}
                    fieldPrefix="categoryFields.internationalLabEntries"
                    textFields={[
                      { name: "labName", label: "Lab Name", placeholder: "e.g., SGS Lab" },
                      { name: "testName", label: "Test Performed", placeholder: "e.g., Fire Retardation Test" },
                    ]}
                    onRemove={() => removeInternationalLabEntry(index)}
                    applicationId={applicationId}
                    documentType="INTERNATIONAL_LAB_TEST_REPORT"
                  />
                ))}
              </div>
              <FormField
                control={form.control}
                name="categoryFields.internationalLabEntries"
                render={({ fieldState }) => (
                  fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                )}
              />
            </div>
          )}
        </div>

        {/* 5. ISO Certification */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.isoCertified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    5. ISO Certified
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check if manufacturing plants/processes are ISO certified. If yes, ISO certificates must be attached.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {isoCertified && (
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-teal-700">ISO Certification Records</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addIsoEntry({ isoDetails: "", validTill: "", documentUrl: "" })}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add ISO Cert
                </Button>
              </div>

              <div className="space-y-3">
                {isoEntries.map((field, index) => (
                  <CertificateRow
                    key={field.id}
                    form={form}
                    index={index}
                    fieldPrefix="categoryFields.isoEntries"
                    textFields={[{ name: "isoDetails", label: "ISO Cert Details", placeholder: "e.g., ISO 9001:2015" }]}
                    onRemove={() => removeIsoEntry(index)}
                    applicationId={applicationId}
                    documentType="ISO_CERTIFICATE"
                    fileFieldName="documentUrl"
                  />
                ))}
              </div>
              <FormField
                control={form.control}
                name="categoryFields.isoEntries"
                render={({ fieldState }) => (
                  fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                )}
              />
            </div>
          )}
        </div>
      </section>

      <Separator className="border-border/60" />

      {/* Section C: Additional Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400 text-sm font-bold text-white shadow-md shadow-teal-400/20">
            C
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Additional Information</h3>
            <p className="text-xs text-muted-foreground">Provide green metrics, area applicability, projects experience, and SRI credentials.</p>
          </div>
        </div>

        {/* 1. Green Certification */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.greenCertified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    1. Green certified (GRIHA / LEED / IGBC)
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Indicate if your material holds rating/certifications from recognized green building organisations.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {greenCertified && (
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-teal-700">Green Certification Records</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addGreenEntry({ orgName: "", validTill: "", documentUrl: "" })}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add Green Cert
                </Button>
              </div>

              <div className="space-y-3">
                {greenEntries.map((field, index) => (
                  <CertificateRow
                    key={field.id}
                    form={form}
                    index={index}
                    fieldPrefix="categoryFields.greenEntries"
                    textFields={[{ name: "orgName", label: "Certifying Organisation", placeholder: "e.g., IGBC Green Home" }]}
                    onRemove={() => removeGreenEntry(index)}
                    applicationId={applicationId}
                    documentType="GREEN_CERTIFICATE"
                    fileFieldName="documentUrl"
                  />
                ))}
              </div>
              <FormField
                control={form.control}
                name="categoryFields.greenEntries"
                render={({ fieldState }) => (
                  fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                )}
              />
            </div>
          )}
        </div>

        {/* 2. Government/PSU Registration */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.govRegistered"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    2. Registered with Government / PSU organisation
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Indicate if this product is approved/registered with other departments (e.g. CPWD, MES, DDA, or other Metros).
                  </p>
                </div>
              </FormItem>
            )}
          />

          {govRegistered && (
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-teal-700">Govt / PSU Approvals</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addGovEntry({ orgName: "", validTill: "", documentUrl: "" })}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add Approval
                </Button>
              </div>

              <div className="space-y-3">
                {govEntries.map((field, index) => (
                  <CertificateRow
                    key={field.id}
                    form={form}
                    index={index}
                    fieldPrefix="categoryFields.govEntries"
                    textFields={[{ name: "orgName", label: "Government/PSU Dept Name", placeholder: "e.g., CPWD, Delhi" }]}
                    onRemove={() => removeGovEntry(index)}
                    applicationId={applicationId}
                    documentType="GOVT_PSU_REGISTRATION"
                    fileFieldName="documentUrl"
                  />
                ))}
              </div>
              <FormField
                control={form.control}
                name="categoryFields.govEntries"
                render={({ fieldState }) => (
                  fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                )}
              />
            </div>
          )}
        </div>

        {/* 3. Projects */}
        <div className="space-y-5 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              <div>
                <h4 className="text-sm font-bold text-foreground">3. Past Projects Experience</h4>
                <p className="text-xs text-muted-foreground">Supply details for Government, PSU, or Private projects (max 5, last 5 years)</p>
              </div>
            </div>
            {projects.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addProject({
                    organisationName: "",
                    amount: "",
                    currency: "INR",
                    completionDate: "",
                    workOrderUrl: "",
                    completionCertUrl: "",
                  })
                }
                className="gap-1.5 h-8 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add Project
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {projects.map((field, index) => (
              <div key={field.id} className="relative rounded-lg border border-border/50 bg-muted/5 p-4 transition-all hover:bg-muted/10">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project #{index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeProject(index)} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`categoryFields.projects.${index}.organisationName`}
                    render={({ field: ff }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold">Organisation Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Organisation name" className="h-10 text-sm bg-background border-border/80" {...ff} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.projects.${index}.amount`}
                    render={({ field: ff }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold">Amount (incl. GST) <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input type="number" placeholder="Amount" className="h-10 text-sm bg-background border-border/80" {...ff} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`categoryFields.projects.${index}.currency`}
                    render={({ field: ff }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={ff.onChange} defaultValue={ff.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-sm bg-background border-border/80">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                          </FormControl>
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
                  <FormField
                    control={form.control}
                    name={`categoryFields.projects.${index}.completionDate`}
                    render={({ field: ff }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold">Completion Date <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input type="date" className="h-10 text-sm bg-background border-border/80" {...ff} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Inline Uploads for Project Documents */}
                <div className="grid gap-4 sm:grid-cols-2 mt-4 pt-4 border-t border-dashed border-border/80">
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-foreground">Work Order PDF <span className="text-destructive">*</span></FormLabel>
                    <div className="flex items-center gap-2">
                      {form.watch(`categoryFields.projects.${index}.workOrderUrl`) ? (
                        <div className="flex items-center gap-2 w-full h-10 border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-md text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <a href={form.watch(`categoryFields.projects.${index}.workOrderUrl`)} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate hover:underline flex-1">
                            View PDF
                          </a>
                          <label className="cursor-pointer text-xs font-bold text-dmrc-blue hover:text-dmrc-blue-light transition-colors shrink-0">
                            Replace
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleProjectFileChange(index, false, "workOrderUrl", e.target.files?.[0], "PROJECT_WORK_ORDER")}
                              className="hidden"
                              disabled={uploadingState[getUploadKey(false, index, "workOrderUrl")]}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-dmrc-blue hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
                          {uploadingState[getUploadKey(false, index, "workOrderUrl")] ? (
                            <><Loader2 className="h-4 w-4 animate-spin text-dmrc-blue" />Uploading...</>
                          ) : (
                            <><Upload className="h-4 w-4 text-muted-foreground" />Upload PDF</>
                          )}
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleProjectFileChange(index, false, "workOrderUrl", e.target.files?.[0], "PROJECT_WORK_ORDER")}
                            className="hidden"
                            disabled={uploadingState[getUploadKey(false, index, "workOrderUrl")]}
                          />
                        </label>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name={`categoryFields.projects.${index}.workOrderUrl`}
                      render={({ fieldState }) => (
                        fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                      )}
                    />
                  </FormItem>

                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-foreground">Completion Certificate PDF <span className="text-destructive">*</span></FormLabel>
                    <div className="flex items-center gap-2">
                      {form.watch(`categoryFields.projects.${index}.completionCertUrl`) ? (
                        <div className="flex items-center gap-2 w-full h-10 border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-md text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <a href={form.watch(`categoryFields.projects.${index}.completionCertUrl`)} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate hover:underline flex-1">
                            View PDF
                          </a>
                          <label className="cursor-pointer text-xs font-bold text-dmrc-blue hover:text-dmrc-blue-light transition-colors shrink-0">
                            Replace
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleProjectFileChange(index, false, "completionCertUrl", e.target.files?.[0], "PROJECT_COMPLETION_CERTIFICATE")}
                              className="hidden"
                              disabled={uploadingState[getUploadKey(false, index, "completionCertUrl")]}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-dmrc-blue hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
                          {uploadingState[getUploadKey(false, index, "completionCertUrl")] ? (
                            <><Loader2 className="h-4 w-4 animate-spin text-dmrc-blue" />Uploading...</>
                          ) : (
                            <><Upload className="h-4 w-4 text-muted-foreground" />Upload PDF</>
                          )}
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleProjectFileChange(index, false, "completionCertUrl", e.target.files?.[0], "PROJECT_COMPLETION_CERTIFICATE")}
                            className="hidden"
                            disabled={uploadingState[getUploadKey(false, index, "completionCertUrl")]}
                          />
                        </label>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name={`categoryFields.projects.${index}.completionCertUrl`}
                      render={({ fieldState }) => (
                        fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                      )}
                    />
                  </FormItem>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-lg">
                No projects added yet. Click "Add Project" to add your work history.
              </p>
            )}
          </div>
        </div>

        {/* 4. DMRC Projects */}
        <div className="space-y-5 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.suppliedToDmrc"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    4. Supplied or used in DMRC projects?
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check if this product/material was supplied directly or via contracting partners in DMRC projects.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {suppliedToDmrc && (
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-teal-700">DMRC Supply Records (max 5)</h5>
                {dmrcProjects.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addDmrcProject({
                        contractNumber: "",
                        contractorName: "",
                        amount: "",
                        currency: "INR",
                        completionDate: "",
                        workOrderUrl: "",
                        completionCertUrl: "",
                      })
                    }
                    className="gap-1.5 h-7 text-xs"
                  >
                    <Plus className="h-3 w-3" /> Add DMRC Record
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {dmrcProjects.map((field, index) => (
                  <div key={field.id} className="relative rounded-lg border border-teal-100 bg-teal-50/10 p-4 transition-all hover:bg-teal-50/20">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-700/80 uppercase tracking-wider">DMRC Entry #{index + 1}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeDmrcProject(index)} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`categoryFields.dmrcProjects.${index}.contractNumber`}
                        render={({ field: ff }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold">Contract / LOA Number <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="LOA / Contract Number" className="h-10 text-sm bg-background border-border/80" {...ff} /></FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`categoryFields.dmrcProjects.${index}.contractorName`}
                        render={({ field: ff }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold">Contractor / Agency Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="Agency name" className="h-10 text-sm bg-background border-border/80" {...ff} /></FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`categoryFields.dmrcProjects.${index}.amount`}
                        render={({ field: ff }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold">Total Value <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input type="number" placeholder="Value" className="h-10 text-sm bg-background border-border/80" {...ff} /></FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`categoryFields.dmrcProjects.${index}.currency`}
                        render={({ field: ff }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={ff.onChange} defaultValue={ff.value}>
                              <FormControl>
                                <SelectTrigger className="h-10 text-sm bg-background border-border/80">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="INR">INR (₹)</SelectItem>
                                <SelectItem value="USD">USD ($)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`categoryFields.dmrcProjects.${index}.completionDate`}
                        render={({ field: ff }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold">Supply / Completion Date <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input type="date" className="h-10 text-sm bg-background border-border/80" {...ff} /></FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* DMRC Project Inline Uploads */}
                    <div className="grid gap-4 sm:grid-cols-2 mt-4 pt-4 border-t border-dashed border-teal-100">
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-foreground">Work Order / LOA PDF <span className="text-destructive">*</span></FormLabel>
                        <div className="flex items-center gap-2">
                          {form.watch(`categoryFields.dmrcProjects.${index}.workOrderUrl`) ? (
                            <div className="flex items-center gap-2 w-full h-10 border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-md text-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <a href={form.watch(`categoryFields.dmrcProjects.${index}.workOrderUrl`)} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate hover:underline flex-1">
                                View PDF
                              </a>
                              <label className="cursor-pointer text-xs font-bold text-dmrc-blue hover:text-dmrc-blue-light transition-colors shrink-0">
                                Replace
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleProjectFileChange(index, true, "workOrderUrl", e.target.files?.[0], "DMRC_PROJECT_WORK_ORDER")}
                                  className="hidden"
                                  disabled={uploadingState[getUploadKey(true, index, "workOrderUrl")]}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-dmrc-blue hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
                              {uploadingState[getUploadKey(true, index, "workOrderUrl")] ? (
                                <><Loader2 className="h-4 w-4 animate-spin text-dmrc-blue" />Uploading...</>
                              ) : (
                                <><Upload className="h-4 w-4 text-muted-foreground" />Upload PDF</>
                              )}
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleProjectFileChange(index, true, "workOrderUrl", e.target.files?.[0], "DMRC_PROJECT_WORK_ORDER")}
                                className="hidden"
                                disabled={uploadingState[getUploadKey(true, index, "workOrderUrl")]}
                              />
                            </label>
                          )}
                        </div>
                        <FormField
                          control={form.control}
                          name={`categoryFields.dmrcProjects.${index}.workOrderUrl`}
                          render={({ fieldState }) => (
                            fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                          )}
                        />
                      </FormItem>

                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-foreground">Completion Certificate PDF <span className="text-destructive">*</span></FormLabel>
                        <div className="flex items-center gap-2">
                          {form.watch(`categoryFields.dmrcProjects.${index}.completionCertUrl`) ? (
                            <div className="flex items-center gap-2 w-full h-10 border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-md text-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <a href={form.watch(`categoryFields.dmrcProjects.${index}.completionCertUrl`)} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate hover:underline flex-1">
                                View PDF
                              </a>
                              <label className="cursor-pointer text-xs font-bold text-dmrc-blue hover:text-dmrc-blue-light transition-colors shrink-0">
                                Replace
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleProjectFileChange(index, true, "completionCertUrl", e.target.files?.[0], "DMRC_PROJECT_COMPLETION_CERTIFICATE")}
                                  className="hidden"
                                  disabled={uploadingState[getUploadKey(true, index, "completionCertUrl")]}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-dmrc-blue hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
                              {uploadingState[getUploadKey(true, index, "completionCertUrl")] ? (
                                <><Loader2 className="h-4 w-4 animate-spin text-dmrc-blue" />Uploading...</>
                              ) : (
                                <><Upload className="h-4 w-4 text-muted-foreground" />Upload PDF</>
                              )}
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleProjectFileChange(index, true, "completionCertUrl", e.target.files?.[0], "DMRC_PROJECT_COMPLETION_CERTIFICATE")}
                                className="hidden"
                                disabled={uploadingState[getUploadKey(true, index, "completionCertUrl")]}
                              />
                            </label>
                          )}
                        </div>
                        <FormField
                          control={form.control}
                          name={`categoryFields.dmrcProjects.${index}.completionCertUrl`}
                          render={({ fieldState }) => (
                            fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                          )}
                        />
                      </FormItem>
                    </div>
                  </div>
                ))}
              </div>
              <FormField
                control={form.control}
                name="categoryFields.dmrcProjects"
                render={({ fieldState }) => (
                  fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
                )}
              />
            </div>
          )}
        </div>

        {/* 5. Application Area */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <div className="space-y-2">
            <FormLabel className="text-sm font-bold text-foreground">5. Application Area <span className="text-destructive">*</span></FormLabel>
            <p className="text-xs text-muted-foreground">Select if your material is meant for Interior, Exterior, or both areas of application.</p>
            <div className="flex flex-row items-center gap-6 rounded-lg border border-border/50 bg-muted/20 p-4 mt-2">
              <FormField
                control={form.control}
                name="categoryFields.applicationArea.interior"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm font-semibold cursor-pointer">Interior</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryFields.applicationArea.exterior"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm font-semibold cursor-pointer">Exterior</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="categoryFields.applicationArea.interior"
              render={({ fieldState }) => (
                fieldState.error ? <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p> : <></>
              )}
            />
          </div>
        </div>

        {/* 6. C&D Waste */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.usesCD_waste"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    6. Material produced using C&D Waste
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check if Construction and Demolition (C&D) waste is used as recycled material in manufacturing.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* 7. SRI Value */}
        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-5">
          <FormField
            control={form.control}
            name="categoryFields.sriApplicable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    7. Solar Reflectance Index (SRI) applicable
                  </FormLabel>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Indicate if the material specifies a Solar Reflectance Index (applicable for roofs/external cladding).
                  </p>
                </div>
              </FormItem>
            )}
          />

          {sriApplicable && (
            <div className="space-y-4 pt-3 border-t border-border/50">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="categoryFields.sriValue"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-semibold text-foreground">SRI Value <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 78" className="h-10 text-sm bg-background border-border/80" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryFields.sriValidTill"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-semibold text-foreground">Valid Till <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" className="h-10 text-sm bg-background border-border/80" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormItem className="space-y-1.5 max-w-md">
                <FormLabel className="text-xs font-semibold text-foreground">SRI Test Report PDF <span className="text-destructive">*</span></FormLabel>
                <div className="flex items-center gap-2">
                  {form.watch("categoryFields.sriTestReportUrl") ? (
                    <div className="flex items-center gap-2 w-full h-10 border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-md text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <a href={form.watch("categoryFields.sriTestReportUrl")} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate hover:underline flex-1">
                        View SRI Report PDF
                      </a>
                      <label className="cursor-pointer text-xs font-bold text-dmrc-blue hover:text-dmrc-blue-light transition-colors shrink-0">
                        Replace
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleSriFileChange(e.target.files?.[0])}
                          className="hidden"
                          disabled={uploadingState.sri}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-dmrc-blue hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
                      {uploadingState.sri ? (
                        <><Loader2 className="h-4 w-4 animate-spin text-dmrc-blue" />Uploading...</>
                      ) : (
                        <><Upload className="h-4 w-4 text-muted-foreground" />Upload SRI PDF</>
                      )}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleSriFileChange(e.target.files?.[0])}
                        className="hidden"
                        disabled={uploadingState.sri}
                      />
                    </label>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="categoryFields.sriValue"
                  render={({ fieldState }) => {
                    const msg = form.formState.errors.categoryFields?.root?.message;
                    return typeof msg === "string" ? (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {msg}
                      </p>
                    ) : <></>;
                  }}
                />
              </FormItem>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
