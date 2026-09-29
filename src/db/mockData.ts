import {
  Company,
  User,
  Employee,
  JobVersion,
  SOPVersion,
  DWRRecord,
  AttendanceRecord,
  Lead,
  Customer,
  ApprovedMarketingClaim,
  UnitInventory,
  Agency,
  AgencyDailySubmission,
  AgencyScorecard,
  DrawingItem,
  BOQItem,
  MeasurementEntry,
  ContractorBillIPC,
  DPRReport,
  QCInspection,
  NCRObject,
  FinancialReceipt,
  FinancialExpense,
  DailyClosingSummary,
  FacilityWorkOrder,
  SecurityPatrolLog,
  GatePass,
  AIAgentDefinition,
  AIRunRecommendation,
  AuditEvent
} from '../types';

export const mockCompanies: Company[] = [
  {
    id: 'dagmar-gch',
    code: 'DAG-GCH',
    name: 'DAGMAR / GCH',
    legalName: 'DAGMAR Group of Companies (Pvt) Ltd',
    tagline: 'Grand City Heights — Mega Commercial & Corporate Towers',
    color: 'from-amber-500 to-amber-700',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    accent: '#f59e0b',
    modules: ['GCH Commercial Tower', 'Shared Corporate Services', 'Civil Construction Core'],
    sitesCount: 3,
    activeStaffCount: 78,
    agencyCount: 4,
    description: 'Flagship commercial real estate & infrastructure company executing high-density urban developments.'
  },
  {
    id: 'pixel-park-stz',
    code: 'PIXEL-STZ',
    name: 'Pixel Park / STZ',
    legalName: 'Pixel Park Special Technology Zone (STZ) Ltd',
    tagline: 'Tech Innovation Hub & IT Commercial Park',
    color: 'from-cyan-500 to-blue-700',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    accent: '#06b6d4',
    modules: ['STZ Technology Park', 'Incubation Suites', 'Tier-3 Data Center Campus'],
    sitesCount: 2,
    activeStaffCount: 34,
    agencyCount: 3,
    description: 'Authorized Special Technology Zone development offering tax-exempt tech offices, fiber pipelines, and co-working.'
  },
  {
    id: 'novelty-condos',
    code: 'NOV-CND',
    name: 'Novelty Condos',
    legalName: 'Novelty Luxury Residential Condominiums Ltd',
    tagline: 'Signature High-Rise Luxury Residences',
    color: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    accent: '#10b981',
    modules: ['Novelty Condos Phase 1', 'Novelty Residences Phase 2', 'Clubhouse & Sky Lounge'],
    sitesCount: 2,
    activeStaffCount: 26,
    agencyCount: 2,
    description: 'High-end residential condominium development delivering smart apartments with private amenities.'
  }
];

export const mockUsers: User[] = [
  {
    id: 'usr-chairman',
    name: 'Malik Tariq (Chairman)',
    email: 'chairman@snaple.group',
    phone: '+92 300 8401100',
    role: 'CHAIRMAN',
    designation: 'Group Executive Chairman',
    companyId: 'dagmar-gch',
    departmentId: 'dept-exec',
    siteId: 'site-gch-hq',
    scope: {
      companyIds: ['dagmar-gch', 'pixel-park-stz', 'novelty-condos'],
      maxConfidentiality: 'BOARD_ONLY',
      isGroupWide: true
    },
    isMfaEnabled: true,
    locale: 'en'
  },
  {
    id: 'usr-group-ceo',
    name: 'Saad Farooq (Group CEO)',
    email: 'saad.ceo@snaple.group',
    phone: '+92 321 5502211',
    role: 'GROUP_CEO',
    designation: 'Chief Executive Officer — Group',
    companyId: 'dagmar-gch',
    departmentId: 'dept-exec',
    siteId: 'site-gch-hq',
    scope: {
      companyIds: ['dagmar-gch', 'pixel-park-stz', 'novelty-condos'],
      maxConfidentiality: 'STRICTLY_CONFIDENTIAL',
      isGroupWide: true
    },
    isMfaEnabled: true,
    locale: 'en'
  },
  {
    id: 'usr-pixel-dir',
    name: 'Dr. Kamran Rizvi (Pixel Director)',
    email: 'k.rizvi@pixelpark.stz',
    phone: '+92 333 9803322',
    role: 'COMPANY_DIRECTOR',
    designation: 'Managing Director — Pixel Park STZ',
    companyId: 'pixel-park-stz',
    departmentId: 'dept-tech',
    siteId: 'site-pixel-hub',
    scope: {
      companyIds: ['pixel-park-stz'],
      maxConfidentiality: 'STRICTLY_CONFIDENTIAL',
      isGroupWide: false
    },
    isMfaEnabled: true,
    locale: 'en'
  },
  {
    id: 'usr-qs-lead',
    name: 'Engr. Bilal Hashmi (Lead QS)',
    email: 'bilal.qs@dagmar.com',
    phone: '+92 301 4405566',
    role: 'QS_ENGINEER',
    designation: 'Senior Quantity Surveyor & Project Engineer',
    companyId: 'dagmar-gch',
    departmentId: 'dept-projects',
    siteId: 'site-gch-tower',
    scope: {
      companyIds: ['dagmar-gch', 'novelty-condos'],
      maxConfidentiality: 'CONFIDENTIAL',
      isGroupWide: false
    },
    isMfaEnabled: true,
    locale: 'en'
  },
  {
    id: 'usr-field-super',
    name: 'Muhammad Asif (Site Supervisor)',
    email: 'asif.field@dagmar.com',
    phone: '+92 345 6607788',
    role: 'FIELD_STAFF',
    designation: 'Civil Site Works Supervisor',
    companyId: 'dagmar-gch',
    departmentId: 'dept-civil',
    siteId: 'site-gch-tower',
    scope: {
      companyIds: ['dagmar-gch'],
      maxConfidentiality: 'INTERNAL',
      isGroupWide: false
    },
    isMfaEnabled: false,
    locale: 'ur'
  },
  {
    id: 'usr-agency-apex',
    name: 'Zainab Shah (Apex Growth Agency)',
    email: 'zainab@apexmedia.agency',
    phone: '+92 302 7708899',
    role: 'AGENCY_USER',
    designation: 'Lead Performance Partner',
    companyId: 'pixel-park-stz',
    departmentId: 'dept-agency',
    siteId: 'site-pixel-hub',
    scope: {
      companyIds: ['pixel-park-stz'],
      maxConfidentiality: 'INTERNAL',
      isGroupWide: false,
      agencyId: 'agency-apex'
    },
    isMfaEnabled: true,
    locale: 'en'
  },
  {
    id: 'usr-finance-mgr',
    name: 'Rana Hammad (Finance Controller)',
    email: 'hammad.finance@snaple.group',
    phone: '+92 300 2209900',
    role: 'FINANCE_MANAGER',
    designation: 'Group Financial Controller',
    companyId: 'dagmar-gch',
    departmentId: 'dept-finance',
    siteId: 'site-gch-hq',
    scope: {
      companyIds: ['dagmar-gch', 'pixel-park-stz', 'novelty-condos'],
      maxConfidentiality: 'CONFIDENTIAL',
      isGroupWide: true
    },
    isMfaEnabled: true,
    locale: 'en'
  }
];

export const mockEmployees: Employee[] = [
  {
    id: 'emp-101',
    userId: 'usr-qs-lead',
    employeeNo: 'EMP-DAG-014',
    name: 'Engr. Bilal Hashmi',
    nameUrdu: 'انجینئر بلال ہاشمی',
    companyId: 'dagmar-gch',
    departmentId: 'dept-projects',
    jobVersionId: 'job-qs-v2',
    jobTitle: 'Senior Quantity Surveyor',
    grade: 'M-2',
    siteId: 'site-gch-tower',
    reportingManagerId: 'usr-group-ceo',
    reportingManagerName: 'Saad Farooq',
    startDate: '2023-03-15',
    status: 'ACTIVE',
    dwrComplianceRate: 96,
    averageQualityRating: 4.8,
    sopAcknowledged: true,
    jobAcknowledged: true
  },
  {
    id: 'emp-102',
    userId: 'usr-field-super',
    employeeNo: 'EMP-DAG-089',
    name: 'Muhammad Asif',
    nameUrdu: 'محمد آصف',
    companyId: 'dagmar-gch',
    departmentId: 'dept-civil',
    jobVersionId: 'job-sup-v1',
    jobTitle: 'Site Supervisor (Civil)',
    grade: 'O-3',
    siteId: 'site-gch-tower',
    reportingManagerId: 'usr-qs-lead',
    reportingManagerName: 'Engr. Bilal Hashmi',
    startDate: '2024-01-10',
    status: 'ACTIVE',
    dwrComplianceRate: 92,
    averageQualityRating: 4.2,
    sopAcknowledged: true,
    jobAcknowledged: true
  },
  {
    id: 'emp-103',
    userId: 'usr-pixel-dir',
    employeeNo: 'EMP-PIX-002',
    name: 'Dr. Kamran Rizvi',
    nameUrdu: 'ڈاکٹر کامران رضوی',
    companyId: 'pixel-park-stz',
    departmentId: 'dept-tech',
    jobVersionId: 'job-md-v1',
    jobTitle: 'Managing Director STZ',
    grade: 'E-1',
    siteId: 'site-pixel-hub',
    reportingManagerId: 'usr-group-ceo',
    reportingManagerName: 'Saad Farooq',
    startDate: '2022-08-01',
    status: 'ACTIVE',
    dwrComplianceRate: 98,
    averageQualityRating: 5.0,
    sopAcknowledged: true,
    jobAcknowledged: true
  },
  {
    id: 'emp-104',
    userId: 'usr-finance-mgr',
    employeeNo: 'EMP-DAG-005',
    name: 'Rana Hammad',
    nameUrdu: 'رانا حماد',
    companyId: 'dagmar-gch',
    departmentId: 'dept-finance',
    jobVersionId: 'job-fin-v3',
    jobTitle: 'Group Financial Controller',
    grade: 'M-1',
    siteId: 'site-gch-hq',
    reportingManagerId: 'usr-group-ceo',
    reportingManagerName: 'Saad Farooq',
    startDate: '2021-11-01',
    status: 'ACTIVE',
    dwrComplianceRate: 94,
    averageQualityRating: 4.9,
    sopAcknowledged: true,
    jobAcknowledged: true
  }
];

