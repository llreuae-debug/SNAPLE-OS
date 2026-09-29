// ============================================================================
// SNAPLE-OS Type Definitions & Data Model (Stage 1-4 Compliant)
// ============================================================================

export type CompanyId = 'dagmar-gch' | 'pixel-park-stz' | 'novelty-condos';

export interface Company {
  id: CompanyId;
  code: string;
  name: string;
  legalName: string;
  tagline: string;
  color: string;
  badgeBg: string;
  accent: string;
  modules: string[];
  sitesCount: number;
  activeStaffCount: number;
  agencyCount: number;
  description: string;
}

export type RoleType =
  | 'CHAIRMAN'
  | 'GROUP_CEO'
  | 'COMPANY_BOARD'
  | 'COMPANY_DIRECTOR'
  | 'COMPANY_CEO'
  | 'HOD'
  | 'SUPERVISOR'
  | 'EMPLOYEE'
  | 'FIELD_STAFF'
  | 'HR_MANAGER'
  | 'FINANCE_MANAGER'
  | 'PROJECT_MANAGER'
  | 'QS_ENGINEER'
  | 'PROCUREMENT_STORES'
  | 'FACILITIES_SECURITY'
  | 'CONSULTANT'
  | 'AGENCY_USER'
  | 'SYSTEM_ADMIN';

export type ConfidentialityLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'STRICTLY_CONFIDENTIAL' | 'BOARD_ONLY';

export interface AccessScope {
  companyIds: CompanyId[];
  moduleIds?: string[];
  siteIds?: string[];
  departmentIds?: string[];
  projectIds?: string[];
  maxConfidentiality: ConfidentialityLevel;
  isGroupWide: boolean;
  agencyId?: string; // For isolated agency users
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: RoleType;
  designation: string;
  companyId: CompanyId;
  departmentId: string;
  siteId: string;
  scope: AccessScope;
  isMfaEnabled: boolean;
  locale: 'en' | 'ur';
}

// ----------------------------------------------------------------------------
// HR & Job Library & SOPs
// ----------------------------------------------------------------------------

export interface JobKPI {
  id: string;
  title: string;
  formula: string;
  target: string;
  weight: number;
}

export interface JobVersion {
  id: string;
  jobCode: string;
  standardTitle: string;
  departmentId: string;
  grade: string;
  version: number;
  effectiveFrom: string;
  responsibilities: string[];
  authorityLimits: string[];
  qualifications: string[];
  skills: string[];
  competencies: string[];
  kpis: JobKPI[];
  status: 'ACTIVE' | 'SUPERSEDED' | 'DRAFT';
  approvedBy: string;
  changeReason?: string;
}

export interface SOPVersion {
  id: string;
  sopNumber: string;
  title: string;
  departmentId: string;
  version: number;
  effectiveDate: string;
  reviewDate: string;
  purpose: string;
  procedureSteps: { step: number; title: string; detail: string; responsible: string }[];
  controls: string[];
  raci: { role: string; type: 'R' | 'A' | 'C' | 'I' }[];
  status: 'ACTIVE' | 'SUPERSEDED' | 'UNDER_REVIEW';
  acknowledgedCount: number;
}

export interface Employee {
  id: string;
  userId: string;
  employeeNo: string;
  name: string;
  nameUrdu?: string;
  companyId: CompanyId;
  departmentId: string;
  jobVersionId: string;
  jobTitle: string;
  grade: string;
  siteId: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  startDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'EXITED';
  dwrComplianceRate: number;
  averageQualityRating: number;
  sopAcknowledged: boolean;
  jobAcknowledged: boolean;
}

// ----------------------------------------------------------------------------
// Daily Work Records (DWR) & Rubric Rating
// ----------------------------------------------------------------------------

export interface DWROutputItem {
  id: string;
  taskId?: string;
  taskTitle: string;
  outputType: string;
  quantity: number;
  unit: string;
  notes: string;
}

export interface DWREvidence {
  id: string;
  type: 'PHOTO' | 'VOICE_NOTE' | 'QR_SCAN' | 'CHECKLIST' | 'DOCUMENT';
  url: string;
  label: string;
  timestamp: string;
  geo?: { lat: number; lng: number };
}

export interface DWRRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  companyId: CompanyId;
  departmentId: string;
  siteId: string;
  workDate: string;
  items: DWROutputItem[];
  problemsEncountered?: string;
  supportNeeded?: string;
  evidences: DWREvidence[];
  submittedAt: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'CORRECTION_REQUESTED' | 'REJECTED';
  supervisorReview?: {
    reviewerId: string;
    reviewerName: string;
    qualityScore: 1 | 2 | 3 | 4 | 5; // 1-5 strict rubric
    rubricFeedback: string;
    reviewedAt: string;
  };
  syncStatus: 'SYNCED' | 'PENDING' | 'CONFLICT';
}

