// Emotional and Contextual Analysis Engine for Scout Analytics

export interface EmotionalInsight {
  id: string;
  emotion: string;
  intensity: number;
  triggers: string[];
  context: 'purchase' | 'usage' | 'sharing' | 'consideration';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  demographicRelevance: {
    age: string;
    gender: string;
    income: string;
  };
}

export interface ContextualFactor {
  id: string;
  type: 'temporal' | 'environmental' | 'social' | 'economic';
  factor: string;
  impact: number;
  brands: string[];
  seasonality: number[];
}

export interface DecisionTrigger {
  id: string;
  trigger: string;
  category: 'rational' | 'emotional' | 'social' | 'habitual';
  strength: number;
  prevalence: number;
  associatedBrands: string[];
  demographics: string[];
}

export class EmotionalContextAnalyzer {
  private emotionalInsights: EmotionalInsight[] = [
    {
      id: 'family_care',
      emotion: 'nurturing',
      intensity: 0.85,
      triggers: ['child_health', 'family_nutrition', 'protection'],
      context: 'purchase',
      timeframe: 'long_term',
      demographicRelevance: {
        age: '25-45',
        gender: 'female_primary',
        income: 'middle_class'
      }
    },
    {
      id: 'social_acceptance',
      emotion: 'belonging',
      intensity: 0.72,
      triggers: ['peer_approval', 'trend_following', 'group_identity'],
      context: 'sharing',
      timeframe: 'immediate',
      demographicRelevance: {
        age: '16-35',
        gender: 'all',
        income: 'disposable_focused'
      }
    },
    {
      id: 'convenience_relief',
      emotion: 'satisfaction',
      intensity: 0.68,
      triggers: ['time_saving', 'effort_reduction', 'simplicity'],
      context: 'usage',
      timeframe: 'immediate',
      demographicRelevance: {
        age: '25-55',
        gender: 'working_parents',
        income: 'middle_upper'
      }
    }
  ];

  private contextualFactors: ContextualFactor[] = [
    {
      id: 'payday_cycle',
      type: 'economic',
      factor: 'monthly_income_cycle',
      impact: 0.75,
      brands: ['alaska', 'delmonte', 'oishi'],
      seasonality: [0.9, 0.6, 0.4, 0.3] // Week 1-4 of month
    },
    {
      id: 'school_schedule',
      type: 'temporal',
      factor: 'academic_calendar',
      impact: 0.65,
      brands: ['alaska', 'oishi'],
      seasonality: [0.8, 0.9, 0.3, 0.7] // Q1-Q4
    },
    {
      id: 'weather_patterns',
      type: 'environmental',
      factor: 'tropical_climate',
      impact: 0.55,
      brands: ['oishi', 'beverages'],
      seasonality: [0.7, 0.9, 0.8, 0.6]
    }
  ];

  private decisionTriggers: DecisionTrigger[] = [
    {
      id: 'price_promotion',
      trigger: 'discount_availability',
      category: 'rational',
      strength: 0.82,
      prevalence: 0.75,
      associatedBrands: ['all'],
      demographics: ['price_conscious', 'bulk_buyers']
    },
    {
      id: 'social_proof',
      trigger: 'peer_recommendation',
      category: 'social',
      strength: 0.78,
      prevalence: 0.65,
      associatedBrands: ['oishi', 'trending_brands'],
      demographics: ['gen_z', 'millennials']
    },
    {
      id: 'habit_reinforcement',
      trigger: 'routine_purchase',
      category: 'habitual',
      strength: 0.85,
      prevalence: 0.55,
      associatedBrands: ['alaska', 'delmonte'],
      demographics: ['families', 'established_consumers']
    },
    {
      id: 'emotional_comfort',
      trigger: 'stress_relief',
      category: 'emotional',
      strength: 0.70,
      prevalence: 0.45,
      associatedBrands: ['comfort_foods', 'oishi'],
      demographics: ['working_adults', 'students']
    }
  ];

