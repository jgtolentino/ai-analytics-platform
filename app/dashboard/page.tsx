// Scout Analytics v3.3.0 - Main Dashboard
import AdvancedInsightsPanel from '../../src/components/ScoutAnalytics/AdvancedInsightsPanel';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header - No Marketing Content */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Scout Analytics</h1>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <AdvancedInsightsPanel />
    </div>
  );
}