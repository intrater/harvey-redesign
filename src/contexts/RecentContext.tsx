import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RecentItem {
  id: string;
  title: string;
  type: 'Analysis' | 'Draft' | 'Workflow';
  timestamp: Date;
  fullQuery: string;
  route: string;
}

interface RecentContextType {
  recentItems: RecentItem[];
  addRecentItem: (item: Omit<RecentItem, 'id' | 'timestamp'>) => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
  clearRecentItems: () => void;
}

const RecentContext = createContext<RecentContextType | undefined>(undefined);

export const useRecent = () => {
  const context = useContext(RecentContext);
  if (context === undefined) {
    throw new Error('useRecent must be used within a RecentProvider');
  }
  return context;
};

interface RecentProviderProps {
  children: ReactNode;
}

// Initial demo items to showcase the Recent functionality
const createDemoItems = (): RecentItem[] => [
  {
    id: 'demo-1',
    title: 'Johnson v. State analysis',
    type: 'Analysis',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    fullQuery: 'Analyze the Johnson v. State case for precedent applicability',
    route: '/ask'
  },
  {
    id: 'demo-2', 
    title: 'Series A investment docs',
    type: 'Draft',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    fullQuery: 'Draft Series A investment documentation package',
    route: '/draft'
  },
  {
    id: 'demo-3',
    title: 'GDPR compliance review',
    type: 'Workflow',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    fullQuery: 'Run GDPR compliance review workflow for client data',
    route: '/automate'
  }
];

export const RecentProvider: React.FC<RecentProviderProps> = ({ children }) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>(createDemoItems);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const addRecentItem = (item: Omit<RecentItem, 'id' | 'timestamp'>) => {
    const newItem: RecentItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setRecentItems(prev => {
      // Remove any existing item with the same query to avoid duplicates
      const filtered = prev.filter(existing => existing.fullQuery !== item.fullQuery);
      // Add new item at the beginning and limit to 5 items
      return [newItem, ...filtered].slice(0, 5);
    });

    // Set this as the active item
    setActiveItemId(newItem.id);
  };

  const clearRecentItems = () => {
    setRecentItems([]);
    setActiveItemId(null);
  };

  return (
    <RecentContext.Provider value={{
      recentItems,
      addRecentItem,
      activeItemId,
      setActiveItemId,
      clearRecentItems,
    }}>
      {children}
    </RecentContext.Provider>
  );
};