import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, ListChecks, Clock, RefreshCw } from 'lucide-react';

const Automate: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || '';

  const workflows = [
    { icon: ListChecks, title: 'Contract Review', description: 'Automated clause detection and risk assessment' },
    { icon: Clock, title: 'Due Diligence', description: 'Streamlined document collection and analysis' },
    { icon: RefreshCw, title: 'Compliance Checks', description: 'Regular monitoring and reporting workflows' },
    { icon: PlayCircle, title: 'Custom Workflows', description: 'Build your own automated processes' }
  ];

  return (
    <motion.div 
      className="p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows</h1>
      <p className="text-gray-600 mb-8">
        Build and manage automated workflows for repetitive legal tasks. Save time and reduce errors with intelligent automation.
      </p>

      {query && (
        <motion.div 
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-gray-700 mb-1">Context:</h2>
          <p className="text-gray-900">{query}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-8">
        {workflows.map((workflow, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer"
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
        className="bg-purple-50 border border-purple-200 rounded-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="font-semibold text-purple-900 mb-2">Building Workflow</h3>
        <p className="text-purple-800">
          Harvey is analyzing your requirements and preparing workflow templates that match your needs. Automation setup typically takes 15-45 seconds.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Automate;