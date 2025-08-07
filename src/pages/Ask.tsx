import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, FileSearch, Scale, TrendingUp, ArrowRight } from 'lucide-react';
import { useRecent } from '../contexts/RecentContext';
import { useCommandPalette } from '../contexts/CommandPaletteContext';

const Ask: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addRecentItem, setActiveItemId } = useRecent();
  const { openCommandPalette } = useCommandPalette();
  const [isLoading, setIsLoading] = useState(false);
  
  const query = location.state?.query;

  useEffect(() => {
    // Clear active item when visiting ask page directly
    setActiveItemId(null);
  }, [setActiveItemId]);

  useEffect(() => {
    if (query && !location.state?.fromRecent) {
      setIsLoading(true);
      
      // Simulate analysis workflow
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [query, location.state?.fromRecent]);

  const assistExamples = [
    {
      icon: FileSearch,
      title: 'Summarize material changes from redlines',
      description: 'Get a clear overview of what changed between document versions',
      category: 'Document Analysis'
    },
    {
      icon: Scale,
      title: 'Analyze key provisions in this agreement',
      description: 'Identify and explain the most important terms and conditions',
      category: 'Contract Review'
    },
    {
      icon: MessageSquare,
      title: 'Compare these two contracts for differences',
      description: 'Side-by-side analysis highlighting variations and implications',
      category: 'Document Comparison'
    },
    {
      icon: FileSearch,
      title: 'Extract all defined terms from this document',
      description: 'Compile a comprehensive list of definitions and their meanings',
      category: 'Document Analysis'
    },
    {
      icon: Scale,
      title: 'Identify potential risks in this clause',
      description: 'Spot legal and business risks with mitigation suggestions',
      category: 'Risk Assessment'
    },
    {
      icon: TrendingUp,
      title: 'Assess market standard terms vs. this agreement',
      description: 'Benchmark against industry practices and standards',
      category: 'Market Analysis'
    }
  ];

  const handleExampleClick = (example: typeof assistExamples[0]) => {
    // Add to recent items
    addRecentItem({
      title: example.title.length > 30 ? example.title.substring(0, 30) + '...' : example.title,
      type: 'Analysis',
      fullQuery: example.title,
      route: '/ask',
    });

    setIsLoading(true);
    
    // Simulate workflow
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

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
            <p className="text-gray-600">Preparing legal analysis...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (query && !location.state?.fromRecent) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Analysis Results</h1>
              <p className="text-sm text-gray-600 mt-1">Based on: "{query}"</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                View Details
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Share
              </button>
              <button className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800">
                Export
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                Based on my analysis of the document, I've identified several key areas that require attention. 
                The agreement contains standard commercial terms with some notable deviations from market practice 
                in the liability and termination clauses.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Findings</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">High Risk: Unlimited Liability Clause</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Section 8.3 contains unlimited liability terms that could expose significant financial risk.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Medium Risk: Termination Rights</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Termination clause allows counterparty broad discretionary termination rights.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Low Risk: IP Provisions</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Intellectual property clauses align with standard market terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="text-green-600 mt-1" size={20} />
                <div>
                  <h2 className="text-lg font-semibold text-green-900 mb-2">AI Recommendations</h2>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>• Consider adding liability caps to limit financial exposure</li>
                    <li>• Negotiate mutual termination rights for better balance</li>
                    <li>• Request additional notice period for termination events</li>
                    <li>• Add specific carve-outs for IP indemnification</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/draft', { state: { query: `Draft liability cap clause based on analysis of: ${query}` } })}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FileSearch className="text-gray-400 mb-2" size={20} />
                  <h3 className="font-medium text-gray-900">Draft Liability Cap</h3>
                  <p className="text-sm text-gray-600">Create protective liability language</p>
                </button>
                <button 
                  onClick={() => navigate('/automate', { state: { query: `Contract review checklist for: ${query}` } })}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <Scale className="text-gray-400 mb-2" size={20} />
                  <h3 className="font-medium text-gray-900">Review Checklist</h3>
                  <p className="text-sm text-gray-600">Generate comprehensive review workflow</p>
                </button>
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
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Legal Assistant</h1>
            <p className="text-gray-600">Get AI-powered analysis and insights for your legal documents</p>
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
            {assistExamples.map((example, index) => (
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
              Need something specific? Use the composer on the homepage for custom queries
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

export default Ask;