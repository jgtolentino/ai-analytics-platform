// Safe Mode AI Agents for v3.2.0 Production
'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@scout/ui';
import { ErrorBoundary, SafeComponent } from '../app/components/ErrorBoundary';

interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'fallback';
  enabled: boolean;
  lastResponse?: string;
  error?: string;
}

const defaultAgents: AgentStatus[] = [
  {
    id: 'retailbot',
    name: 'RetailBot',
    status: 'inactive',
    enabled: true
  },
  {
    id: 'learnbot',
    name: 'LearnBot',
    status: 'inactive',
    enabled: true
  },
  {
    id: 'vibetest',
    name: 'VibeTestBot',
    status: 'inactive',
    enabled: false
  }
];

export function SafeModeAgents() {
  const [agents, setAgents] = useState<AgentStatus[]>(defaultAgents);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    // Check if AI is enabled in production
    const checkAIStatus = () => {
      const enabled = process.env.ENABLE_AI_AGENTS === 'true' && 
                     process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
      setAiEnabled(enabled);

      if (!enabled) {
        setAgents(agents.map(agent => ({ ...agent, status: 'fallback' })));
      }
    };

    checkAIStatus();
  }, []);

  const activateAgent = async (agentId: string) => {
    if (!aiEnabled) {
      setAgents(agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'fallback', lastResponse: 'AI disabled in safe mode' }
          : agent
      ));
      return;
    }

    setAgents(agents.map(agent => 
      agent.id === agentId ? { ...agent, status: 'active' } : agent
    ));

    try {
      const response = await fetch(`/api/agents/${agentId}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        throw new Error(`Failed to activate ${agentId}`);
      }

      const data = await response.json();
      
      setAgents(agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'active', lastResponse: data.message }
          : agent
      ));
    } catch (error) {
      setAgents(agents.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              status: 'error', 
              error: 'Failed to activate. Using fallback mode.',
              lastResponse: 'Stubbed response: Agent functionality simulated'
            }
          : agent
      ));
    }
  };

  const getStatusBadge = (status: AgentStatus['status']) => {
    const variants = {
      active: 'success',
      inactive: 'default',
      error: 'error',
      fallback: 'warning'
    } as const;

    return <Badge variant={variants[status]} size="sm">{status}</Badge>;
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* AI Status Header */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">AI Agent System</h3>
              <p className="text-sm text-gray-600">
                {aiEnabled ? 'AI agents are enabled' : 'Running in safe mode (AI disabled)'}
              </p>
            </div>
            <Badge variant={aiEnabled ? 'success' : 'warning'}>
              {aiEnabled ? 'Production' : 'Safe Mode'}
            </Badge>
          </div>
        </Card>

        {/* Agent Cards */}
        <div className="grid gap-4">
          {agents.map((agent) => (
            <SafeComponent key={agent.id} name={`agent-${agent.id}`}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{agent.name}</h4>
                      {getStatusBadge(agent.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      {agent.id === 'retailbot' && 'KPI validation and trend analysis'}
                      {agent.id === 'learnbot' && 'Interactive tutorials and help'}
                      {agent.id === 'vibetest' && 'QA and performance monitoring (Hidden)'}
                    </div>

                    {agent.lastResponse && (
                      <div className="text-sm bg-gray-50 p-3 rounded">
                        {agent.lastResponse}
                      </div>
                    )}

                    {agent.error && (
                      <div className="text-sm text-red-600 mt-2">
                        {agent.error}
                      </div>
                    )}
                  </div>

                  <div>
                    {agent.enabled && agent.status !== 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => activateAgent(agent.id)}
                        disabled={agent.status === 'active'}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </SafeComponent>
          ))}
        </div>

        {/* Fallback Notice */}
        {!aiEnabled && (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-amber-600">⚠️</span>
              <div className="text-sm">
                <p className="font-medium text-amber-900">Safe Mode Active</p>
                <p className="text-amber-700">
                  AI agents are running in fallback mode. Core functionality is maintained 
                  with simulated responses to ensure system stability.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
}