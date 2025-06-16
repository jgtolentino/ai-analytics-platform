// Scout Analytics Landing Page - Cruip Layout Integration
'use client';

import { useState } from 'react';
import { Button, Card, Badge } from '@scout/ui';
import { Navigation } from '@scout/ui';
import { useFilterStore } from '../stores/filterStore';
import { ErrorBoundary, SafeComponent } from '../components/ErrorBoundary';
import { fallbackStats, fallbackFeatures, systemStatus, isMinimalMode } from '../lib/fallback-data';

const navigationItems = [
  { id: 'home', label: 'Home', href: '#home', active: true },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'analytics', label: 'Analytics', href: '#analytics' },
  { id: 'ai-agents', label: 'AI Agents', href: '#ai-agents' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];

const features = [
  {
    title: 'Real-time Analytics',
    description: 'Monitor your retail performance with live data updates and interactive dashboards.',
    icon: '📊',
    badge: 'Core'
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations from our RetailBot, LearnBot, and VibeTestBot agents.',
    icon: '🤖',
    badge: 'AI'
  },
  {
    title: 'Interactive Charts',
    description: 'Explore data with SKU networks, Sankey diagrams, and customizable visualizations.',
    icon: '📈',
    badge: 'Visual'
  },
  {
    title: 'Advanced Filtering',
    description: 'Drill down into specific segments with powerful filter combinations.',
    icon: '🔍',
    badge: 'Pro'
  },
  {
    title: 'Performance Monitoring',
    description: 'Continuous QA testing and performance optimization with VibeTestBot.',
    icon: '⚡',
    badge: 'DevOps'
  },
  {
    title: 'Learning Assistant',
    description: 'Interactive tutorials and contextual help with LearnBot guidance.',
    icon: '🎓',
    badge: 'Education'
  }
];

// Use fallback stats in minimal mode
const stats = isMinimalMode() ? fallbackStats : [
  { label: 'Active Users', value: '10,000+', change: '+12%' },
  { label: 'Data Points', value: '50M+', change: '+25%' },
  { label: 'Insights Generated', value: '1M+', change: '+18%' },
  { label: 'Accuracy', value: '99.7%', change: '+0.3%' }
];

export default function LandingPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const { dateRange, setDateRange } = useFilterStore();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
      {/* Site header */}
      <header className="absolute w-full z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Site branding */}
            <div className="shrink-0 mr-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Scout Analytics</span>
                <Badge variant="success" size="sm">v3.1.0</Badge>
              </div>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex md:grow">
              <ul className="flex grow justify-end flex-wrap items-center">
                <li>
                  <a href="#features" className="font-medium text-sm text-slate-600 hover:text-gray-900 px-4 py-2 flex items-center transition duration-150 ease-in-out">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#ai-agents" className="font-medium text-sm text-slate-600 hover:text-gray-900 px-4 py-2 flex items-center transition duration-150 ease-in-out">
                    AI Agents
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="font-medium text-sm text-slate-600 hover:text-gray-900 px-4 py-2 flex items-center transition duration-150 ease-in-out">
                    Analytics
                  </a>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="ml-3">Sign In</Button>
                </li>
                <li>
                  <Button variant="primary" size="sm" className="ml-3">Get Started</Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="grow">
        {/* Hero */}
        <section className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 pointer-events-none" aria-hidden="true"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-20 md:pt-40 md:pb-32">
              {/* Hero content */}
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="h1 mb-6 font-extrabold text-5xl md:text-6xl leading-tight">
                  Next-Generation
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"> Retail Analytics</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10">
                  Powered by AI agents, interactive visualizations, and real-time insights. 
                  Transform your retail data into actionable intelligence.
                </p>
                
                {/* CTA buttons */}
                <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Start Free Trial
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <svg className="w-3 h-3 fill-current shrink-0 mr-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="m3.427 8.49 3.396-3.396A.75.75 0 0 1 7.909 5l-.094.083L4.5 8.409a.75.75 0 0 1-1.073-1.049z"/>
                        <path d="M3.475 9.467a.75.75 0 0 1-.042-1.024L6.75 5.159a.75.75 0 0 1 1.049.042l.083.094a.75.75 0 0 1-.042 1.024L4.524 9.593a.75.75 0 0 1-1.049-.042z"/>
                      </svg>
                      Watch Demo
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-600 uppercase tracking-wider font-medium">{stat.label}</div>
                      <Badge variant="success" size="sm" className="mt-2">
                        {stat.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Analytics Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand your retail business, from AI-powered insights 
              to interactive data exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedFeature === feature.title ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedFeature(
                  selectedFeature === feature.title ? null : feature.title
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <Badge variant="outline" size="sm">{feature.badge}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section id="ai-agents" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Your AI Assistants
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three specialized AI agents working together to enhance your analytics experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* RetailBot */}
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">RetailBot</h3>
              <Badge variant="info" className="mb-4">Analytics Validator</Badge>
              <p className="text-gray-600 mb-6">
                Validates KPIs, analyzes trends, and generates intelligent recommendations 
                for your retail operations.
              </p>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>KPI Validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Trend Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Smart Recommendations</span>
                </div>
              </div>
            </Card>

            {/* LearnBot */}
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">LearnBot</h3>
              <Badge variant="warning" className="mb-4">Tutorial Assistant</Badge>
              <p className="text-gray-600 mb-6">
                Provides interactive tutorials, contextual help, and step-by-step guidance 
                for mastering the platform.
              </p>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Interactive Tutorials</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Contextual Help</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Feature Explanations</span>
                </div>
              </div>
            </Card>

            {/* VibeTestBot */}
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">VibeTestBot</h3>
              <Badge variant="error" className="mb-4">QA Monitor</Badge>
              <p className="text-gray-600 mb-6">
                Continuously monitors performance, runs real-time tests, and ensures 
                optimal system reliability.
              </p>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Real-time Probing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Performance Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Quality Analysis</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Retail Analytics?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of retailers using Scout Analytics to make data-driven decisions.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-white font-bold">Scout Analytics</span>
              </div>
              <p className="text-gray-400 text-sm">
                Next-generation retail analytics powered by AI.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Features</li>
                <li>AI Agents</li>
                <li>Analytics</li>
                <li>Integrations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Scout Analytics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}