import { z } from "zod";

// Base fields shared across all categories
export const baseFieldsSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(200),
  role: z.enum(["MANUFACTURER", "AUTHORISED_RESELLER", "FABRICATOR"], {
    message: "Please select your role",
  }),
  manufacturingPeriod: z
    .string()
    .min(1, "Manufacturing period is required"),
  madeInIndia: z.boolean(),
  countryName: z.string().optional(),
  productionCapacity: z
    .string()
    .min(1, "Production capacity is required"),
  productionCapacityUnit: z
    .string()
    .min(1, "Unit is required"),
  lifespan: z.string().min(1, "Lifespan is required"),
});

// Civil-specific fields
export const civilFieldsSchema = z.object({
  // Qualifying Criteria
  isCodeConformance: z.string().optional(),
  internationalCodeConformance: z.string().optional(),
  nablAccredited: z.boolean().optional(),
  nablLabName: z.string().optional(),
  internationalLabTested: z.boolean().optional(),
  internationalLabName: z.string().optional(),
  isoCertified: z.boolean().optional(),
  isoDetails: z.string().optional(),

  // Experience - Purchase/Work Orders
  purchaseOrders: z.array(z.object({
    clientType: z.string().min(1, "Client type is required"),
    clientName: z.string().min(1, "Client name is required"),
    totalValue: z.string().min(1, "Total value is required"),
    currency: z.string().min(1, "Currency is required"),
    totalQuantity: z.string().optional(),
    unit: z.string().optional(),
    issuanceDate: z.string().min(1, "Issuance date is required"),
  })).min(1, "At least one purchase/work order is required").max(5),

  // Completion Certificates
  completionCertificates: z.array(z.object({
    clientType: z.string().min(1, "Client type is required"),
    clientName: z.string().min(1, "Client name is required"),
    certificateDate: z.string().min(1, "Certificate date is required"),
  })).min(1, "At least one completion certificate is required").max(5),

  // Quality Plan
  qualityPlanDetails: z.string().optional(),
  bisAccreditation: z.array(z.object({
    certificationName: z.string(),
    validTill: z.string(),
  })).optional(),

  // Financial Data
  financialYears: z.array(z.object({
    financialYear: z.string().min(1, "Financial year is required"),
  })).min(1).max(3),

  // Undertakings
  undertaking_a: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_b_servicePeriod: z.string().min(1, "Service period is required"),
  undertaking_c: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_d: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_e: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_f: z.boolean().refine(val => val === true, "You must accept this undertaking"),
});

// Electrical-specific fields (similar structure to Civil)
export const electricalFieldsSchema = z.object({
  isCodeConformance: z.string().optional(),
  internationalCodeConformance: z.string().optional(),
  nablAccredited: z.boolean().optional(),
  nablLabName: z.string().optional(),
  internationalLabTested: z.boolean().optional(),
  internationalLabName: z.string().optional(),
  isoCertified: z.boolean().optional(),
  isoDetails: z.string().optional(),

  purchaseOrders: z.array(z.object({
    clientType: z.string().min(1, "Client type is required"),
    clientName: z.string().min(1, "Client name is required"),
    totalValue: z.string().min(1, "Total value is required"),
    currency: z.string().min(1, "Currency is required"),
    totalQuantity: z.string().optional(),
    unit: z.string().optional(),
    issuanceDate: z.string().min(1, "Issuance date is required"),
  })).min(1).max(5),

  completionCertificates: z.array(z.object({
    clientType: z.string().min(1, "Client type is required"),
    clientName: z.string().min(1, "Client name is required"),
    certificateDate: z.string().min(1, "Certificate date is required"),
  })).min(1).max(5),

  qualityPlanDetails: z.string().optional(),

  financialYears: z.array(z.object({
    financialYear: z.string().min(1, "Financial year is required"),
  })).min(1).max(3),

  undertaking_a: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_b_servicePeriod: z.string().min(1, "Service period is required"),
  undertaking_c: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_d: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_e: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_f: z.boolean().refine(val => val === true, "You must accept this undertaking"),
});

// Architecture-specific fields
export const architectureFieldsSchema = z.object({
  // Material/Item details
  materialItem: z.string().min(1, "Material/Item is required"),

  // Qualifying Criteria
  isCodes: z.array(z.object({
    code: z.string().min(1, "IS code is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).optional().default([]),

  internationalCodes: z.array(z.object({
    code: z.string().min(1, "International code is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).optional().default([]),

  nablAccredited: z.boolean().optional().default(false),
  nablEntries: z.array(z.object({
    labName: z.string().min(1, "NABL lab name is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).optional().default([]),

  internationalLabTested: z.boolean().optional().default(false),
  internationalLabEntries: z.array(z.object({
    labName: z.string().min(1, "International lab name is required"),
    testName: z.string().min(1, "Test name is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).optional().default([]),

  isoCertified: z.boolean().optional().default(false),
  isoEntries: z.array(z.object({
    isoDetails: z.string().min(1, "ISO details are required"),
    validTill: z.string().min(1, "Valid till date is required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  // Additional Information
  greenCertified: z.boolean().optional().default(false),
  greenEntries: z.array(z.object({
    orgName: z.string().min(1, "Organisation name is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  govRegistered: z.boolean().optional().default(false),
  govEntries: z.array(z.object({
    orgName: z.string().min(1, "Organisation name is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  // Projects
  projects: z.array(z.object({
    organisationName: z.string().min(1, "Organisation name is required"),
    amount: z.string().min(1, "Amount is required"),
    currency: z.string().min(1, "Currency is required"),
    completionDate: z.string().min(1, "Completion date is required"),
    workOrderUrl: z.string().min(1, "Work order PDF is required"),
    completionCertUrl: z.string().min(1, "Completion certificate PDF is required"),
  })).max(5).optional().default([]),

  // DMRC Projects
  suppliedToDmrc: z.boolean().optional().default(false),
  dmrcProjects: z.array(z.object({
    contractNumber: z.string().min(1, "Contract number is required"),
    contractorName: z.string().min(1, "Contractor name is required"),
    amount: z.string().min(1, "Amount is required"),
    currency: z.string().min(1, "Currency is required"),
    completionDate: z.string().min(1, "Completion date is required"),
    workOrderUrl: z.string().min(1, "Work order PDF is required"),
    completionCertUrl: z.string().min(1, "Completion certificate PDF is required"),
  })).max(5).optional().default([]),

  // Application & Material Properties
  applicationArea: z.object({
    interior: z.boolean().default(false),
    exterior: z.boolean().default(false),
  }).refine(val => val.interior || val.exterior, {
    message: "Please select at least one application area",
    path: ["interior"],
  }),
  usesCD_waste: z.boolean().optional().default(false),
  sriApplicable: z.boolean().optional().default(false),
  sriValue: z.string().optional(),
  sriValidTill: z.string().optional(),
  sriTestReportUrl: z.string().optional(),
}).refine((data) => {
  if (data.sriApplicable) {
    return !!data.sriValue && !!data.sriValidTill && !!data.sriTestReportUrl;
  }
  return true;
}, {
  message: "SRI value, valid till, and test report PDF are required when SRI is applicable",
  path: ["sriValue"],
}).refine((data) => {
  if (data.nablAccredited && (!data.nablEntries || data.nablEntries.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one NABL laboratory entry is required",
  path: ["nablEntries"],
}).refine((data) => {
  if (data.internationalLabTested && (!data.internationalLabEntries || data.internationalLabEntries.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one international laboratory entry is required",
  path: ["internationalLabEntries"],
}).refine((data) => {
  if (data.isoCertified && (!data.isoEntries || data.isoEntries.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one ISO certification entry is required",
  path: ["isoEntries"],
}).refine((data) => {
  if (data.greenCertified && (!data.greenEntries || data.greenEntries.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one Green certification entry is required",
  path: ["greenEntries"],
}).refine((data) => {
  if (data.govRegistered && (!data.govEntries || data.govEntries.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one Government/PSU registration entry is required",
  path: ["govEntries"],
}).refine((data) => {
  if (data.suppliedToDmrc && (!data.dmrcProjects || data.dmrcProjects.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one DMRC project details entry is required",
  path: ["dmrcProjects"],
});

// Combined application schema
export const applicationSchema = z.object({
  category: z.enum(["CIVIL", "ELECTRICAL", "ARCHITECTURE"]),
  baseFields: baseFieldsSchema,
  categoryFields: z.union([
    civilFieldsSchema,
    electricalFieldsSchema,
    architectureFieldsSchema,
  ]),
});

export const applicationSubmitSchema = z.object({
  category: z.enum(["CIVIL", "ELECTRICAL", "ARCHITECTURE"]),
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  formData: z.record(z.string(), z.unknown()),
});

const categoryFormDataSchema = {
  CIVIL: baseFieldsSchema.merge(civilFieldsSchema),
  ELECTRICAL: baseFieldsSchema.merge(electricalFieldsSchema),
  ARCHITECTURE: baseFieldsSchema.merge(architectureFieldsSchema),
} as const;

export function validateApplicationFormData(
  category: keyof typeof categoryFormDataSchema,
  formData: Record<string, unknown>
) {
  return categoryFormDataSchema[category].safeParse(formData);
}

export type BaseFormValues = z.infer<typeof baseFieldsSchema>;
export type CivilFormValues = z.infer<typeof civilFieldsSchema>;
export type ElectricalFormValues = z.infer<typeof electricalFieldsSchema>;
export type ArchitectureFormValues = z.infer<typeof architectureFieldsSchema>;
export type ApplicationFormValues = z.infer<typeof applicationSchema>;
export type ApplicationSubmitValues = z.infer<typeof applicationSubmitSchema>;
