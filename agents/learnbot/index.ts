// LearnBot - Interactive Tutorial and Learning Agent
import { 
  LearnBot as LearnBotType, 
  AgentResponse, 
  AgentMessage,
  MessageType 
} from '../../packages/types/src';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'focus';
  nextStep?: string;
}

export interface TutorialModule {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: TutorialStep[];
  prerequisites?: string[];
}

export class LearnBot implements LearnBotType {
  public id = 'learnbot_001';
  public name = 'LearnBot';
  public version = '1.0.0';
  public type = 'tutorial' as const;
  public category = 'education' as const;
  public status = 'active' as const;
  public capabilities: [
    'interactive_tooltips',
    'step_by_step_guidance',
    'feature_explanations',
    'keyboard_shortcuts'
  ] = [
    'interactive_tooltips',
    'step_by_step_guidance',
    'feature_explanations',
    'keyboard_shortcuts'
  ];

  public tutorialModules = {
    dashboardNavigation: true,
    chartInteraction: true,
    filterUsage: true,
    reportGeneration: true
  };

  public configuration = {
    enabled: true,
    autoStart: false,
    priority: 5,
    timeout: 60000,
    retryCount: 2,
    dependencies: [],
    environment: {
      showKeyboardShortcuts: true,
      autoProgress: false,
      highlightColor: '#3B82F6'
    }
  };

  public metadata = {
    description: 'AI-powered learning assistant for Scout Analytics dashboard',
    author: 'Scout Analytics Team',
    created: '2024-01-01T00:00:00Z',
    updated: new Date().toISOString(),
    documentation: 'https://docs.scout-analytics.com/agents/learnbot',
    tags: ['tutorial', 'learning', 'onboarding', 'help']
  };

  private tutorialModules_: TutorialModule[] = [
    {
      id: 'dashboard_navigation',
      name: 'Dashboard Navigation',
      description: 'Learn how to navigate the Scout Analytics dashboard',
      difficulty: 'beginner',
      estimatedTime: '5 minutes',
      steps: [
        {
          id: 'step_1',
          title: 'Welcome to Scout Analytics',
          description: 'This is your main dashboard where you can view key retail metrics and insights.',
          target: '.dashboard-container',
          position: 'top'
        },
        {
          id: 'step_2',
          title: 'Navigation Menu',
          description: 'Use this menu to switch between different sections of the dashboard.',
          target: '.nav-menu',
          position: 'right',
          nextStep: 'step_3'
        },
        {
          id: 'step_3',
          title: 'KPI Overview',
          description: 'These cards show your most important business metrics at a glance.',
          target: '.kpi-cards',
          position: 'bottom',
          nextStep: 'step_4'
        },
        {
          id: 'step_4',
          title: 'Date Range Selector',
          description: 'Change the time period for your analysis using this date picker.',
          target: '.date-range-picker',
          position: 'left',
          action: 'click'
        }
      ]
    },
    {
      id: 'chart_interaction',
      name: 'Chart Interaction',
      description: 'Master interactive chart features and data exploration',
      difficulty: 'intermediate',
      estimatedTime: '7 minutes',
      prerequisites: ['dashboard_navigation'],
      steps: [
        {
          id: 'chart_step_1',
          title: 'Interactive Charts',
          description: 'Charts in Scout Analytics are fully interactive. Hover over data points to see details.',
          target: '.chart-container',
          position: 'top',
          action: 'hover'
        },
        {
          id: 'chart_step_2',
          title: 'Zoom and Pan',
          description: 'Use mouse wheel to zoom and drag to pan on time series charts.',
          target: '.line-chart',
          position: 'bottom'
        },
        {
          id: 'chart_step_3',
          title: 'Legend Interaction',
          description: 'Click legend items to show/hide data series.',
          target: '.chart-legend',
          position: 'right',
          action: 'click'
        },
        {
          id: 'chart_step_4',
          title: 'Export Options',
          description: 'Right-click on any chart to access export options (PNG, SVG, CSV).',
          target: '.chart-export',
          position: 'left'
        }
      ]
    },
    {
      id: 'filter_usage',
      name: 'Advanced Filtering',
      description: 'Learn to use filters to analyze specific data segments',
      difficulty: 'intermediate',
      estimatedTime: '6 minutes',
      steps: [
        {
          id: 'filter_step_1',
          title: 'Filter Panel',
          description: 'Access advanced filters to narrow down your data analysis.',
          target: '.filter-panel',
          position: 'right'
        },
        {
          id: 'filter_step_2',
          title: 'Category Filters',
          description: 'Filter by product categories to focus on specific market segments.',
          target: '.category-filter',
          position: 'bottom',
          action: 'click'
        },
        {
          id: 'filter_step_3',
          title: 'Region Selection',
          description: 'Analyze performance by geographic regions.',
          target: '.region-filter',
          position: 'top'
        },
        {
          id: 'filter_step_4',
          title: 'Save Filter Presets',
          description: 'Save frequently used filter combinations for quick access.',
          target: '.save-filter-btn',
          position: 'left',
          action: 'click'
        }
      ]
    },
    {
      id: 'report_generation',
      name: 'Report Generation',
      description: 'Create and customize analytical reports',
      difficulty: 'advanced',
      estimatedTime: '10 minutes',
      prerequisites: ['dashboard_navigation', 'filter_usage'],
      steps: [
        {
          id: 'report_step_1',
          title: 'Report Builder',
          description: 'Access the report builder to create custom analytics reports.',
          target: '.report-builder',
          position: 'top'
        },
        {
          id: 'report_step_2',
          title: 'Add Visualizations',
          description: 'Drag and drop charts to build your custom report layout.',
          target: '.chart-library',
          position: 'right'
        },
        {
          id: 'report_step_3',
          title: 'Schedule Reports',
          description: 'Set up automated report delivery to stakeholders.',
          target: '.schedule-report',
          position: 'bottom'
        }
      ]
    }
  ];

