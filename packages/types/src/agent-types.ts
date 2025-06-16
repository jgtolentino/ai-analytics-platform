// AI Agent type definitions for Scout Analytics

export interface BaseAgent {
  id: string;
  name: string;
  version: string;
  type: AgentType;
  category: AgentCategory;
  status: AgentStatus;
  capabilities: string[];
  configuration: AgentConfig;
  metadata: AgentMetadata;
}

export type AgentType = 
  | 'validator'
  | 'tutorial'
  | 'qa'
  | 'env_sync'
  | 'analytics'
  | 'recommendation'
  | 'monitoring';

export type AgentCategory = 
  | 'analytics'
  | 'education'
  | 'testing'
  | 'infrastructure'
  | 'customer_service'
  | 'optimization';

export type AgentStatus = 
  | 'active'
  | 'inactive'
  | 'error'
  | 'maintenance'
  | 'updating';

export interface AgentConfig {
  enabled: boolean;
  autoStart: boolean;
  priority: number;
  timeout: number;
  retryCount: number;
  dependencies: string[];
  environment: Record<string, any>;
}

export interface AgentMetadata {
  description: string;
  author: string;
  created: string;
  updated: string;
  documentation: string;
  tags: string[];
}

export interface RetailBot extends BaseAgent {
  type: 'validator';
  category: 'analytics';
  capabilities: [
    'kpi_validation',
    'trend_analysis', 
    'recommendation_engine',
    'data_quality_checks'
  ];
  specializations: {
    fmcgAnalytics: boolean;
    priceOptimization: boolean;
    demandForecasting: boolean;
    customerSegmentation: boolean;
  };
}

export interface LearnBot extends BaseAgent {
  type: 'tutorial';
  category: 'education';
  capabilities: [
    'interactive_tooltips',
    'step_by_step_guidance',
    'feature_explanations',
    'keyboard_shortcuts'
  ];
  tutorialModules: {
    dashboardNavigation: boolean;
    chartInteraction: boolean;
    filterUsage: boolean;
    reportGeneration: boolean;
  };
}

export interface VibeTestBot extends BaseAgent {
  type: 'qa';
  category: 'testing';
  capabilities: [
    'real_time_probing',
    'code_quality_analysis',
    'performance_monitoring',
    'no_reload_testing'
  ];
  testingFrameworks: {
    unit: string[];
    integration: string[];
    e2e: string[];
    performance: string[];
  };
}

export interface KeyKeyAgent extends BaseAgent {
  type: 'env_sync';
  category: 'infrastructure';
  capabilities: [
    'environment_synchronization',
    'file_integrity_verification',
    'backup_and_restore',
    'metadata_logging'
  ];
  syncConfig: {
    sourceRepo: string;
    targetFiles: string[];
    backupEnabled: boolean;
    verificationMethod: 'hash' | 'checksum';
  };
}

export interface AgentMessage {
  id: string;
  agentId: string;
  type: MessageType;
  content: string;
  data?: Record<string, any>;
  timestamp: string;
  priority: MessagePriority;
  tags?: string[];
}

export type MessageType = 
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'recommendation'
  | 'insight'
  | 'tutorial'
  | 'validation';

export type MessagePriority = 'low' | 'medium' | 'high' | 'critical';

export interface AgentResponse {
  success: boolean;
  agentId: string;
  data?: any;
  message?: string;
  insights?: Insight[];
  recommendations?: Recommendation[];
  timestamp: string;
  executionTime: number;
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  relevance: number;
  data: Record<string, any>;
  tags: string[];
  actionable: boolean;
}

export type InsightType = 
  | 'trend'
  | 'anomaly'
  | 'opportunity'
  | 'risk'
  | 'correlation'
  | 'forecast';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: RecommendationType;
  priority: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  category: string;
  actionItems: ActionItem[];
  estimatedValue?: number;
  confidence: number;
}

export type RecommendationType = 
  | 'optimization'
  | 'expansion'
  | 'cost_reduction'
  | 'risk_mitigation'
  | 'process_improvement'
  | 'feature_enhancement';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: number;
  estimatedTime: string;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
}

export interface AgentPerformance {
  agentId: string;
  metrics: {
    uptime: number;
    responseTime: number;
    successRate: number;
    errorRate: number;
    throughput: number;
  };
  period: {
    start: string;
    end: string;
  };
  trends: {
    metric: string;
    values: number[];
    trend: 'improving' | 'declining' | 'stable';
  }[];
}

export interface AgentOrchestration {
  workflow: {
    id: string;
    name: string;
    agents: string[];
    sequence: AgentStep[];
    triggers: WorkflowTrigger[];
  };
  execution: {
    id: string;
    workflowId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startTime: string;
    endTime?: string;
    results: AgentStepResult[];
  };
}

export interface AgentStep {
  id: string;
  agentId: string;
  action: string;
  input?: Record<string, any>;
  conditions?: StepCondition[];
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
  };
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'manual';
  config: Record<string, any>;
  enabled: boolean;
}

export interface StepCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface AgentStepResult {
  stepId: string;
  agentId: string;
  status: 'success' | 'failure' | 'skipped';
  output?: any;
  error?: string;
  duration: number;
  timestamp: string;
}