import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, FileText, Zap, ArrowRight } from 'lucide-react';
import { useRecent } from '../contexts/RecentContext';
import { getRelativeTime } from '../utils/time';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  section: 'suggested' | 'recent' | 'actions';
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { recentItems, setActiveItemId } = useRecent();

  const isMac = navigator.platform.indexOf('Mac') > -1;
  const cmdKey = isMac ? '⌘' : 'Ctrl';

  const actions: CommandItem[] = [
    {
      id: 'new-analysis',
      title: 'New Analysis',
      subtitle: 'Start a new legal analysis',
      icon: '💬',
      shortcut: `${cmdKey}⇧A`,
      section: 'actions',
      action: () => {
        navigate('/ask');
        onClose();
      },
    },
    {
      id: 'new-draft',
      title: 'New Draft',
      subtitle: 'Create a new document',
      icon: '✏️',
      shortcut: `${cmdKey}⇧D`,
      section: 'actions',
      action: () => {
        navigate('/draft');
        onClose();
      },
    },
    {
      id: 'run-workflow',
      title: 'Run Workflow',
      subtitle: 'Start an automated workflow',
      icon: '⚡',
      shortcut: `${cmdKey}⇧W`,
      section: 'actions',
      action: () => {
        navigate('/automate');
        onClose();
      },
    },
  ];

  const recentCommands: CommandItem[] = recentItems.map((item, index) => ({
    id: `recent-${item.id}`,
    title: item.title,
    subtitle: `${item.type} • ${getRelativeTime(item.timestamp)}`,
    icon: item.type === 'Analysis' ? '💬' : item.type === 'Draft' ? '✏️' : '⚡',
    shortcut: index < 2 ? `${cmdKey}${index + 1}` : undefined,
    section: index < 2 ? 'suggested' : 'recent',
    action: () => {
      setActiveItemId(item.id);
      navigate(item.route, { state: { query: item.fullQuery, fromRecent: true } });
      onClose();
    },
  }));

  const suggestedCommands = recentCommands.filter(cmd => cmd.section === 'suggested');
  const recentOnlyCommands = recentCommands.filter(cmd => cmd.section === 'recent');

  const allCommands = [...suggestedCommands, ...recentOnlyCommands, ...actions];

  const filteredCommands = allCommands.filter(cmd =>
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCommands = {
    suggested: filteredCommands.filter(cmd => cmd.section === 'suggested'),
    recent: filteredCommands.filter(cmd => cmd.section === 'recent'),
    actions: filteredCommands.filter(cmd => cmd.section === 'actions'),
  };

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case '1':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            const cmd = suggestedCommands[0];
            if (cmd) cmd.action();
          }
          break;
        case '2':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            const cmd = suggestedCommands[1];
            if (cmd) cmd.action();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, suggestedCommands, onClose]);

  const renderSection = (title: string, commands: CommandItem[], startIndex: number) => {
    if (commands.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
          {title}
        </h3>
        <div className="space-y-0">
          {commands.map((command, index) => {
            const globalIndex = startIndex + index;
            const isSelected = globalIndex === selectedIndex;
            
            return (
              <button
                key={command.id}
                onClick={command.action}
                className={`w-full flex items-center justify-between px-3 py-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{command.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{command.title}</div>
                    {command.subtitle && (
                      <div className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {command.subtitle}
                      </div>
                    )}
                  </div>
                </div>
                {command.shortcut && (
                  <div className={`text-xs font-mono ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                    {command.shortcut}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  let currentIndex = 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-[600px] max-h-[400px] flex flex-col mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 text-base placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-sm">No commands found</div>
              </div>
            ) : (
              <div className="py-2">
                {renderSection('Suggested', groupedCommands.suggested, (() => {
                  const index = currentIndex;
                  currentIndex += groupedCommands.suggested.length;
                  return index;
                })())}
                
                {renderSection('Recent', groupedCommands.recent, (() => {
                  const index = currentIndex;
                  currentIndex += groupedCommands.recent.length;
                  return index;
                })())}
                
                {renderSection('Actions', groupedCommands.actions, (() => {
                  const index = currentIndex;
                  currentIndex += groupedCommands.actions.length;
                  return index;
                })())}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
            Use ↑↓ to navigate • Enter to select • ESC to close
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;