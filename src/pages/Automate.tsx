import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ListChecks, Clock, RefreshCw, ArrowRight, MessageSquare, PlayCircle, CheckCircle, Settings } from 'lucide-react';
import { useRecent } from '../contexts/RecentContext';
import { useCommandPalette } from '../contexts/CommandPaletteContext';

const Automate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addRecentItem, setActiveItemId } = useRecent();
  const { openCommandPalette } = useCommandPalette();
  const [isLoading, setIsLoading] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  
  const query = location.state?.query;

  useEffect(() => {
    // Clear active item when visiting automate page directly
    setActiveItemId(null);
  }, [setActiveItemId]);

  useEffect(() => {
    if (query && !location.state?.fromRecent) {
      setIsLoading(true);
      
      // Simulate automation workflow setup
      setTimeout(() => {
        setIsLoading(false);
        setShowWorkflow(true);
      }, 3000);
    }
  }, [query, location.state?.fromRecent]);

  const automateExamples = [
    {
      icon: Clock,
      title: 'Automate a post closing timeline',
      description: 'Generate comprehensive post-closing checklists and deadlines',
      category: 'M&A'
    },
    {
      icon: ListChecks,
      title: 'Run due diligence checklist',
      description: 'Systematic document review and verification process',
      category: 'Due Diligence'
    },
    {
      icon: RefreshCw,
      title: 'Execute contract review workflow',
      description: 'Automated clause analysis and risk assessment',
      category: 'Contract Review'
    },
    {
      icon: Zap,
      title: 'Generate closing document set',
      description: 'Compile all required documents for transaction closing',
      category: 'Closing'
    },
    {
      icon: ListChecks,
      title: 'Create matter status report',
      description: 'Automated progress tracking and client reporting',
      category: 'Project Management'
    },
    {
      icon: Clock,
      title: 'Setup compliance monitoring',
      description: 'Ongoing regulatory compliance tracking workflow',
      category: 'Compliance'
    }
  ];

  const handleExampleClick = (example: typeof automateExamples[0]) => {
    // Add to recent items
    addRecentItem({
      title: example.title.length > 30 ? example.title.substring(0, 30) + '...' : example.title,
      type: 'Workflow',
      fullQuery: example.title,
      route: '/automate',
    });

    setIsLoading(true);
    
    // Simulate workflow
    setTimeout(() => {
      setIsLoading(false);
      setShowWorkflow(true);
    }, 3000);
  };

  const workflowSteps = [
    { id: 1, title: 'Document Collection', description: 'Gather all transaction documents', status: 'completed' },
    { id: 2, title: 'Timeline Generation', description: 'Create post-closing schedule', status: 'completed' },
    { id: 3, title: 'Responsibility Assignment', description: 'Assign tasks to team members', status: 'active' },
    { id: 4, title: 'Deadline Setup', description: 'Configure reminders and notifications', status: 'pending' },
    { id: 5, title: 'Progress Tracking', description: 'Monitor completion status', status: 'pending' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-gray-600">Setting up automation workflow...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showWorkflow) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Automation Workflow</h1>
              <p className="text-sm text-gray-600 mt-1">
                {query ? `Running: "${query}"` : 'Active Automation Process'}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <Settings size={16} className="inline mr-1" />
                Configure
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Pause
              </button>
              <button className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800">
                <PlayCircle size={16} className="inline mr-1" />
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Progress</h2>
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.status === 'completed' 
                        ? 'bg-green-500 border-green-500' 
                        : step.status === 'active'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : step.status === 'active' ? (
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      ) : (
                        <span className="text-sm text-gray-500">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        step.status === 'active' ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      step.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : step.status === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {step.status === 'completed' ? 'Done' : step.status === 'active' ? 'In Progress' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
              <div className="flex items-start gap-3">
                <Zap className="text-yellow-600 mt-1" size={20} />
                <div>
                  <h2 className="text-lg font-semibold text-yellow-900 mb-2">Automation in Progress</h2>
                  <p className="text-sm text-yellow-800 mb-4">
                    The workflow is currently processing step 3 of 5. Estimated completion time: 8 minutes.
                    You'll receive notifications as each step completes.
                  </p>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full w-3/5 transition-all duration-500"></div>
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">60% complete</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Generated Outputs</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Post-closing checklist (PDF)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Timeline spreadsheet (Excel)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={14} />
                    <span>Task assignments (pending)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Next Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    Review generated timeline
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    Assign team members
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    Set up notifications
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Legal Automation</h1>
            <p className="text-gray-600">Streamline repetitive legal tasks with intelligent workflows</p>
          </div>
          <button
            onClick={openCommandPalette}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            Ask Harvey
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {automateExamples.map((example, index) => (
              <motion.button
                key={index}
                onClick={() => handleExampleClick(example)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <example.icon className="text-gray-400 group-hover:text-gray-600 transition-colors" size={24} />
                  <ArrowRight className="text-gray-300 group-hover:text-gray-500 transition-colors" size={16} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{example.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {example.category}
                </span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500 mb-4">
              Need a custom automation? Use the composer on the homepage
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MessageSquare size={16} />
              Go to Homepage Composer
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Automate;