// Bundling Opportunities Analysis for Scout Analytics v3.2.0
// Identifies optimal product combinations for targeted promotions and product placement

import { BrandProfile, getBrandProfile, brandDictionary } from '../data/brand-dictionary';
import { EmotionalContextAnalyzer, emotionalAnalyzer } from './emotional-context-analyzer';

export interface BundlingOpportunity {
  id: string;
  name: string;
  brands: string[];
  products: string[];
  synergy: number;
  confidence: number;
  targetDemographics: string[];
  promotionType: 'cross_sell' | 'upsell' | 'seasonal' | 'complementary';
  expectedUplift: {
    revenue: number;
    volume: number;
    frequency: number;
  };
  reasoning: {
    emotional: string[];
    behavioral: string[];
    contextual: string[];
  };
  implementation: {
    placement: string;
    timing: string;
    messaging: string[];
  };
}

export interface BundlingContext {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  occasion: 'regular' | 'special' | 'holiday' | 'back_to_school';
  demographics: string[];
  location: 'urban' | 'suburban' | 'rural';
}

export class BundlingOpportunitiesAnalyzer {
  private opportunityMatrix: BundlingOpportunity[] = [
    {
      id: 'family_nutrition_bundle',
      name: 'Complete Family Nutrition',
      brands: ['alaska', 'delmonte'],
      products: ['Alaska Milk', 'Del Monte Fruit Cocktail', 'Del Monte Tomato Sauce'],
      synergy: 0.85,
      confidence: 0.78,
      targetDemographics: ['families_with_children', 'millennials', 'health_conscious'],
      promotionType: 'complementary',
      expectedUplift: {
        revenue: 0.23,
        volume: 0.18,
        frequency: 0.15
      },
      reasoning: {
        emotional: ['family_care', 'nutrition_confidence', 'meal_planning_success'],
        behavioral: ['bulk_shopping', 'meal_prep', 'brand_loyalty'],
        contextual: ['school_season', 'monthly_grocery', 'family_dinner_time']
      },
      implementation: {
        placement: 'end_cap_display',
        timing: 'school_calendar_aligned',
        messaging: ['Complete Family Nutrition', 'Everything for Healthy Meals', 'Trusted Family Brands']
      }
    },
    {
      id: 'social_snacking_combo',
      name: 'Share & Connect Snack Pack',
      brands: ['oishi'],
      products: ['Oishi Potato Chips', 'Oishi Crackers', 'Oishi Beverages'],
      synergy: 0.92,
      confidence: 0.85,
      targetDemographics: ['gen_z', 'millennials', 'social_gatherers'],
      promotionType: 'cross_sell',
      expectedUplift: {
        revenue: 0.35,
        volume: 0.42,
        frequency: 0.28
      },
      reasoning: {
        emotional: ['social_bonding', 'fun_excitement', 'peer_acceptance'],
        behavioral: ['impulse_buying', 'group_consumption', 'flavor_variety_seeking'],
        contextual: ['weekend_gatherings', 'study_sessions', 'party_occasions']
      },
      implementation: {
        placement: 'checkout_lane',
        timing: 'weekend_focused',
        messaging: ['Perfect for Sharing', 'Mix & Match Flavors', 'Social Snack Attack']
      }
    },
    {
      id: 'convenient_cooking_set',
      name: 'Quick Meal Solutions',
      brands: ['delmonte', 'alaska'],
      products: ['Del Monte Pasta Sauce', 'Del Monte Corned Beef', 'Alaska Condensed Milk'],
      synergy: 0.78,
      confidence: 0.72,
      targetDemographics: ['working_parents', 'busy_professionals', 'gen_x'],
      promotionType: 'upsell',
      expectedUplift: {
        revenue: 0.28,
        volume: 0.22,
        frequency: 0.35
      },
      reasoning: {
        emotional: ['time_saving_relief', 'cooking_confidence', 'family_satisfaction'],
        behavioral: ['convenience_seeking', 'meal_planning', 'brand_trust'],
        contextual: ['weeknight_dinners', 'busy_schedules', 'dual_income_families']
      },
      implementation: {
        placement: 'meal_solutions_aisle',
        timing: 'weekday_evening_peak',
        messaging: ['Quick Family Meals', '30-Minute Dinner Solutions', 'Trusted Quality, Fast Results']
      }
    },
    {
      id: 'seasonal_celebration_pack',
      name: 'Holiday Family Feast Bundle',
      brands: ['alaska', 'delmonte', 'oishi'],
      products: ['Alaska Fresh Milk', 'Del Monte Fruit Salad', 'Del Monte Sweet Style Corn', 'Oishi Party Snacks'],
      synergy: 0.88,
      confidence: 0.80,
      targetDemographics: ['families', 'party_hosts', 'tradition_keepers'],
      promotionType: 'seasonal',
      expectedUplift: {
        revenue: 0.45,
        volume: 0.38,
        frequency: 0.12
      },
      reasoning: {
        emotional: ['celebration_joy', 'family_togetherness', 'tradition_keeping'],
        behavioral: ['bulk_purchasing', 'special_occasion_shopping', 'cross_category_buying'],
        contextual: ['holiday_seasons', 'family_gatherings', 'celebration_prep']
      },
      implementation: {
        placement: 'seasonal_display',
        timing: 'pre_holiday_weeks',
        messaging: ['Complete Celebration Bundle', 'Family Favorites Together', 'Everything for the Perfect Feast']
      }
    }
  ];

