"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { toast } from "@/components/ui/sonner";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Confirmation dialogues
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Document upload state mapping
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      companyName: "",
      businessStructure: undefined,
      businessStructureOther: "",
      registeredAddress: "",
      city: "",
      state: "",
      country: "India",
      pinCode: "",
      gstNumber: "",
      gstDocUrl: "",
      panDocUrl: "",
      cinNumber: "",
      cinDocUrl: "",
      dateOfRegistration: "",
      contactCountryCode: "+91",
      contactNumber: "",
      companyEmail: "",
      repName: "",
      repDesignation: "",
      repAuthDocUrl: "",
      repCountryCode: "+91",
      repMobile: "",
      repEmail: "",
      panCard: "",
      password: "",
      confirmPassword: "",
      declaration: false,
    },
  });

  // Watch for conditional inputs
  const businessStructure = useWatch({ control, name: "businessStructure" });
  const panCardVal = useWatch({ control, name: "panCard" });
  const passwordVal = useWatch({ control, name: "password" });
  
  const gstDocUrl = useWatch({ control, name: "gstDocUrl" });
  const panDocUrl = useWatch({ control, name: "panDocUrl" });
  const cinDocUrl = useWatch({ control, name: "cinDocUrl" });
  const repAuthDocUrl = useWatch({ control, name: "repAuthDocUrl" });

  // Handle client-side file upload directly to unauthenticated upload API
  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof RegisterFormValues) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/register/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      setValue(fieldName as any, data.fileUrl);
      setUploadedFiles((prev) => ({ ...prev, [fieldName]: file.name }));
      toast.success(`${file.name} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file");
    } finally {
      setUploadingField(null);
    }
  }

  function removeUploadedFile(fieldName: keyof RegisterFormValues) {
    setValue(fieldName as any, "");
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  }

  async function handleNextStep() {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "companyName",
        "businessStructure",
        "businessStructureOther",
        "registeredAddress",
        "city",
        "state",
        "country",
        "pinCode",
        "gstNumber",
        "gstDocUrl",
        "panDocUrl",
        "cinNumber",
        "cinDocUrl",
        "dateOfRegistration",
        "contactCountryCode",
        "contactNumber",
        "companyEmail",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "repName",
        "repDesignation",
        "repAuthDocUrl",
        "repCountryCode",
        "repMobile",
        "repEmail",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all required fields correctly before moving next.");
    }
  }

  function handleBackStep() {
    setCurrentStep((prev) => prev - 1);
  }

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please check your network connection.");
    } finally {
      setIsLoading(false);
      setShowSubmitDialog(false);
    }
  }

  const steps = [
    { number: 1, title: "Company Details" },
    { number: 2, title: "Representative" },
    { number: 3, title: "Credentials" },
  ];

  return (
    <div className="w-full">
      {/* Wizard Step Progress Indicator */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition duration-300 ${
                  currentStep === step.number
                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                    : currentStep > step.number
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5 stroke-[2.5]" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-[0.78rem] font-semibold tracking-wide transition duration-300 ${
                  currentStep === step.number ? "text-blue-700 dark:text-blue-400" : "text-gray-400 dark:text-zinc-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-full flex-1 self-center -translate-y-3 transition duration-500 ${
                  currentStep > step.number ? "bg-emerald-400" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit((data) => setShowSubmitDialog(true))} className="flex flex-col gap-6">
        
        {/* ================= STEP 1: COMPANY DETAILS ================= */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition duration-300 animate-fadeIn">
            <div className="md:col-span-2 border-b border-gray-100 dark:border-zinc-800 pb-2 mb-1">
              <h2 className="text-sm font-bold text-gray-800 dark:text-zinc-100 uppercase tracking-wide">Section A: Details of the Company</h2>
            </div>

            {/* A.1 Name of the Company */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                1. Name of the Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter company legal name"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.companyName ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("companyName")}
              />
              {errors.companyName && <p className="text-red-500 text-[0.78rem]">{errors.companyName.message}</p>}
            </div>

            {/* A.2 Business Structure */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                2. Business Structure <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-3.5 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.businessStructure ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("businessStructure")}
              >
                <option value="">-- Select Structure --</option>
                <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
                <option value="LLP">Limited Liability Partnership (LLP)</option>
                <option value="PUBLIC_LIMITED">Public Limited Company</option>
                <option value="PRIVATE_LIMITED">Private Limited Company</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.businessStructure && <p className="text-red-500 text-[0.78rem]">{errors.businessStructure.message}</p>}
            </div>

            {/* A.2.Other Conditional Input */}
            {businessStructure === "OTHER" && (
              <div className="flex flex-col gap-1.5 animate-slideDown">
                <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                  Specify Other Structure <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter business structure structure"
                  className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                    errors.businessStructureOther ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  {...register("businessStructureOther")}
                />
                {errors.businessStructureOther && (
                  <p className="text-red-500 text-[0.78rem]">{errors.businessStructureOther.message}</p>
                )}
              </div>
            )}

            {/* A.3 Registered Address */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                3. Registered Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Enter complete office registered address"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.registeredAddress ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("registeredAddress")}
              />
              {errors.registeredAddress && <p className="text-red-500 text-[0.78rem]">{errors.registeredAddress.message}</p>}
            </div>

            {/* City & State */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="City"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.city ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("city")}
              />
              {errors.city && <p className="text-red-500 text-[0.78rem]">{errors.city.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">State <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="State"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.state ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("state")}
              />
              {errors.state && <p className="text-red-500 text-[0.78rem]">{errors.state.message}</p>}
            </div>

            {/* Country & PIN */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">Country <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Country"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.country ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("country")}
              />
              {errors.country && <p className="text-red-500 text-[0.78rem]">{errors.country.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">PIN Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit PIN code"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.pinCode ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("pinCode")}
              />
              {errors.pinCode && <p className="text-red-500 text-[0.78rem]">{errors.pinCode.message}</p>}
            </div>

            {/* A.4 GST Number & Doc */}
            <div className="flex flex-col gap-1.5 border border-gray-100 dark:border-zinc-800/80 p-4 rounded-xl bg-gray-50/50 dark:bg-zinc-900/10">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                4. GST Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter 15-character GSTIN"
                maxLength={15}
                className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-4 py-2.5 text-gray-800 dark:text-zinc-100 placeholder-gray-400 uppercase outline-none transition focus:ring-2 ${
                  errors.gstNumber ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("gstNumber", {
                  onChange: (e) => { e.target.value = e.target.value.toUpperCase(); }
                })}
              />
              {errors.gstNumber && <p className="text-red-500 text-[0.78rem]">{errors.gstNumber.message}</p>}

              <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                <span className="text-xs font-semibold text-gray-500">GST Registration PDF</span>
                {gstDocUrl ? (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-2.5 py-1">
                    <span className="text-[0.78rem] font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-[120px]">
                      {uploadedFiles.gstDocUrl || "Uploaded GST"}
                    </span>
                    <button type="button" onClick={() => removeUploadedFile("gstDocUrl")} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold transition">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingField === "gstDocUrl" ? "Uploading..." : "Upload File"}
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleDocUpload(e, "gstDocUrl")} disabled={uploadingField !== null} />
                  </label>
                )}
              </div>
              {errors.gstDocUrl && <p className="text-red-500 text-[0.78rem] mt-1">{errors.gstDocUrl.message}</p>}
            </div>

            {/* A.5 PAN Number & Doc */}
            <div className="flex flex-col gap-1.5 border border-gray-100 dark:border-zinc-800/80 p-4 rounded-xl bg-gray-50/50 dark:bg-zinc-900/10">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                5. PAN Card Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-4 py-2.5 text-gray-800 dark:text-zinc-100 placeholder-gray-400 uppercase outline-none transition focus:ring-2 ${
                  errors.panCard ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("panCard", {
                  onChange: (e) => { e.target.value = e.target.value.toUpperCase(); }
                })}
              />
              {errors.panCard && <p className="text-red-500 text-[0.78rem]">{errors.panCard.message}</p>}

              <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                <span className="text-xs font-semibold text-gray-500">PAN Card PDF</span>
                {panDocUrl ? (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-2.5 py-1">
                    <span className="text-[0.78rem] font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-[120px]">
                      {uploadedFiles.panDocUrl || "Uploaded PAN"}
                    </span>
                    <button type="button" onClick={() => removeUploadedFile("panDocUrl")} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold transition">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingField === "panDocUrl" ? "Uploading..." : "Upload File"}
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleDocUpload(e, "panDocUrl")} disabled={uploadingField !== null} />
                  </label>
                )}
              </div>
              {errors.panDocUrl && <p className="text-red-500 text-[0.78rem] mt-1">{errors.panDocUrl.message}</p>}
            </div>

            {/* A.6 CIN (Optional) */}
            <div className="flex flex-col gap-1.5 border border-gray-100 dark:border-zinc-800/80 p-4 rounded-xl bg-gray-50/50 dark:bg-zinc-900/10 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                    6. CIN / Firm Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter CIN/Firm registration number (Optional)"
                    className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:ring-2 ${
                      errors.cinNumber ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    {...register("cinNumber")}
                  />
                  {errors.cinNumber && <p className="text-red-500 text-[0.78rem]">{errors.cinNumber.message}</p>}
                </div>

                <div className="flex flex-col justify-end border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-3 md:pt-0 md:pl-4">
                  <div className="flex items-center justify-between h-full pt-1.5">
                    <span className="text-xs font-semibold text-gray-500">CIN Registration PDF</span>
                    {cinDocUrl ? (
                      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-2.5 py-1">
                        <span className="text-[0.78rem] font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-[150px]">
                          {uploadedFiles.cinDocUrl || "Uploaded CIN"}
                        </span>
                        <button type="button" onClick={() => removeUploadedFile("cinDocUrl")} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold transition">
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingField === "cinDocUrl" ? "Uploading..." : "Upload File"}
                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleDocUpload(e, "cinDocUrl")} disabled={uploadingField !== null} />
                      </label>
                    )}
                  </div>
                  {errors.cinDocUrl && <p className="text-red-500 text-[0.78rem] mt-1">{errors.cinDocUrl.message}</p>}
                </div>
              </div>
            </div>

            {/* A.7 Date of Registration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                7. Date of Registration <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.dateOfRegistration ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("dateOfRegistration")}
              />
              {errors.dateOfRegistration && <p className="text-red-500 text-[0.78rem]">{errors.dateOfRegistration.message}</p>}
            </div>

            {/* A.8 Contact Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                8. Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2.5 text-center text-gray-800 text-sm outline-none"
                  {...register("contactCountryCode")}
                />
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10-digit number"
                  className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                    errors.contactNumber ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  {...register("contactNumber")}
                />
              </div>
              {errors.contactNumber && <p className="text-red-500 text-[0.78rem]">{errors.contactNumber.message}</p>}
            </div>

            {/* A.9 Email ID of the Company */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                9. Email ID of the Company <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. contact@company.com"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.companyEmail ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("companyEmail")}
              />
              {errors.companyEmail && <p className="text-red-500 text-[0.78rem]">{errors.companyEmail.message}</p>}
            </div>
          </div>
        )}

        {/* ================= STEP 2: AUTHORISED REPRESENTATIVE ================= */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition duration-300 animate-fadeIn">
            <div className="md:col-span-2 border-b border-gray-100 dark:border-zinc-800 pb-2 mb-1">
              <h2 className="text-sm font-bold text-gray-800 dark:text-zinc-100 uppercase tracking-wide">Section B: Details of the Authorised Representative</h2>
            </div>

            {/* B.1 Name of Representative */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                1. Name of Representative <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Representative full name"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.repName ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("repName")}
              />
              {errors.repName && <p className="text-red-500 text-[0.78rem]">{errors.repName.message}</p>}
            </div>

            {/* B.2 Designation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                2. Designation in Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Managing Director / Partner"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.repDesignation ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("repDesignation")}
              />
              {errors.repDesignation && <p className="text-red-500 text-[0.78rem]">{errors.repDesignation.message}</p>}
            </div>

            {/* B.3 Authorisation Document Upload */}
            <div className="flex flex-col gap-1.5 border border-gray-100 dark:border-zinc-800/80 p-4 rounded-xl bg-gray-50/50 dark:bg-zinc-900/10">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                3. Authorisation Document (Power of Attorney, etc) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-between h-full pt-1">
                <span className="text-xs font-semibold text-gray-500">Authorisation Doc PDF</span>
                {repAuthDocUrl ? (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-2.5 py-1">
                    <span className="text-[0.78rem] font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-[150px]">
                      {uploadedFiles.repAuthDocUrl || "Uploaded Doc"}
                    </span>
                    <button type="button" onClick={() => removeUploadedFile("repAuthDocUrl")} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold transition">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingField === "repAuthDocUrl" ? "Uploading..." : "Upload File"}
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleDocUpload(e, "repAuthDocUrl")} disabled={uploadingField !== null} />
                  </label>
                )}
              </div>
              {errors.repAuthDocUrl && <p className="text-red-500 text-[0.78rem] mt-1">{errors.repAuthDocUrl.message}</p>}
            </div>

            {/* B.4 Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                4. Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2.5 text-center text-gray-800 text-sm outline-none"
                  {...register("repCountryCode")}
                />
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10-digit number"
                  className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                    errors.repMobile ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  {...register("repMobile")}
                />
              </div>
              {errors.repMobile && <p className="text-red-500 text-[0.78rem]">{errors.repMobile.message}</p>}
            </div>

            {/* B.5 Email ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                5. Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. rep@company.com"
                className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                  errors.repEmail ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                {...register("repEmail")}
              />
              {errors.repEmail && <p className="text-red-500 text-[0.78rem]">{errors.repEmail.message}</p>}
            </div>
          </div>
        )}

        {/* ================= STEP 3: CREDENTIALS & DECLARATION ================= */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition duration-300 animate-fadeIn">
            <div className="md:col-span-2 border-b border-gray-100 dark:border-zinc-800 pb-2 mb-1">
              <h2 className="text-sm font-bold text-gray-800 dark:text-zinc-100 uppercase tracking-wide">Section C: Credentials and Declaration</h2>
            </div>

            {/* C.1 User ID (Disabled, filled from PAN) */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                1. User ID (Auto-filled from PAN)
              </label>
              <input
                type="text"
                disabled
                value={panCardVal || "Enter PAN in Step 1 to auto-fill"}
                className="w-full rounded-lg border border-gray-200 bg-gray-100 dark:bg-zinc-800/60 px-4 py-2.5 text-gray-500 dark:text-zinc-400 outline-none tracking-widest font-semibold font-mono"
              />
              <p className="text-xs text-gray-400">Your unique PAN number serves as your username/User ID.</p>
            </div>

            {/* C.2 Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                2. Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 pr-11 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                    errors.password ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              
              {/* Strength Hint */}
              {passwordVal?.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          passwordVal.length >= i * 3
                            ? passwordVal.length >= 12
                              ? "#10b981"
                              : passwordVal.length >= 8
                              ? "#f59e0b"
                              : "#ef4444"
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-500 text-[0.78rem]">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full rounded-lg border bg-gray-50 dark:bg-zinc-800/40 px-4 py-2.5 pr-11 text-gray-800 dark:text-zinc-100 outline-none transition focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 ${
                    errors.confirmPassword ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[0.78rem]">{errors.confirmPassword.message}</p>}
            </div>

            {/* Declaration Box */}
            <div className="md:col-span-2 border border-blue-100 dark:border-blue-900/30 rounded-xl bg-blue-50/20 dark:bg-blue-950/10 p-5 mt-3">
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  id="declaration-cb"
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                  {...register("declaration")}
                />
                <label htmlFor="declaration-cb" className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed cursor-pointer font-medium">
                  By submitting this Registration Form, we hereby confirm that all the statements, information, and answers given above are true and no information has been suppressed. In case any information provided by us is found incorrect or misleading, DMRC will be at liberty to take suitable penal action as considered appropriate.
                </label>
              </div>
              {errors.declaration && <p className="text-red-500 text-[0.78rem] mt-2 ml-8">{errors.declaration.message}</p>}
            </div>
          </div>
        )}

        {/* ================= BUTTON ACTION FOOTER ================= */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-6 mt-4">
          <button
            type="button"
            onClick={() => setShowCancelDialog(true)}
            className="rounded-lg px-5 py-2.5 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-zinc-300 text-sm font-semibold transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBackStep}
                className="flex items-center gap-1 rounded-lg px-4 py-2.5 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-zinc-300 text-sm font-semibold transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1 rounded-lg px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold shadow-sm transition"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 text-sm font-bold shadow-md shadow-blue-100 transition"
              >
                Submit Form
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-gray-400 text-xs">OR</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <p className="mt-5 text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 transition font-semibold">
          Sign in here
        </Link>
      </p>

      {/* Confirmation dialogues */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              Cancel Registration?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to discard your registration progress? All filled information will be lost and you will be redirected to the sign-in page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setShowCancelDialog(false)}
              className="rounded-lg px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition"
            >
              No, Keep Filling
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCancelDialog(false);
                router.push("/login");
              }}
              className="rounded-lg px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
            >
              Yes, Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              Confirm Submission
            </DialogTitle>
            <DialogDescription>
              Please confirm that all company, representative, and credential details filled are correct. Once submitted, your registration request will be verified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowSubmitDialog(false)}
              className="rounded-lg px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition"
            >
              Review Again
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit((data) => onSubmit(data))}
              className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm & Submit"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
