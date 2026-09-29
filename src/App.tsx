import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SyncProvider } from './context/SyncContext';
import { AppShell } from './components/layout/AppShell';
import { ExecutiveDashboard } from './components/modules/ExecutiveDashboard';
import { DWRModule } from './components/modules/DWRModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { HRModule } from './components/modules/HRModule';
import { CommercialCRMModule } from './components/modules/CommercialCRMModule';
import { ProjectControlsModule } from './components/modules/ProjectControlsModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { AgencyPortalModule } from './components/modules/AgencyPortalModule';
import { OperationsFacilitiesModule } from './components/modules/OperationsFacilitiesModule';
import { AIAgentCenter } from './components/modules/AIAgentCenter';
import { AuditSecurityAdmin } from './components/modules/AuditSecurityAdmin';
import { DesignSystemShowcase } from './components/modules/DesignSystemShowcase';

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const renderModule = () => {
    switch (currentTab) {
      case 'dashboard':
        return <ExecutiveDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'dwr':
        return <DWRModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'hr':
        return <HRModule />;
      case 'crm':
        return <CommercialCRMModule />;
      case 'projects':
        return <ProjectControlsModule />;
      case 'finance':
        return <FinanceModule />;
      case 'agencies':
        return <AgencyPortalModule />;
      case 'facilities':
        return <OperationsFacilitiesModule />;
      case 'ai':
        return <AIAgentCenter />;
      case 'audit':
        return <AuditSecurityAdmin />;
      case 'design-system':
        return <DesignSystemShowcase />;
      default:
        return <ExecutiveDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <AppShell currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderModule()}
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SyncProvider>
            <MainContent />
          </SyncProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
