import React, { createContext, useContext, useState, type ReactNode } from 'react';

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
  removeRecentItem: (id: string) => void;
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
    title: 'Material changes in M&A redlines',
    type: 'Analysis',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    fullQuery: 'Summarize material changes from redlines in the TechCorp acquisition agreement',
    route: '/ask'
  },
  {
    id: 'demo-2', 
    title: 'Employment agreement for VP',
    type: 'Draft',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    fullQuery: 'Draft employment agreement for VP of Engineering with equity provisions',
    route: '/draft'
  },
  {
    id: 'demo-3',
    title: 'Due diligence checklist',
    type: 'Workflow',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    fullQuery: 'Run comprehensive due diligence checklist for Series B transaction',
    route: '/automate'
  },
  {
    id: 'demo-4',
    title: 'IP indemnity clause risks',
    type: 'Analysis',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    fullQuery: 'Identify potential risks in IP indemnification clause for software licensing deal',
    route: '/ask'
  },
  {
    id: 'demo-5',
    title: 'NDA for Fortune 500 client',
    type: 'Draft',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    fullQuery: 'Create standard NDA template for Fortune 500 technology partnerships',
    route: '/draft'
  },
  {
    id: 'demo-6',
    title: 'Post-closing timeline automation',
    type: 'Workflow',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    fullQuery: 'Automate post-closing timeline and deliverables tracking for merger transaction',
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
      // Add new item at the beginning and limit to 8 items to accommodate demo data
      return [newItem, ...filtered].slice(0, 8);
    });

    // Set this as the active item
    setActiveItemId(newItem.id);
  };

  const removeRecentItem = (id: string) => {
    setRecentItems(prev => prev.filter(item => item.id !== id));
    // If the removed item was active, clear the active state
    if (activeItemId === id) {
      setActiveItemId(null);
    }
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
      removeRecentItem,
      clearRecentItems,
    }}>
      {children}
    </RecentContext.Provider>
  );
};