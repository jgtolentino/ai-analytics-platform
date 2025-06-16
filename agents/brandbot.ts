// BrandBot v1.0 - Brand Intelligence Agent
// Cloud-Native Dual-DB Architecture with Agent-Aware Schema Routing
// Scout Analytics v3.3.0

import { AzureOpenAI } from '@azure/openai';
import sql from 'mssql';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// =============================================
// Type Definitions
// =============================================

interface BrandBotContext {
  user: {
    id: string;
    tenant: string;
    roles: string[];
    permissions: string[];
  };
  session: {
    id: string;
    timestamp: Date;
    source: 'web' | 'api' | 'agent';
  };
  query: {
    intent: 'analytics' | 'insights' | 'comparison' | 'recommendation' | 'trend';
    brand?: string;
    timeframe?: string;
    demographic?: string;
    context?: string;
  };
}

interface DatabaseRoute {
  provider: 'azure_sql' | 'supabase';
  reason: string;
  confidence: number;
  fallback?: DatabaseRoute;
}

interface BrandInsight {
  id: string;
  brand_id: string;
  insight_type: string;
  content: string;
  confidence: number;
  evidence: any[];
  recommendations: string[];
  metadata: {
    source: string;
    timestamp: Date;
    model_version: string;
  };
}

interface AnalyticsQuery {
  sql: string;
  provider: 'azure_sql' | 'supabase';
  parameters: Record<string, any>;
  estimated_rows: number;
  cache_key?: string;
}

// =============================================
// BrandBot Core Agent
// =============================================

export class BrandBot {
  private azureOpenAI: AzureOpenAI;
  private sqlPool: sql.ConnectionPool | null = null;
  private supabase: SupabaseClient;
  private context: BrandBotContext;