  /**
   * Analyze emotional patterns for a specific brand
   */
  analyzeEmotionalPatterns(brandId: string): EmotionalInsight[] {
    return this.emotionalInsights.filter(insight => 
      insight.triggers.some(trigger => 
        this.isTriggerRelevantToBrand(trigger, brandId)
      )
    );
  }

  /**
   * Get contextual factors affecting brand performance
   */
  getContextualFactors(brandId: string): ContextualFactor[] {
    return this.contextualFactors.filter(factor =>
      factor.brands.includes(brandId) || factor.brands.includes('all')
    );
  }

  /**
   * Identify decision triggers for specific demographics
   */
  getDecisionTriggers(demographics: string[]): DecisionTrigger[] {
    return this.decisionTriggers.filter(trigger =>
      trigger.demographics.some(demo => demographics.includes(demo))
    );
  }

  /**
   * Calculate emotional engagement score
   */
  calculateEmotionalEngagement(brandId: string, context: string): number {
    const relevantInsights = this.analyzeEmotionalPatterns(brandId);
    const contextualInsights = relevantInsights.filter(insight => 
      insight.context === context
    );

    if (contextualInsights.length === 0) return 0;

    const totalIntensity = contextualInsights.reduce(
      (sum, insight) => sum + insight.intensity, 0
    );

    return totalIntensity / contextualInsights.length;
  }

  /**
   * Generate behavioral trend predictions
   */
  predictBehavioralTrends(brandId: string, timeframe: string): {
    trend: string;
    confidence: number;
    factors: string[];
  }[] {
    const patterns = this.analyzeEmotionalPatterns(brandId);
    const factors = this.getContextualFactors(brandId);
    
    return [
      {
        trend: 'increased_family_focus',
        confidence: 0.78,
        factors: ['economic_uncertainty', 'health_awareness', 'family_time']
      },
      {
        trend: 'convenience_premium',
        confidence: 0.85,
        factors: ['time_scarcity', 'dual_income_families', 'urban_lifestyle']
      },
      {
        trend: 'social_media_influence',
        confidence: 0.72,
        factors: ['digital_natives', 'peer_recommendations', 'visual_content']
      }
    ];
  }

  /**
   * Analyze cross-emotional correlations
   */
  analyzeCrossEmotionalCorrelations(): {
    emotion1: string;
    emotion2: string;
    correlation: number;
    shared_triggers: string[];
  }[] {
    const correlations = [];
    
    for (let i = 0; i < this.emotionalInsights.length; i++) {
      for (let j = i + 1; j < this.emotionalInsights.length; j++) {
        const insight1 = this.emotionalInsights[i];
        const insight2 = this.emotionalInsights[j];
        
        const sharedTriggers = insight1.triggers.filter(trigger =>
          insight2.triggers.includes(trigger)
        );
        
        const correlation = sharedTriggers.length / 
          Math.max(insight1.triggers.length, insight2.triggers.length);
        
        if (correlation > 0.3) {
          correlations.push({
            emotion1: insight1.emotion,
            emotion2: insight2.emotion,
            correlation,
            shared_triggers: sharedTriggers
          });
        }
      }
    }
    
    return correlations.sort((a, b) => b.correlation - a.correlation);
  }

  private isTriggerRelevantToBrand(trigger: string, brandId: string): boolean {
    // Simplified relevance mapping
    const brandTriggerMap: { [key: string]: string[] } = {
      'alaska': ['child_health', 'family_nutrition', 'protection', 'trust'],
      'oishi': ['social_connection', 'fun', 'peer_approval', 'trend_following'],
      'delmonte': ['convenience', 'family_meals', 'time_saving', 'trusted_quality']
    };

    return brandTriggerMap[brandId]?.includes(trigger) || false;
  }
}

// Export singleton instance
export const emotionalAnalyzer = new EmotionalContextAnalyzer();