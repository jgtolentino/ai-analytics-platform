import React from 'react';
import { GetStaticProps } from 'next';
import Layout from '../src/components/Layout';
import { VibeTestBot } from '../src/components/VibeTestBot';
import { KPICards, VibeTestBotKPIs } from '../src/components/KPICards';

interface VibePageProps {
  // Add any props you need from static generation
}

const VibePage: React.FC<VibePageProps> = () => {
  const handleFixApplied = (fix: string) => {
    console.log('Fix applied:', fix);
    // Could integrate with actual code editor or Git
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vibe TestBot</h1>
                <p className="mt-2 text-gray-600">
                  AI-powered code QA with TikTok-style fix replays
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✨ v1.2
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  🚀 Active
                </span>
              </div>
            </div>
          </div>

          {/* KPI Cards - Updated Style */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <KPICards data={VibeTestBotKPIs} />
          </div>

          {/* Vibe TestBot Component */}
          <div className="mb-8">
            <VibeTestBot 
              mode="dev"
              projectPath="/ai-analytics-platform"
              onFixApplied={handleFixApplied}
            />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Dev Mode Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Real-time error detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Inline patch suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Auto test generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Vibe mode overlay</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📹 Social Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>TikTok-style fix replays</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Shareable debugging sessions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Achievement system</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Social demo mode</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CLI Commands */}
          <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono">
            <h3 className="text-lg font-semibold text-white mb-4">📱 CLI Commands</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">$</span> vibe check
                <span className="text-gray-500 ml-4"># Start real-time coding assistance</span>
              </div>
              <div>
                <span className="text-gray-400">$</span> vibe test src/components/Dashboard.tsx
                <span className="text-gray-500 ml-4"># Generate tests for specific file</span>
              </div>
              <div>
                <span className="text-gray-400">$</span> vibe replay --share
                <span className="text-gray-500 ml-4"># Create shareable fix demonstration</span>
              </div>
              <div>
                <span className="text-gray-400">$</span> vibe ci --full-report
                <span className="text-gray-500 ml-4"># Run comprehensive CI-style check</span>
              </div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Integration Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'VS Code', status: 'connected', icon: '💚' },
                { name: 'GitHub', status: 'connected', icon: '💚' },
                { name: 'Vercel', status: 'connected', icon: '💚' },
                { name: 'Pulser CLI', status: 'active', icon: '⚡' }
              ].map((integration) => (
                <div key={integration.name} className="text-center p-3 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">{integration.icon}</div>
                  <div className="font-medium text-gray-900">{integration.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{integration.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60, // Revalidate every minute
  };
};

export default VibePage;