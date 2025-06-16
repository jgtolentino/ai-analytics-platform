// Scout Analytics v3.2.0 - SQL Server API Integration Service
// Purpose: TypeScript service layer for Brand Dictionary SQL Server integration

import sql from 'mssql';

// SQL Server Configuration Interface
interface SQLServerConfig {
  server: string;
  database: string;
  user: string;
  password: string;
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
}

// Brand Profile Interfaces (matching TypeScript implementation)
export interface BrandProfile {
  id: string;
  name: string;
  category: string;
  colorAssociations: {
    primary: string;
    secondary: string[];
    emotionalTone: 'warm' | 'cool' | 'neutral' | 'energetic';
  };
  generationalPatterns: {
    genZ: { affinity: number; behaviors: string[] };
    millennial: { affinity: number; behaviors: string[] };
    genX: { affinity: number; behaviors: string[] };
    boomer: { affinity: number; behaviors: string[] };
  };
  brandAffinity: {
    loyaltyScore: number;
    switchingPropensity: number;
    crossBrandAssociations: string[];
  };
  emotionalTriggers: {
    primary: string[];
    secondary: string[];
    negativeSignals: string[];
  };
  contextualFactors: {
    timeOfDay: { morning: number; afternoon: number; evening: number };
    seasonality: { q1: number; q2: number; q3: number; q4: number };
    occasions: { daily: number; special: number; gifting: number };
  };
}

export interface BrandAnalytics {
  category: string;
  brandCount: number;
  avgLoyaltyScore: number;
  avgSwitchingPropensity: number;
  maxLoyaltyScore: number;
  minLoyaltyScore: number;
  genZ_AvgAffinity: number;
  millennial_AvgAffinity: number;
  genX_AvgAffinity: number;
  boomer_AvgAffinity: number;
  topPerformingGeneration: string;
}

export interface GenerationalAnalysis {
  brandId: string;
  brandName: string;
  category: string;
  genZ_Affinity: number;
  millennial_Affinity: number;
  genX_Affinity: number;
  boomer_Affinity: number;
  generationSpread: number;
  dominantGeneration: string;
}

export interface BrandComparison {
  basicMetrics: {
    brand1_Name: string;
    brand1_Category: string;
    brand1_Loyalty: number;
    brand1_Switching: number;
    brand2_Name: string;
    brand2_Category: string;
    brand2_Loyalty: number;
    brand2_Switching: number;
    loyaltyDifference: number;
    switchingDifference: number;
  };
  generationalComparison: Array<{
    generation: string;
    brand1_Affinity: number;
    brand2_Affinity: number;
    affinityDifference: number;
    strongerBrand: string;
  }>;
  emotionalTriggerOverlap: Array<{
    triggerName: string;
    brand1_TriggerType: string;
    brand1_Intensity: number;
    brand2_TriggerType: string;
    brand2_Intensity: number;
    triggerStatus: string;
  }>;
}

// SQL Server Connection Pool
class SQLServerConnection {
  private pool: sql.ConnectionPool | null = null;
  private config: SQLServerConfig;

  constructor(config: SQLServerConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      this.pool = new sql.ConnectionPool(this.config);
      await this.pool.connect();
      console.log('Connected to SQL Server successfully');
    } catch (error) {
      console.error('SQL Server connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }

  getPool(): sql.ConnectionPool {
    if (!this.pool) {
      throw new Error('Database connection not established');
    }
    return this.pool;
  }
}

// Brand Dictionary Service Class
export class BrandDictionaryService {
  private connection: SQLServerConnection;

  constructor(config: SQLServerConfig) {
    this.connection = new SQLServerConnection(config);
  }

  async initialize(): Promise<void> {
    await this.connection.connect();
  }

  async dispose(): Promise<void> {
    await this.connection.disconnect();
  }

  /**
   * Get complete brand profile from SQL Server
   */
  async getBrandProfile(brandId: string): Promise<BrandProfile | null> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();
      request.input('BrandID', sql.NVarChar(50), brandId);

      const result = await request.execute('dbo.GetBrandProfile');

      if (result.recordsets.length === 0 || result.recordsets[0].length === 0) {
        return null;
      }

      const mainData = result.recordsets[0][0];
      const colorData = result.recordsets[1] || [];
      const generationalData = result.recordsets[2] || [];
      const triggerData = result.recordsets[3] || [];
      const associationData = result.recordsets[4] || [];
      const contextualData = result.recordsets[5] || [];

      return this.mapSqlResultToBrandProfile(
        mainData,
        colorData,
        generationalData,
        triggerData,
        associationData,
        contextualData
      );
    } catch (error) {
      console.error('Error fetching brand profile:', error);
      throw error;
    }
  }