// ----------------------------------------------------------------------------
// Attendance & Geofencing
// ----------------------------------------------------------------------------

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  companyId: CompanyId;
  siteId: string;
  siteName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  method: 'GEOFENCE' | 'WIFI_SSID' | 'QR_CODE' | 'BIOMETRIC_FALLBACK';
  locationVerified: boolean;
  deviceIdHash: string;
  status: 'ON_TIME' | 'LATE' | 'HALF_DAY' | 'EXEMPTED' | 'PENDING_VERIFICATION';
  exceptionReason?: string;
}

// ----------------------------------------------------------------------------
// CRM & Commercial Operations
// ----------------------------------------------------------------------------

export type LeadStage = 'NEW_ENQUIRY' | 'CONTACTED' | 'QUALIFIED' | 'SITE_VISIT' | 'OFFER_MADE' | 'BOOKED' | 'LOST';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  companyId: CompanyId;
  totalLeads: number;
  consentRecorded: boolean;
}

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  companyId: CompanyId;
  projectName: string;
  budgetRange: string;
  stage: LeadStage;
  ownerId: string;
  ownerName: string;
  source: 'WALK_IN' | 'DIGITAL_AD' | 'WHATSAPP' | 'AGENCY_REFERRAL' | 'BILLBOARD' | 'ORGANIC';
  campaignId?: string;
  agencyId?: string;
  agencyName?: string;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityNote: string;
  potentialValue: number;
}

export interface ApprovedMarketingClaim {
  id: string;
  companyId: CompanyId;
  claimCode: string;
  claimText: string;
  claimTextUrdu: string;
  legalApprovedBy: string;
  approvedDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVISED';
}

export interface UnitInventory {
  id: string;
  companyId: CompanyId;
  projectName: string;
  unitCode: string;
  category: 'RETAIL' | 'OFFICE' | 'LUXURY_APARTMENT' | 'PENTHOUSE' | 'FOOD_COURT';
  areaSqFt: number;
  floor: string;
  basePrice: number;
  status: 'AVAILABLE' | 'RESERVED' | 'BOOKED' | 'HANDOVER_READY';
}

// ----------------------------------------------------------------------------
// Agency Portal & Scorecard
// ----------------------------------------------------------------------------

export interface Agency {
  id: string;
  name: string;
  companyId: CompanyId;
  primaryContact: string;
  phone: string;
  email: string;
  contractStart: string;
  contractEnd: string;
  commissionModel: string;
  slaTargetResponseHours: number;
  assignedCampaigns: string[];
}

export interface AgencyStaff {
  id: string;
  agencyId: string;
  name: string;
  phone: string;
  cnicReference: string; // Protected reference
  active: boolean;
}

export interface AgencyDailySubmission {
  id: string;
  agencyId: string;
  agencyName: string;
  staffName: string;
  date: string;
  outboundCalls: number;
  adSpendPKR: number;
  leadsGenerated: number;
  siteVisitsConducted: number;
  notes: string;
  submittedAt: string;
}

export interface AgencyScorecard {
  agencyId: string;
  agencyName: string;
  period: string;
  totalLeads: number;
  qualifiedLeads: number;
  bookings: number;
  costPerLead: number;
  costPerQualifiedLead: number;
  slaBreachCount: number;
  ratingScore: number; // 0-100
}

// ----------------------------------------------------------------------------
// Project & Construction Controls
// ----------------------------------------------------------------------------

export interface DrawingItem {
  id: string;
  projectId: string;
  projectName: string;
  companyId: CompanyId;
  drawingNo: string;
  title: string;
  discipline: 'ARCHITECTURAL' | 'STRUCTURAL' | 'MEP' | 'HVAC' | 'FIRE_FIGHTING';
  currentRevision: string;
  status: 'ISSUED_FOR_CONSTRUCTION' | 'SUPERSEDED' | 'FOR_REVIEW' | 'AS_BUILT';
  fileUrl: string;
  uploadDate: string;
  uploadedBy: string;
  confidentiality: ConfidentialityLevel;
}

export interface BOQItem {
  id: string;
  projectId: string;
  itemCode: string;
  description: string;
  unit: string;
  boqQuantity: number;
  contractRatePKR: number;
  totalAmountPKR: number;
  executedQuantity: number;
}

export interface MeasurementEntry {
  id: string;
  projectId: string;
  projectName: string;
  boqItemId: string;
  itemDescription: string;
  locationReference: string;
  quantityMeasured: number;
  unit: string;
  dateRecorded: string;
  enteredBy: string;
  checkedBy?: string;
  verifiedBy?: string;
  status: 'DRAFT_ENTERED' | 'ENGINEER_CHECKED' | 'QS_VERIFIED' | 'REJECTED';
  photoEvidenceUrl?: string;
  contractorBillReference?: string;
}

export interface ContractorBillIPC {
  id: string;
  ipcNumber: string;
  projectId: string;
  contractorName: string;
  periodStart: string;
  periodEnd: string;
  claimedAmountPKR: number;
  verifiedAmountPKR: number;
  retentionDeductionPKR: number;
  netPayablePKR: number;
  status: 'SUBMITTED' | 'MB_VERIFICATION_PENDING' | 'QS_CERTIFIED' | 'APPROVED_FOR_PAYMENT' | 'PAID';
  verifiedMBEntriesCount: number;
}