  /**
   * Analyze bundling opportunities for specific context
   */
  analyzeBundlingOpportunities(context: BundlingContext): BundlingOpportunity[] {
    return this.opportunityMatrix
      .filter(opportunity => this.isContextRelevant(opportunity, context))
      .sort((a, b) => (b.synergy * b.confidence) - (a.synergy * a.confidence));
  }

  /**
   * Calculate bundle synergy score between brands
   */
  calculateBundleSynergy(brandIds: string[]): number {
    if (brandIds.length < 2) return 0;

    let totalSynergy = 0;
    let pairCount = 0;

    for (let i = 0; i < brandIds.length; i++) {
      for (let j = i + 1; j < brandIds.length; j++) {
        const synergy = this.calculateBrandPairSynergy(brandIds[i], brandIds[j]);
        totalSynergy += synergy;
        pairCount++;
      }
    }

    return pairCount > 0 ? totalSynergy / pairCount : 0;
  }

  /**
   * Generate cross-brand promotion recommendations
   */
  generateCrossBrandPromotions(brandId: string): BundlingOpportunity[] {
    const brandProfile = getBrandProfile(brandId);
    if (!brandProfile) return [];

    const crossBrands = brandProfile.brandAffinity.crossBrandAssociations;
    const relevantOpportunities = this.opportunityMatrix.filter(opportunity =>
      opportunity.brands.includes(brandId) ||
      opportunity.brands.some(brand => crossBrands.includes(brand))
    );

    return relevantOpportunities
      .sort((a, b) => b.expectedUplift.revenue - a.expectedUplift.revenue)
      .slice(0, 5);
  }

  /**
   * Identify optimal product placement strategies
   */
  getPlacementRecommendations(bundleId: string): {
    primary: string;
    secondary: string[];
    timing: string;
    duration: string;
  } {
    const bundle = this.opportunityMatrix.find(b => b.id === bundleId);
    if (!bundle) {
      return {
        primary: 'standard_shelf',
        secondary: [],
        timing: 'regular_hours',
        duration: 'ongoing'
      };
    }

    const placementStrategies = {
      'cross_sell': {
        primary: 'related_categories',
        secondary: ['checkout_lane', 'end_cap'],
        timing: 'peak_shopping_hours',
        duration: '2_weeks'
      },
      'upsell': {
        primary: 'premium_section',
        secondary: ['eye_level_shelf', 'cart_path'],
        timing: 'meal_planning_days',
        duration: '1_month'
      },
      'seasonal': {
        primary: 'seasonal_display',
        secondary: ['store_entrance', 'main_aisle'],
        timing: 'pre_season_buildup',
        duration: 'season_length'
      },
      'complementary': {
        primary: 'meal_solutions_area',
        secondary: ['recipe_cards_nearby', 'cooking_aisle'],
        timing: 'dinner_rush_hours',
        duration: 'ongoing'
      }
    };

    return placementStrategies[bundle.promotionType] || placementStrategies['complementary'];
  }

  /**
   * Calculate expected ROI for bundling strategy
   */
  calculateBundlingROI(bundleId: string, investmentAmount: number): {
    expectedRevenue: number;
    roi: number;
    paybackPeriod: number;
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const bundle = this.opportunityMatrix.find(b => b.id === bundleId);
    if (!bundle) {
      return { expectedRevenue: 0, roi: 0, paybackPeriod: 0, riskLevel: 'high' };
    }

    const baseRevenue = investmentAmount * 2.5; // Assumed baseline
    const expectedRevenue = baseRevenue * (1 + bundle.expectedUplift.revenue);
    const roi = ((expectedRevenue - investmentAmount) / investmentAmount) * 100;
    const paybackPeriod = investmentAmount / (expectedRevenue / 12); // Months

    const riskLevel = bundle.confidence > 0.8 ? 'low' : 
                     bundle.confidence > 0.6 ? 'medium' : 'high';

    return {
      expectedRevenue,
      roi,
      paybackPeriod,
      riskLevel
    };
  }

  /**
   * Analyze competitive bundling landscape
   */
  analyzeCompetitiveBundling(): {
    competitorStrategy: string;
    marketGap: string;
    opportunity: string;
    recommendation: string;
  }[] {
    return [
      {
        competitorStrategy: 'Single brand focus',
        marketGap: 'Cross-brand meal solutions',
        opportunity: 'Multi-brand convenience bundles',
        recommendation: 'Create cross-category meal planning bundles'
      },
      {
        competitorStrategy: 'Price-driven promotions',
        marketGap: 'Value-added experiences',
        opportunity: 'Lifestyle-focused bundling',
        recommendation: 'Bundle products with recipes and occasion themes'
      },
      {
        competitorStrategy: 'Static seasonal displays',
        marketGap: 'Dynamic contextual bundling',
        opportunity: 'AI-driven personalized bundles',
        recommendation: 'Implement demographic-specific bundle recommendations'
      }
    ];
  }