  /**
   * Get brand analytics summary
   */
  async getBrandAnalytics(): Promise<BrandAnalytics[]> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();

      const result = await request.execute('dbo.GetBrandAnalytics');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching brand analytics:', error);
      throw error;
    }
  }

  /**
   * Get generational analysis
   */
  async getGenerationalAnalysis(generation?: string): Promise<GenerationalAnalysis[]> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();
      
      if (generation) {
        request.input('Generation', sql.NVarChar(20), generation);
      }

      const result = await request.execute('dbo.GetGenerationalAnalysis');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching generational analysis:', error);
      throw error;
    }
  }

  /**
   * Compare two brands
   */
  async compareBrands(brandId1: string, brandId2: string): Promise<BrandComparison> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();
      request.input('BrandID1', sql.NVarChar(50), brandId1);
      request.input('BrandID2', sql.NVarChar(50), brandId2);

      const result = await request.execute('dbo.CompareBrands');

      return {
        basicMetrics: result.recordsets[0][0],
        generationalComparison: result.recordsets[1],
        emotionalTriggerOverlap: result.recordsets[2]
      };
    } catch (error) {
      console.error('Error comparing brands:', error);
      throw error;
    }
  }

  /**
   * Update generational affinity score
   */
  async updateGenerationalAffinity(
    brandId: string,
    generation: string,
    affinityScore: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();
      request.input('BrandID', sql.NVarChar(50), brandId);
      request.input('Generation', sql.NVarChar(20), generation);
      request.input('NewAffinityScore', sql.Decimal(5, 4), affinityScore);

      const result = await request.execute('dbo.UpdateGenerationalAffinity');
      const response = result.recordset[0];

      return {
        success: response.Status === 'Success',
        message: response.Status === 'Success' ? 'Updated successfully' : response.ErrorMessage
      };
    } catch (error) {
      console.error('Error updating generational affinity:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Add new brand to dictionary
   */
  async addNewBrand(brandData: {
    brandId: string;
    brandName: string;
    category: string;
    primaryColor?: string;
    emotionalTone?: string;
    loyaltyScore?: number;
    switchingPropensity?: number;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();
      request.input('BrandID', sql.NVarChar(50), brandData.brandId);
      request.input('BrandName', sql.NVarChar(100), brandData.brandName);
      request.input('Category', sql.NVarChar(50), brandData.category);
      request.input('PrimaryColor', sql.NChar(7), brandData.primaryColor || null);
      request.input('EmotionalTone', sql.NVarChar(20), brandData.emotionalTone || null);
      request.input('LoyaltyScore', sql.Decimal(5, 4), brandData.loyaltyScore || null);
      request.input('SwitchingPropensity', sql.Decimal(5, 4), brandData.switchingPropensity || null);

      const result = await request.execute('dbo.AddNewBrand');
      const response = result.recordset[0];

      return {
        success: response.Status === 'Successfully added',
        message: response.Status === 'Successfully added' ? 'Brand added successfully' : response.ErrorMessage
      };
    } catch (error) {
      console.error('Error adding new brand:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search brands with filters
   */
  async searchBrands(criteria: {
    searchTerm?: string;
    category?: string;
    minLoyaltyScore?: number;
    maxSwitchingPropensity?: number;
    emotionalTone?: string;
    generation?: string;
    minGenerationalAffinity?: number;
  }): Promise<any[]> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();

      request.input('SearchTerm', sql.NVarChar(100), criteria.searchTerm || null);
      request.input('Category', sql.NVarChar(50), criteria.category || null);
      request.input('MinLoyaltyScore', sql.Decimal(5, 4), criteria.minLoyaltyScore || null);
      request.input('MaxSwitchingPropensity', sql.Decimal(5, 4), criteria.maxSwitchingPropensity || null);
      request.input('EmotionalTone', sql.NVarChar(20), criteria.emotionalTone || null);
      request.input('Generation', sql.NVarChar(20), criteria.generation || null);
      request.input('MinGenerationalAffinity', sql.Decimal(5, 4), criteria.minGenerationalAffinity || null);

      const result = await request.execute('dbo.SearchBrands');
      return result.recordset;
    } catch (error) {
      console.error('Error searching brands:', error);
      throw error;
    }
  }

  /**
   * Generate brand performance report
   */
  async generatePerformanceReport(category?: string): Promise<{
    brandMetrics: any[];
    categorySummary?: any[];
  }> {
    try {
      const pool = this.connection.getPool();
      const request = pool.request();
      
      if (category) {
        request.input('Category', sql.NVarChar(50), category);
      }

      const result = await request.execute('dbo.GenerateBrandPerformanceReport');
      
      return {
        brandMetrics: result.recordsets[0],
        categorySummary: result.recordsets[1] || undefined
      };
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw error;
    }
  }

  /**
   * Helper method to map SQL results to BrandProfile interface
   */
  private mapSqlResultToBrandProfile(
    mainData: any,
    colorData: any[],
    generationalData: any[],
    triggerData: any[],
    associationData: any[],
    contextualData: any[]
  ): BrandProfile {
    // Process color associations
    const primaryColor = colorData.find(c => c.ColorType === 'primary')?.ColorHex || mainData.PrimaryColor;
    const secondaryColors = colorData.filter(c => c.ColorType === 'secondary').map(c => c.ColorHex);

    // Process generational patterns
    const generationalPatterns = {
      genZ: { affinity: 0, behaviors: [] as string[] },
      millennial: { affinity: 0, behaviors: [] as string[] },
      genX: { affinity: 0, behaviors: [] as string[] },
      boomer: { affinity: 0, behaviors: [] as string[] }
    };

    generationalData.forEach(gen => {
      const generation = gen.Generation as keyof typeof generationalPatterns;
      if (generationalPatterns[generation]) {
        generationalPatterns[generation].affinity = gen.AffinityScore;
        generationalPatterns[generation].behaviors = gen.Behaviors ? gen.Behaviors.split(', ') : [];
      }
    });

    // Process emotional triggers
    const emotionalTriggers = {
      primary: triggerData.filter(t => t.TriggerType === 'primary').map(t => t.TriggerName),
      secondary: triggerData.filter(t => t.TriggerType === 'secondary').map(t => t.TriggerName),
      negativeSignals: triggerData.filter(t => t.TriggerType === 'negative').map(t => t.TriggerName)
    };

    // Process contextual factors
    const contextualFactors = {
      timeOfDay: { morning: 0, afternoon: 0, evening: 0 },
      seasonality: { q1: 0, q2: 0, q3: 0, q4: 0 },
      occasions: { daily: 0, special: 0, gifting: 0 }
    };

    contextualData.forEach(factor => {
      if (factor.FactorType === 'timeOfDay') {
        (contextualFactors.timeOfDay as any)[factor.FactorKey] = factor.FactorValue;
      } else if (factor.FactorType === 'seasonality') {
        (contextualFactors.seasonality as any)[factor.FactorKey] = factor.FactorValue;
      } else if (factor.FactorType === 'occasions') {
        (contextualFactors.occasions as any)[factor.FactorKey] = factor.FactorValue;
      }
    });

    return {
      id: mainData.BrandID,
      name: mainData.BrandName,
      category: mainData.Category,
      colorAssociations: {
        primary: primaryColor,
        secondary: secondaryColors,
        emotionalTone: mainData.EmotionalTone || 'neutral'
      },
      generationalPatterns,
      brandAffinity: {
        loyaltyScore: mainData.LoyaltyScore,
        switchingPropensity: mainData.SwitchingPropensity,
        crossBrandAssociations: associationData.map(a => a.AssociatedBrand)
      },
      emotionalTriggers,
      contextualFactors
    };
  }
}

// Factory function to create service instance
export function createBrandDictionaryService(config?: Partial<SQLServerConfig>): BrandDictionaryService {
  const defaultConfig: SQLServerConfig = {
    server: process.env.SQL_SERVER_HOST || 'localhost',
    database: process.env.SQL_SERVER_DATABASE || 'ScoutAnalytics',
    user: process.env.SQL_SERVER_USER || '',
    password: process.env.SQL_SERVER_PASSWORD || '',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new BrandDictionaryService(finalConfig);
}

// Export types and service
export default BrandDictionaryService;
export { SQLServerConfig };

// Usage example:
/*
const service = createBrandDictionaryService({
  server: 'your-sql-server.database.windows.net',
  user: 'your-username',
  password: 'your-password'
});

await service.initialize();

// Get brand profile
const alaskaBrand = await service.getBrandProfile('alaska');

// Get analytics
const analytics = await service.getBrandAnalytics();

// Compare brands
const comparison = await service.compareBrands('alaska', 'oishi');

// Update affinity
await service.updateGenerationalAffinity('alaska', 'genZ', 0.75);

await service.dispose();
*/