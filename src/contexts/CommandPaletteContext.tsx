import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface CommandPaletteContextType {
  openCommandPalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
  }
  return context;
};

interface CommandPaletteProviderProps {
  children: ReactNode;
  openCommandPalette: () => void;
}

export const CommandPaletteProvider: React.FC<CommandPaletteProviderProps> = ({
  children,
  openCommandPalette,
}) => {
  return (
    <CommandPaletteContext.Provider value={{ openCommandPalette }}>
      {children}
    </CommandPaletteContext.Provider>
  );
};