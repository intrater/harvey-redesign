import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, PenTool, Scale, Briefcase, ArrowRight, MessageSquare, Save, Share2, Eye } from 'lucide-react';
import { useRecent } from '../contexts/RecentContext';
import { useCommandPalette } from '../contexts/CommandPaletteContext';

const Draft: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addRecentItem, setActiveItemId } = useRecent();
  const { openCommandPalette } = useCommandPalette();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  const query = location.state?.query;

  useEffect(() => {
    // Clear active item when visiting draft page directly
    setActiveItemId(null);
  }, [setActiveItemId]);

  useEffect(() => {
    if (query && !location.state?.fromRecent) {
      setIsLoading(true);
      
      // Simulate draft preparation
      setTimeout(() => {
        setIsLoading(false);
        setShowEditor(true);
      }, 3000);
    }
  }, [query, location.state?.fromRecent]);

  const draftExamples = [
    {
      icon: FileText,
      title: 'Draft an interim operating covenants memo',
      description: 'Create comprehensive operating guidelines for interim periods',
      category: 'Corporate'
    },
    {
      icon: PenTool,
      title: 'Create a standard NDA for a new client',
      description: 'Generate customizable non-disclosure agreement template',
      category: 'Contracts'
    },
    {
      icon: Scale,
      title: 'Write a cease and desist letter',
      description: 'Professional demand letter with legal backing',
      category: 'Litigation'
    },
    {
      icon: Briefcase,
      title: 'Generate board resolution minutes',
      description: 'Formal minutes template for board decisions',
      category: 'Corporate'
    },
    {
      icon: FileText,
      title: 'Prepare a contract amendment',
      description: 'Modify existing agreements with proper legal language',
      category: 'Contracts'
    },
    {
      icon: PenTool,
      title: 'Draft employment agreement terms',
      description: 'Comprehensive employment contract provisions',
      category: 'Employment'
    }
  ];

  const handleExampleClick = (example: typeof draftExamples[0]) => {
    // Add to recent items
    addRecentItem({
      title: example.title.length > 30 ? example.title.substring(0, 30) + '...' : example.title,
      type: 'Draft',
      fullQuery: example.title,
      route: '/draft',
    });

    setIsLoading(true);
    
    // Simulate workflow
    setTimeout(() => {
      setIsLoading(false);
      setShowEditor(true);
    }, 3000);
  };

  const sampleDocument = `INTERIM OPERATING COVENANTS MEMORANDUM

TO: Board of Directors
FROM: Legal Department  
DATE: [Current Date]
RE: Interim Operating Covenants During Transaction Period

This memorandum outlines the interim operating covenants that [COMPANY NAME] ("Company") must observe during the pending transaction period to ensure compliance with the merger agreement dated [DATE].

1. ORDINARY COURSE OF BUSINESS
The Company shall conduct its business only in the ordinary course and in a manner consistent with past practice. Specifically, the Company shall:

• Maintain existing customer and supplier relationships
• Continue current marketing and promotional activities
• Preserve employee relationships and maintain current compensation levels
• Operate facilities in accordance with established practices

2. RESTRICTED ACTIVITIES
Without prior written consent from the acquiring party, the Company shall not:

• Incur indebtedness exceeding $[AMOUNT] individually or $[AMOUNT] in the aggregate
• Enter into any material contracts outside the ordinary course of business
• Make capital expenditures exceeding $[AMOUNT] individually
• Modify employee compensation or benefit plans
• Declare or pay dividends or distributions

3. REQUIRED NOTIFICATIONS
The Company must provide prompt written notice of:

• Any material adverse changes to business operations
• Threatened or pending litigation
• Loss of key customers representing more than [X]% of revenue
• Departure of key management personnel

4. COMPLIANCE MONITORING
Legal and finance teams will establish weekly monitoring procedures to ensure adherence to these covenants and will report any potential violations immediately to the Board.

This memorandum shall remain in effect until the earlier of: (i) completion of the transaction, (ii) termination of the merger agreement, or (iii) written modification by the Board.`;

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
            <p className="text-gray-600">Preparing document draft...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Document Draft</h1>
              <p className="text-sm text-gray-600 mt-1">
                {query ? `Based on: "${query}"` : 'Legal Document Editor'}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <Eye size={16} className="inline mr-1" />
                Preview
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <Share2 size={16} className="inline mr-1" />
                Share
              </button>
              <button className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800">
                <Save size={16} className="inline mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <textarea
                className="w-full h-96 p-4 border border-gray-200 rounded-lg font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                defaultValue={sampleDocument}
              />
            </div>
            
            <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="text-blue-600 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">AI Writing Assistant</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    This draft has been generated based on your request. You can edit directly in the text area above or ask for specific modifications.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Suggest Improvements
                    </button>
                    <button className="px-3 py-1.5 text-xs border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                      Check Compliance
                    </button>
                  </div>
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
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Document Drafting</h1>
            <p className="text-gray-600">Create and edit legal documents with AI-powered assistance</p>
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
            {draftExamples.map((example, index) => (
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
              Need to draft something custom? Use the composer on the homepage
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

export default Draft;