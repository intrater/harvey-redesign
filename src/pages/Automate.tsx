import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ListChecks, Clock, RefreshCw, CheckCircle, ArrowRight, Settings, BarChart3 } from 'lucide-react';
import { useRecent } from '../contexts/RecentContext';

const Automate: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || '';
  const fromRecent = location.state?.fromRecent || false;
  const { recentItems } = useRecent();
  const [showWorkflows, setShowWorkflows] = useState(false);

  const isWorkflowQuery = query.toLowerCase().includes('workflow') || 
                         query.toLowerCase().includes('review') ||
                         query.toLowerCase().includes('contract');

  useEffect(() => {
    if (query && isWorkflowQuery) {
      // Simulate workflow preparation delay
      const timer = setTimeout(() => {
        setShowWorkflows(true);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [query, isWorkflowQuery]);

  const workflows = [
    { icon: ListChecks, title: 'Contract Review', description: 'Automated clause detection and risk assessment' },
    { icon: Clock, title: 'Due Diligence', description: 'Streamlined document collection and analysis' },
    { icon: RefreshCw, title: 'Compliance Checks', description: 'Regular monitoring and reporting workflows' },
    { icon: PlayCircle, title: 'Custom Workflows', description: 'Build your own automated processes' }
  ];

  const contractReviewSteps = [
    { id: 1, title: 'Document Upload', description: 'Upload contract files (PDF, DOCX, TXT)', status: 'completed' },
    { id: 2, title: 'Initial Scan', description: 'Identify document type and key sections', status: 'completed' },
    { id: 3, title: 'Clause Analysis', description: 'Extract and categorize contract clauses', status: 'active' },
    { id: 4, title: 'Risk Assessment', description: 'Evaluate potential legal risks and issues', status: 'pending' },
    { id: 5, title: 'Generate Report', description: 'Create comprehensive review summary', status: 'pending' },
  ];

  const workflowTemplates = [
    {
      title: 'Contract Review Workflow',
      description: 'Complete contract analysis with risk assessment and recommendations',
      steps: 5,
      avgTime: '12 minutes',
      icon: ListChecks,
      color: 'blue'
    },
    {
      title: 'NDA Processing',
      description: 'Automated NDA review and approval workflow',
      steps: 4,
      avgTime: '8 minutes',
      icon: RefreshCw,
      color: 'green'
    },
    {
      title: 'Compliance Monitor',
      description: 'Ongoing monitoring for regulatory compliance',
      steps: 6,
      avgTime: 'Continuous',
      icon: BarChart3,
      color: 'purple'
    }
  ];

  return (
    <motion.div 
      className="p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows</h1>
      <p className="text-gray-600 mb-8">
        Build and manage automated workflows for repetitive legal tasks. Save time and reduce errors with intelligent automation.
      </p>

      {query && (
        <motion.div 
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-gray-700 mb-1">Context:</h2>
          <p className="text-gray-900">{query}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!showWorkflows ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              {workflows.map((workflow, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <workflow.icon className="w-8 h-8 text-gray-700 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{workflow.title}</h3>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="bg-purple-50 border border-purple-200 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-semibold text-purple-900 mb-2">Building Workflow</h3>
              <p className="text-purple-800">
                Harvey is analyzing your requirements and preparing workflow templates...
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-1"
                >
                  ●●●
                </motion.span>
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="workflows"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Active Workflow Status */}
            {isWorkflowQuery && (
              <motion.div
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Contract Review Workflow - In Progress</h3>
                      <p className="text-sm text-gray-500">Started 2 minutes ago • Estimated completion: 10 minutes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow-sm transition-all">
                        <Settings size={16} />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {contractReviewSteps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-100 text-green-600' :
                          step.status === 'active' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle size={16} />
                          ) : step.status === 'active' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw size={16} />
                            </motion.div>
                          ) : (
                            <span className="text-xs font-medium">{step.id}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            step.status === 'active' ? 'text-blue-900' : 
                            step.status === 'completed' ? 'text-green-900' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        {step.status === 'active' && (
                          <div className="text-sm text-blue-600 font-medium">Processing...</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Available Workflow Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Workflow Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workflowTemplates.map((template, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      template.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      template.color === 'green' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <template.icon size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span>{template.steps} steps</span>
                        <span>~{template.avgTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-medium">
                        <span>Use template</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Automate;