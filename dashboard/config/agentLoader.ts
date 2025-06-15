// Agent Loader Configuration for Scout AI Combo
// Dynamically loads and initializes the unified AI assistant system
// Version: 1.2

export interface AgentConfig {
  name: string;
  version: string;
  role: string;
  capabilities: string[];
  ui: {
    position: string;
    style: string;
    auto_show: string;
  };
  triggers: string[];
}

export interface AgentLoader {
  agents: AgentConfig[];
  initialized: boolean;
  loadedAt: Date;
}

class ScoutAgentLoader {
  private static instance: ScoutAgentLoader;
  private agentConfigs: AgentConfig[] = [];
  private initialized = false;

  private constructor() {}

  public static getInstance(): ScoutAgentLoader {
    if (!ScoutAgentLoader.instance) {
      ScoutAgentLoader.instance = new ScoutAgentLoader();
    }
    return ScoutAgentLoader.instance;
  }

  // Initialize all agents from the scout-ai-combo.yaml configuration
  public async initializeAgents(): Promise<void> {
    try {
      // Load agent configurations
      this.agentConfigs = [
        {
          name: 'Vibe TestBot',
          version: '1.2',
          role: 'Real-time error detection and patching for code and data pipelines',
          capabilities: [
            'code_qa',
            'data_pipeline_validation', 
            'real_time_monitoring',
            'fix_replay_generation'
          ],
          ui: {
            position: 'side_panel',
            style: 'terminal_embedded',
            auto_show: 'on_error'
          },
          triggers: ['cli_command', 'file_change', 'ci_commit', 'dashboard_error']
        },
        {
          name: 'LearnBot',
          version: '2.1',
          role: 'Interactive dashboard tutorial & assistant for user onboarding',
          capabilities: [
            'interactive_tutorials',
            'contextual_assistance',
            'dashboard_navigation',
            'ai_prompt_optimization'
          ],
          ui: {
            position: 'floating_panel',
            style: 'chat_interface',
            auto_show: 'on_help_request'
          },
          triggers: ['first_login', 'help_request', 'question_asked', 'tutorial_step']
        },
        {
          name: 'RetailBot',
          version: '3.0',
          role: 'Domain-specific QA engine for FMCG and retail analytics',
          capabilities: [
            'fmcg_domain_validation',
            'transaction_analysis',
            'basket_logic_qa',
            'revenue_reconciliation'
          ],
          ui: {
            position: 'overlay_widget',
            style: 'alert_system',
            auto_show: 'on_data_issue'
          },
          triggers: ['table_detected: transactions', 'schema_match: fmcg', 'data_anomaly', 'kpi_calculation']
        }
      ];

      this.initialized = true;
      console.log(`[AgentLoader] Successfully initialized ${this.agentConfigs.length} AI agents`);
      
      // Initialize agent event listeners
      this.setupEventListeners();
      
    } catch (error) {
      console.error('[AgentLoader] Failed to initialize agents:', error);
      throw error;
    }
  }

  // Set up event listeners for agent triggers
  private setupEventListeners(): void {
    // Vibe TestBot triggers
    document.addEventListener('dashboard_error', () => this.triggerAgent('Vibe TestBot'));
    document.addEventListener('file_change', () => this.triggerAgent('Vibe TestBot'));

    // LearnBot triggers  
    document.addEventListener('help_request', () => this.triggerAgent('LearnBot'));
    document.addEventListener('first_login', () => this.triggerAgent('LearnBot'));

    // RetailBot triggers
    document.addEventListener('data_anomaly', () => this.triggerAgent('RetailBot'));
    document.addEventListener('kpi_calculation', () => this.triggerAgent('RetailBot'));

    console.log('[AgentLoader] Event listeners configured for all agents');
  }

  // Trigger specific agent
  private triggerAgent(agentName: string): void {
    const agent = this.agentConfigs.find(a => a.name === agentName);
    if (agent) {
      console.log(`[AgentLoader] Triggering ${agentName} with ${agent.ui.style} interface`);
      
      // Dispatch custom event for agent activation
      const event = new CustomEvent('agent_activated', {
        detail: { agent: agent.name, ui: agent.ui }
      });
      document.dispatchEvent(event);
    }
  }

  // Get all loaded agents
  public getAgents(): AgentConfig[] {
    return this.agentConfigs;
  }

  // Get agent by name
  public getAgent(name: string): AgentConfig | undefined {
    return this.agentConfigs.find(agent => agent.name === name);
  }

  // Check if agents are initialized
  public isInitialized(): boolean {
    return this.initialized;
  }

  // Get agent status
  public getStatus(): AgentLoader {
    return {
      agents: this.agentConfigs,
      initialized: this.initialized,
      loadedAt: new Date()
    };
  }
}

// Export singleton instance
export const agentLoader = ScoutAgentLoader.getInstance();

// Auto-initialize on import (for Next.js pages)
if (typeof window !== 'undefined') {
  agentLoader.initializeAgents().catch(console.error);
}

// Reference to scout-ai-combo.yaml configuration (loaded at runtime)
// import '../../agents/scout-ai-combo.yaml';

export default agentLoader;