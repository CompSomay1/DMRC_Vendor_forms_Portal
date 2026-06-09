// Shared application types used by both frontend and backend

export enum Category {
  CIVIL = "CIVIL",
  ELECTRICAL = "ELECTRICAL",
  ARCHITECTURE = "ARCHITECTURE",
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface VendorApplication {
  id: string;
  userId: string;
  category: Category;
  status: Status;
  companyName: string;
  formData: Record<string, unknown>;
  submittedAt: string;
}

export interface ApplicationSubmitInput {
  category: Category;
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
