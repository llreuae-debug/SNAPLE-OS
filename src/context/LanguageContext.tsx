import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App & Header
    'app.title': 'SNAPLE-OS',
    'app.subtitle': 'Group Management Operating System',
    'app.switch_company': 'Switch Entity',
    'app.switch_role': 'Simulate Persona / Role',
    'app.online': 'Connected',
    'app.offline': 'Offline Mode',
    'app.syncing': 'Syncing Records...',
    'app.synced': 'All Queues Synced',
    'app.pending_sync': 'Pending Sync',
    'app.language': 'Language',
    'app.urdu': 'اردو (Urdu)',
    'app.english': 'English',

    // Navigation
    'nav.dashboard': 'Executive Dashboard',
    'nav.dwr': 'Daily Work (DWR)',
    'nav.attendance': 'Attendance & Geofence',
    'nav.hr': 'People & Job Library',
    'nav.crm': 'Commercial & CRM',
    'nav.projects': 'Project Controls',
    'nav.finance': 'Finance & Reversals',
    'nav.agencies': 'Agency Portal',
    'nav.facilities': 'Facilities & Security',
    'nav.ai': 'AI Intelligence Center',
    'nav.audit': 'Security & Audit Trail',

    // Companies
    'company.all': 'Group Consolidated View',
    'company.dagmar': 'DAGMAR / GCH',
    'company.pixel': 'Pixel Park / STZ',
    'company.novelty': 'Novelty Condos',

    // Status Badges
    'status.active': 'Active',
    'status.verified': 'Verified',
    'status.pending': 'Pending',
    'status.draft': 'Draft',
    'status.rejected': 'Rejected',
    'status.normal': 'Normal',
    'status.warning': 'Warning',
    'status.critical': 'Critical',
    'status.open': 'Open',
    'status.closed': 'Closed',
    'status.superseded': 'Superseded',

    // DWR specific
    'dwr.title': 'Daily Work Record (DWR)',
    'dwr.quick_time': 'Target: 2-5 min (Office) / <2 min (Field)',
    'dwr.add_item': '+ Add Measurable Output',
    'dwr.submit_btn': 'Submit Daily Record',
    'dwr.rubric_score': 'Supervisor Quality Rubric (1-5)',
    'dwr.photo_evidence': 'Photo Evidence',
    'dwr.voice_evidence': 'Voice Note',
    'dwr.qr_evidence': 'QR Scan',
    'dwr.problems': 'Problems Encountered',
    'dwr.support': 'Support Needed',

    // Security & Auth
    'security.step_up': 'Step-Up MFA Verification Required',
    'security.step_up_desc': 'This privileged action requires secondary verification for security compliance.',
    'security.verify_btn': 'Verify & Proceed',
    'security.export_pdf': 'Export PDF Report',
    'security.export_excel': 'Export Excel Sheet',
    'security.audit_log': 'Append-Only Audit Trail',

    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.approve': 'Approve',
    'action.reject': 'Reject',
    'action.filter': 'Filter',
    'action.search': 'Search records...',
    'action.view_detail': 'View Details',
    'action.close': 'Close'
  },
  ur: {
    // App & Header
    'app.title': 'سنیپل او ایس (SNAPLE-OS)',
    'app.subtitle': 'گروپ مینجمنٹ آپریٹنگ سسٹم',
    'app.switch_company': 'ادارہ تبدیل کریں',
    'app.switch_role': 'کردار / صارف تبدیل کریں',
    'app.online': 'آن لائن منسلک',
    'app.offline': 'آف لائن موڈ',
    'app.syncing': 'ریکارڈز ہم آہنگ ہو رہے ہیں...',
    'app.synced': 'تمام ڈیٹا ہم آہنگ ہو چکا ہے',
    'app.pending_sync': 'ہم آہنگی زیر التواء',
    'app.language': 'زبان',
    'app.urdu': 'اردو',
    'app.english': 'English',

    // Navigation
    'nav.dashboard': 'ایگزیکٹو ڈیش بورڈ',
    'nav.dwr': 'روزمرہ کام کی رپورٹ (DWR)',
    'nav.attendance': 'حاضری اور جیو فینسنگ',
    'nav.hr': 'افرادی قوت اور جاب لائبریری',
    'nav.crm': 'کمرشل اور لیڈز (CRM)',
    'nav.projects': 'پروجیکٹ کنٹرولز اور تعمیرات',
    'nav.finance': 'فنانس اور کھاتہ جاتی ریورسلز',
    'nav.agencies': 'مارکیٹنگ ایجنسی پورٹل',
    'nav.facilities': 'سہولیات اور سیکیورٹی آپریشنز',
    'nav.ai': 'اے آئی انٹیلی جنس سینٹر',
    'nav.audit': 'سیکیورٹی اور آڈٹ ٹریل',

    // Companies
    'company.all': 'تمام گروپ کا مجموعی جائزہ',
    'company.dagmar': 'ڈاگمار / جی سی ایچ (DAGMAR / GCH)',
    'company.pixel': 'پکسل پارک / ایس ٹی زیڈ (Pixel Park / STZ)',
    'company.novelty': 'ناولٹی کونڈوز (Novelty Condos)',

    // Status Badges
    'status.active': 'فعال',
    'status.verified': 'تصدیق شدہ',
    'status.pending': 'زیرِ التواء',
    'status.draft': 'ڈرافٹ',
    'status.rejected': 'مسترد',
    'status.normal': 'نارمل',
    'status.warning': 'انتباہ (وارننگ)',
    'status.critical': 'انتہائی اہم (کریٹیکل)',
    'status.open': 'کھلا ہوا',
    'status.closed': 'بند شدہ',
    'status.superseded': 'منسوخ شدہ (سپرسیڈڈ)',

    // DWR specific
    'dwr.title': 'روزانہ کام کا اندراج (DWR)',
    'dwr.quick_time': 'مطلوبہ وقت: ۲ سے ۵ منٹ (آفس) / ۲ منٹ سے کم (فیلڈ)',
    'dwr.add_item': '+ قابل پیمائش کام کا اندراج کریں',
    'dwr.submit_btn': 'رپورٹ جمع کروائیں',
    'dwr.rubric_score': 'نگران کا کوالٹی رینکنگ سکور (۱ سے ۵)',
    'dwr.photo_evidence': 'تصویری ثبوت',
    'dwr.voice_evidence': 'آواز کا ریکارڈ (وائس نوٹ)',
    'dwr.qr_evidence': 'کیو آر اسکین',
    'dwr.problems': 'درپیش مسائل اور رکاوٹیں',
    'dwr.support': 'مطلوبہ مدد / وسائل',

    // Security & Auth
    'security.step_up': 'اضافی تصدیق درکار ہے (MFA Step-Up)',
    'security.step_up_desc': 'اس حساس کارروائی کے لیے اعلی سیکیورٹی توثیق ضروری ہے۔',
    'security.verify_btn': 'تصدیق کریں اور آگے بڑھیں',
    'security.export_pdf': 'پی ڈی ایف رپورٹ برآمد کریں',
    'security.export_excel': 'ایکسل فائل برآمد کریں',
    'security.audit_log': 'مستقل اور ناقابل ترمیم آڈٹ ٹریل',

    // Common Actions
    'action.save': 'محفوظ کریں',
    'action.cancel': 'منسوخ کریں',
    'action.approve': 'منظور کریں',
    'action.reject': 'مسترد کریں',
    'action.filter': 'فلٹر کریں',
    'action.search': 'ریکارڈ تلاش کریں...',
    'action.view_detail': 'تفصیلات دیکھیں',
    'action.close': 'بند کریں'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('snaple_lang') as Language) || 'en';
  });

  const isRTL = language === 'ur';

  useEffect(() => {
    localStorage.setItem('snaple_lang', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, defaultText?: string): string => {
    return translations[language]?.[key] || defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
