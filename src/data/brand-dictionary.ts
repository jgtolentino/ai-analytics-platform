// Brand Dictionary: Refined insights for Scout Analytics v3.2.0

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

export const brandDictionary: BrandProfile[] = [
  {
    id: 'alaska',
    name: 'Alaska Milk',
    category: 'Dairy & Nutrition',
    colorAssociations: {
      primary: '#E8F4FD',
      secondary: ['#FFFFFF', '#87CEEB', '#B0E0E6'],
      emotionalTone: 'cool'
    },
    generationalPatterns: {
      genZ: { 
        affinity: 0.72, 
        behaviors: ['health-conscious', 'ingredient-focused', 'social-sharing'] 
      },
      millennial: { 
        affinity: 0.85, 
        behaviors: ['family-oriented', 'nutrition-aware', 'brand-loyal'] 
      },
      genX: { 
        affinity: 0.78, 
        behaviors: ['value-seeking', 'trusted-brands', 'bulk-buying'] 
      },
      boomer: { 
        affinity: 0.65, 
        behaviors: ['traditional-preferences', 'doctor-recommended', 'routine-based'] 
      }
    },
    brandAffinity: {
      loyaltyScore: 0.82,
      switchingPropensity: 0.28,
      crossBrandAssociations: ['Nestle', 'Bear Brand', 'Carnation']
    },
    emotionalTriggers: {
      primary: ['family_health', 'child_nutrition', 'trusted_quality'],
      secondary: ['convenience', 'affordability', 'tradition'],
      negativeSignals: ['artificial_ingredients', 'high_sugar', 'expensive']
    },
    contextualFactors: {
      timeOfDay: { morning: 0.45, afternoon: 0.25, evening: 0.30 },
      seasonality: { q1: 0.22, q2: 0.28, q3: 0.25, q4: 0.25 },
      occasions: { daily: 0.70, special: 0.20, gifting: 0.10 }
    }
  },
  {
    id: 'oishi',
    name: 'Oishi',
    category: 'Snacks & Confectionery',
    colorAssociations: {
      primary: '#FF6B35',
      secondary: ['#FFD700', '#FF4500', '#FFA500'],
      emotionalTone: 'energetic'
    },
    generationalPatterns: {
      genZ: { 
        affinity: 0.88, 
        behaviors: ['impulse-buying', 'flavor-seeking', 'social-snacking'] 
      },
      millennial: { 
        affinity: 0.75, 
        behaviors: ['nostalgia-driven', 'sharing-occasions', 'convenience'] 
      },
      genX: { 
        affinity: 0.45, 
        behaviors: ['family-purchases', 'value-conscious', 'occasional-treats'] 
      },
      boomer: { 
        affinity: 0.25, 
        behaviors: ['grandchildren-focused', 'health-concerned', 'selective'] 
      }
    },
    brandAffinity: {
      loyaltyScore: 0.65,
      switchingPropensity: 0.55,
      crossBrandAssociations: ['Lay\'s', 'Piattos', 'Nova']
    },
    emotionalTriggers: {
      primary: ['fun', 'excitement', 'social_connection'],
      secondary: ['flavor_adventure', 'youthfulness', 'energy'],
      negativeSignals: ['boring', 'healthy_only', 'expensive']
    },
    contextualFactors: {
      timeOfDay: { morning: 0.15, afternoon: 0.35, evening: 0.50 },
      seasonality: { q1: 0.20, q2: 0.30, q3: 0.25, q4: 0.25 },
      occasions: { daily: 0.40, special: 0.35, gifting: 0.25 }
    }
  },
  {
    id: 'delmonte',
    name: 'Del Monte',
    category: 'Processed Foods',
    colorAssociations: {
      primary: '#228B22',
      secondary: ['#32CD32', '#90EE90', '#ADFF2F'],
      emotionalTone: 'warm'
    },
    generationalPatterns: {
      genZ: { 
        affinity: 0.58, 
        behaviors: ['convenience-focused', 'quick-meals', 'brand-aware'] 
      },
      millennial: { 
        affinity: 0.82, 
        behaviors: ['meal-planning', 'family-cooking', 'time-saving'] 
      },
      genX: { 
        affinity: 0.88, 
        behaviors: ['trusted-quality', 'bulk-shopping', 'family-meals'] 
      },
      boomer: { 
        affinity: 0.75, 
        behaviors: ['brand-loyalty', 'quality-focused', 'traditional-cooking'] 
      }
    },
    brandAffinity: {
      loyaltyScore: 0.78,
      switchingPropensity: 0.35,
      crossBrandAssociations: ['Libby\'s', 'Hunt\'s', 'Jolly']
    },
    emotionalTriggers: {
      primary: ['family_meals', 'convenience', 'trusted_quality'],
      secondary: ['nutrition', 'value', 'versatility'],
      negativeSignals: ['artificial', 'processed', 'unhealthy']
    },
    contextualFactors: {
      timeOfDay: { morning: 0.20, afternoon: 0.25, evening: 0.55 },
      seasonality: { q1: 0.25, q2: 0.25, q3: 0.25, q4: 0.25 },
      occasions: { daily: 0.80, special: 0.15, gifting: 0.05 }
    }
  }
];

export function getBrandProfile(brandId: string): BrandProfile | undefined {
  return brandDictionary.find(brand => brand.id === brandId);
}

export function getBrandsByCategory(category: string): BrandProfile[] {
  return brandDictionary.filter(brand => brand.category === category);
}

export function getBrandAffinity(brandId: string, generation: keyof BrandProfile['generationalPatterns']): number {
  const brand = getBrandProfile(brandId);
  return brand?.generationalPatterns[generation]?.affinity || 0;
}

export function getCrossBrandOpportunities(brandId: string): string[] {
  const brand = getBrandProfile(brandId);
  return brand?.brandAffinity.crossBrandAssociations || [];
}