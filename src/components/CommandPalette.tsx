import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('thinking');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { recentItems, setActiveItemId, addRecentItem } = useRecent();

  const isMac = navigator.platform.indexOf('Mac') > -1;
  const cmdKey = isMac ? '⌘' : 'Ctrl';

  const placeholders = [
    "Summarize the key points from this document",
    "Draft a consulting agreement for a contractor", 
    "Run contract review workflow"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(60, textareaRef.current.scrollHeight)}px`;
    }
  }, [inputValue]);

  const detectRoute = (text: string): { route: string; type: string } => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(summarize|analyze|review|key points|analysis)\b/)) {
      return { route: '/ask', type: 'Analysis' };
    }
    if (lowerText.match(/\b(draft|create|agreement|contract|document)\b/)) {
      return { route: '/draft', type: 'Draft' };
    }
    if (lowerText.match(/\b(workflow|automate|checklist|process|automation)\b/)) {
      return { route: '/automate', type: 'Workflow' };
    }
    
    return { route: '/ask', type: 'Analysis' };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const { route, type } = detectRoute(inputValue);
    
    // Add to recent items
    addRecentItem({
      title: inputValue.length > 30 ? inputValue.substring(0, 30) + '...' : inputValue,
      type: type as 'Analysis' | 'Draft' | 'Workflow',
      fullQuery: inputValue,
      route,
    });

    setIsLoading(true);
    setLoadingPhase('thinking');

    // First phase: Thinking
    setTimeout(() => {
      setLoadingPhase('preparing');
    }, 1000);

    // Second phase: Navigate and close
    setTimeout(() => {
      navigate(route, { state: { query: inputValue } });
      onClose();
      setIsLoading(false);
      setInputValue('');
    }, 2000);
  };

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

  const groupedCommands = {
    suggested: suggestedCommands,
    recent: recentOnlyCommands,
    actions: actions,
  };

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setSelectedIndex(0);
      setIsLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          if (e.target !== textareaRef.current) {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, allCommands.length - 1));
          }
          break;
        case 'ArrowUp':
          if (e.target !== textareaRef.current) {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
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
  }, [isOpen, selectedIndex, allCommands, suggestedCommands, onClose]);

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

  const AnimatedDots: React.FC = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 400);
      return () => clearInterval(interval);
    }, []);

    return <span>{dots}</span>;
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
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-[600px] max-h-[500px] flex flex-col mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="border-b border-gray-200 p-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={placeholders[placeholder]}
                disabled={isLoading}
                className={`w-full min-h-[60px] p-3 pr-32 text-base border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all bg-gray-50 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                rows={1}
              />
              
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-2 right-3 text-xs text-gray-600"
                  >
                    {loadingPhase === 'thinking' ? (
                      <span>
                        Thinking<AnimatedDots />
                      </span>
                    ) : (
                      <span>
                        Preparing {detectRoute(inputValue).type}<AnimatedDots />
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit-button"
                    type="button"
                    onClick={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    disabled={!inputValue.trim()}
                    className={`absolute bottom-3 right-3 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      !inputValue.trim() 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                    }`}
                  >
                    Ask Harvey
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
          
          <div className="flex-1 overflow-y-auto">
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
              
              {renderSection('Common Actions', groupedCommands.actions, (() => {
                const index = currentIndex;
                currentIndex += groupedCommands.actions.length;
                return index;
              })())}
            </div>
          </div>
          
          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
            Type your question above • Enter to submit • ESC to close
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;