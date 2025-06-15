// AI Assistant Panel - Unified interface for LearnBot, RetailBot, and Vibe TestBot
// Provides seamless multi-agent experience with context switching
// Version: 1.2

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentLoader } from '../../dashboard/config/agentLoader';

interface Message {
  id: string;
  agent: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'agent';
  metadata?: {
    suggestions?: string[];
    actions?: string[];
    severity?: 'info' | 'warning' | 'error' | 'success';
  };
}

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeAgent?: 'LearnBot' | 'RetailBot' | 'Vibe TestBot';
  context?: {
    page: string;
    data?: any;
    error?: string;
  };
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  isOpen,
  onClose,
  activeAgent = 'LearnBot',
  context
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentAgent, setCurrentAgent] = useState(activeAgent);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get agent configurations
  const agents = agentLoader.getAgents();
  const learnBot = agents.find(a => a.name === 'LearnBot');
  const retailBot = agents.find(a => a.name === 'RetailBot');
  const vibeBot = agents.find(a => a.name === 'Vibe TestBot');

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message based on active agent
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(currentAgent);
      setMessages([{
        id: `welcome-${Date.now()}`,
        agent: currentAgent,
        content: welcomeMessage,
        timestamp: new Date(),
        type: 'agent',
        metadata: {
          suggestions: getAgentSuggestions(currentAgent),
          severity: 'info'
        }
      }]);
    }
  }, [isOpen, currentAgent]);

  const getWelcomeMessage = (agent: string): string => {
    switch (agent) {
      case 'LearnBot':
        return `👋 Hi! I'm LearnBot, your dashboard tutorial assistant. I can help you:\n• Navigate the Scout Dashboard\n• Understand KPI metrics\n• Learn dashboard features\n• Optimize your workflow\n\nWhat would you like to learn about?`;
      case 'RetailBot':
        return `🛍️ Hello! I'm RetailBot, your FMCG analytics specialist. I can assist with:\n• Transaction analysis\n• Revenue reconciliation\n• Basket logic validation\n• Data anomaly detection\n\nHow can I help with your retail data?`;
      case 'Vibe TestBot':
        return `✨ Hey! I'm Vibe TestBot, your AI code QA assistant. I provide:\n• Real-time error detection\n• Patch suggestions\n• Fix replays for sharing\n• Code quality insights\n\nReady to vibe check your code?`;
      default:
        return 'Hello! How can I assist you today?';
    }
  };

  const getAgentSuggestions = (agent: string): string[] => {
    switch (agent) {
      case 'LearnBot':
        return [
          'Show me the dashboard overview',
          'Explain customer demographics',
          'How do I filter data?',
          'What are the key KPIs?'
        ];
      case 'RetailBot':
        return [
          'Analyze transaction patterns',
          'Check for data anomalies',
          'Validate revenue calculations',
          'Review top products'
        ];
      case 'Vibe TestBot':
        return [
          'Check current code quality',
          'Generate test cases',
          'Create fix replay',
          'Run CI validation'
        ];
      default:
        return [];
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      agent: currentAgent,
      content: input,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in real implementation, this would call the actual agent)
    setTimeout(() => {
      const aiResponse = generateMockResponse(input, currentAgent, context);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateMockResponse = (query: string, agent: string, context?: any): Message => {
    const baseResponse = {
      id: `ai-${Date.now()}`,
      agent,
      timestamp: new Date(),
      type: 'agent' as const
    };

    // Agent-specific responses
    if (agent === 'LearnBot') {
      return {
        ...baseResponse,
        content: `I can help you with that! Based on your question about "${query.slice(0, 30)}...", here are some insights about the Scout Dashboard features.`,
        metadata: {
          suggestions: ['Learn more about this feature', 'See related tutorials', 'Practice with sample data'],
          severity: 'info'
        }
      };
    }

    if (agent === 'RetailBot') {
      return {
        ...baseResponse,
        content: `Analyzing your request about "${query.slice(0, 30)}...". Based on current retail data patterns, I've found some interesting insights in your transaction data.`,
        metadata: {
          suggestions: ['View detailed analysis', 'Export findings', 'Set up alerts'],
          actions: ['Generate Report', 'Schedule Alert'],
          severity: 'success'
        }
      };
    }

    if (agent === 'Vibe TestBot') {
      return {
        ...baseResponse,
        content: `🔍 Code analysis for "${query.slice(0, 30)}..." complete! Found 2 potential improvements and generated a fix suggestion.`,
        metadata: {
          suggestions: ['Apply suggested fixes', 'Create fix replay', 'Run tests'],
          actions: ['Apply Fix', 'Generate Replay'],
          severity: 'warning'
        }
      };
    }

    return {
      ...baseResponse,
      content: 'I understand your request. Let me help you with that.'
    };
  };

  const switchAgent = (newAgent: string) => {
    setCurrentAgent(newAgent as any);
    const switchMessage: Message = {
      id: `switch-${Date.now()}`,
      agent: 'System',
      content: `Switched to ${newAgent}. ${getWelcomeMessage(newAgent)}`,
      timestamp: new Date(),
      type: 'agent',
      metadata: {
        suggestions: getAgentSuggestions(newAgent),
        severity: 'info'
      }
    };
    setMessages(prev => [...prev, switchMessage]);
  };

  const getAgentIcon = (agent: string): string => {
    switch (agent) {
      case 'LearnBot': return '🎓';
      case 'RetailBot': return '🛍️';
      case 'Vibe TestBot': return '✨';
      default: return '🤖';
    }
  };

  const getAgentColor = (agent: string): string => {
    switch (agent) {
      case 'LearnBot': return 'blue';
      case 'RetailBot': return 'green';
      case 'Vibe TestBot': return 'purple';
      default: return 'gray';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getAgentIcon(currentAgent)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{currentAgent}</h3>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Agent Switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {['LearnBot', 'RetailBot', 'Vibe TestBot'].map((agent) => (
            <button
              key={agent}
              onClick={() => switchAgent(agent)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                currentAgent === agent
                  ? `text-${getAgentColor(agent)}-600 bg-white border-b-2 border-${getAgentColor(agent)}-500`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-1">{getAgentIcon(agent)}</span>
              {agent.replace('Bot', '')}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : `bg-gray-100 text-gray-900 border-l-4 border-${getAgentColor(message.agent)}-400`
                }`}
              >
                {message.type === 'agent' && (
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-xs">{getAgentIcon(message.agent)}</span>
                    <span className="text-xs font-medium text-gray-600">{message.agent}</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Suggestions */}
                {message.metadata?.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.metadata.suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion)}
                        className="block w-full text-left px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {message.metadata?.actions && (
                  <div className="mt-2 flex space-x-1">
                    {message.metadata.actions.map((action, index) => (
                      <button
                        key={index}
                        className={`px-2 py-1 text-xs rounded font-medium bg-${getAgentColor(currentAgent)}-500 text-white hover:bg-${getAgentColor(currentAgent)}-600 transition-colors`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{currentAgent} is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask ${currentAgent}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`px-4 py-2 bg-${getAgentColor(currentAgent)}-500 text-white rounded-lg hover:bg-${getAgentColor(currentAgent)}-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium`}
            >
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistantPanel;