"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, ArrowRight, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { Category } from "@/types/application";
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
    color: "data-[state=active]:bg-dmrc-blue data-[state=active]:text-white",
  },
  [Category.ELECTRICAL]: {
    label: "Electrical",
    color: "data-[state=active]:bg-purple-600 data-[state=active]:text-white",
  },
  [Category.ARCHITECTURE]: {
    label: "Architecture",
    color: "data-[state=active]:bg-teal-600 data-[state=active]:text-white",
  },
};

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.CIVIL
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [categoryLocked, setCategoryLocked] = useState(false);

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
        // Civil defaults
        isCodeConformance: "",
        internationalCodeConformance: "",
        nablAccredited: false,
        isoCertified: false,
        purchaseOrders: [
          {
            clientType: "",
            clientName: "",
            totalValue: "",
            currency: "INR",
            totalQuantity: "",
            unit: "",
            issuanceDate: "",
          },
        ],
        completionCertificates: [
          { clientType: "", clientName: "", certificateDate: "" },
        ],
        qualityPlanDetails: "",
        financialYears: [{ financialYear: "" }],
        undertaking_a: false,
        undertaking_b_servicePeriod: "",
        undertaking_c: false,
        undertaking_d: false,
        undertaking_e: false,
        undertaking_f: false,
      },
    },
  });

  function handleCategoryChange(value: string) {
    if (categoryLocked) return;
    const cat = value as Category;
    setSelectedCategory(cat);
    form.setValue("category", value as "CIVIL" | "ELECTRICAL" | "ARCHITECTURE");

    // Reset category-specific fields when switching
    if (cat === Category.ARCHITECTURE) {
      form.setValue("categoryFields", {
        materialItem: "",
        isCodeConformance: "",
        internationalCodeConformance: "",
        nablAccredited: false,
        isoCertified: false,
        greenCertified: false,
        govRegistered: false,
        applicationArea: undefined,
        usesCD_waste: false,
        sriApplicable: false,
        projects: [],
        suppliedToDmrc: false,
      });
    } else {
      form.setValue("categoryFields", {
        isCodeConformance: "",
        internationalCodeConformance: "",
        nablAccredited: false,
        isoCertified: false,
        purchaseOrders: [
          {
            clientType: "",
            clientName: "",
            totalValue: "",
            currency: "INR",
            totalQuantity: "",
            unit: "",
            issuanceDate: "",
          },
        ],
        completionCertificates: [
          { clientType: "", clientName: "", certificateDate: "" },
        ],
        qualityPlanDetails: "",
        financialYears: [{ financialYear: "" }],
        undertaking_a: false,
        undertaking_b_servicePeriod: "",
        undertaking_c: false,
        undertaking_d: false,
        undertaking_e: false,
        undertaking_f: false,
      });
    }
  }

  async function handleNext() {
    if (currentStep === 1) {
      // Validate base fields before proceeding
      const valid = await form.trigger("baseFields");
      if (!valid) {
        toast.error("Please fill in all required company information fields.");
        return;
      }
      setCategoryLocked(true);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  }

  function handleBack() {
    if (currentStep === 2) {
      setCategoryLocked(false);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      const response = await fetch("/api/vendor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: values.category,
          companyName: values.baseFields.companyName,
          formData: {
            ...values.baseFields,
            ...values.categoryFields,
          },
        }),
      });

      if (response.status === 409) {
        toast.error("You have already submitted an application.");
        router.push("/dashboard");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Submission failed. Please try again.");
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
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Category Tabs — only visible and interactive on Step 1 */}
      {currentStep === 1 && (
        <div className="mb-6">
          <Tabs
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-12">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={`text-sm font-semibold transition-all ${config.color}`}
                  disabled={categoryLocked}
                >
                  {config.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Select your application category. This cannot be changed after Step 1.
          </p>
        </div>
      )}

      {/* Locked category indicator for steps 2 & 3 */}
      {currentStep > 1 && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5">
          <span className="text-sm text-muted-foreground">Category:</span>
          <span className="text-sm font-bold text-foreground">
            {categoryConfig[selectedCategory].label}
          </span>
        </div>
      )}

      {/* Form Content */}
      <Card className="border-border/50 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-dmrc-blue via-dmrc-blue-light to-dmrc-gold" />
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Base Fields */}
              {currentStep === 1 && <BaseFields form={form} />}

              {/* Step 2: Category-Specific Fields */}
              {currentStep === 2 && selectedCategory === Category.CIVIL && (
                <CivilFields form={form} />
              )}
              {currentStep === 2 &&
                selectedCategory === Category.ELECTRICAL && (
                  <ElectricalFields form={form} />
                )}
              {currentStep === 2 &&
                selectedCategory === Category.ARCHITECTURE && (
                  <ArchitectureFields form={form} />
                )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
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
                  {currentStep < 3 && (
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

                  {currentStep === 3 && (
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
              Are you sure you want to submit your vendor application? You can
              only submit one application. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <strong>Declaration:</strong> I hereby confirm that all statements,
            information, and answers given are true and no information has been
            suppressed.
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
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