export const mockJobVersions: JobVersion[] = [
  {
    id: 'job-qs-v2',
    jobCode: 'JOB-ENG-008',
    standardTitle: 'Senior Quantity Surveyor & Project Engineer',
    departmentId: 'dept-projects',
    grade: 'M-2',
    version: 2,
    effectiveFrom: '2025-01-01',
    responsibilities: [
      'Prepare and audit Bill of Quantities (BOQ) with detailed structural breakdown.',
      'Conduct rigorous Measurement Book (MB) verification prior to contractor IPC certification.',
      'Monitor project S-curve, SPI, CPI and rate variances against master tender.',
      'Enforce zero tolerance for unverified material or civil claims.'
    ],
    authorityLimits: [
      'Certify verified site measurements up to PKR 25,000,000.',
      'Sign off daily concrete pour measurement records.',
      'Reject contractor claims missing timestamped geo-evidence.'
    ],
    qualifications: ['B.Sc Civil Engineering / Quantity Surveying', 'PEC Registered Engineer', 'Min 6 years High-Rise Experience'],
    skills: ['AutoCAD', 'Primavera P6', 'BIM / Revit', 'Cost Estimation', 'FIDIC Contracts'],
    competencies: ['Relentless Precision', 'Zero-Leakage Accountability', 'Technical Leadership'],
    kpis: [
      { id: 'kpi-1', title: 'MB Verification SLA', formula: '% of MB checked in <24h', target: '≥95%', weight: 40 },
      { id: 'kpi-2', title: 'Bill Variance Accuracy', formula: 'Calculated error in IPC', target: '<0.5%', weight: 35 },
      { id: 'kpi-3', title: 'DWR Compliance & Quality', formula: 'Monthly DWR avg score', target: '≥4.5 / 5', weight: 25 }
    ],
    status: 'ACTIVE',
    approvedBy: 'Saad Farooq (Group CEO)',
    changeReason: 'Updated IPC certification thresholds to conform with ISO 9001 and enhanced audit rigor.'
  },
  {
    id: 'job-qs-v1',
    jobCode: 'JOB-ENG-008',
    standardTitle: 'Quantity Surveyor',
    departmentId: 'dept-projects',
    grade: 'M-3',
    version: 1,
    effectiveFrom: '2023-01-01',
    responsibilities: ['Assist in BOQ preparation', 'Record physical site measurements in MB register'],
    authorityLimits: ['Verify measurements up to PKR 5,000,000'],
    qualifications: ['B.Sc Civil Engineering'],
    skills: ['AutoCAD', 'Excel'],
    competencies: ['Accuracy'],
    kpis: [{ id: 'kpi-v1', title: 'Measurement Count', formula: 'Entries per week', target: '20', weight: 100 }],
    status: 'SUPERSEDED',
    approvedBy: 'Tariq Malik',
    changeReason: 'Initial job description version.'
  }
];

export const mockSOPs: SOPVersion[] = [
  {
    id: 'sop-mb-01',
    sopNumber: 'SOP-ENG-042',
    title: 'Site Measurement Book (MB) & Contractor Bill Certification',
    departmentId: 'dept-projects',
    version: 3,
    effectiveDate: '2025-02-01',
    reviewDate: '2026-02-01',
    purpose: 'Standardize the 3-step physical verification process ensuring no contractor invoice is paid without traceable, timestamped site evidence.',
    procedureSteps: [
      { step: 1, title: 'Site Supervisor Entry', detail: 'Record dimensions, grid coordinates, and photo evidence immediately after pour/installation.', responsible: 'Site Supervisor' },
      { step: 2, title: 'Project Engineer Check', detail: 'Physically cross-check tape measurement against drawings on site within 12 hours.', responsible: 'Project Engineer' },
      { step: 3, title: 'Lead QS Verification & Lock', detail: 'Verify calculation against approved BOQ rates and digitally sign off the MB record.', responsible: 'Lead QS' },
      { step: 4, title: 'IPC Bill Generation', detail: 'System automatically permits contractor bill generation only for verified MB line items.', responsible: 'Finance & Contracts' }
    ],
    controls: ['No bill without QS signature', 'Mandatory geo-tagged photo with watermark', 'Audit trail on any revision'],
    raci: [
      { role: 'Site Supervisor', type: 'R' },
      { role: 'Lead QS Engineer', type: 'A' },
      { role: 'Project Director', type: 'C' },
      { role: 'Finance Controller', type: 'I' }
    ],
    status: 'ACTIVE',
    acknowledgedCount: 42
  }
];

export const mockDWRRecords: DWRRecord[] = [
  {
    id: 'dwr-2026-0928-01',
    employeeId: 'emp-101',
    employeeName: 'Engr. Bilal Hashmi',
    companyId: 'dagmar-gch',
    departmentId: 'dept-projects',
    siteId: 'site-gch-tower',
    workDate: '2026-09-28',
    items: [
      {
        id: 'item-1',
        taskTitle: 'GCH Tower 4th Floor Slab Pour Verification',
        outputType: 'MB Physical Verification',
        quantity: 3200,
        unit: 'Cu.Ft R.C.C',
        notes: 'Verified rebar spacing, grade-60 steel alignment, and cube test batching #08.'
      },
      {
        id: 'item-2',
        taskTitle: 'Contractor IPC #06 Audit',
        outputType: 'IPC Bill Check',
        quantity: 1,
        unit: 'IPC Certificate',
        notes: 'Deducted PKR 450,000 for uncertified plaster thickness at East wing.'
      }
    ],
    problemsEncountered: 'Ready-mix transit mixer #04 delayed by 40 mins due to traffic diversion on Main Blvd.',
    supportNeeded: 'Traffic marshal coordination with City Traffic Police for tonight’s column pour.',
    evidences: [
      {
        id: 'ev-1',
        type: 'PHOTO',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
        label: '4th Floor Slab Pour & Slump Test Sample',
        timestamp: '2026-09-28T14:22:00Z',
        geo: { lat: 31.5204, lng: 74.3587 }
      }
    ],
    submittedAt: '2026-09-28T17:45:00Z',
    status: 'VERIFIED',
    supervisorReview: {
      reviewerId: 'usr-group-ceo',
      reviewerName: 'Saad Farooq',
      qualityScore: 5,
      rubricFeedback: 'Exemplary precision in contractor deduction and prompt cube test sampling. Verified.',
      reviewedAt: '2026-09-28T19:10:00Z'
    },
    syncStatus: 'SYNCED'
  },
  {
    id: 'dwr-2026-0929-02',
    employeeId: 'emp-102',
    employeeName: 'Muhammad Asif',
    companyId: 'dagmar-gch',
    departmentId: 'dept-civil',
    siteId: 'site-gch-tower',
    workDate: '2026-09-29',
    items: [
      {
        id: 'item-3',
        taskTitle: 'Basement-2 Shuttering & Scaffolding Inspection',
        outputType: 'Safety Checklist & MB Check',
        quantity: 85,
        unit: 'Pipes / Props',
        notes: 'Checked base plates, bracing clamps, and safety net installation.'
      }
    ],
    problemsEncountered: 'None. All 18 steel fixers reported on schedule.',
    supportNeeded: 'None',
    evidences: [
      {
        id: 'ev-2',
        type: 'VOICE_NOTE',
        url: 'audio-note-0929.m4a',
        label: 'Audio note: Shuttering stability verified on line 4-A',
        timestamp: '2026-09-29T10:15:00Z'
      }
    ],
    submittedAt: '2026-09-29T11:05:00Z',
    status: 'SUBMITTED',
    syncStatus: 'SYNCED'
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-001',
    employeeId: 'emp-101',
    employeeName: 'Engr. Bilal Hashmi',
    companyId: 'dagmar-gch',
    siteId: 'site-gch-tower',
    siteName: 'GCH Tower Construction Site',
    date: '2026-09-29',
    checkInTime: '08:24 AM',
    method: 'GEOFENCE',
    locationVerified: true,
    deviceIdHash: 'dev_iphone15_99a8',
    status: 'ON_TIME'
  },
  {
    id: 'att-002',
    employeeId: 'emp-102',
    employeeName: 'Muhammad Asif',
    companyId: 'dagmar-gch',
    siteId: 'site-gch-tower',
    siteName: 'GCH Tower Construction Site',
    date: '2026-09-29',
    checkInTime: '07:55 AM',
    method: 'QR_CODE',
    locationVerified: true,
    deviceIdHash: 'dev_galaxy_a54_31f2',
    status: 'ON_TIME'
  },
  {
    id: 'att-003',
    employeeId: 'emp-103',
    employeeName: 'Dr. Kamran Rizvi',
    companyId: 'pixel-park-stz',
    siteId: 'site-pixel-hub',
    siteName: 'Pixel Park STZ Campus HQ',
    date: '2026-09-29',
    checkInTime: '08:45 AM',
    method: 'WIFI_SSID',
    locationVerified: true,
    deviceIdHash: 'dev_macbook_m3_88f0',
    status: 'ON_TIME'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1001',
    name: 'Sheikh Nabeel & Sons Trading',
    phone: '+92 300 1122334',
    email: 'nabeel@sheikhtrading.com.pk',
    city: 'Lahore',
    companyId: 'dagmar-gch',
    totalLeads: 2,
    consentRecorded: true
  },
  {
    id: 'cust-1002',
    name: 'NexGen Cloud Technologies Ltd',
    phone: '+92 321 9988776',
    email: 'realestate@nexgencloud.io',
    city: 'Islamabad',
    companyId: 'pixel-park-stz',
    totalLeads: 1,
    consentRecorded: true
  },
  {
    id: 'cust-1003',
    name: 'Dr. Fatima Jahangir (Overseas Investor)',
    phone: '+44 7700 900123',
    email: 'fatima.jahangir@nhs.net',
    city: 'London / Lahore',
    companyId: 'novelty-condos',
    totalLeads: 1,
    consentRecorded: true
  }
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-gch-089',
    customerId: 'cust-1001',
    customerName: 'Sheikh Nabeel & Sons Trading',
    phone: '+92 300 1122334',
    companyId: 'dagmar-gch',
    projectName: 'GCH Commercial Tower',
    budgetRange: 'PKR 120M - 150M',
    stage: 'OFFER_MADE',
    ownerId: 'usr-group-ceo',
    ownerName: 'Saad Farooq',
    source: 'WALK_IN',
    createdAt: '2026-09-20',
    updatedAt: '2026-09-28',
    lastActivityNote: 'Presented revised 5-year installment plan for 3,400 sq.ft Retail Floor 1.',
    potentialValue: 135000000
  },
  {
    id: 'lead-pix-045',
    customerId: 'cust-1002',
    customerName: 'NexGen Cloud Technologies Ltd',
    phone: '+92 321 9988776',
    companyId: 'pixel-park-stz',
    projectName: 'Pixel Park STZ Suites',
    budgetRange: 'PKR 45M - 60M (Lease/Purchase)',
    stage: 'QUALIFIED',
    ownerId: 'usr-pixel-dir',
    ownerName: 'Dr. Kamran Rizvi',
    source: 'AGENCY_REFERRAL',
    agencyId: 'agency-apex',
    agencyName: 'Apex Growth Agency',
    trackingCode: 'APX-STZ-FB-09',
    createdAt: '2026-09-24',
    updatedAt: '2026-09-29',
    lastActivityNote: 'STZ 10-year income tax exemption documentation shared with tech CEO.',
    potentialValue: 55000000
  },
  {
    id: 'lead-nov-022',
    customerId: 'cust-1003',
    customerName: 'Dr. Fatima Jahangir',
    phone: '+44 7700 900123',
    companyId: 'novelty-condos',
    projectName: 'Novelty Condos Phase 1',
    budgetRange: 'PKR 75M - 90M',
    stage: 'SITE_VISIT',
    ownerId: 'usr-group-ceo',
    ownerName: 'Saad Farooq',
    source: 'DIGITAL_AD',
    createdAt: '2026-09-25',
    updatedAt: '2026-09-29',
    lastActivityNote: 'Family representative completed virtual 3D tour of 3-Bed Corner Penthouse.',
    potentialValue: 82000000
  }
];

