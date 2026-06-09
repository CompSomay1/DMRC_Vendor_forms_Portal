// Shared application types used by both frontend and backend
// These enums MUST match the Prisma schema enums in prisma/schema.prisma

export enum VendorCategory {
  CIVIL = "CIVIL",
  ELECTRICAL = "ELECTRICAL",
  ARCHITECTURE = "ARCHITECTURE",
}

// Keep "Category" as an alias for backward compatibility with frontend components
export const Category = VendorCategory;
export type Category = VendorCategory;

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Keep "Status" as an alias for backward compatibility with frontend components
export const Status = ApplicationStatus;
export type Status = ApplicationStatus;

export interface VendorApplication {
  id: string;
  userId: string;
  category: VendorCategory;
  status: ApplicationStatus;
  companyName: string | null;
  formData: Record<string, unknown> | null;
  remarks: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationSubmitInput {
  category: VendorCategory;
  companyName: string;
  formData: Record<string, unknown>;
}

export interface ApplicationResponse {
  application: VendorApplication;
}

export interface ApplicationError {
  error: string;
}

// Base fields shared across all categories (Step 1 — Company Info)
export interface BaseFormFields {
  companyName: string;
  role: "MANUFACTURER" | "AUTHORISED_RESELLER" | "FABRICATOR";
  manufacturingPeriod: string;
  madeInIndia: boolean;
  countryName?: string;
  productionCapacity: string;
  productionCapacityUnit: string;
  lifespan: string;
}

// Step information for multi-step form
export interface StepInfo {
  step: number;
  title: string;
  description: string;
}

export const FORM_STEPS: StepInfo[] = [
  {
    step: 1,
    title: "Company Information",
    description: "Basic company and product details",
  },
  {
    step: 2,
    title: "Category Fields",
    description: "Category-specific qualification details",
  },
  {
    step: 3,
    title: "Review & Submit",
    description: "Review your application and submit",
  },
];
