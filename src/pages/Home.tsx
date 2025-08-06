import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, PenTool, PlayCircle, Upload } from 'lucide-react';
import { useRecent } from '../contexts/RecentContext';

const Home: React.FC = () => {
  const [placeholder, setPlaceholder] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('thinking');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { addRecentItem, setActiveItemId } = useRecent();

  useEffect(() => {
    // Clear active item when visiting home
    setActiveItemId(null);
  }, [setActiveItemId]);

  const placeholders = [
    "Summarize the key points from this deposition...",
    "Draft a consulting agreement for a contractor...",
    "Run contract review workflow..."
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
      textareaRef.current.style.height = `${Math.max(80, textareaRef.current.scrollHeight)}px`;
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
      type,
      fullQuery: inputValue,
      route,
    });

    setIsLoading(true);
    setLoadingPhase('thinking');

    // First phase: Thinking
    setTimeout(() => {
      setLoadingPhase('preparing');
    }, 1000);

    // Second phase: Navigate
    setTimeout(() => {
      navigate(route, { state: { query: inputValue } });
    }, 2000);
  };

  const quickActions = [
    { icon: FileText, label: 'Summarize Document', text: 'Summarize the key points from this document' },
    { icon: PenTool, label: 'Draft Agreement', text: 'Draft a consulting agreement for a contractor' },
    { icon: PlayCircle, label: 'Run Workflow', text: 'Run contract review workflow' },
    { icon: Upload, label: 'Upload Files', text: 'Upload and analyze legal documents' }
  ];

  const handleQuickAction = (text: string) => {
    setInputValue(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <motion.div 
        className="w-full max-w-[600px] space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold text-gray-900">
            How can Harvey help you today?
          </h1>
          <p className="text-lg text-gray-600">
            Describe what you need in your own words
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
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
            className={`w-full min-h-[80px] p-4 pr-32 text-base border-2 border-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ${
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
                className="absolute bottom-3 right-3 text-sm text-gray-600"
              >
                {loadingPhase === 'thinking' ? (
                  <span>
                    Thinking<AnimatedDots />
                  </span>
                ) : (
                  <span>
                    Preparing {detectRoute(inputValue).type} environment<AnimatedDots />
                  </span>
                )}
              </motion.div>
            ) : (
              <motion.span
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-3 right-3 text-xs text-gray-500"
              >
{navigator.platform.indexOf('Mac') > -1 ? 'Press ⌘K' : 'Press Ctrl+K'} for quick actions
              </motion.span>
            )}
          </AnimatePresence>
        </form>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickAction(action.text)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <action.icon size={20} className="text-gray-700" />
              <span className="text-xs text-gray-700">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
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

export default Home;