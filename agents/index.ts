// Scout Analytics AI Agents Orchestrator
import { retailBot } from './retailbot';
import { learnBot } from './learnbot';
import { vibeTestBot } from './vibetest';
import { 
  AgentOrchestration, 
  AgentStep, 
  WorkflowTrigger,
  AgentResponse 
} from '../packages/types/src';

export class AgentOrchestrator {
  private agents = {
    retailbot: retailBot,
    learnbot: learnBot,
    vibetest: vibeTestBot
  };

  private workflows: AgentOrchestration['workflow'][] = [
    {
      id: 'data_quality_pipeline',
      name: 'Data Quality Pipeline',
      agents: ['retailbot', 'vibetest'],
      sequence: [
        {
          id: 'step_1',
          agentId: 'retailbot',
          action: 'checkDataQuality',
          timeout: 30000,
          retryPolicy: { maxRetries: 2, backoffStrategy: 'exponential' }
        },
        {
          id: 'step_2',
          agentId: 'vibetest',
          action: 'runRealTimeProbing',
          timeout: 15000,
          retryPolicy: { maxRetries: 1, backoffStrategy: 'linear' }
        }
      ],
      triggers: [
        { type: 'schedule', config: { cron: '0 */4 * * *' }, enabled: true },
        { type: 'event', config: { event: 'data_updated' }, enabled: true }
      ]
    },
    {
      id: 'user_onboarding',
      name: 'User Onboarding Workflow',
      agents: ['learnbot'],
      sequence: [
        {
          id: 'welcome_step',
          agentId: 'learnbot',
          action: 'startTutorial',
          input: { moduleId: 'dashboard_navigation' },
          timeout: 60000,
          retryPolicy: { maxRetries: 1, backoffStrategy: 'linear' }
        }
      ],
      triggers: [
        { type: 'event', config: { event: 'first_login' }, enabled: true }
      ]
    },
    {
      id: 'performance_monitoring',
      name: 'Continuous Performance Monitoring',
      agents: ['vibetest', 'retailbot'],
      sequence: [
        {
          id: 'performance_check',
          agentId: 'vibetest',
          action: 'monitorPerformance',
          timeout: 20000,
          retryPolicy: { maxRetries: 2, backoffStrategy: 'exponential' }
        },
        {
          id: 'trend_analysis',
          agentId: 'retailbot',
          action: 'analyzeTrends',
          conditions: [
            { field: 'performance.loadTime', operator: 'greater_than', value: 3000 }
          ],
          timeout: 25000,
          retryPolicy: { maxRetries: 1, backoffStrategy: 'linear' }
        }
      ],
      triggers: [
        { type: 'schedule', config: { interval: 300000 }, enabled: true }, // Every 5 minutes
        { type: 'event', config: { event: 'performance_degradation' }, enabled: true }
      ]
    }
  ];

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, input?: any): Promise<AgentResponse> {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const startTime = Date.now();
    const results: any[] = [];

    try {
      for (const step of workflow.sequence) {
        const agent = this.agents[step.agentId as keyof typeof this.agents];
        if (!agent) {
          throw new Error(`Agent ${step.agentId} not found`);
        }

        // Check conditions if any
        if (step.conditions && !this.evaluateConditions(step.conditions, input)) {
          results.push({
            stepId: step.id,
            agentId: step.agentId,
            status: 'skipped',
            timestamp: new Date().toISOString()
          });
          continue;
        }

        // Execute agent action
        const stepInput = step.input || input;
        let result: AgentResponse;

        switch (step.action) {
          case 'checkDataQuality':
            result = await (agent as any).checkDataQuality(stepInput);
            break;
          case 'runRealTimeProbing':
            result = await (agent as any).runRealTimeProbing();
            break;
          case 'startTutorial':
            result = await (agent as any).startTutorial(stepInput?.moduleId);
            break;
          case 'monitorPerformance':
            result = await (agent as any).monitorPerformance();
            break;
          case 'analyzeTrends':
            result = await (agent as any).analyzeTrends(stepInput);
            break;
          default:
            throw new Error(`Unknown action: ${step.action}`);
        }

        results.push({
          stepId: step.id,
          agentId: step.agentId,
          status: result.success ? 'success' : 'failure',
          output: result.data,
          error: result.success ? undefined : result.message,
          duration: result.executionTime,
          timestamp: result.timestamp
        });

        // If step failed and no retries left, stop workflow
        if (!result.success) {
          break;
        }
      }

      return {
        success: true,
        agentId: 'orchestrator',
        data: {
          workflow: workflow.name,
          steps: results.length,
          completed: results.filter(r => r.status === 'success').length
        },
        message: `Workflow ${workflow.name} completed`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        agentId: 'orchestrator',
        message: `Workflow execution failed: ${error}`,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): any {
    return this.agents[agentId as keyof typeof this.agents];
  }

  /**
   * Get all agents
   */
  getAllAgents(): any[] {
    return Object.values(this.agents);
  }

  /**
   * Get workflows
   */
  getWorkflows(): AgentOrchestration['workflow'][] {
    return this.workflows;
  }

  /**
   * Add workflow
   */
  addWorkflow(workflow: AgentOrchestration['workflow']): void {
    this.workflows.push(workflow);
  }

  /**
   * Trigger workflow by event
   */
  async triggerByEvent(event: string, data?: any): Promise<AgentResponse[]> {
    const triggeredWorkflows = this.workflows.filter(w => 
      w.triggers.some(t => 
        t.type === 'event' && 
        t.config.event === event && 
        t.enabled
      )
    );

    const results: AgentResponse[] = [];
    for (const workflow of triggeredWorkflows) {
      const result = await this.executeWorkflow(workflow.id, data);
      results.push(result);
    }

    return results;
  }

  /**
   * Start scheduled workflows
   */
  startScheduler(): void {
    this.workflows.forEach(workflow => {
      workflow.triggers.forEach(trigger => {
        if (trigger.type === 'schedule' && trigger.enabled) {
          if (trigger.config.interval) {
            setInterval(() => {
              this.executeWorkflow(workflow.id);
            }, trigger.config.interval);
          }
          // Cron scheduling would require additional library
        }
      });
    });
  }

  private evaluateConditions(conditions: any[], input: any): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getNestedValue(input, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'greater_than':
          return fieldValue > condition.value;
        case 'less_than':
          return fieldValue < condition.value;
        case 'contains':
          return String(fieldValue).includes(condition.value);
        default:
          return false;
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator();

// Export individual agents
export { retailBot, learnBot, vibeTestBot };

// Auto-start scheduler
if (typeof window !== 'undefined') {
  agentOrchestrator.startScheduler();
}