import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PendingSyncItem {
  id: string;
  type: 'DWR' | 'ATTENDANCE' | 'MB_ENTRY' | 'PATROL_SCAN';
  title: string;
  timestamp: string;
  payload: any;
}

interface SyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingQueue: PendingSyncItem[];
  enqueueOfflineAction: (type: PendingSyncItem['type'], title: string, payload: any) => void;
  triggerManualSync: () => Promise<void>;
  clearQueue: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingQueue, setPendingQueue] = useState<PendingSyncItem[]>(() => {
    const saved = localStorage.getItem('snaple_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      autoSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingQueue]);

  useEffect(() => {
    localStorage.setItem('snaple_offline_queue', JSON.stringify(pendingQueue));
  }, [pendingQueue]);

  const autoSync = async () => {
    if (pendingQueue.length > 0) {
      await triggerManualSync();
    }
  };

  const enqueueOfflineAction = (type: PendingSyncItem['type'], title: string, payload: any) => {
    const newItem: PendingSyncItem = {
      id: 'sync_' + Math.random().toString(36).substring(2, 9),
      type,
      title,
      timestamp: new Date().toISOString(),
      payload
    };
    setPendingQueue((prev) => [newItem, ...prev]);
  };

  const triggerManualSync = async () => {
    if (pendingQueue.length === 0) return;
    setIsSyncing(true);
    // Simulate network transmission & idempotent UUID check
    await new Promise((res) => setTimeout(res, 1200));
    setPendingQueue([]);
    setIsSyncing(false);
  };

  const clearQueue = () => {
    setPendingQueue([]);
  };

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingQueue,
        enqueueOfflineAction,
        triggerManualSync,
        clearQueue
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
