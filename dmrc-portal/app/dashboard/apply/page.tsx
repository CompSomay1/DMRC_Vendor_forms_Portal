"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, ArrowRight, Send, Paperclip, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { StepIndicator } from "@/components/forms/StepIndicator";
import { BaseFields } from "@/components/forms/BaseFields";
import { CivilFields } from "@/components/forms/CivilFields";
import { ElectricalFields } from "@/components/forms/ElectricalFields";
import { ArchitectureFields } from "@/components/forms/ArchitectureFields";
import { FormReview } from "@/components/forms/FormReview";

import { Category, ApplicationDocument, FORM_STEPS } from "@/types/application";
import { baseFieldsSchema } from "@/lib/validations/application";

// Minimal schema for form — full category validation is applied on submit
const formSchema = z.object({
  category: z.enum(["CIVIL", "ELECTRICAL", "ARCHITECTURE"]),
  baseFields: baseFieldsSchema,
  categoryFields: z.record(z.string(), z.unknown()),
});

type FormValues = z.infer<typeof formSchema>;

const categoryConfig = {
  [Category.CIVIL]: {
    label: "Civil",
  },
  [Category.ELECTRICAL]: {
    label: "Electrical",
  },
  [Category.ARCHITECTURE]: {
    label: "Architecture",
  },
};

function ApplyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("id");

  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.CIVIL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Document upload states
  const [uploadedDocuments, setUploadedDocuments] = useState<ApplicationDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>("ISO_CERTIFICATE");
  const [isUploading, setIsUploading] = useState(false);

  const steps = (selectedCategory === Category.ARCHITECTURE || selectedCategory === Category.CIVIL || selectedCategory === Category.ELECTRICAL)
    ? [
        {
          step: 1,
          title: "Company Information",
          description: "Basic company and product details",
        },
        {
          step: 2,
          title: "Category Fields",
          description: "Category-specific qualification details & docs",
        },
        {
          step: 3,
          title: "Review & Submit",
          description: "Review your application and submit",
        },
      ]
    : FORM_STEPS;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema, undefined),
    defaultValues: {
      category: "CIVIL",
      baseFields: {
        companyName: "",
        role: undefined,
        manufacturingPeriod: "",
        madeInIndia: true,
        countryName: "",
        productionCapacity: "",
        productionCapacityUnit: "",
        lifespan: "",
      },
      categoryFields: {
        // Civil and Electrical default values (Sections A-H)
        materialItem: "",
        materialItemName: "",
        otherDetails: "",
        manufacturingUnits: [{ address: "", certifications: [], licensedCapacity: "", licensedCapacityUnit: "per_month", licensedCapacityDocUrl: "", actualProduction: "", actualProductionUnit: "per_month", actualProductionDocUrl: "", totalLandArea: "", totalLandAreaUnit: "sq_meters", landOwnershipDocUrl: "", coveredArea: "", coveredAreaUnit: "sq_meters", machineryWriteUp: "", machineryDocUrl: "" }],
        directorsShareholding: [],
        manufacturedInIndia: true,
        countryOfOrigin: "",
        authorisationDocUrl: "",
        technicalCatalogueUrl: "",
        manufacturingOngoingPeriod: "",
        orgChartUrl: "",
        manpowerLevelsUrl: "",
        keyManpowerUrl: "",
        approvals: [{ agencyType: "", agencyName: "", certificateDate: "", validTill: "", certificateUrl: "" }],
        purchaseOrders: Array.from({ length: 5 }, () => ({
          clientType: "",
          clientName: "",
          contractorName: "",
          contractNumber: "",
          scopeOfWork: "",
          materialType: "",
          typeModel: "",
          issuanceDate: "",
          workOrderUrl: "",
          totalQuantity: "",
          unit: "",
          totalValue: "",
          currency: "INR",
          purchaseOrderUrl: "",
          purchaseOrderDate: "",
          performanceCertificateUrl: "",
          performanceCertificateDate: "",
          performanceCertificateValidTill: "",
        })),
        completionCertificates: Array.from({ length: 5 }, () => ({
          clientType: "",
          clientName: "",
          certificateDate: "",
          certificateUrl: "",
        })),
        worksExecuted: Array.from({ length: 5 }, () => ({ clientType: "", clientName: "", issuanceDate: "", workOrderUrl: "" })),
        qualityPlanDetails: "",
        qualityPlanUrl: "",
        qualityCertifications: [],
        applicableCodes: [],
        inHouseTestingAccredited: false,
        inHouseTestingDetails: "",
        inHouseTestingDocUrl: "",
        externalTestingConducted: false,
        externalTestingDetails: "",
        externalTestingDocUrl: "",
        financialData: Array.from({ length: 3 }, () => ({
          financialYear: "",
          balanceSheetUrl: "",
          profitLossUrl: "",
          turnover: "",
          turnoverCurrency: "INR",
          revenue: "",
          revenueCurrency: "INR",
          profitLoss: "",
          profitLossCurrency: "INR",
          profitability: "",
          annualReportUrl: "",
          itrUrl: "",
        })),
        ocsComplianceReports: [],
        undertaking_a: false,
        undertaking_b_servicePeriod: "",
        undertaking_c: false,
        undertaking_d: false,
        undertaking_d_annexureAUrl: "",
        undertaking_d_annexureBUrl: "",
        undertaking_d_annexureCUrl: "",
        undertaking_d_annexureDUrl: "",
        undertaking_d_annexureEUrl: "",
        undertaking_d_annexure2AUrl: "",
        undertaking_d_annexure2BUrl: "",
        undertaking_e: false,
        undertaking_f: false,
        // Electrical additional default values
        applyingAs: undefined,
        nameOfMake: "",
        capacity: "",
        capacityUnit: "HP",
        rating: "",
        ratingUnit: "V",
        parentCompanyDetails: [],
        additionalOrgDocUrl: "",
        hasInHouseDesign: false,
        inHouseDesignDetails: "",
        inHouseDesignDocUrl: "",
        hasInHouseTesting: false,
        hasInHouseRnd: false,
        inHouseRndDetails: "",
        inHouseRndDocUrl: "",
        suppliedOtherProjects: false,
        otherProjects: [],
        hasBlacklisting: false,
        blacklistingDetails: [],
        hasLitigation: false,
        litigationDetails: [],
        inHouseTestingAsPerStd: false,
        inHouseTestingAsPerStdDetails: [],
        inHouseTestingAsPerProductStd: false,
        inHouseTestingAsPerProductStdDetails: [],
        inHouseTestingAccreditedDetails: [],
        inHouseAllTestsConducted: false,
        inHouseAllTestsConductedDetails: [],
        netWorth: "",
        netWorthCurrency: "INR",
        netWorthDocUrl: "",
        liquidity: "",
        liquidityDocUrl: "",
        solvencyDetails: "",
        solvencyBankName: "",
        solvencyDate: "",
        solvencyDocUrl: "",
        typeTestCertificateProvided: false,
        typeTestCertificates: [],
        typeTestFromAccreditedLab: false,
        typeTestAccreditedLabs: [],
        typeTestProposedModel: undefined,
        typeTestRelevantStandard: undefined,
        typeTestLessThan5Years: undefined,
        afterSalesDelhiNcr: [{ details: "", documentUrl: "" }],
        afterSalesOutsideDelhiNcr: [{ details: "", documentUrl: "" }],
        undertaking_g: "Not Applicable",
        undertaking_g_emiEmcStudyUrl: "",
        undertaking_h: false,
        // Architecture default values
        isCodes: [],
        internationalCodes: [],
        nablAccredited: false,
        nablEntries: [],
        internationalLabTested: false,
        internationalLabEntries: [],
        isoCertified: false,
        isoEntries: [],
        greenCertified: false,
        greenEntries: [],
        govRegistered: false,
        govEntries: [],
        projects: [],
        suppliedToDmrc: false,
        dmrcProjects: [],
        applicationArea: { interior: false, exterior: false },
        usesCD_waste: false,
        sriApplicable: false,
        sriValue: "",
        sriValidTill: "",
        sriTestReportUrl: "",
      },
    },
  });

  // Load draft application
  useEffect(() => {
    if (!draftId) {
      toast.error("Application ID is required.");
      router.push("/dashboard");
      return;
    }

    async function loadDraft() {
      try {
        const response = await fetch(`/api/applications/${draftId}`);
        if (!response.ok) {
          toast.error("Failed to load application draft.");
          router.push("/dashboard");
          return;
        }

        const data = await response.json();
        const app = data.application;

        // Populate fields
        setSelectedCategory(app.category);
        form.setValue("category", app.category);

        if (app.companyName) {
          form.setValue("baseFields.companyName", app.companyName);
        }

        if (app.documents) {
          setUploadedDocuments(app.documents);
        }

        const fd = app.formData as Record<string, any> | null;
        if (fd) {
          // populate baseFields
          Object.keys(form.getValues("baseFields")).forEach((key) => {
            if (fd[key] !== undefined) {
              form.setValue(`baseFields.${key}` as any, fd[key]);
            }
          });
          // populate categoryFields
          Object.keys(form.getValues("categoryFields")).forEach((key) => {
            if (fd[key] !== undefined) {
              form.setValue(`categoryFields.${key}` as any, fd[key]);
            }
          });
        }
      } catch {
        toast.error("Error connecting to server.");
        router.push("/dashboard");
      } finally {
        setIsLoadingDraft(false);
      }
    }

    loadDraft();
  }, [draftId, form, router]);

  async function saveDraftProgress() {
    if (!draftId) return;
    const values = form.getValues();
    try {
      await fetch(`/api/applications/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: values.baseFields.companyName,
          formData: {
            ...values.baseFields,
            ...values.categoryFields,
          },
        }),
      });
    } catch (err) {
      console.error("Draft auto-save error:", err);
    }
  }

  async function handleNext() {
    if (currentStep === 1) {
      const valid = await form.trigger("baseFields");
      if (!valid) {
        toast.error("Please fill in all required company information fields.");
        return;
      }
      await saveDraftProgress();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      await saveDraftProgress();
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedCategory !== Category.ARCHITECTURE && selectedCategory !== Category.CIVIL && selectedCategory !== Category.ELECTRICAL) {
        setCurrentStep(4);
      }
    }
  }

  function handleBack() {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    }
  }

  async function handleFileUpload() {
    if (!selectedFile || !draftId) return;
    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);
      uploadData.append("documentType", docType);

      const response = await fetch(`/api/applications/${draftId}/documents`, {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "File upload failed.");
        return;
      }

      toast.success("Document uploaded successfully!");
      setUploadedDocuments((prev) => [...prev, data.document]);
      setSelectedFile(null);
    } catch {
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit() {
    if (!draftId) return;
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      const response = await fetch(`/api/applications/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: values.baseFields.companyName,
          formData: {
            ...values.baseFields,
            ...values.categoryFields,
          },
          status: "SUBMITTED",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Submission failed. Please check form validations.");
        return;
      }

      toast.success("Application submitted successfully!");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  }

  if (isLoadingDraft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-dmrc-blue" />
        <p className="text-sm text-muted-foreground font-medium">Loading application draft...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Vendor Application Form
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete all steps to submit your vendor registration application.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} steps={steps} />
      </div>

      {/* Locked category indicator */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5">
        <span className="text-sm text-muted-foreground">Category:</span>
        <span className="text-sm font-bold text-foreground">
          {categoryConfig[selectedCategory]?.label}
        </span>
      </div>

      {/* Form Content */}
      <Card className="border-border/50 shadow-lg">
        <div className="h-1 bg-dmrc-blue" />
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Base Fields */}
              {currentStep === 1 && <BaseFields form={form} />}

              {/* Step 2: Category-Specific Fields */}
              {currentStep === 2 && selectedCategory === Category.CIVIL && (
                <CivilFields form={form} applicationId={draftId || ""} />
              )}
              {currentStep === 2 && selectedCategory === Category.ELECTRICAL && (
                <ElectricalFields form={form} applicationId={draftId || ""} />
              )}
              {currentStep === 2 && selectedCategory === Category.ARCHITECTURE && (
                <ArchitectureFields form={form} applicationId={draftId || ""} />
              )}

              {/* Step 3: Document Uploads */}
              {currentStep === 3 && selectedCategory !== Category.ARCHITECTURE && selectedCategory !== Category.CIVIL && selectedCategory !== Category.ELECTRICAL && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Attach Supporting Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload certificates, registration proofs, and other category-relevant documents.
                    </p>
                  </div>

                  {/* List of uploaded documents */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Uploaded Documents</h4>
                    {uploadedDocuments.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic bg-muted/20 border border-dashed rounded-lg p-4 text-center">
                        No files uploaded yet.
                      </p>
                    ) : (
                      <div className="divide-y border border-border rounded-lg bg-background">
                        {uploadedDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 text-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Paperclip className="h-4 w-4 text-dmrc-blue shrink-0" />
                              <span className="truncate font-medium text-foreground">{doc.fileName}</span>
                              <span className="text-xs text-muted-foreground uppercase">({doc.documentType.replace(/_/g, " ")})</span>
                            </div>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-dmrc-blue hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* File uploader form */}
                  <div className="grid gap-4 rounded-xl border bg-muted/10 p-5">
                    <h4 className="text-sm font-semibold text-foreground">Upload New Document</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Document Type</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                        >
                          <option value="ISO_CERTIFICATE">ISO Certification</option>
                          <option value="NABL_CERTIFICATE">NABL Lab Report</option>
                          <option value="BIS_ACCREDITATION">BIS Accreditation</option>
                          <option value="COMPLETION_CERTIFICATE">Completion Certificate</option>
                          <option value="PURCHASE_ORDER">Purchase/Work Order</option>
                          <option value="OTHER">Other Supporting Document</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Choose File</label>
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="rounded-lg border bg-background px-3 py-1.5 text-sm file:mr-2 file:rounded-md file:border-0 file:bg-dmrc-blue/10 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-dmrc-blue hover:file:bg-dmrc-blue/20"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={isUploading || !selectedFile}
                        className="gap-2 bg-dmrc-blue hover:bg-dmrc-blue-light text-white font-semibold"
                        size="sm"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5" />
                            Upload File
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {((currentStep === 4 && selectedCategory !== Category.ARCHITECTURE && selectedCategory !== Category.CIVIL && selectedCategory !== Category.ELECTRICAL) ||
                (currentStep === 3 && (selectedCategory === Category.ARCHITECTURE || selectedCategory === Category.CIVIL || selectedCategory === Category.ELECTRICAL))) && (
                <FormReview
                  category={selectedCategory}
                  formValues={form.getValues()}
                />
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                <div className="flex items-center gap-3">
                  {currentStep < steps.length && (
                    <Button
                      id="form-next-step"
                      type="button"
                      onClick={handleNext}
                      className="gap-2 bg-dmrc-blue hover:bg-dmrc-blue-light text-white"
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}

                  {currentStep === steps.length && (
                    <Button
                      id="form-submit"
                      type="button"
                      onClick={() => setShowConfirmDialog(true)}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your vendor application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <strong>Declaration:</strong> I hereby confirm that all statements,
            information, and answers given are true and no information has been
            suppressed.
          </div>
          <DialogFooter className="gap-4 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm & Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-dmrc-blue" />
        <p className="text-sm text-muted-foreground font-medium">Mounting form...</p>
      </div>
    }>
      <ApplyFormContent />
    </Suspense>
  );
}