export const mockApprovedClaims: ApprovedMarketingClaim[] = [
  {
    id: 'claim-01',
    companyId: 'pixel-park-stz',
    claimCode: 'CLM-STZ-01',
    claimText: '100% Exemption on Federal Income Tax, Import Duties on Tech Equipment for 10 Years as approved by STZA.',
    claimTextUrdu: 'ایس ٹی زیڈ اے کی منظور شدہ پالیسی کے تحت ۱۰ سال کے لیے انکم ٹیکس اور کسٹمز ڈیوٹی سے مکمل استثنیٰ۔',
    legalApprovedBy: 'Advocate Junaid (Corporate Legal Counsel)',
    approvedDate: '2025-06-15',
    status: 'ACTIVE'
  },
  {
    id: 'claim-02',
    companyId: 'dagmar-gch',
    claimCode: 'CLM-GCH-04',
    claimText: '100% Clear LDA Approved Commercial Building Plan & Structural Vetting by NESPAK.',
    claimTextUrdu: 'ایل ڈی اے سے باضابطہ منظور شدہ کمرشل نقشہ اور نیسپاک سے اسٹرکچرل کلیرنس یافتہ۔',
    legalApprovedBy: 'Head of Legal & Compliance',
    approvedDate: '2024-11-20',
    status: 'ACTIVE'
  }
];

export const mockUnitInventory: UnitInventory[] = [
  {
    id: 'unit-gch-101',
    companyId: 'dagmar-gch',
    projectName: 'GCH Tower',
    unitCode: 'GCH-RET-01',
    category: 'RETAIL',
    areaSqFt: 1850,
    floor: 'Ground Floor',
    basePrice: 92500000,
    status: 'AVAILABLE'
  },
  {
    id: 'unit-gch-402',
    companyId: 'dagmar-gch',
    projectName: 'GCH Tower',
    unitCode: 'GCH-OFF-402',
    category: 'OFFICE',
    areaSqFt: 3400,
    floor: '4th Corporate Floor',
    basePrice: 135000000,
    status: 'RESERVED'
  },
  {
    id: 'unit-pix-201',
    companyId: 'pixel-park-stz',
    projectName: 'Pixel Park STZ',
    unitCode: 'PIX-TECH-201',
    category: 'OFFICE',
    areaSqFt: 2200,
    floor: '2nd Floor Tech Suite',
    basePrice: 55000000,
    status: 'AVAILABLE'
  },
  {
    id: 'unit-nov-PH1',
    companyId: 'novelty-condos',
    projectName: 'Novelty Condos',
    unitCode: 'NOV-PH-01',
    category: 'PENTHOUSE',
    areaSqFt: 3800,
    floor: '18th Sky Floor',
    basePrice: 82000000,
    status: 'RESERVED'
  }
];

export const mockAgencies: Agency[] = [
  {
    id: 'agency-apex',
    name: 'Apex Growth Media & Sales',
    companyId: 'pixel-park-stz',
    primaryContact: 'Zainab Shah',
    phone: '+92 302 7708899',
    email: 'zainab@apexmedia.agency',
    contractStart: '2025-01-01',
    contractEnd: '2026-12-31',
    commissionModel: '2.5% on Qualified Closed Volume + PKR 250,000 monthly retainer',
    slaTargetResponseHours: 2,
    assignedCampaigns: ['Pixel Park Tech Launch 2026', 'Novelty Overseas Drive']
  },
  {
    id: 'agency-prime',
    name: 'Prime Estate Consultants',
    companyId: 'dagmar-gch',
    primaryContact: 'Mian Usman',
    phone: '+92 333 4411223',
    email: 'usman@primeestate.pk',
    contractStart: '2024-06-01',
    contractEnd: '2026-06-01',
    commissionModel: '2.0% on Direct Retail Conversions',
    slaTargetResponseHours: 4,
    assignedCampaigns: ['GCH Retail Showcase']
  }
];

export const mockAgencySubmissions: AgencyDailySubmission[] = [
  {
    id: 'sub-01',
    agencyId: 'agency-apex',
    agencyName: 'Apex Growth Media & Sales',
    staffName: 'Zainab Shah',
    date: '2026-09-28',
    outboundCalls: 145,
    adSpendPKR: 85000,
    leadsGenerated: 18,
    siteVisitsConducted: 4,
    notes: 'High engagement from Islamabad IT startups regarding STZ tax perks.',
    submittedAt: '2026-09-28T21:30:00Z'
  },
  {
    id: 'sub-02',
    agencyId: 'agency-prime',
    agencyName: 'Prime Estate Consultants',
    staffName: 'Mian Usman',
    date: '2026-09-28',
    outboundCalls: 90,
    adSpendPKR: 40000,
    leadsGenerated: 8,
    siteVisitsConducted: 2,
    notes: '2 investor groups interested in GCH Food Court units.',
    submittedAt: '2026-09-28T20:15:00Z'
  }
];

export const mockAgencyScorecards: AgencyScorecard[] = [
  {
    agencyId: 'agency-apex',
    agencyName: 'Apex Growth Media & Sales',
    period: 'September 2026',
    totalLeads: 240,
    qualifiedLeads: 62,
    bookings: 4,
    costPerLead: 4750,
    costPerQualifiedLead: 18400,
    slaBreachCount: 1,
    ratingScore: 92
  },
  {
    agencyId: 'agency-prime',
    agencyName: 'Prime Estate Consultants',
    period: 'September 2026',
    totalLeads: 110,
    qualifiedLeads: 28,
    bookings: 2,
    costPerLead: 6200,
    costPerQualifiedLead: 24300,
    slaBreachCount: 3,
    ratingScore: 78
  }
];