export interface DPRReport {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  weather: string;
  manpowerHeadcount: number;
  machineryActive: string[];
  workDoneSummary: string;
  quantitiesAchieved: string[];
  delaysSafetyIssues: string;
  preparedBy: string;
}

export interface QCInspection {
  id: string;
  projectId: string;
  inspectionType: string;
  location: string;
  result: 'PASS' | 'PASS_WITH_REMARKS' | 'FAIL_NCR_RAISED';
  ncrReference?: string;
  inspectedBy: string;
  inspectionDate: string;
}

export interface NCRObject {
  id: string;
  ncrNumber: string;
  projectId: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  description: string;
  correctiveActionProposed: string;
  status: 'OPEN' | 'ACTION_TAKEN' | 'VERIFIED_CLOSED';
  issuedTo: string;
  targetClosureDate: string;
}

// ----------------------------------------------------------------------------
// Finance & Reversals
// ----------------------------------------------------------------------------

export interface FinancialReceipt {
  id: string;
  companyId: CompanyId;
  receiptNumber: string;
  customerOrPayee: string;
  amountPKR: number;
  paymentMethod: 'CROSS_CHEQUE' | 'BANK_TRANSFER' | 'PAY_ORDER' | 'CASH_DEPOSIT';
  referenceNumber: string;
  accountCategory: string;
  date: string;
  status: 'POSTED' | 'REVERSED' | 'PENDING_APPROVAL';
  reversalReason?: string;
  reversedBy?: string;
  supportingDocUrl?: string;
}

export interface FinancialExpense {
  id: string;
  companyId: CompanyId;
  voucherNumber: string;
  vendorName: string;
  category: 'CONSTRUCTION_MATERIAL' | 'SITE_UTILITIES' | 'MARKETING_ADS' | 'PAYROLL' | 'MAINTENANCE';
  amountPKR: number;
  date: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REVERSED';
  approvedBy?: string;
  approvalDate?: string;
  reversalReason?: string;
}

export interface DailyClosingSummary {
  id: string;
  companyId: CompanyId;
  closingDate: string;
  openingBalancePKR: number;
  totalReceiptsPKR: number;
  totalExpensesPKR: number;
  closingBalancePKR: number;
  variancePKR: number;
  status: 'BALANCED' | 'VARIANCE_FLAGGED' | 'SUPERVISOR_VERIFIED';
  verifiedBy: string;
}

// ----------------------------------------------------------------------------
// Facilities, Security & Operations
// ----------------------------------------------------------------------------

export interface FacilityWorkOrder {
  id: string;
  companyId: CompanyId;
  siteName: string;
  location: string;
  title: string;
  category: 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'CIVIL' | 'ELEVATOR';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  assignedTo: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED_CLOSED';
  reportedDate: string;
  evidenceUrl?: string;
}

export interface SecurityPatrolLog {
  id: string;
  siteName: string;
  guardName: string;
  checkpointName: string;
  qrCodeScanTime: string;
  status: 'VERIFIED' | 'INCIDENT_REPORTED';
  incidentNotes?: string;
}

export interface GatePass {
  id: string;
  passNumber: string;
  companyId: CompanyId;
  type: 'VISITOR' | 'MATERIAL_IN' | 'MATERIAL_OUT' | 'CONTRACTOR_CREW';
  bearerName: string;
  vehicleNo?: string;
  validUntil: string;
  authorizedBy: string;
  status: 'ACTIVE' | 'EXPIRED' | 'EXITED';
}

// ----------------------------------------------------------------------------
// Permission-Aware AI Agent Center
// ----------------------------------------------------------------------------

export type AIAgentType =
  | 'PROJECT_CONTROLS_AGENT'
  | 'QC_COMPLIANCE_AGENT'
  | 'PROCUREMENT_PRICE_AGENT'
  | 'AGENCY_PERFORMANCE_AGENT'
  | 'DWR_QUALITY_AGENT'
  | 'HR_LIBRARY_AGENT'
  | 'FACILITIES_PPM_AGENT';

export interface AIAgentDefinition {
  id: AIAgentType;
  name: string;
  nameUrdu: string;
  role: string;
  description: string;
  requiredScopes: string[];
  icon: string;
}

export interface AIRunRecommendation {
  id: string;
  agentId: AIAgentType;
  agentName: string;
  companyId: CompanyId;
  scopeSummary: string;
  timestamp: string;
  findingHeadline: string;
  recommendationBody: string;
  sourceRecords: { recordType: string; recordId: string; label: string }[];
  confidenceRating: number;
  status: 'PENDING_HUMAN_REVIEW' | 'APPROVED_BY_USER' | 'REJECTED_BY_USER';
  reviewedBy?: string;
  requiresActionType?: string;
}

// ----------------------------------------------------------------------------
// Audit Trail & System Security
// ----------------------------------------------------------------------------

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  companyId: CompanyId;
  action: string;
  entityType: string;
  entityId: string;
  oldValueSummary?: string;
  newValueSummary?: string;
  reason?: string;
  ipAddress: string;
  confidentiality: ConfidentialityLevel;
}
