import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, PenTool, FileCheck, Zap } from 'lucide-react';

const Draft: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || '';

  const documentTypes = [
    { icon: FileText, title: 'Contracts', description: 'Service agreements, NDAs, employment contracts' },
    { icon: PenTool, title: 'Legal Briefs', description: 'Motions, memoranda, and court filings' },
    { icon: FileCheck, title: 'Corporate Documents', description: 'Bylaws, resolutions, and governance docs' },
    { icon: Zap, title: 'Quick Templates', description: 'Common forms and standard agreements' }
  ];

  return (
    <motion.div 
      className="p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Draft</h1>
      <p className="text-gray-600 mb-8">
        Create and edit legal documents with AI assistance. Generate contracts, briefs, and other legal documents efficiently.
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
        {documentTypes.map((type, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <type.icon className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="bg-green-50 border border-green-200 rounded-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="font-semibold text-green-900 mb-2">Preparing Draft Environment</h3>
        <p className="text-green-800">
          Harvey is setting up your document workspace with relevant templates, clauses, and precedents based on your request.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Draft;