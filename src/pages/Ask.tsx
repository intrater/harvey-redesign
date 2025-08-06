import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Scale, BookOpen, Paperclip, CheckCircle } from 'lucide-react';

const Ask: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || '';
  const [showResults, setShowResults] = useState(false);

  const isDepositionQuery = query.toLowerCase().includes('deposition') || 
                           query.toLowerCase().includes('summarize');

  useEffect(() => {
    if (query) {
      // Simulate analysis delay
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const depositionSummary = [
    "Witness confirmed employment at TechCorp from January 2020 to March 2023",
    "Disclosed signing a non-compete agreement but claims it was never properly explained",
    "Admitted to downloading client contact lists before resignation",
    "Stated that supervisor explicitly approved working on competing projects",
    "Revealed ongoing communications with former colleagues about proprietary methods"
  ];

  const features = [
    { icon: Search, title: 'Legal Research', description: 'Search through millions of cases and statutes' },
    { icon: FileText, title: 'Document Analysis', description: 'Extract key information from legal documents' },
    { icon: Scale, title: 'Case Law', description: 'Find relevant precedents and citations' },
    { icon: BookOpen, title: 'Regulatory Guidance', description: 'Navigate complex regulatory frameworks' }
  ];

  return (
    <motion.div 
      className="p-8 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Assistant</h1>
      <p className="text-gray-600 mb-8">
        Ask Harvey questions about legal topics, case law, and regulations. Get instant, accurate answers powered by AI.
      </p>

      {query && (
        <motion.div 
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-700 mb-1">Context:</h2>
              <p className="text-gray-900 mb-3">{query}</p>
              {isDepositionQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Paperclip size={14} />
                  deposition_transcript.pdf
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 shadow-sm"
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
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-semibold text-blue-900 mb-2">Analysis In Progress</h3>
              <p className="text-blue-800">
                Harvey is analyzing your request and preparing comprehensive results...
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
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <motion.div 
              className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Analysis Complete</h3>
              </div>
              <p className="text-green-800 text-sm">
                Successfully analyzed deposition transcript and extracted key information.
              </p>
            </motion.div>

            {isDepositionQuery && (
              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">Key Points from Deposition</h3>
                <div className="space-y-3">
                  {depositionSummary.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-6 pt-4 border-t border-gray-200"
                >
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Next Steps</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Review non-compete agreement for enforceability</li>
                    <li>• Investigate extent of proprietary information accessed</li>
                    <li>• Consider requesting forensic analysis of defendant's devices</li>
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Ask;