import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, PenTool, FileCheck, Zap, Save, Share2, Eye, Edit3 } from 'lucide-react';

const Draft: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || '';
  const [showEditor, setShowEditor] = useState(false);

  const isAgreementQuery = query.toLowerCase().includes('agreement') || 
                          query.toLowerCase().includes('consulting') ||
                          query.toLowerCase().includes('contract');

  useEffect(() => {
    if (query && isAgreementQuery) {
      // Simulate draft preparation delay
      const timer = setTimeout(() => {
        setShowEditor(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [query, isAgreementQuery]);

  const documentTypes = [
    { icon: FileText, title: 'Contracts', description: 'Service agreements, NDAs, employment contracts' },
    { icon: PenTool, title: 'Legal Briefs', description: 'Motions, memoranda, and court filings' },
    { icon: FileCheck, title: 'Corporate Documents', description: 'Bylaws, resolutions, and governance docs' },
    { icon: Zap, title: 'Quick Templates', description: 'Common forms and standard agreements' }
  ];

  const sampleAgreement = `CONSULTING AGREEMENT

This Consulting Agreement ("Agreement") is entered into on [DATE], between [COMPANY NAME], a [STATE] corporation ("Company"), and [CONSULTANT NAME], an independent contractor ("Consultant").

1. SERVICES
Consultant agrees to provide consulting services as described in Exhibit A attached hereto and incorporated herein by reference ("Services").

2. COMPENSATION
Company shall pay Consultant a fee of $[AMOUNT] per [HOUR/PROJECT] for the Services. Payment shall be made within thirty (30) days of receipt of invoice.

3. TERM
This Agreement shall commence on [START DATE] and continue until [END DATE], unless earlier terminated in accordance with this Agreement.

4. INDEPENDENT CONTRACTOR
Consultant is an independent contractor and not an employee of Company. Consultant shall be solely responsible for all taxes, withholdings, and other statutory or contractual obligations.

5. CONFIDENTIALITY
Consultant acknowledges that during the course of this Agreement, Consultant may have access to certain confidential information of Company. Consultant agrees to maintain the confidentiality of such information.

6. INTELLECTUAL PROPERTY
Any work product created by Consultant in the performance of the Services shall be deemed "work made for hire" and shall be owned by Company.

7. TERMINATION
Either party may terminate this Agreement at any time with thirty (30) days written notice to the other party.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY:                    CONSULTANT:

_________________          _________________
[NAME]                     [CONSULTANT NAME]
[TITLE]                    
Date: _________            Date: _________`;

  return (
    <motion.div 
      className="p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Draft</h1>
      <p className="text-gray-600 mb-8">
        Create and edit legal documents with AI assistance. Generate contracts, briefs, and other legal documents efficiently.
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
        {!showEditor ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              {documentTypes.map((type, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm"
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
              className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-semibold text-green-900 mb-2">Preparing Draft Environment</h3>
              <p className="text-green-800">
                Harvey is setting up your document workspace with relevant templates and clauses...
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
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Document Header */}
            <motion.div
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">consulting_agreement_draft.docx</h3>
                    <p className="text-sm text-gray-500">Last modified just now • Auto-saved</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow-sm transition-all">
                      <Eye size={16} />
                      Preview
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow-sm transition-all">
                      <Share2 size={16} />
                      Share
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:shadow-sm transition-all">
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <button className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors">
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <select className="text-sm border-none bg-transparent focus:ring-0">
                    <option>Normal Text</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">B</button>
                    <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">I</button>
                    <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">U</button>
                  </div>
                </div>
              </div>

              {/* Document Editor */}
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="prose max-w-none"
                >
                  <textarea
                    className="w-full h-96 p-6 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed"
                    value={sampleAgreement}
                    readOnly
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace' }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* AI Suggestions Panel */}
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold text-blue-900 mb-3">AI Suggestions</h4>
              <div className="space-y-2">
                <div className="text-sm text-blue-800">
                  • Consider adding a dispute resolution clause (Section 8)
                </div>
                <div className="text-sm text-blue-800">
                  • Specify deliverables and milestones in Exhibit A
                </div>
                <div className="text-sm text-blue-800">
                  • Add governing law and jurisdiction clause
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Draft;