export const mockDrawings: DrawingItem[] = [
  {
    id: 'drw-gch-str-04',
    projectId: 'proj-gch-tower',
    projectName: 'GCH Commercial Tower',
    companyId: 'dagmar-gch',
    drawingNo: 'GCH-STR-L04-REV03',
    title: '4th Floor Slab & Column Reinforcement Layout',
    discipline: 'STRUCTURAL',
    currentRevision: 'REV-03',
    status: 'ISSUED_FOR_CONSTRUCTION',
    fileUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    uploadDate: '2026-09-15',
    uploadedBy: 'Engr. Bilal Hashmi',
    confidentiality: 'INTERNAL'
  },
  {
    id: 'drw-gch-str-03-old',
    projectId: 'proj-gch-tower',
    projectName: 'GCH Commercial Tower',
    companyId: 'dagmar-gch',
    drawingNo: 'GCH-STR-L04-REV02',
    title: '4th Floor Slab (Old Layout - Cancelled)',
    discipline: 'STRUCTURAL',
    currentRevision: 'REV-02',
    status: 'SUPERSEDED',
    fileUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    uploadDate: '2026-07-10',
    uploadedBy: 'Engr. Bilal Hashmi',
    confidentiality: 'INTERNAL'
  }
];

export const mockBOQItems: BOQItem[] = [
  {
    id: 'boq-01',
    projectId: 'proj-gch-tower',
    itemCode: 'CIV-CONC-01',
    description: 'Supply & pour R.C.C 1:2:4 Class-A concrete (3000 PSI) for suspended slabs & beams',
    unit: 'Cu.Ft',
    boqQuantity: 45000,
    contractRatePKR: 850,
    totalAmountPKR: 38250000,
    executedQuantity: 28400
  },
  {
    id: 'boq-02',
    projectId: 'proj-gch-tower',
    itemCode: 'CIV-STEL-02',
    description: 'Providing & binding Deformed Grade-60 High-Tensile Steel Rebar with lap welding',
    unit: 'Tons',
    boqQuantity: 420,
    contractRatePKR: 275000,
    totalAmountPKR: 115500000,
    executedQuantity: 245
  }
];

export const mockMeasurementEntries: MeasurementEntry[] = [
  {
    id: 'mb-entry-901',
    projectId: 'proj-gch-tower',
    projectName: 'GCH Commercial Tower',
    boqItemId: 'boq-01',
    itemDescription: 'R.C.C 1:2:4 Suspended Slab Pour (Floor 4 Grid A-E / 1-6)',
    locationReference: '4th Floor Slab Zone-2',
    quantityMeasured: 3200,
    unit: 'Cu.Ft',
    dateRecorded: '2026-09-28',
    enteredBy: 'Muhammad Asif (Site Supervisor)',
    checkedBy: 'Engr. Bilal Hashmi (Project Engr)',
    verifiedBy: 'Engr. Bilal Hashmi (Lead QS)',
    status: 'QS_VERIFIED',
    photoEvidenceUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
    contractorBillReference: 'IPC-06'
  },
  {
    id: 'mb-entry-902',
    projectId: 'proj-gch-tower',
    projectName: 'GCH Commercial Tower',
    boqItemId: 'boq-02',
    itemDescription: 'Grade-60 High-Tensile Rebar for Floor 5 Column Starters',
    locationReference: 'Level 5 Columns C1 to C12',
    quantityMeasured: 14.5,
    unit: 'Tons',
    dateRecorded: '2026-09-29',
    enteredBy: 'Muhammad Asif (Site Supervisor)',
    status: 'DRAFT_ENTERED'
  }
];

export const mockContractorBills: ContractorBillIPC[] = [
  {
    id: 'ipc-gch-06',
    ipcNumber: 'IPC-GCH-06',
    projectId: 'proj-gch-tower',
    contractorName: 'Al-Madina Construction Associates (Pvt) Ltd',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-25',
    claimedAmountPKR: 18450000,
    verifiedAmountPKR: 17200000,
    retentionDeductionPKR: 1720000,
    netPayablePKR: 15480000,
    status: 'QS_CERTIFIED',
    verifiedMBEntriesCount: 14
  }
];

export const mockDPRReports: DPRReport[] = [
  {
    id: 'dpr-2026-0929',
    projectId: 'proj-gch-tower',
    projectName: 'GCH Commercial Tower',
    date: '2026-09-29',
    weather: 'Clear / 32°C',
    manpowerHeadcount: 64,
    machineryActive: ['Tower Crane #1', 'Concrete Batching Plant #2', 'Boom Placer (36m)', 'Generator 250kVA'],
    workDoneSummary: 'Steel fixing completed for Floor 4 columns; electrical conduits embedded on East bay.',
    quantitiesAchieved: ['14.5 Tons rebar placed', '120 R.Ft conduit pipe laid'],
    delaysSafetyIssues: 'Zero safety incidents. 100% PPE compliance checked at morning toolbox talk.',
    preparedBy: 'Engr. Bilal Hashmi'
  }
];

export const mockQCInspections: QCInspection[] = [
  {
    id: 'qc-01',
    projectId: 'proj-gch-tower',
    inspectionType: 'Concrete Slump & Cube Compression Strength Test',
    location: '4th Floor Slab Batch #08',
    result: 'PASS',
    inspectedBy: 'Engr. Bilal Hashmi',
    inspectionDate: '2026-09-28'
  },
  {
    id: 'qc-02',
    projectId: 'proj-gch-tower',
    inspectionType: 'Rebar Cover Block & Spacing Inspection',
    location: 'Floor 4 Beam B-12',
    result: 'FAIL_NCR_RAISED',
    ncrReference: 'NCR-GCH-014',
    inspectedBy: 'Engr. Bilal Hashmi',
    inspectionDate: '2026-09-27'
  }
];

