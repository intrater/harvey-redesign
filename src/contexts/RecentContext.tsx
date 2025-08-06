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

export const RecentProvider: React.FC<RecentProviderProps> = ({ children }) => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
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

  return (
    <RecentContext.Provider value={{
      recentItems,
      addRecentItem,
      activeItemId,
      setActiveItemId,
    }}>
      {children}
    </RecentContext.Provider>
  );
};