  constructor(context: BrandBotContext) {
    this.context = context;
    
    // Initialize Azure OpenAI
    this.azureOpenAI = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      apiVersion: "2024-02-15-preview",
      deployment: "gpt-4-turbo"
    });

    // Initialize Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // SQL Server will be initialized on demand
  }

  // =============================================
  // Database Routing Intelligence
  // =============================================

  private routeQuery(query: string, intent: string): DatabaseRoute {
    const brandKeywords = ['brand', 'color', 'sentiment', 'identity', 'mood', 'recall', 'emotion'];
    const retailKeywords = ['transaction', 'sku', 'store', 'customer', 'sales', 'basket'];
    
    const hasBrandContext = brandKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
    const hasRetailContext = retailKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );

    // Route to Azure SQL for brand intelligence queries
    if (hasBrandContext && this.context.user.tenant === 'brand') {
      return {
        provider: 'azure_sql',
        reason: 'Brand intelligence data requires Azure SQL advanced analytics',
        confidence: 0.9,
        fallback: {
          provider: 'supabase',
          reason: 'Fallback to Supabase for basic brand data',
          confidence: 0.7
        }
      };
    }

    // Route to Supabase for retail analytics
    if (hasRetailContext || this.context.user.tenant === 'retail') {
      return {
        provider: 'supabase',
        reason: 'Retail analytics optimized for Supabase',
        confidence: 0.85
      };
    }

    // Default routing based on user tenant
    if (this.context.user.tenant === 'brand') {
      return {
        provider: 'azure_sql',
        reason: 'Brand tenant default to Azure SQL',
        confidence: 0.6,
        fallback: {
          provider: 'supabase',
          reason: 'Supabase fallback available',
          confidence: 0.5
        }
      };
    }

    return {
      provider: 'supabase',
      reason: 'Default retail analytics provider',
      confidence: 0.7
    };
  }

  // =============================================
  // Azure SQL Connection Management
  // =============================================

  private async getAzureSQLConnection(): Promise<sql.ConnectionPool> {
    if (this.sqlPool?.connected) {
      return this.sqlPool;
    }

    const config: sql.config = {
      server: process.env.AZURE_SQL_SERVER!,
      database: process.env.AZURE_SQL_DATABASE!,
      user: process.env.AZURE_SQL_USERNAME!,
      password: process.env.AZURE_SQL_PASSWORD!,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: true,
        trustServerCertificate: false,
        rowCollectionOnRequestCompletion: true
      }
    };

    this.sqlPool = new sql.ConnectionPool(config);
    await this.sqlPool.connect();
    
    console.log(`[BrandBot] Connected to Azure SQL for tenant: ${this.context.user.tenant}`);
    return this.sqlPool;
  }

  // =============================================
  // Natural Language to SQL Conversion
  // =============================================

  private async convertNLToSQL(query: string, provider: 'azure_sql' | 'supabase'): Promise<AnalyticsQuery> {
    const schemaContext = provider === 'azure_sql' ? 
      this.getAzureSQLSchema() : this.getSupabaseSchema();

    const prompt = `
Convert this natural language query to SQL for ${provider.toUpperCase()}:
"${query}"

Available schema:
${schemaContext}

User context:
- Tenant: ${this.context.user.tenant}
- Permissions: ${this.context.user.permissions.join(', ')}
- Brand focus: ${this.context.query.brand || 'all brands'}
- Timeframe: ${this.context.query.timeframe || 'recent'}

Requirements:
1. Use proper table aliases
2. Include WHERE clauses for RLS (user_id, tenant_id)
3. Optimize for performance with appropriate LIMIT/TOP
4. Return JSON with: sql, parameters, estimated_rows
5. Use parameterized queries to prevent injection

Return only valid JSON:
`;

    const response = await this.azureOpenAI.getChatCompletions(
      "gpt-4-turbo",
      [
        { role: "system", content: "You are an expert SQL query generator for brand analytics. Always return valid JSON." },
        { role: "user", content: prompt }
      ],
      {
        temperature: 0.1,
        maxTokens: 1000
      }
    );

    const sqlResponse = response.choices[0]?.message?.content;
    if (!sqlResponse) {
      throw new Error('Failed to generate SQL query');
    }

    try {
      const parsed = JSON.parse(sqlResponse);
      return {
        sql: parsed.sql,
        provider,
        parameters: {
          ...parsed.parameters,
          user_id: this.context.user.id,
          tenant_id: this.context.user.tenant
        },
        estimated_rows: parsed.estimated_rows || 100,
        cache_key: this.generateCacheKey(query, provider)
      };
    } catch (error) {
      throw new Error(`Invalid SQL response format: ${error}`);
    }
  }

  // =============================================
  // Query Execution with Fallback
  // =============================================

  private async executeQuery(analyticsQuery: AnalyticsQuery): Promise<any[]> {
    try {
      if (analyticsQuery.provider === 'azure_sql') {
        return await this.executeAzureSQLQuery(analyticsQuery);
      } else {
        return await this.executeSupabaseQuery(analyticsQuery);
      }
    } catch (error) {
      console.error(`[BrandBot] Query execution failed on ${analyticsQuery.provider}:`, error);
      
      // Attempt fallback if available
      const route = this.routeQuery(analyticsQuery.sql, this.context.query.intent);
      if (route.fallback) {
        console.log(`[BrandBot] Attempting fallback to ${route.fallback.provider}`);
        
        const fallbackQuery: AnalyticsQuery = {
          ...analyticsQuery,
          provider: route.fallback.provider,
          sql: await this.adaptQueryForProvider(analyticsQuery.sql, route.fallback.provider)
        };
        
        return await this.executeQuery(fallbackQuery);
      }
      
      throw error;
    }
  }

  private async executeAzureSQLQuery(query: AnalyticsQuery): Promise<any[]> {
    const pool = await this.getAzureSQLConnection();
    const request = pool.request();
    
    // Add parameters
    Object.entries(query.parameters).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.query(query.sql);
    return result.recordset;
  }

  private async executeSupabaseQuery(query: AnalyticsQuery): Promise<any[]> {
    // For Supabase, we'll use the client with RLS
    const { data, error } = await this.supabase
      .rpc('execute_dynamic_query', {
        query_sql: query.sql,
        query_params: query.parameters
      });
    
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    
    return data || [];
  }

  // =============================================
  // AI-Powered Insight Generation
  // =============================================

  private async generateInsights(data: any[], originalQuery: string): Promise<BrandInsight[]> {
    if (!data || data.length === 0) {
      return [{
        id: `insight_${Date.now()}`,
        brand_id: this.context.query.brand || 'unknown',
        insight_type: 'no_data',
        content: 'No data available for the requested analysis. Consider adjusting your query parameters or timeframe.',
        confidence: 0.9,
        evidence: [],
        recommendations: [
          'Expand the time range for analysis',
          'Check if brand data has been collected',
          'Verify access permissions for the requested data'
        ],
        metadata: {
          source: 'brandbot_v1',
          timestamp: new Date(),
          model_version: 'gpt-4-turbo'
        }
      }];
    }

    const prompt = `
Analyze this brand analytics data and generate actionable insights:

Original Query: "${originalQuery}"
Data Points: ${data.length}
Sample Data: ${JSON.stringify(data.slice(0, 5), null, 2)}

User Context:
- Tenant: ${this.context.user.tenant}
- Brand Focus: ${this.context.query.brand || 'multiple brands'}
- Intent: ${this.context.query.intent}

Generate 2-3 insights in JSON format:
[
  {
    "insight_type": "trend|opportunity|warning|strength",
    "content": "Clear, actionable insight description",
    "confidence": 0.0-1.0,
    "evidence": ["data point 1", "data point 2"],
    "recommendations": ["action 1", "action 2"]
  }
]

Focus on:
1. Emotional intelligence patterns
2. Brand perception trends
3. Competitive positioning
4. Actionable recommendations
5. Risk identification

Return only valid JSON array:
`;

    const response = await this.azureOpenAI.getChatCompletions(
      "gpt-4-turbo",
      [
        { 
          role: "system", 
          content: "You are a brand intelligence analyst. Generate strategic insights from data. Always return valid JSON." 
        },
        { role: "user", content: prompt }
      ],
      {
        temperature: 0.3,
        maxTokens: 1500
      }
    );

    const insightsResponse = response.choices[0]?.message?.content;
    if (!insightsResponse) {
      throw new Error('Failed to generate insights');
    }

    try {
      const insights = JSON.parse(insightsResponse);
      return insights.map((insight: any, index: number) => ({
        id: `insight_${Date.now()}_${index}`,
        brand_id: this.context.query.brand || 'analysis',
        insight_type: insight.insight_type,
        content: insight.content,
        confidence: insight.confidence,
        evidence: insight.evidence || [],
        recommendations: insight.recommendations || [],
        metadata: {
          source: 'brandbot_v1',
          timestamp: new Date(),
          model_version: 'gpt-4-turbo'
        }
      }));
    } catch (error) {
      throw new Error(`Invalid insights response format: ${error}`);
    }
  }

  // =============================================
  // Main Query Processing
  // =============================================

  async processQuery(query: string): Promise<{
    data: any[];
    insights: BrandInsight[];
    route: DatabaseRoute;
    performance: {
      query_time_ms: number;
      insight_time_ms: number;
      total_rows: number;
    };
  }> {
    const startTime = Date.now();
    
    try {
      // 1. Determine routing strategy
      const route = this.routeQuery(query, this.context.query.intent);
      console.log(`[BrandBot] Routing to ${route.provider}: ${route.reason}`);

      // 2. Convert natural language to SQL
      const analyticsQuery = await this.convertNLToSQL(query, route.provider);
      console.log(`[BrandBot] Generated SQL for ${route.provider}`);

      // 3. Execute query with fallback support
      const queryStartTime = Date.now();
      const data = await this.executeQuery(analyticsQuery);
      const queryTime = Date.now() - queryStartTime;

      // 4. Generate AI insights
      const insightStartTime = Date.now();
      const insights = await this.generateInsights(data, query);
      const insightTime = Date.now() - insightStartTime;

      console.log(`[BrandBot] Query completed: ${data.length} rows, ${insights.length} insights`);

      return {
        data,
        insights,
        route,
        performance: {
          query_time_ms: queryTime,
          insight_time_ms: insightTime,
          total_rows: data.length
        }
      };

    } catch (error) {
      console.error('[BrandBot] Query processing failed:', error);
      throw new Error(`BrandBot analysis failed: ${error}`);
    }
  }

  // =============================================
  // Schema Definitions
  // =============================================

  private getAzureSQLSchema(): string {
    return `
    -- Azure SQL Brand Intelligence Schema
    brand_color_profiles: brand_id, primary_hex, emotional_tone, arousal_score, valence_score, trustworthiness
    brand_sentiment_logs: brand_id, sentiment_score, emotion_category, interaction_context, demographic_segment
    brand_identity_signals: brand_id, signal_type, signal_strength, category_position, competitive_uniqueness
    brand_touchpoint_channels: brand_id, channel_type, brand_consistency, emotional_resonance, roi_contribution
    brand_asset_recall: brand_id, asset_type, unaided_recall, aided_recall, recognition_accuracy
    brand_mood_valence: brand_id, valence, arousal, brand_love, brand_excitement, measurement_timestamp
    brand_rls_tags: brand_id, tenant_id, access_level, data_classification
    vw_brandbot_analytics: Unified view with all brand metrics
    `;
  }

  private getSupabaseSchema(): string {
    return `
    -- Supabase Retail Analytics Schema
    transactions: id, store_id, customer_id, total_amount, transaction_date
    transaction_items: transaction_id, sku, quantity, unit_price, category
    customers: id, age_group, gender, location, registration_date
    stores: id, name, location, region, store_type
    products: sku, name, category, brand, unit_cost
    `;
  }

  private async adaptQueryForProvider(sql: string, provider: 'azure_sql' | 'supabase'): Promise<string> {
    // Basic query adaptation - in production, this would be more sophisticated
    if (provider === 'supabase') {
      return sql
        .replace(/brand_color_profiles/g, 'brand_dictionary')
        .replace(/TOP (\d+)/g, 'LIMIT $1')
        .replace(/GETDATE\(\)/g, 'NOW()');
    } else {
      return sql
        .replace(/brand_dictionary/g, 'brand_color_profiles')
        .replace(/LIMIT (\d+)/g, 'TOP $1')
        .replace(/NOW\(\)/g, 'GETDATE()');
    }
  }

  private generateCacheKey(query: string, provider: string): string {
    const hash = require('crypto')
      .createHash('md5')
      .update(`${query}_${provider}_${this.context.user.tenant}`)
      .digest('hex');
    return `brandbot_${hash}`;
  }

  // =============================================
  // Cleanup
  // =============================================

  async dispose(): Promise<void> {
    if (this.sqlPool) {
      await this.sqlPool.close();
      console.log('[BrandBot] Azure SQL connection closed');
    }
  }
}