export const mockNCRs: NCRObject[] = [
  {
    id: 'ncr-014',
    ncrNumber: 'NCR-GCH-014',
    projectId: 'proj-gch-tower',
    severity: 'MAJOR',
    description: 'Insufficient concrete cover (less than 25mm specified) detected on bottom rebar of Beam B-12.',
    correctiveActionProposed: 'Install high-density cement cover spacer blocks @ 750mm c/c before concrete pour clearance.',
    status: 'VERIFIED_CLOSED',
    issuedTo: 'Al-Madina Construction',
    targetClosureDate: '2026-09-28'
  }
];

export const mockReceipts: FinancialReceipt[] = [
  {
    id: 'rec-01',
    companyId: 'dagmar-gch',
    receiptNumber: 'REC-2026-049',
    customerOrPayee: 'Sheikh Nabeel & Sons Trading',
    amountPKR: 15000000,
    paymentMethod: 'PAY_ORDER',
    referenceNumber: 'PO-MBL-8874102',
    accountCategory: 'Customer Down Payment - Unit GCH-RET-01',
    date: '2026-09-28',
    status: 'POSTED',
    supportingDocUrl: 'receipt-scanned-049.pdf'
  },
  {
    id: 'rec-02',
    companyId: 'pixel-park-stz',
    receiptNumber: 'REC-2026-050',
    customerOrPayee: 'NexGen Cloud Technologies Ltd',
    amountPKR: 5500000,
    paymentMethod: 'BANK_TRANSFER',
    referenceNumber: 'FT-HBL-9932014',
    accountCategory: 'STZ Tech Suite Advance Token',
    date: '2026-09-29',
    status: 'POSTED'
  }
];

export const mockExpenses: FinancialExpense[] = [
  {
    id: 'exp-01',
    companyId: 'dagmar-gch',
    voucherNumber: 'EXP-2026-118',
    vendorName: 'Mughal Steel Mills Ltd',
    category: 'CONSTRUCTION_MATERIAL',
    amountPKR: 6875000,
    date: '2026-09-27',
    status: 'APPROVED',
    approvedBy: 'Saad Farooq (Group CEO)',
    approvalDate: '2026-09-28'
  },
  {
    id: 'exp-02',
    companyId: 'dagmar-gch',
    voucherNumber: 'EXP-2026-119',
    vendorName: 'Apex Growth Media',
    category: 'MARKETING_ADS',
    amountPKR: 350000,
    date: '2026-09-29',
    status: 'SUBMITTED'
  }
];

export const mockDailyClosings: DailyClosingSummary[] = [
  {
    id: 'cls-2026-0928',
    companyId: 'dagmar-gch',
    closingDate: '2026-09-28',
    openingBalancePKR: 42100000,
    totalReceiptsPKR: 15000000,
    totalExpensesPKR: 6875000,
    closingBalancePKR: 50225000,
    variancePKR: 0,
    status: 'BALANCED',
    verifiedBy: 'Rana Hammad (Finance Controller)'
  }
];

export const mockWorkOrders: FacilityWorkOrder[] = [
  {
    id: 'wo-001',
    companyId: 'dagmar-gch',
    siteName: 'GCH Tower',
    location: 'Basement 1 Electrical Room',
    title: 'Main Distribution Panel Breaker Thermal Scan',
    category: 'ELECTRICAL',
    priority: 'HIGH',
    assignedTo: 'Tariq Mehmood (Electrician)',
    status: 'IN_PROGRESS',
    reportedDate: '2026-09-29'
  }
];

export const mockPatrolLogs: SecurityPatrolLog[] = [
  {
    id: 'pat-01',
    siteName: 'GCH Tower Construction Site',
    guardName: 'Sher Zaman (Security Guard)',
    checkpointName: 'Gate #1 Main Ingress / Perimeter North',
    qrCodeScanTime: '2026-09-29 09:30 AM',
    status: 'VERIFIED'
  },
  {
    id: 'pat-02',
    siteName: 'Pixel Park STZ Campus HQ',
    guardName: 'Abdul Qadir (Guard)',
    checkpointName: 'Data Center Ingress Pod-A',
    qrCodeScanTime: '2026-09-29 10:00 AM',
    status: 'VERIFIED'
  }
];

export const mockGatePasses: GatePass[] = [
  {
    id: 'gp-101',
    passNumber: 'GP-DAG-2026-88',
    companyId: 'dagmar-gch',
    type: 'MATERIAL_IN',
    bearerName: 'Mughal Steel Trailer Driver (Tariq)',
    vehicleNo: 'LES-9912',
    validUntil: '2026-09-29 06:00 PM',
    authorizedBy: 'Muhammad Asif',
    status: 'ACTIVE'
  }
];

