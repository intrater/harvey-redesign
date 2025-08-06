import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, FileText, Scale, BookOpen } from 'lucide-react';

const Ask: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || '';

  const features = [
    { icon: Search, title: 'Legal Research', description: 'Search through millions of cases and statutes' },
    { icon: FileText, title: 'Document Analysis', description: 'Extract key information from legal documents' },
    { icon: Scale, title: 'Case Law', description: 'Find relevant precedents and citations' },
    { icon: BookOpen, title: 'Regulatory Guidance', description: 'Navigate complex regulatory frameworks' }
  ];

  return (
    <motion.div 
      className="p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Assistant</h1>
      <p className="text-gray-600 mb-8">
        Ask Harvey questions about legal topics, case law, and regulations. Get instant, accurate answers powered by AI.
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
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <feature.icon className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="font-semibold text-blue-900 mb-2">Analysis In Progress</h3>
        <p className="text-blue-800">
          Harvey is analyzing your request and preparing comprehensive results. This typically takes 10-30 seconds depending on complexity.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Ask;