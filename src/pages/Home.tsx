import React, { useState, useEffect, useRef } from 'react';
import { FileText, PenTool, PlayCircle, Upload } from 'lucide-react';

const Home: React.FC = () => {
  const [placeholder, setPlaceholder] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholders = [
    "Summarize the key points from this deposition...",
    "Draft a consulting agreement for a contractor...",
    "Run contract review workflow..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(80, textareaRef.current.scrollHeight)}px`;
    }
  }, [inputValue]);

  const quickActions = [
    { icon: FileText, label: 'Summarize Document' },
    { icon: PenTool, label: 'Draft Agreement' },
    { icon: PlayCircle, label: 'Run Workflow' },
    { icon: Upload, label: 'Upload Files' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-[600px] space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold text-gray-900">
            How can Harvey help you today?
          </h1>
          <p className="text-lg text-gray-600">
            Describe what you need in your own words
          </p>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholders[placeholder]}
            className="w-full min-h-[80px] p-4 pr-32 text-base border-2 border-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
            rows={1}
          />
          <span className="absolute bottom-3 right-3 text-xs text-gray-500">
            Press ⌘K for quick actions
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <action.icon size={20} className="text-gray-700" />
              <span className="text-xs text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;