  private calculateBrandPairSynergy(brandId1: string, brandId2: string): number {
    const brand1 = getBrandProfile(brandId1);
    const brand2 = getBrandProfile(brandId2);

    if (!brand1 || !brand2) return 0;

    // Calculate emotional trigger overlap
    const sharedTriggers = brand1.emotionalTriggers.primary.filter(trigger =>
      brand2.emotionalTriggers.primary.includes(trigger) ||
      brand2.emotionalTriggers.secondary.includes(trigger)
    );

    // Calculate demographic overlap
    const genOverlap = this.calculateGenerationalOverlap(brand1, brand2);

    // Calculate contextual compatibility
    const contextual = this.calculateContextualCompatibility(brand1, brand2);

    // Weighted average
    const emotionalWeight = 0.4;
    const demographicWeight = 0.35;
    const contextualWeight = 0.25;

    const emotionalScore = sharedTriggers.length / Math.max(brand1.emotionalTriggers.primary.length, 1);
    
    return (emotionalScore * emotionalWeight) + 
           (genOverlap * demographicWeight) + 
           (contextual * contextualWeight);
  }

  private calculateGenerationalOverlap(brand1: BrandProfile, brand2: BrandProfile): number {
    const generations = ['genZ', 'millennial', 'genX', 'boomer'] as const;
    let overlapScore = 0;

    generations.forEach(gen => {
      const affinity1 = brand1.generationalPatterns[gen].affinity;
      const affinity2 = brand2.generationalPatterns[gen].affinity;
      
      // Higher score for generations where both brands have strong affinity
      if (affinity1 > 0.7 && affinity2 > 0.7) {
        overlapScore += 0.4;
      } else if (affinity1 > 0.5 && affinity2 > 0.5) {
        overlapScore += 0.25;
      }
    });

    return Math.min(overlapScore, 1.0);
  }

  private calculateContextualCompatibility(brand1: BrandProfile, brand2: BrandProfile): number {
    // Time of day compatibility
    const timeCompatibility = this.calculateTimeCompatibility(
      brand1.contextualFactors.timeOfDay,
      brand2.contextualFactors.timeOfDay
    );

    // Occasion compatibility
    const occasionCompatibility = this.calculateOccasionCompatibility(
      brand1.contextualFactors.occasions,
      brand2.contextualFactors.occasions
    );

    return (timeCompatibility + occasionCompatibility) / 2;
  }

  private calculateTimeCompatibility(time1: any, time2: any): number {
    const morningCompat = Math.min(time1.morning, time2.morning);
    const afternoonCompat = Math.min(time1.afternoon, time2.afternoon);
    const eveningCompat = Math.min(time1.evening, time2.evening);

    return Math.max(morningCompat, afternoonCompat, eveningCompat);
  }

  private calculateOccasionCompatibility(occ1: any, occ2: any): number {
    const dailyCompat = Math.min(occ1.daily, occ2.daily);
    const specialCompat = Math.min(occ1.special, occ2.special);
    const giftingCompat = Math.min(occ1.gifting, occ2.gifting);

    return Math.max(dailyCompat, specialCompat, giftingCompat);
  }

  private isContextRelevant(opportunity: BundlingOpportunity, context: BundlingContext): boolean {
    // Check demographic relevance
    const demoMatch = opportunity.targetDemographics.some(demo =>
      context.demographics.includes(demo)
    );

    // Check timeframe relevance
    const timeframeMatch = this.isTimeframeRelevant(opportunity, context.timeframe);

    // Check occasion relevance
    const occasionMatch = this.isOccasionRelevant(opportunity, context.occasion);

    return demoMatch && (timeframeMatch || occasionMatch);
  }

  private isTimeframeRelevant(opportunity: BundlingOpportunity, timeframe: string): boolean {
    const timeframeMapping: { [key: string]: string[] } = {
      'daily': ['cross_sell', 'complementary'],
      'weekly': ['cross_sell', 'upsell', 'complementary'],
      'monthly': ['upsell', 'complementary'],
      'seasonal': ['seasonal']
    };

    return timeframeMapping[timeframe]?.includes(opportunity.promotionType) || false;
  }

  private isOccasionRelevant(opportunity: BundlingOpportunity, occasion: string): boolean {
    const occasionMapping: { [key: string]: string[] } = {
      'regular': ['cross_sell', 'upsell', 'complementary'],
      'special': ['seasonal', 'upsell'],
      'holiday': ['seasonal'],
      'back_to_school': ['complementary', 'cross_sell']
    };

    return occasionMapping[occasion]?.includes(opportunity.promotionType) || false;
  }
}

// Export singleton instance
export const bundlingAnalyzer = new BundlingOpportunitiesAnalyzer();