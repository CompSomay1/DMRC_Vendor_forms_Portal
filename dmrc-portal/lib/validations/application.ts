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

// Civil-specific fields — matches CIVIL APPLICATION FORM.docx sections A–H
// Raw object schema (used for merge with baseFields)
const _civilFieldsObject = z.object({
  // ── Section A: General Information ──
  materialItem: z.string().min(1, "Material / Item is required"),
  materialItemName: z.string().min(1, "Name of material / item is required"),
  otherDetails: z.string().optional().default(""),

  // A.5 – Manufacturing Units (repeatable)
  manufacturingUnits: z.array(z.object({
    address: z.string().min(1, "Address is required"),
    certifications: z.array(z.object({
      certName: z.string().min(1, "Certification name is required"),
      validTill: z.string().min(1, "Valid till date is required"),
      certificateUrl: z.string().min(1, "Certificate PDF is required"),
    })).optional().default([]),
    licensedCapacity: z.string().min(1, "Licensed production capacity is required"),
    licensedCapacityUnit: z.string().min(1, "Unit is required"),
    licensedCapacityDocUrl: z.string().optional().default(""),
    actualProduction: z.string().min(1, "Actual production is required"),
    actualProductionUnit: z.string().min(1, "Unit is required"),
    actualProductionDocUrl: z.string().optional().default(""),
  })).min(1, "At least one manufacturing unit is required"),

  // ── Section B: Company Profile ──
  // B.1 – Directors / Share Holding (repeatable)
  directorsShareholding: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    documentUrl: z.string().optional().default(""),
  })).optional().default([]),

  // B.2 – Manufactured in India
  manufacturedInIndia: z.boolean().default(true),
  countryOfOrigin: z.string().optional().default(""),
  authorisationDocUrl: z.string().optional().default(""),

  // B.3 – Technical Catalogue
  technicalCatalogueUrl: z.string().optional().default(""),

  // B.4 – Manufacturing ongoing period
  manufacturingOngoingPeriod: z.string().min(1, "Manufacturing period is required"),

  // B.5 – Organisation Details
  orgChartUrl: z.string().optional().default(""),
  manpowerLevelsUrl: z.string().optional().default(""),
  keyManpowerUrl: z.string().optional().default(""),

  // ── Section C: Approvals ──
  approvals: z.array(z.object({
    agencyType: z.string().min(1, "Agency type is required"),
    agencyName: z.string().min(1, "Agency name is required"),
    certificateDate: z.string().min(1, "Certificate date is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).min(3, "Minimum 3 approvals are required"),

  // ── Section D: Experience ──
  // D.1 – Purchase / Work Orders (exactly 5)
  purchaseOrders: z.array(z.object({
    clientType: z.string().min(1, "Client type is required"),
    clientName: z.string().min(1, "Client name is required"),
    scopeOfWork: z.string().optional().default(""),
    materialType: z.string().optional().default(""),
    issuanceDate: z.string().min(1, "Issuance date is required"),
    workOrderUrl: z.string().min(1, "Work order PDF is required"),
    totalQuantity: z.string().min(1, "Total quantity is required"),
    unit: z.string().min(1, "Unit is required"),
    totalValue: z.string().min(1, "Total value is required"),
    currency: z.string().min(1, "Currency is required"),
  })).length(5, "Exactly 5 purchase / work orders are required"),

  // D.2 – Completion Certificates (exactly 5)
  completionCertificates: z.array(z.object({
    clientType: z.string().min(1, "Client type is required"),
    clientName: z.string().min(1, "Client name is required"),
    certificateDate: z.string().min(1, "Certificate date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).length(5, "Exactly 5 completion certificates are required"),

  // D.3 – Works Executed (exactly 5)
  worksExecuted: z.array(z.object({
    clientType: z.string().min(1, "Client type is required"),
    clientName: z.string().min(1, "Client name is required"),
    issuanceDate: z.string().min(1, "Issuance date is required"),
    workOrderUrl: z.string().min(1, "Work order PDF is required"),
  })).length(5, "Exactly 5 works executed entries are required"),

  // ── Section E: Quality Plan & Certification ──
  qualityPlanDetails: z.string().optional().default(""),
  qualityPlanUrl: z.string().optional().default(""),

  // E.2 – BIS / IGBC / ISO 17025 Certifications (repeatable)
  qualityCertifications: z.array(z.object({
    certName: z.string().min(1, "Certification name is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).optional().default([]),

  // E.3 – Applicable Codes (repeatable)
  applicableCodes: z.array(z.object({
    codeName: z.string().min(1, "Code name is required"),
    documentUrl: z.string().optional().default(""),
  })).optional().default([]),

  // E.4a – In-house testing
  inHouseTestingAccredited: z.boolean().default(false),
  inHouseTestingDetails: z.string().optional().default(""),
  inHouseTestingDocUrl: z.string().optional().default(""),

  // E.4b – External testing
  externalTestingConducted: z.boolean().default(false),
  externalTestingDetails: z.string().optional().default(""),
  externalTestingDocUrl: z.string().optional().default(""),

  // ── Section F: Financial Data ──
  financialData: z.array(z.object({
    financialYear: z.string().min(1, "Financial year is required"),
    balanceSheetUrl: z.string().min(1, "Balance sheet PDF is required"),
    profitLossUrl: z.string().min(1, "Profit & loss statement PDF is required"),
  })).length(3, "Financial data for 3 years is required"),

  // ── Section G: OCS Compliance ──
  ocsComplianceReports: z.array(z.object({
    laboratoryName: z.string().min(1, "Laboratory name is required"),
    standardName: z.string().min(1, "Standard name is required"),
    issuanceDate: z.string().min(1, "Issuance date is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    testReportUrl: z.string().min(1, "Test report PDF is required"),
  })).optional().default([]),

  // ── Section H: Undertakings ──
  undertaking_a: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_b_servicePeriod: z.string().min(1, "Service period is required"),
  undertaking_c: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_d: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_d_annexureAUrl: z.string().optional().default(""),
  undertaking_d_annexureBUrl: z.string().optional().default(""),
  undertaking_d_annexureCUrl: z.string().optional().default(""),
  undertaking_d_annexureDUrl: z.string().optional().default(""),
  undertaking_d_annexureEUrl: z.string().optional().default(""),
  undertaking_e: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_f: z.boolean().refine(val => val === true, "You must accept this undertaking"),
});

// Refined version with cross-field validations (used for submit-time validation)
export const civilFieldsSchema = _civilFieldsObject.refine((data) => {
  if (!data.manufacturedInIndia && (!data.countryOfOrigin || data.countryOfOrigin.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Country of origin is required when not manufactured in India",
  path: ["countryOfOrigin"],
}).refine((data) => {
  if (data.inHouseTestingAccredited && !data.inHouseTestingDetails) {
    return false;
  }
  return true;
}, {
  message: "In-house testing details are required when accredited",
  path: ["inHouseTestingDetails"],
}).refine((data) => {
  if (data.externalTestingConducted && !data.externalTestingDetails) {
    return false;
  }
  return true;
}, {
  message: "External testing details are required when conducted",
  path: ["externalTestingDetails"],
}).refine((data) => {
  if (data.undertaking_d) {
    return !!(data.undertaking_d_annexureAUrl && data.undertaking_d_annexureBUrl &&
      data.undertaking_d_annexureCUrl && data.undertaking_d_annexureDUrl &&
      data.undertaking_d_annexureEUrl);
  }
  return true;
}, {
  message: "All Annexures (A-E) must be uploaded when undertaking (d) is accepted",
  path: ["undertaking_d_annexureAUrl"],
});


// Electrical-specific fields — matches ELECTRICAL APPLICATION FORM.pdf sections A–H
const _electricalFieldsObject = z.object({
  // ── Section A: General Information ──
  applyingAs: z.enum(["MANUFACTURER", "AUTHORISED_RESELLER"], {
    message: "Please select applying category",
  }),
  materialItem: z.string().min(1, "Material / Item is required"),
  nameOfMake: z.string().min(1, "Name of make is required"),
  capacity: z.string().min(1, "Capacity is required"),
  capacityUnit: z.string().min(1, "Capacity unit is required"),
  rating: z.string().min(1, "Rating is required"),
  ratingUnit: z.string().min(1, "Rating unit is required"),
  otherDetails: z.string().optional().default(""),

  // A.7 – Details of Manufacturing Unit / Factory (repeatable, min 1)
  manufacturingUnits: z.array(z.object({
    address: z.string().min(1, "Address is required"),
    totalLandArea: z.string().min(1, "Total land area is required"),
    totalLandAreaUnit: z.string().min(1, "Unit is required"),
    landOwnershipDocUrl: z.string().min(1, "Land ownership document PDF is required"),
    coveredArea: z.string().min(1, "Covered area is required"),
    coveredAreaUnit: z.string().min(1, "Unit is required"),
    licensedCapacity: z.string().min(1, "Licensed capacity is required"),
    licensedCapacityUnit: z.string().min(1, "Unit is required"),
    licensedCapacityDocUrl: z.string().min(1, "Licensed capacity document PDF is required"),
    machineryWriteUp: z.string().min(1, "Machinery write-up is required"),
    machineryDocUrl: z.string().min(1, "Supporting machinery document PDF is required"),
    actualProduction: z.string().min(1, "Actual production is required"),
    actualProductionUnit: z.string().min(1, "Unit is required"),
    actualProductionDocUrl: z.string().min(1, "Actual production document PDF is required"),
  })).min(1, "At least one manufacturing unit is required"),

  // ── Section B: Company Profile and Experience ──
  parentCompanyDetails: z.array(z.object({
    parentCompanyName: z.string().min(1, "Parent company name is required"),
    countryOfOrigin: z.string().min(1, "Country of origin is required"),
    manufacturingPeriod: z.string().min(1, "Manufacturing period is required"),
    shareholdingDetails: z.string().min(1, "Shareholding details are required"),
    shareholdingDocUrl: z.string().min(1, "Shareholding document PDF is required"),
    directorsDetails: z.string().min(1, "Board of directors details are required"),
    directorsDocUrl: z.string().min(1, "Directors document PDF is required"),
  })).optional().default([]),

  directorsShareholding: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    documentUrl: z.string().optional().default(""),
  })).optional().default([]),

  manufacturedInIndia: z.boolean().default(true),
  countryOfOrigin: z.string().optional().default(""),
  authorisationDocUrl: z.string().optional().default(""),

  manufacturingOngoingPeriod: z.string().min(1, "Manufacturing ongoing period is required"),

  orgChartUrl: z.string().min(1, "Organisation chart PDF is required"),
  manpowerLevelsUrl: z.string().min(1, "Manpower details PDF is required"),
  keyManpowerUrl: z.string().min(1, "Key manpower details PDF is required"),
  additionalOrgDocUrl: z.string().optional().default(""),

  hasInHouseDesign: z.boolean().default(false),
  inHouseDesignDetails: z.string().optional().default(""),
  inHouseDesignDocUrl: z.string().optional().default(""),

  hasInHouseTesting: z.boolean().default(false),
  inHouseTestingDetails: z.string().optional().default(""),
  inHouseTestingDocUrl: z.string().optional().default(""),

  hasInHouseRnd: z.boolean().default(false),
  inHouseRndDetails: z.string().optional().default(""),
  inHouseRndDocUrl: z.string().optional().default(""),

  // ── Section C: Details of Experience ──
  purchaseOrders: z.array(z.object({
    clientName: z.string().min(1, "Client name is required"),
    contractorName: z.string().min(1, "Contractor name is required"),
    contractNumber: z.string().min(1, "Contract number is required"),
    scopeOfWork: z.string().min(1, "Scope of work is required"),
    typeModel: z.string().min(1, "Type / Model is required"),
    totalQuantity: z.string().min(1, "Total quantity is required"),
    unit: z.string().min(1, "Unit is required"),
    totalValue: z.string().min(1, "Total value is required"),
    currency: z.string().min(1, "Currency is required"),
    purchaseOrderUrl: z.string().min(1, "Purchase order PDF is required"),
    purchaseOrderDate: z.string().min(1, "PO date is required"),
    performanceCertificateUrl: z.string().min(1, "Performance certificate PDF is required"),
    performanceCertificateDate: z.string().min(1, "Certificate date is required"),
    performanceCertificateValidTill: z.string().min(1, "Valid till date is required"),
  })).length(5, "Exactly 5 purchase orders and performance certificates are required"),

  suppliedToDmrc: z.boolean().default(false),
  dmrcProjects: z.array(z.object({
    clientName: z.string().min(1, "Client name is required"),
    contractorName: z.string().min(1, "Contractor name is required"),
    amount: z.string().min(1, "Amount is required"),
    currency: z.string().min(1, "Currency is required"),
    dateOfIssuance: z.string().min(1, "Date of issuance is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    workOrderUrl: z.string().min(1, "Work order PDF is required"),
    completionCertUrl: z.string().min(1, "Completion certificate PDF is required"),
  })).max(5).optional().default([]),

  suppliedOtherProjects: z.boolean().default(false),
  otherProjects: z.array(z.object({
    projectType: z.enum(["Metro", "Railway", "Airport", "Central / State Govt.", "Private Ltd. Organisation"], {
      message: "Please select a project type",
    }),
    clientName: z.string().min(1, "Client name is required"),
    contractorName: z.string().min(1, "Contractor name is required"),
    amount: z.string().min(1, "Amount is required"),
    currency: z.string().min(1, "Currency is required"),
    dateOfIssuance: z.string().min(1, "Date of issuance is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    workOrderUrl: z.string().min(1, "Work order PDF is required"),
    completionCertUrl: z.string().min(1, "Completion certificate PDF is required"),
  })).max(10).optional().default([]),

  hasBlacklisting: z.boolean().default(false),
  blacklistingDetails: z.array(z.object({
    blacklistedBy: z.string().min(1, "Agency name is required"),
    reason: z.string().min(1, "Reason is required"),
    date: z.string().min(1, "Date is required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  hasLitigation: z.boolean().default(false),
  litigationDetails: z.array(z.object({
    agencyName: z.string().min(1, "Agency name is required"),
    reason: z.string().min(1, "Reason is required"),
    date: z.string().min(1, "Date is required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  // ── Section D: Quality Plan and Certification ──
  qualityPlanDetails: z.string().min(1, "Quality plan details are required"),
  qualityPlanUrl: z.string().min(1, "Quality plan document PDF is required"),

  qualityCertifications: z.array(z.object({
    certName: z.string().min(1, "Certification name is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    certificateUrl: z.string().min(1, "Certificate PDF is required"),
  })).optional().default([]),

  energySavingMeasures: z.string().min(1, "Energy saving measures details are required"),
  energySavingDocUrl: z.string().min(1, "Supporting document PDF is required"),

  wasteRecyclingMeasures: z.string().min(1, "Waste recycling measures details are required"),
  wasteRecyclingDocUrl: z.string().min(1, "Supporting document PDF is required"),

  applicableCodes: z.array(z.object({
    codeName: z.string().min(1, "Code name is required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  technicalLiteratureDetails: z.string().min(1, "Technical literature details are required"),
  technicalLiteratureDocUrl: z.string().min(1, "Technical literature comparing properties PDF is required"),

  inHouseTestingAsPerStd: z.boolean().default(false),
  inHouseTestingAsPerStdDetails: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    docUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  inHouseTestingAsPerProductStd: z.boolean().default(false),
  inHouseTestingAsPerProductStdDetails: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    docUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  inHouseTestingAccredited: z.boolean().default(false),
  inHouseTestingAccreditedDetails: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    docUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  inHouseAllTestsConducted: z.boolean().default(false),
  inHouseAllTestsConductedDetails: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    docUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  externalTestingConducted: z.boolean().default(false),
  externalTestingDetails: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    docUrl: z.string().min(1, "Document PDF is required"),
  })).optional().default([]),

  // ── Section E: Financial Data ──
  netWorth: z.string().min(1, "Net worth is required"),
  netWorthCurrency: z.string().min(1, "Currency is required"),
  netWorthDocUrl: z.string().min(1, "Net worth document PDF is required"),

  financialData: z.array(z.object({
    financialYear: z.string().min(1, "Financial year is required"),
    turnover: z.string().min(1, "Turnover is required"),
    turnoverCurrency: z.string().min(1, "Currency is required"),
    revenue: z.string().min(1, "Revenue is required"),
    revenueCurrency: z.string().min(1, "Currency is required"),
    profitLoss: z.string().min(1, "Profit / Loss is required"),
    profitLossCurrency: z.string().min(1, "Currency is required"),
    profitability: z.string().min(1, "Profitability is required"),
    annualReportUrl: z.string().min(1, "Annual report PDF is required"),
    balanceSheetUrl: z.string().min(1, "Balance sheet PDF is required"),
    itrUrl: z.string().min(1, "ITR PDF is required"),
  })).length(3, "Financial data for exactly 3 years is required"),

  liquidity: z.string().min(1, "Liquidity is required"),
  liquidityDocUrl: z.string().min(1, "Liquidity document PDF is required"),

  solvencyDetails: z.string().min(1, "Solvency certificate details are required"),
  solvencyBankName: z.string().min(1, "Bank name is required"),
  solvencyDate: z.string().min(1, "Solvency issuance date is required"),
  solvencyDocUrl: z.string().min(1, "Solvency certificate PDF is required"),

  // ── Section F: Type Test Certificates ──
  typeTestCertificateProvided: z.boolean().default(false),
  typeTestCertificates: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    validTill: z.string().min(1, "Valid till date is required"),
    documentUrl: z.string().min(1, "Certificate / Report PDF is required"),
  })).optional().default([]),

  typeTestFromAccreditedLab: z.boolean().default(false),
  typeTestAccreditedLabs: z.array(z.object({
    laboratoryName: z.string().min(1, "Laboratory name is required"),
    validTill: z.string().min(1, "Valid till date is required"),
    accreditationCertUrl: z.string().min(1, "Accreditation certificate PDF is required"),
  })).optional().default([]),

  typeTestProposedModel: z.boolean().default(false),
  typeTestRelevantStandard: z.boolean().default(false),
  typeTestLessThan5Years: z.boolean().default(false),

  // ── Section G: After Sales Service ──
  afterSalesDelhiNcr: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).min(1, "At least one support system entry for Delhi and NCR is required"),

  afterSalesOutsideDelhiNcr: z.array(z.object({
    details: z.string().min(1, "Details are required"),
    documentUrl: z.string().min(1, "Document PDF is required"),
  })).min(1, "At least one support system entry outside Delhi and NCR is required"),

  // ── Section H: Undertakings ──
  undertaking_a: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_b_servicePeriod: z.string().min(1, "Service period is required"),
  undertaking_c: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_d: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_d_annexure2AUrl: z.string().optional().default(""),
  undertaking_d_annexure2BUrl: z.string().optional().default(""),
  undertaking_e: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_f: z.boolean().refine(val => val === true, "You must accept this undertaking"),
  undertaking_g: z.enum(["Yes", "No", "Not Applicable"], {
    message: "EMI / EMC compliance is required",
  }),
  undertaking_g_emiEmcStudyUrl: z.string().optional().default(""),
  undertaking_h: z.boolean().refine(val => val === true, "You must accept this undertaking"),
});

export const electricalFieldsSchema = _electricalFieldsObject.refine((data) => {
  if (!data.manufacturedInIndia && (!data.countryOfOrigin || data.countryOfOrigin.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Country of origin is required when not manufactured in India",
  path: ["countryOfOrigin"],
}).refine((data) => {
  if (!data.manufacturedInIndia && !data.authorisationDocUrl) {
    return false;
  }
  return true;
}, {
  message: "Authorisation document is required when not manufactured in India",
  path: ["authorisationDocUrl"],
}).refine((data) => {
  if (data.hasInHouseDesign && (!data.inHouseDesignDetails || !data.inHouseDesignDocUrl)) {
    return false;
  }
  return true;
}, {
  message: "In-house design details and document are required when enabled",
  path: ["inHouseDesignDetails"],
}).refine((data) => {
  if (data.hasInHouseTesting && (!data.inHouseTestingDetails || !data.inHouseTestingDocUrl)) {
    return false;
  }
  return true;
}, {
  message: "In-house testing details and document are required when enabled",
  path: ["inHouseTestingDetails"],
}).refine((data) => {
  if (data.hasInHouseRnd && (!data.inHouseRndDetails || !data.inHouseRndDocUrl)) {
    return false;
  }
  return true;
}, {
  message: "In-house R&D details and document are required when enabled",
  path: ["inHouseRndDetails"],
}).refine((data) => {
  if (data.undertaking_d && (!data.undertaking_d_annexure2AUrl || !data.undertaking_d_annexure2BUrl)) {
    return false;
  }
  return true;
}, {
  message: "Annexure-2A and Annexure-2B must be uploaded when undertaking (d) is accepted",
  path: ["undertaking_d_annexure2AUrl"],
}).refine((data) => {
  if (data.undertaking_g === "Yes" && !data.undertaking_g_emiEmcStudyUrl) {
    return false;
  }
  return true;
}, {
  message: "EMI / EMC study report is required when compliance is Yes",
  path: ["undertaking_g_emiEmcStudyUrl"],
}).refine((data) => {
  if (data.suppliedToDmrc && (!data.dmrcProjects || data.dmrcProjects.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one DMRC project entry is required when 'Yes' is selected",
  path: ["dmrcProjects"],
}).refine((data) => {
  if (data.suppliedOtherProjects && (!data.otherProjects || data.otherProjects.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one other project entry is required when 'Yes' is selected",
  path: ["otherProjects"],
}).refine((data) => {
  if (data.hasBlacklisting && (!data.blacklistingDetails || data.blacklistingDetails.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one blacklisting detail is required when 'Yes' is selected",
  path: ["blacklistingDetails"],
}).refine((data) => {
  if (data.hasLitigation && (!data.litigationDetails || data.litigationDetails.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one litigation detail is required when 'Yes' is selected",
  path: ["litigationDetails"],
}).refine((data) => {
  if (data.typeTestCertificateProvided && (!data.typeTestCertificates || data.typeTestCertificates.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one type test certificate is required when 'Yes' is selected",
  path: ["typeTestCertificates"],
}).refine((data) => {
  if (data.typeTestFromAccreditedLab && (!data.typeTestAccreditedLabs || data.typeTestAccreditedLabs.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one accredited lab detail is required when 'Yes' is selected",
  path: ["typeTestAccreditedLabs"],
}).refine((data) => {
  if (data.inHouseTestingAsPerStd && (!data.inHouseTestingAsPerStdDetails || data.inHouseTestingAsPerStdDetails.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one standard testing details entry is required when 'Yes' is selected",
  path: ["inHouseTestingAsPerStdDetails"],
}).refine((data) => {
  if (data.inHouseTestingAsPerProductStd && (!data.inHouseTestingAsPerProductStdDetails || data.inHouseTestingAsPerProductStdDetails.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one product standard details entry is required when 'Yes' is selected",
  path: ["inHouseTestingAsPerProductStdDetails"],
}).refine((data) => {
  if (data.inHouseTestingAccredited && (!data.inHouseTestingAccreditedDetails || data.inHouseTestingAccreditedDetails.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one accredited testing details entry is required when 'Yes' is selected",
  path: ["inHouseTestingAccreditedDetails"],
}).refine((data) => {
  if (data.inHouseAllTestsConducted && (!data.inHouseAllTestsConductedDetails || data.inHouseAllTestsConductedDetails.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one routine/type test details entry is required when 'Yes' is selected",
  path: ["inHouseAllTestsConductedDetails"],
}).refine((data) => {
  if (data.externalTestingConducted && (!data.externalTestingDetails || data.externalTestingDetails.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one external testing details entry is required when 'Yes' is selected",
  path: ["externalTestingDetails"],
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
  CIVIL: baseFieldsSchema.merge(_civilFieldsObject),
  ELECTRICAL: baseFieldsSchema.merge(_electricalFieldsObject),
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