// =============================================
// Factory Function
// =============================================

export function createBrandBot(context: BrandBotContext): BrandBot {
  return new BrandBot(context);
}

// =============================================
// Pre-built Query Templates
// =============================================

export const BrandBotQueries = {
  brandOverview: (brandId: string) => `
    Analyze the overall brand health and performance for ${brandId}, 
    including sentiment trends, identity strength, and color psychology impact
  `,
  
  competitiveAnalysis: (brandId: string, competitors: string[]) => `
    Compare ${brandId} against ${competitors.join(', ')} in terms of 
    brand positioning, emotional resonance, and market differentiation
  `,
  
  emotionalProfile: (brandId: string) => `
    Generate a comprehensive emotional profile for ${brandId}, 
    including mood valence trends, sentiment patterns, and emotional triggers
  `,
  
  touchpointOptimization: (brandId: string) => `
    Analyze touchpoint performance for ${brandId} across all channels 
    and identify optimization opportunities for brand consistency
  `,
  
  generationalInsights: (brandId: string, generation: string) => `
    Provide deep insights into how ${generation} demographic perceives ${brandId}, 
    including emotional responses and behavioral patterns
  `
};

// =============================================
// Export Types
// =============================================

export type { 
  BrandBotContext, 
  DatabaseRoute, 
  BrandInsight, 
  AnalyticsQuery 
};