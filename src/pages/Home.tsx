import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageSquare, Zap, Paperclip } from 'lucide-react';
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
    "Ask anything or describe what you need"
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

    // Second phase: Navigate
    setTimeout(() => {
      navigate(route, { state: { query: inputValue } });
    }, 2000);
  };

  const quickActions = [
    { icon: MessageSquare, label: 'Ask', text: 'Summarize Material Changes from Redlines' },
    { icon: FileText, label: 'Draft', text: 'Draft an interim operating covenants memo' },
    { icon: Zap, label: 'Automate', text: 'Automate a post closing timeline' }
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
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="relative"
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.005, 1],
            transition: { 
              duration: 4, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        >
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
            className={`w-full min-h-[80px] p-4 pr-48 text-base border-2 border-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all bg-gray-50 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            rows={1}
          />
          
          <button
            type="button"
            className="absolute bottom-4 right-36 p-1.5 text-gray-400 hover:text-black rounded-md transition-colors"
            onClick={() => {
              // TODO: Add file upload functionality
              console.log('File upload clicked');
            }}
          >
            <Paperclip size={18} />
          </button>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-2 right-3 text-sm text-gray-600"
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
              <motion.button
                key="submit-button"
                type="button"
                onClick={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                disabled={!inputValue.trim()}
                className={`absolute bottom-4 right-4 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  !inputValue.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                }`}
              >
                Ask Harvey
              </motion.button>
            )}
          </AnimatePresence>
        </motion.form>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuickAction(action.text)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between gap-4 p-4 rounded-lg bg-white border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all text-left"
            >
              <div>
                <div className="font-medium text-sm text-gray-800 mb-0.5">{action.label}</div>
                <div className="text-xs text-gray-600">{action.text}</div>
              </div>
              <action.icon size={20} className="text-gray-300 flex-shrink-0" />
            </motion.button>
          ))}
        </motion.div>

        <motion.p 
          className="text-center text-sm text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Not sure where to start? <button className="text-black hover:underline">Get some suggestions by browsing the library</button>
        </motion.p>
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