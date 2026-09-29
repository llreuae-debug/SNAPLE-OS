import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CompanyId, Company, ConfidentialityLevel } from '../types';
import { mockUsers, mockCompanies } from '../db/mockData';

interface StepUpChallengeState {
  isOpen: boolean;
  actionTitle: string;
  actionDescription: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface AuthContextType {
  currentUser: User;
  activeCompanyId: CompanyId | 'ALL';
  currentCompany: Company | null;
  availableCompanies: Company[];
  usersList: User[];
  isStepUpOpen: boolean;
  stepUpData: StepUpChallengeState | null;
  switchUser: (userId: string) => void;
  setActiveCompanyId: (companyId: CompanyId | 'ALL') => void;
  requestStepUpMFA: (actionTitle: string, actionDescription: string, callback: () => void) => void;
  confirmStepUpMFA: (otpCode: string) => boolean;
  cancelStepUpMFA: () => void;
  canAccessCompany: (companyId: CompanyId) => boolean;
  canAccessConfidentiality: (level: ConfidentialityLevel) => boolean;
  canApproveBills: () => boolean;
  isAgencyIsolated: () => boolean;
}

const confidentialityRank: Record<ConfidentialityLevel, number> = {
  PUBLIC: 1,
  INTERNAL: 2,
  CONFIDENTIAL: 3,
  STRICTLY_CONFIDENTIAL: 4,
  BOARD_ONLY: 5
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('snaple_user_id');
    const found = mockUsers.find((u) => u.id === saved);
    return found || mockUsers[1]; // Default to Group CEO (Saad Farooq)
  });

  const [activeCompanyId, setActiveCompanyIdState] = useState<CompanyId | 'ALL'>(() => {
    return 'ALL';
  });

  const [stepUpData, setStepUpData] = useState<StepUpChallengeState | null>(null);

  // When changing user, adjust default company if needed
  const switchUser = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return;
    setCurrentUser(user);
    localStorage.setItem('snaple_user_id', user.id);

    // If user is company-restricted, set their company
    if (!user.scope.isGroupWide && user.scope.companyIds.length === 1) {
      setActiveCompanyIdState(user.scope.companyIds[0]);
    } else {
      setActiveCompanyIdState('ALL');
    }
  };

  const setActiveCompanyId = (companyId: CompanyId | 'ALL') => {
    // Check permission
    if (companyId !== 'ALL' && !currentUser.scope.companyIds.includes(companyId)) {
      alert('Access Denied: You do not have permission for this company scope.');
      return;
    }
    setActiveCompanyIdState(companyId);
  };

  const canAccessCompany = (companyId: CompanyId): boolean => {
    return currentUser.scope.companyIds.includes(companyId);
  };

  const canAccessConfidentiality = (level: ConfidentialityLevel): boolean => {
    const userRank = confidentialityRank[currentUser.scope.maxConfidentiality];
    const targetRank = confidentialityRank[level];
    return userRank >= targetRank;
  };

  const canApproveBills = (): boolean => {
    return ['CHAIRMAN', 'GROUP_CEO', 'QS_ENGINEER', 'FINANCE_MANAGER'].includes(currentUser.role);
  };

  const isAgencyIsolated = (): boolean => {
    return currentUser.role === 'AGENCY_USER' && !!currentUser.scope.agencyId;
  };

  const requestStepUpMFA = (actionTitle: string, actionDescription: string, callback: () => void) => {
    setStepUpData({
      isOpen: true,
      actionTitle,
      actionDescription,
      onSuccess: callback,
      onCancel: () => setStepUpData(null)
    });
  };

  const confirmStepUpMFA = (otpCode: string): boolean => {
    // Simulated step-up verification code check (accept '123456' or non-empty 6 digits)
    if (otpCode.length === 6) {
      if (stepUpData?.onSuccess) {
        stepUpData.onSuccess();
      }
      setStepUpData(null);
      return true;
    }
    return false;
  };

  const cancelStepUpMFA = () => {
    if (stepUpData?.onCancel) {
      stepUpData.onCancel();
    }
    setStepUpData(null);
  };

  const currentCompany =
    activeCompanyId === 'ALL' ? null : mockCompanies.find((c) => c.id === activeCompanyId) || null;

  const availableCompanies = mockCompanies.filter((c) => currentUser.scope.companyIds.includes(c.id));

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeCompanyId,
        currentCompany,
        availableCompanies,
        usersList: mockUsers,
        isStepUpOpen: !!stepUpData?.isOpen,
        stepUpData,
        switchUser,
        setActiveCompanyId,
        requestStepUpMFA,
        confirmStepUpMFA,
        cancelStepUpMFA,
        canAccessCompany,
        canAccessConfidentiality,
        canApproveBills,
        isAgencyIsolated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
