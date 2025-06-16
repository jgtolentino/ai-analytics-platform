// Scout Analytics v3.3.0 - Main Page with Advanced Insights + BrandBot Integration
import AdvancedInsightsPanel from '../src/components/ScoutAnalytics/AdvancedInsightsPanel';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Scout Analytics v3.3.0</h1>
                <p className="text-sm text-gray-600">AI-Powered Retail Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Production Ready
              </div>
              <a 
                href="https://scout-5x6jqhv2g-jakes-projects-e9f46c30.vercel.app" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center text-green-700">
              <span className="mr-2">✅</span> Brand Dictionary Active
            </div>
            <div className="flex items-center text-green-700">
              <span className="mr-2">✅</span> Emotional Context Analysis
            </div>
            <div className="flex items-center text-green-700">
              <span className="mr-2">✅</span> Bundling Opportunities Engine
            </div>
            <div className="flex items-center text-green-700">
              <span className="mr-2">✅</span> Advanced Insights Panel
            </div>
            <div className="flex items-center text-green-700">
              <span className="mr-2">🧠</span> BrandBot v1.0 Active
            </div>
            <div className="flex items-center text-green-700">
              <span className="mr-2">🔄</span> Dual-DB Architecture
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AdvancedInsightsPanel />

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              Scout Analytics v3.3.0 | Dual-DB Architecture + Agent-Aware Analytics
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span>🎨 Brand Dictionary with Color Psychology</span>
              <span>🧠 BrandBot AI Agent with Dual-DB Routing</span>
              <span>📦 AI-Driven Bundling Opportunities</span>
              <span>🔍 QA Audit Chain (Caca → Claudia → Dash)</span>
            </div>
            <p className="mt-2 text-xs">
              Powered by Next.js 14, TypeScript, Tailwind CSS | 
              Ready for Production Deployment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}