export const mockAIAgents: AIAgentDefinition[] = [
  {
    id: 'PROJECT_CONTROLS_AGENT',
    name: 'Project Controls & S-Curve Sentinel',
    nameUrdu: 'پروجیکٹ کنٹرولز اور ایس-کورو نگہبان',
    role: 'Monitors physical MB verification, SPI/CPI earned-value, and prevents contractor bill inflation.',
    description: 'Cross-checks tape measurements against BOQ budgets and flags bill certification risks.',
    requiredScopes: ['PROJECTS', 'BOQ', 'MB'],
    icon: 'HardHat'
  },
  {
    id: 'QC_COMPLIANCE_AGENT',
    name: 'QC & NCR Risk Inspector',
    nameUrdu: 'کوالٹی کنٹرول اور این سی آر انسپکٹر',
    role: 'Analyzes recurring defect patterns across concrete, structural rebar, and MEP installations.',
    description: 'Flags overdue corrective actions and ensures zero concrete pour without cube tests.',
    requiredScopes: ['QC', 'SOP'],
    icon: 'ShieldCheck'
  },
  {
    id: 'AGENCY_PERFORMANCE_AGENT',
    name: 'Agency ROI & SLA Auditor',
    nameUrdu: 'ایجنسی کارکردگی اور لاگت آڈیٹر',
    role: 'Audits daily agency submissions against CRM pipeline velocity and cost per qualified lead (CPQL).',
    description: 'Calculates true lead attribution and flags non-performing marketing campaigns.',
    requiredScopes: ['CRM', 'AGENCY'],
    icon: 'TrendingUp'
  },
  {
    id: 'DWR_QUALITY_AGENT',
    name: 'DWR Output & Rubric Evaluator',
    nameUrdu: 'روزمرہ کام اور کوالٹی تجزیہ کار',
    role: 'Enforces measurable output logging and rejects vague submissions like "worked on site".',
    description: 'Benchmarks 1-5 supervisor rubric ratings against department KPI targets.',
    requiredScopes: ['DWR', 'HR'],
    icon: 'CheckCircle2'
  }
];

export const mockAIRunRecommendations: AIRunRecommendation[] = [
  {
    id: 'ai-rec-101',
    agentId: 'PROJECT_CONTROLS_AGENT',
    agentName: 'Project Controls Sentinel',
    companyId: 'dagmar-gch',
    scopeSummary: 'GCH Commercial Tower — IPC Bill #06 Audit',
    timestamp: '2026-09-29 09:40 AM',
    findingHeadline: 'Contractor claimed 1,200 sq.ft external plaster not verified in Measurement Book (MB).',
    recommendationBody: 'Recommend withholding PKR 450,000 from Al-Madina Construction IPC #06 until physical MB measurement is signed by Lead QS Engr. Bilal.',
    sourceRecords: [
      { recordType: 'Contractor Bill', recordId: 'IPC-GCH-06', label: 'Al-Madina IPC #06 Claim' },
      { recordType: 'Measurement Book', recordId: 'MB-901', label: 'Verified 4th Floor Slab Records' }
    ],
    confidenceRating: 98,
    status: 'PENDING_HUMAN_REVIEW',
    requiresActionType: 'BILL_DEDUCTION_APPROVAL'
  },
  {
    id: 'ai-rec-102',
    agentId: 'AGENCY_PERFORMANCE_AGENT',
    agentName: 'Agency ROI & SLA Auditor',
    companyId: 'pixel-park-stz',
    scopeSummary: 'Pixel Park STZ — Agency Spend Attribution',
    timestamp: '2026-09-29 10:15 AM',
    findingHeadline: 'Apex Growth Agency CPQL dropped to PKR 18,400 with 62 qualified leads for Tech Suites.',
    recommendationBody: 'Apex is outperforming Prime Estate by 28% lower acquisition cost. Recommend shifting 30% of October budget to Apex STZ campaigns.',
    sourceRecords: [
      { recordType: 'Agency Scorecard', recordId: 'agency-apex', label: 'Apex Scorecard September' },
      { recordType: 'CRM Leads', recordId: 'lead-pix-045', label: 'NexGen Cloud STZ Lead' }
    ],
    confidenceRating: 94,
    status: 'PENDING_HUMAN_REVIEW',
    requiresActionType: 'BUDGET_REALLOCATION'
  }
];

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-29 09:12:44',
    actorId: 'usr-qs-lead',
    actorName: 'Engr. Bilal Hashmi',
    actorRole: 'QS_ENGINEER',
    companyId: 'dagmar-gch',
    action: 'VERIFY_MEASUREMENT_BOOK',
    entityType: 'MeasurementEntry',
    entityId: 'mb-entry-901',
    oldValueSummary: 'Status: DRAFT_ENTERED',
    newValueSummary: 'Status: QS_VERIFIED (3200 Cu.Ft RCC 4th Floor Slab)',
    reason: 'Physical tape measurement verified against structural drawing GCH-STR-L04-REV03.',
    ipAddress: '192.168.10.45',
    confidentiality: 'INTERNAL'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-29 08:30:10',
    actorId: 'usr-group-ceo',
    actorName: 'Saad Farooq',
    actorRole: 'GROUP_CEO',
    companyId: 'dagmar-gch',
    action: 'APPROVE_EXPENSE_VOUCHER',
    entityType: 'FinancialExpense',
    entityId: 'exp-01',
    oldValueSummary: 'Status: SUBMITTED',
    newValueSummary: 'Status: APPROVED (PKR 6,875,000 to Mughal Steel)',
    reason: 'Steel mill delivery verified via GRN #104 and Weighbridge Slip #889.',
    ipAddress: '182.185.12.90',
    confidentiality: 'CONFIDENTIAL'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-28 17:50:00',
    actorId: 'usr-chairman',
    actorName: 'Malik Tariq (Chairman)',
    actorRole: 'CHAIRMAN',
    companyId: 'dagmar-gch',
    action: 'STEP_UP_EXPORT_MANAGEMENT_PACK',
    entityType: 'ManagementReport',
    entityId: 'rep-mgt-2026-09',
    oldValueSummary: 'N/A',
    newValueSummary: 'Exported Encrypted PDF Group Consolidated Pack',
    reason: 'Monthly board review preparation.',
    ipAddress: '39.40.112.5',
    confidentiality: 'BOARD_ONLY'
  }
];