  /**
   * Start an interactive tutorial
   */
  async startTutorial(moduleId: string): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      const module = this.tutorialModules_.find(m => m.id === moduleId);
      if (!module) {
        throw new Error(`Tutorial module ${moduleId} not found`);
      }

      // Check prerequisites
      if (module.prerequisites) {
        const missingPrereqs = module.prerequisites.filter(prereq => 
          !this.isModuleCompleted(prereq)
        );
        
        if (missingPrereqs.length > 0) {
          return {
            success: false,
            agentId: this.id,
            message: `Prerequisites not met: ${missingPrereqs.join(', ')}`,
            timestamp: new Date().toISOString(),
            executionTime: Date.now() - startTime
          };
        }
      }

      return {
        success: true,
        agentId: this.id,
        data: { 
          module: module,
          currentStep: 0,
          totalSteps: module.steps.length
        },
        message: `Started tutorial: ${module.name}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        agentId: this.id,
        message: `Failed to start tutorial: ${error}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Get contextual help for UI elements
   */
  async getContextualHelp(element: string): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      const helpContent = this.getHelpContent(element);

      return {
        success: true,
        agentId: this.id,
        data: helpContent,
        message: `Contextual help provided for ${element}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        agentId: this.id,
        message: `Failed to get contextual help: ${error}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Show keyboard shortcuts
   */
  async showKeyboardShortcuts(): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      const shortcuts = [
        { key: 'Ctrl + D', description: 'Open date range picker' },
        { key: 'Ctrl + F', description: 'Open filter panel' },
        { key: 'Ctrl + E', description: 'Export current view' },
        { key: 'Ctrl + R', description: 'Refresh data' },
        { key: 'Ctrl + H', description: 'Show/hide help overlay' },
        { key: 'Ctrl + S', description: 'Save current view' },
        { key: 'Esc', description: 'Close modals/overlays' },
        { key: '?', description: 'Show this help' }
      ];

      return {
        success: true,
        agentId: this.id,
        data: { shortcuts },
        message: 'Keyboard shortcuts displayed',
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        agentId: this.id,
        message: `Failed to show shortcuts: ${error}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Generate interactive tooltip content
   */
  async generateTooltip(elementId: string, context: any): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      const tooltip = this.createTooltipContent(elementId, context);

      return {
        success: true,
        agentId: this.id,
        data: tooltip,
        message: `Tooltip generated for ${elementId}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        agentId: this.id,
        message: `Failed to generate tooltip: ${error}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Track learning progress
   */
  async trackProgress(moduleId: string, stepId: string, completed: boolean): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      // Store progress in localStorage or send to backend
      const progressKey = `learnbot_progress_${moduleId}`;
      const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      
      existingProgress[stepId] = {
        completed,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(progressKey, JSON.stringify(existingProgress));

      return {
        success: true,
        agentId: this.id,
        data: { moduleId, stepId, completed, progress: existingProgress },
        message: `Progress tracked for ${moduleId}:${stepId}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        agentId: this.id,
        message: `Failed to track progress: ${error}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  private getHelpContent(element: string): any {
    const helpMap: { [key: string]: any } = {
      'kpi-card': {
        title: 'KPI Card',
        description: 'Displays key performance indicators with trend arrows and percentage changes.',
        tips: [
          'Green arrows indicate positive trends',
          'Click for detailed breakdown',
          'Hover for additional context'
        ]
      },
      'chart': {
        title: 'Interactive Chart',
        description: 'Visualizes data trends and patterns over time.',
        tips: [
          'Hover over data points for details',
          'Use mouse wheel to zoom',
          'Right-click to export'
        ]
      },
      'filter': {
        title: 'Data Filter',
        description: 'Narrows down data based on selected criteria.',
        tips: [
          'Multiple selections allowed',
          'Use Ctrl+Click for multi-select',
          'Clear all to reset'
        ]
      }
    };

    return helpMap[element] || {
      title: 'Help',
      description: 'No specific help available for this element.',
      tips: ['Contact support for assistance']
    };
  }

  private createTooltipContent(elementId: string, context: any): any {
    return {
      id: `tooltip_${elementId}`,
      title: context.title || 'Information',
      content: context.description || 'Additional information about this element.',
      position: context.position || 'top',
      showArrow: true,
      interactive: true,
      delay: 500
    };
  }

  private isModuleCompleted(moduleId: string): boolean {
    const progressKey = `learnbot_progress_${moduleId}`;
    const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    const module = this.tutorialModules_.find(m => m.id === moduleId);
    if (!module) return false;

    return module.steps.every(step => progress[step.id]?.completed);
  }

  /**
   * Get available tutorial modules
   */
  getTutorialModules(): TutorialModule[] {
    return this.tutorialModules_;
  }

  /**
   * Create learning message
   */
  createLearningMessage(type: MessageType, content: string): AgentMessage {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      agentId: this.id,
      type,
      content,
      timestamp: new Date().toISOString(),
      priority: 'medium',
      tags: ['learning', 'tutorial']
    };
  }
}

// Export singleton instance
export const learnBot = new LearnBot();
export default learnBot;