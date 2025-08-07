import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChatCircle, Lightning, Paperclip, SlidersHorizontal, Check, BookmarkSimple, X, Database, Info } from 'phosphor-react';
import { useRecent } from '../contexts/RecentContext';

const Home: React.FC = () => {
  const [placeholder, setPlaceholder] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isPromptsModalOpen, setIsPromptsModalOpen] = useState(false);
  const [activePromptsTab, setActivePromptsTab] = useState<'private' | 'team' | 'harvey'>('private');
  const [selectedPrompt, setSelectedPrompt] = useState<{title: string, prompt: string} | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
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
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530); // More realistic cursor blink timing
    return () => clearInterval(cursorInterval);
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

  const getWorkflowSteps = (type: string) => {
    switch (type) {
      case 'Analysis':
        return [
          'Analyzing your request',
          'Preparing legal research tools',
          'Setting up assistant environment'
        ];
      case 'Draft':
        return [
          'Understanding document requirements',
          'Gathering relevant templates',
          'Preparing drafting environment'
        ];
      case 'Workflow':
        return [
          'Processing automation parameters',
          'Loading automation tools',
          'Initializing automation environment'
        ];
      default:
        return [
          'Processing your request',
          'Preparing tools',
          'Setting up environment'
        ];
    }
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
    setCurrentStep(0);

    const steps = getWorkflowSteps(type);

    // Progress through steps
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, (index + 1) * 800);
    });

    // Navigate after all steps complete
    setTimeout(() => {
      navigate(route, { state: { query: inputValue } });
    }, steps.length * 800 + 500);
  };

  const quickActions = [
    { icon: ChatCircle, label: 'Assist', value: 'assistant' },
    { icon: FileText, label: 'Draft', value: 'draft' },
    { icon: Lightning, label: 'Automate', value: 'automate' }
  ];

  const modalOptions = {
    assistant: [
      'Summarize material changes from redlines',
      'Analyze key provisions in this agreement',
      'Compare these two contracts for differences',
      'Extract all defined terms from this document',
      'Identify potential risks in this clause'
    ],
    draft: [
      'Draft an interim operating covenants memo',
      'Create a standard NDA for a new client',
      'Write a cease and desist letter',
      'Generate board resolution minutes',
      'Prepare a contract amendment'
    ],
    automate: [
      'Automate a post closing timeline',
      'Run due diligence checklist',
      'Execute contract review workflow',
      'Generate closing document set',
      'Create matter status report'
    ]
  };

  const savedPrompts = {
    private: [
      {
        id: '1',
        title: 'Contract Risk Analysis',
        prompt: 'Analyze this contract for potential risks and suggest mitigation strategies. Focus on liability, termination, and intellectual property clauses.',
        category: 'Analysis'
      },
      {
        id: '2',
        title: 'Due Diligence Summary',
        prompt: 'Create a comprehensive summary of due diligence findings including red flags, compliance issues, and recommendations.',
        category: 'Analysis'
      },
      {
        id: '3',
        title: 'Employment Agreement Draft',
        prompt: 'Draft an employment agreement for [ROLE] including standard clauses for equity, confidentiality, and termination.',
        category: 'Draft'
      }
    ],
    team: [
      {
        id: '4',
        title: 'NDA Comparison Template',
        prompt: 'Compare the attached NDA to our standard template and highlight key differences, risks, and negotiation points.',
        category: 'Analysis'
      },
      {
        id: '5',
        title: 'Investment Term Sheet',
        prompt: 'Draft a Series A term sheet with standard investor protections, anti-dilution provisions, and governance terms.',
        category: 'Draft'
      }
    ],
    harvey: [
      {
        id: '6',
        title: 'Legal Document Summary',
        prompt: 'Provide a concise summary of this legal document including key terms, obligations, and important dates.',
        category: 'Analysis'
      },
      {
        id: '7',
        title: 'Contract Clause Generator',
        prompt: 'Generate standard contract clauses for [CLAUSE TYPE] with appropriate legal language and industry standards.',
        category: 'Draft'
      }
    ]
  };

  const handleQuickAction = (action: typeof quickActions[0], event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveModal(action.value);
    // Store button position for modal positioning
    setModalPosition({ top: rect.bottom + 8, left: rect.left });
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    setActiveModal(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handlePromptSelect = (promptData: {title: string, prompt: string}) => {
    setInputValue(promptData.prompt);
    setSelectedPrompt(promptData);
    setIsPromptsModalOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleClearPrompt = () => {
    setSelectedPrompt(null);
    setInputValue('');
    setIsPromptsModalOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 -mt-16">
      <motion.div 
        className="w-full max-w-[600px] space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold text-gray-900">
            How can Harvey help you today, John?
          </h1>
          <p className="text-sm text-gray-600 whitespace-nowrap flex items-center justify-center gap-1">
            Harvey is trained on proprietary legal datasets such as U.S. case law, statutes, and LexisNexis
            <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Learn more">
              <Info size={16} weight="regular" />
            </button>
          </p>
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
              placeholder=""
              disabled={isLoading}
              className={`w-full min-h-[120px] p-4 pb-14 text-base rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all bg-gray-100 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              rows={1}
            />
            
            {/* Custom placeholder with blinking cursor */}
            {!inputValue && (
              <div className="absolute top-4 left-4 pointer-events-none text-base text-gray-400">
                <span className="inline-flex items-center">
                  <span 
                    className={`w-0.5 h-5 bg-gray-400 mr-1 transition-opacity duration-0 ${
                      cursorVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{width: '1.5px'}}
                  ></span>
                  {placeholders[placeholder]}
                </span>
              </div>
            )}
          </div>
          
          {/* Bottom Left Utility Icons */}
          <div className="absolute bottom-4 left-4 flex gap-1">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-black rounded-md transition-colors"
              title="Attach files"
              onClick={() => {
                // TODO: Add file upload functionality
                console.log('File upload clicked');
              }}
            >
              <Paperclip size={18} weight="regular" />
            </button>
            
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-black rounded-md transition-colors"
              title="Choose source"
              onClick={() => {
                // TODO: Add source functionality
                console.log('Source clicked');
              }}
            >
              <Database size={18} weight="regular" />
            </button>
            
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-black rounded-md transition-colors"
              title="Settings"
              onClick={() => {
                // TODO: Add settings functionality
                console.log('Settings clicked');
              }}
            >
              <SlidersHorizontal size={18} weight="regular" />
            </button>
          </div>
          
          {/* Bottom Right Prompt Dropdown and Ask Harvey Button */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPromptsModalOpen(true)}
              className="px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-100 transition-colors rounded-md"
            >
              <span className="text-gray-700">
                {selectedPrompt ? selectedPrompt.title : 'Prompt'}
              </span>
            </button>
            
            <AnimatePresence mode="wait">
              {!isLoading && (
                <motion.button
                  key="submit-button"
                  type="button"
                  onClick={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  disabled={!inputValue.trim()}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    !inputValue.trim() 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                  }`}
                >
                  Ask Harvey
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        <motion.div 
          className="flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={(e) => handleQuickAction(action, e)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-12 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all text-sm font-medium text-gray-600"
            >
              <action.icon size={20} weight="regular" />
              <span>{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

      </motion.div>

      <AnimatePresence>
        {activeModal && (
          <React.Fragment>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-96 p-2"
              style={{
                top: modalPosition.top,
                left: modalPosition.left,
              }}
            >
              <div className="px-1 py-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 pb-2">
                  {activeModal} examples
                </div>
              </div>
              
              <div className="py-1">
                {modalOptions[activeModal as keyof typeof modalOptions]?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Loading Modal */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Generating {detectRoute(inputValue).type.toLowerCase() === 'analysis' ? 'assistant' : detectRoute(inputValue).type.toLowerCase()}
              </h2>
              
              <div className="space-y-4">
                {getWorkflowSteps(detectRoute(inputValue).type).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                      opacity: index < currentStep ? 1 : 0.3,
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      index < currentStep 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {index < currentStep && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Check size={14} weight="bold" className="text-white" />
                        </motion.div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      index < currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setIsLoading(false);
                    setCurrentStep(0);
                  }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompts Library Modal */}
      <AnimatePresence>
        {isPromptsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setIsPromptsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Prompt Library</h2>
                  <button
                    onClick={() => setIsPromptsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} weight="regular" />
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {(['private', 'team', 'harvey'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActivePromptsTab(tab)}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors capitalize ${
                        activePromptsTab === tab
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-3">
                  {/* Clear prompt option */}
                  {selectedPrompt && (
                    <motion.button
                      onClick={handleClearPrompt}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full text-left p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-red-900 text-sm">Clear selected prompt</h3>
                        <X size={16} weight="bold" className="text-red-600" />
                      </div>
                      <p className="text-xs text-red-700 mt-1">
                        Return to custom prompt mode
                      </p>
                    </motion.button>
                  )}
                  
                  {savedPrompts[activePromptsTab].map((prompt) => (
                    <motion.button
                      key={prompt.id}
                      onClick={() => handlePromptSelect({title: prompt.title, prompt: prompt.prompt})}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{prompt.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                          {prompt.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-700">
                        {prompt.prompt}
                      </p>
                    </motion.button>
                  ))}
                </div>
                
                {savedPrompts[activePromptsTab].length === 0 && (
                  <div className="text-center py-12">
                    <BookmarkSimple size={48} weight="light" className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved prompts yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your {activePromptsTab} prompts will appear here
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Home;