// pages/ai-assist.tsx - Unified AI Assistant Page
// Integration point for LearnBot, RetailBot, and Vibe TestBot
// Version: 1.2

import React, { useState } from 'react';
import { Header } from '../src/components/Header.jsx';
import { DateRangePicker } from '../src/components/DateRangePicker.jsx';
import Navigation from '../src/components/Navigation';
import CollapsibleSection from '../src/components/layout/CollapsibleSection';
import AIAssistantPanel from '../src/components/AIAssistantPanel';

export default function AIAssistCombo() {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState<'LearnBot' | 'RetailBot' | 'Vibe TestBot'>('RetailBot');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      message: 'Welcome to Scout AI Assistant! I integrate LearnBot, RetailBot, and Vibe TestBot to provide comprehensive support for your analytics platform.',
      timestamp: '2025-06-15T12:30:00Z'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          type: 'user',
          message: currentMessage,
          timestamp: new Date().toISOString()
        },
        {
          type: 'bot',
          message: `I understand you're asking about "${currentMessage}". Let me analyze your data... Based on current trends, I recommend focusing on premium customer segments and optimizing inventory for peak Saturday shopping periods.`,
          timestamp: new Date().toISOString()
        }
      ]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <Header 
        onSearch={(term) => console.log('Search:', term)}
        onClearAll={() => console.log('Clear all filters')}
        hasActiveFilters={true}
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🤖 Scout AI Assistant</h1>
            <p className="text-lg text-gray-600 mt-2">Unified LearnBot + RetailBot + Vibe TestBot Intelligence</p>
          </div>
          <DateRangePicker 
            onDateChange={(range) => console.log('Date range changed:', range)}
          />
        </div>

        {/* AI Agent Launcher */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Launch AI Assistants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <button
                onClick={() => { setActiveAgent('LearnBot'); setIsAIPanelOpen(true); }}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <div className="font-medium text-blue-900">LearnBot</div>
                    <div className="text-sm text-blue-700">Dashboard tutorials & help</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setActiveAgent('RetailBot'); setIsAIPanelOpen(true); }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <div className="font-medium text-green-900">RetailBot</div>
                    <div className="text-sm text-green-700">FMCG analytics specialist</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setActiveAgent('Vibe TestBot'); setIsAIPanelOpen(true); }}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="font-medium text-purple-900">Vibe TestBot</div>
                    <div className="text-sm text-purple-700">AI code QA assistant</div>
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chat Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Scout AI Combo</h3>
                      <p className="text-sm text-gray-600">Unified AI assistant platform</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setVoiceMode(!voiceMode)}
                    className={`p-2 rounded-lg transition-colors ${
                      voiceMode 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {voiceMode ? '🔴' : '🎤'}
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm px-4 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your retail data..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send
                  </button>
                </div>
                
                {/* Quick Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'Show top performing products',
                    'Analyze customer segments',
                    'Recommend promotions',
                    'Peak hours analysis'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMessage(suggestion)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Recommendations & Actions */}
          <div className="space-y-6">
            
            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Smart Recommendations</h3>
              <div className="space-y-4">
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">Inventory Optimization</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Increase beverage stock by 15% for weekend periods. Expected ROI: +₱45,000/month
                  </p>
                  <button className="mt-2 text-sm text-green-600 font-medium hover:text-green-800">
                    Apply Recommendation →
                  </button>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">Customer Targeting</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Launch loyalty program for Premium Loyalists segment. Potential retention: +8%
                  </p>
                  <button className="mt-2 text-sm text-blue-600 font-medium hover:text-blue-800">
                    View Campaign Details →
                  </button>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">Promotional Strategy</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Bundle promotion: Shampoo + Conditioner. Cross-sell opportunity: 65% confidence
                  </p>
                  <button className="mt-2 text-sm text-purple-600 font-medium hover:text-purple-800">
                    Create Bundle →
                  </button>
                </div>

              </div>
            </div>

            {/* Next Best Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Next Best Actions</h3>
              <div className="space-y-3">
                
                {[
                  { action: 'Review Saturday 2-4 PM staffing', priority: 'High', color: 'bg-red-100 text-red-800' },
                  { action: 'Analyze GCash payment growth', priority: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
                  { action: 'Expand Davao region presence', priority: 'Low', color: 'bg-green-100 text-green-800' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{item.action}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                      {item.priority}
                    </span>
                  </div>
                ))}

              </div>
            </div>

            {/* Recent Queries Log */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Recent Queries</h3>
              <div className="space-y-2">
                
                {[
                  { query: 'Top performing products this week', time: '2 min ago' },
                  { query: 'Customer segment analysis', time: '5 min ago' },
                  { query: 'Peak shopping hours by region', time: '12 min ago' },
                  { query: 'Payment method trends', time: '18 min ago' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="text-sm text-gray-700 flex-1">{item.query}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>

        {/* Advanced AI Features */}
        <div className="mt-8">
          <CollapsibleSection
            title="Advanced AI Analytics"
            subtitle="Predictive modeling and advanced insights"
            icon="🧠"
            badge="Beta"
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🔮</span>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-2">Demand Forecasting</h4>
                  <p className="text-sm text-purple-700 mb-4">
                    AI-powered prediction of demand patterns for the next 30 days
                  </p>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600">
                    Generate Forecast
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Customer Churn Prediction</h4>
                  <p className="text-sm text-green-700 mb-4">
                    Identify customers at risk of churning and suggest retention strategies
                  </p>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600">
                    Analyze Churn Risk
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Price Optimization</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    AI-recommended pricing strategies to maximize revenue and margin
                  </p>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
                    Optimize Pricing
                  </button>
                </div>
              </div>

            </div>
          </CollapsibleSection>
        </div>

        {/* Footer */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Scout AI Combo - LearnBot + RetailBot + Vibe TestBot v2.0</p>
            <p className="mt-1">Powered by Azure OpenAI and InsightPulseAI orchestration</p>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        activeAgent={activeAgent}
        context={{
          page: 'ai-assist',
          data: { chatMessages, voiceMode }
        }}
      />
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: 'Scout AI Combo - Unified AI Assistant',
      description: 'LearnBot + RetailBot + Vibe TestBot integrated AI assistance platform'
    },
    revalidate: 60
  };
}