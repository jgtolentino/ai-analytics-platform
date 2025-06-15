import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VibeTestBotProps {
  mode?: 'dev' | 'ci';
  projectPath?: string;
  onFixApplied?: (fix: string) => void;
}

interface ErrorDetection {
  id: string;
  type: 'error' | 'warning' | 'suggestion';
  file: string;
  line: number;
  message: string;
  confidence: number;
  fix?: string;
  timestamp: Date;
}

interface FixReplay {
  id: string;
  title: string;
  beforeCode: string;
  afterCode: string;
  explanation: string;
  duration: number;
  shareUrl?: string;
}

export const VibeTestBot: React.FC<VibeTestBotProps> = ({ 
  mode = 'dev', 
  projectPath,
  onFixApplied 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState<ErrorDetection[]>([]);
  const [currentReplay, setCurrentReplay] = useState<FixReplay | null>(null);
  const [vibeScore, setVibeScore] = useState(85);
  const [showOverlay, setShowOverlay] = useState(false);

  // Simulate real-time error detection
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      // Mock error detection
      const mockErrors: ErrorDetection[] = [
        {
          id: `err_${Date.now()}`,
          type: 'warning',
          file: 'src/components/Dashboard.tsx',
          line: 42,
          message: 'Unused variable detected',
          confidence: 0.9,
          fix: 'Remove unused variable `tempData`',
          timestamp: new Date()
        }
      ];
      
      if (Math.random() > 0.7) {
        setErrors(prev => [...prev.slice(-4), ...mockErrors]);
        if (mockErrors[0].confidence > 0.8) {
          setShowOverlay(true);
          setTimeout(() => setShowOverlay(false), 3000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive]);

  const startVibeMode = () => {
    setIsActive(true);
    setVibeScore(Math.floor(Math.random() * 20) + 80);
  };

  const stopVibeMode = () => {
    setIsActive(false);
    setErrors([]);
    setShowOverlay(false);
  };

  const generateTests = async () => {
    // Mock test generation
    const testSuggestion = `
// Generated test for Dashboard component
describe('Dashboard', () => {
  it('should render KPI cards correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });
});`;
    
    console.log('Generated tests:', testSuggestion);
  };

  const createFixReplay = (error: ErrorDetection) => {
    const replay: FixReplay = {
      id: `replay_${Date.now()}`,
      title: `Fixed: ${error.message}`,
      beforeCode: `// Before: ${error.file}:${error.line}\nconst tempData = fetchData(); // Unused variable`,
      afterCode: `// After: ${error.file}:${error.line}\n// Removed unused variable`,
      explanation: error.fix || 'Applied AI-suggested fix',
      duration: 15,
      shareUrl: `https://scout-mvp.vercel.app/replay/${Date.now()}`
    };
    
    setCurrentReplay(replay);
  };

  const applyFix = (error: ErrorDetection) => {
    if (error.fix && onFixApplied) {
      onFixApplied(error.fix);
    }
    // Remove applied error
    setErrors(prev => prev.filter(e => e.id !== error.id));
    setVibeScore(prev => Math.min(100, prev + 2));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">VT</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Vibe TestBot</h2>
            <p className="text-sm text-gray-500">AI-powered code QA assistant</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Vibe Score:</span>
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold text-emerald-500">{vibeScore}</span>
              <span className="text-sm">✨</span>
            </div>
          </div>
          
          <button
            onClick={isActive ? stopVibeMode : startVibeMode}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {isActive ? 'Stop Vibe' : 'Start Vibe'}
          </button>
        </div>
      </div>

      {/* KPI Cards - Updated Style (No Background Shading) */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: '🐛', label: 'Errors', value: errors.filter(e => e.type === 'error').length },
          { icon: '⚡', label: 'Fixes', value: Math.floor(vibeScore / 10) },
          { icon: '🛡️', label: 'Coverage', value: '94%' },
          { icon: '✨', label: 'Quality', value: vibeScore }
        ].map((kpi, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{kpi.value}</div>
            <div className="text-sm text-gray-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={generateTests}
          disabled={!isActive}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <span>🧪</span>
          <span>Generate Tests</span>
        </button>
        
        <button
          onClick={() => currentReplay && setCurrentReplay(null)}
          disabled={!isActive || errors.length === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          <span>📹</span>
          <span>Create Replay</span>
        </button>
      </div>

      {/* Error List */}
      {errors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Issues</h3>
          <div className="space-y-2">
            {errors.slice(-3).map((error) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {error.type === 'error' ? '🚨' : error.type === 'warning' ? '⚠️' : '💡'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{error.message}</p>
                    <p className="text-sm text-gray-500">{error.file}:{error.line}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {error.fix && (
                    <button
                      onClick={() => applyFix(error)}
                      className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600"
                    >
                      Apply Fix
                    </button>
                  )}
                  <button
                    onClick={() => createFixReplay(error)}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                  >
                    Replay
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Vibe Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">✨</span>
              <div>
                <p className="font-medium">Vibe Check!</p>
                <p className="text-sm opacity-90">New issue detected - ready to fix?</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fix Replay Modal */}
      <AnimatePresence>
        {currentReplay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setCurrentReplay(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-xl p-6 max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Fix Replay</h3>
                <button
                  onClick={() => setCurrentReplay(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Before</h4>
                  <pre className="bg-red-50 p-3 rounded text-sm overflow-x-auto">
                    {currentReplay.beforeCode}
                  </pre>
                </div>
                
                <div className="text-center">
                  <span className="text-2xl">⬇️</span>
                  <p className="text-sm text-gray-600">{currentReplay.explanation}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">After</h4>
                  <pre className="bg-green-50 p-3 rounded text-sm overflow-x-auto">
                    {currentReplay.afterCode}
                  </pre>
                </div>
                
                {currentReplay.shareUrl && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-600">Share this fix:</span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded">
                        Twitter
                      </button>
                      <button className="px-3 py-1 bg-gray-800 text-white text-sm rounded">
                        GitHub
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Mode: <span className="font-medium capitalize">{mode}</span>
            {projectPath && <span> • {projectPath}</span>}
          </span>
          <span>
            Status: <span className={`font-medium ${isActive ? 'text-green-500' : 'text-gray-400'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};