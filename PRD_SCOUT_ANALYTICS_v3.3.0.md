📘 Product Requirements Document (PRD)

**Project:** Scout Analytics  
**Version:** v3.3.0  
**Maintainer:** InsightPulseAI × TBWA  
**Environment:** Production  
**Release Type:** 🚀 Final MVP — Production Locked Release with Enhanced Brand Intelligence

⸻

## 🎯 Purpose

Deliver a fully production-ready, AI-integrated, retail intelligence platform with:
• **End-to-end analytics** with sophisticated brand intelligence
• **Enhanced Brand Dictionary** - 100+ brands with fuzzy matching + deep insights for key brands
• **AI-based insights** (RetailBot with brand-aware context)
• **QA & validation** (Vibe TestBot)
• **Interactive tutorials** (LearnBot)
• **Advanced data models** - Emotional Context Analysis + Bundling Opportunities
• **SQL Server integration** for enterprise-grade brand analytics
• **Full navigation & no empty components**
• **CI/CD reliability** via Vercel

⸻

## 🧩 Core Functional Modules

| Page | Modules Included | Brand Intelligence Features |
|------|------------------|----------------------------|
| **Overview** | KPI cards + Regional Map + Brand Performance Summary | Top performing brands by loyalty score, switching analysis |
| **Trends** | Time series + Brand trend analysis | Generational affinity trends, emotional trigger patterns |
| **Product Mix** | Brand share + Category mix + Cross-brand substitution flow | Bundling opportunities, brand association mapping |
| **Consumers** | Demographics + Brand affinity by generation | Gen Z/Millennial/GenX/Boomer brand preferences with behavioral insights |
| **Brand Intelligence** | **NEW:** Advanced Brand Dictionary UI with SQL Server integration | Interactive brand profiles, emotional analysis, bundling recommendations |
| **Scout AI Chat** | AI assistant with brand-aware context | Brand-specific insights, competitive analysis, market recommendations |

⸻

## 🧠 Enhanced Brand Intelligence Architecture

### **Brand Dictionary Pipeline**
```
Detection Layer (Fuzzy Matching)
├── 100+ brands with variants handling
├── Category classification
├── Product portfolio mapping
└── Basic insights (existing structure)

Analytics Layer (Sophisticated Model)
├── Deep profiles for key brands (Alaska, Oishi, Del Monte, etc.)
├── SQL Server normalized schema
├── Generational affinity scoring
├── Emotional trigger analysis
├── Bundling opportunities engine
└── Cross-brand association mapping
```

### **Key Brand Profiles Enhanced**

#### **Alaska Milk**
```typescript
Enhanced Profile: {
  // Existing fuzzy matching
  variants: ["Alaxka", "Alaske", "Alska"],
  category: "Dairy",
  products: ["Evaporated Milk", "Condensed Milk", "Powdered Milk"],
  
  // NEW: Sophisticated insights
  colorAssociations: {
    primary: "#E8F4FD",
    secondary: ["#FFFFFF", "#87CEEB", "#B0E0E6"],
    emotionalTone: "cool"
  },
  generationalPatterns: {
    genZ: { affinity: 0.72, behaviors: ["health-conscious", "ingredient-focused"] },
    millennial: { affinity: 0.85, behaviors: ["family-oriented", "nutrition-aware"] },
    genX: { affinity: 0.78, behaviors: ["value-seeking", "trusted-brands"] },
    boomer: { affinity: 0.65, behaviors: ["traditional-preferences"] }
  },
  brandAffinity: {
    loyaltyScore: 0.82,
    switchingPropensity: 0.28
  },
  emotionalTriggers: {
    primary: ["family_health", "child_nutrition", "trusted_quality"],
    secondary: ["convenience", "affordability", "tradition"],
    negativeSignals: ["artificial_ingredients", "high_sugar"]
  }
}
```

#### **Oishi**
```typescript
Enhanced Profile: {
  // Existing detection
  variants: ["Oyshi", "Oyishi", "Oisi"],
  category: "Snacks",
  products: ["Prawn Crackers", "Pillows", "Marty's", "Ridges"],
  
  // NEW: Deep insights
  colorAssociations: {
    primary: "#FF6B35",
    secondary: ["#FFD700", "#FF4500", "#FFA500"],
    emotionalTone: "energetic"
  },
  generationalPatterns: {
    genZ: { affinity: 0.88, behaviors: ["impulse-buying", "flavor-seeking", "social-snacking"] },
    millennial: { affinity: 0.75, behaviors: ["nostalgia-driven", "sharing-occasions"] }
  }
}
```

⸻

## 🧠 Agents and Capabilities

| Agent | Role | Version | Brand Intelligence Integration |
|-------|------|---------|-------------------------------|
| **RetailBot** | KPI explanation, trends + brand insights | v2.1 | Brand-aware context, competitive analysis, loyalty scoring |
| **LearnBot** | Tutorial + brand education | v1.6 | Brand profile tours, generational insights tutorials |
| **VibeTestBot** | UI & data QA + brand data validation | v1.1 | Brand dictionary integrity, SQL connection validation |
| **BrandBot** | **NEW:** Brand intelligence specialist | v1.0 | Emotional analysis, bundling recommendations, cross-brand insights |
| **Caca** | Audit orchestrator | v1.1 | Brand data quality assurance |
| **Dash** | UI validation | v1.0 | Brand UI component validation |

⸻

## 📦 Tech Stack

| Layer | Stack | Brand Intelligence Components |
|-------|-------|-------------------------------|
| **Frontend** | React (Next.js 14) + Tailwind + Cruip UI | Advanced Brand Dictionary UI, Interactive brand profiles |
| **State Mgmt** | Zustand | Brand selection state, generational filter state |
| **Backend** | Supabase (Postgres) + **SQL Server** | Brand Dictionary tables, emotional analysis, bundling engine |
| **Data Models** | TypeScript interfaces | BrandProfile, EmotionalInsight, BundlingOpportunity |
| **Analytics** | **NEW:** Emotional Context Analyzer + Bundling Engine | Cross-brand analysis, ROI calculations |
| **Hosting** | Vercel (CI/CD) | Brand intelligence API endpoints |
| **Agents** | Pulser Orchestration | Brand-aware AI agents |

⸻

## 🔐 Environment & Enhanced Reliability Goals

### **Existing Requirements:**
• ✅ Must load even if data/API fails (fallback mode)
• ✅ All widgets must render
• ✅ No broken navigation links
• ✅ QA pass via Caca & Dash

### **NEW Brand Intelligence Requirements:**
• ✅ **Brand Dictionary** - Fuzzy matching must work for 100+ brands
• ✅ **SQL Server Integration** - Connection pooling and fallback to TypeScript data
• ✅ **Generational Analysis** - All affinity scores must load with visualization
• ✅ **Emotional Context** - Decision triggers and behavioral analysis functional
• ✅ **Bundling Engine** - ROI calculations and placement recommendations active
• ✅ **Cross-brand Analysis** - Association mapping and competitive insights
• ✅ **Brand UI Components** - Interactive profiles, color psychology, charts render correctly

⸻

## 📦 Enhanced release.yaml — Production Deployment Manifest

```yaml
release:
  name: Scout Analytics Enhanced Brand Intelligence
  version: v3.3.0
  environment: production
  url: https://scout-mvp.vercel.app
  repo: https://github.com/jgtolentino/ai-agency
  deploy_branch: release/v3.3.0
  lock_status: locked
  fallback_enabled: true
  brand_intelligence: enabled

data_models:
  brand_dictionary:
    detection_layer:
      brands_count: 100+
      fuzzy_matching: enabled
      categories: ["Dairy", "Snacks", "Packaged Food", "Beverages", "Personal Care", "Home Care", "Health & Wellness", "Tobacco", "Telecoms"]
    analytics_layer:
      enhanced_brands: ["Alaska", "Oishi", "Del Monte", "Bear Brand", "Jack n Jill", "Century Tuna", "Datu Puti"]
      sql_server_integration: enabled
      generational_analysis: enabled
      emotional_context: enabled
      bundling_engine: enabled

pages:
  - name: Overview
    modules:
      - KPI Cards with Brand Performance
      - Regional Map
      - Top Brands by Loyalty
      - RetailBot v2.1 (brand-aware)
      - LearnBot Tips
      - VibeTestBot QA
    brand_features:
      - Brand loyalty summary
      - Switching propensity alerts
      - Top performing categories

  - name: Trends
    modules:
      - Time Series Chart
      - Brand Trend Analysis
      - Generational Affinity Trends
      - Filters (timeframe, region, generation)
      - RetailBot v2.1
      - VibeTestBot QA
    brand_features:
      - Generational preference shifts
      - Emotional trigger evolution
      - Brand performance patterns

  - name: Product Mix
    modules:
      - Category Mix Chart
      - Brand Share Chart with Affinity Scoring
      - Cross-Brand Substitution Flow
      - Bundling Opportunities Panel
      - RetailBot v2.1
      - VibeTestBot QA
    brand_features:
      - Brand association mapping
      - Competitive switching analysis
      - Bundle recommendation engine

  - name: Consumers
    modules:
      - Age Breakdown with Brand Affinity
      - Gender Distribution
      - Income Heatmap
      - Generational Brand Preferences
      - Behavioral Analysis Panel
      - LearnBot brand education
      - VibeTestBot QA
    brand_features:
      - Generation-specific brand rankings
      - Behavioral trigger analysis
      - Emotional context mapping

  - name: Brand Intelligence
    modules:
      - Advanced Brand Dictionary UI
      - Interactive Brand Profiles
      - Generational Affinity Visualization
      - Emotional Context Analyzer
      - Bundling Opportunities Dashboard
      - Color Psychology Display
      - Cross-Brand Analysis
      - BrandBot AI Assistant
    brand_features:
      - Comprehensive brand profiles
      - Real-time analytics
      - SQL Server integration
      - ROI analysis
      - Competitive intelligence

  - name: Scout AI Chat
    modules:
      - GPT-4 Context Chat with Brand Intelligence
      - Persistent Panel
      - Brand-specific query routing
      - LearnBot prompt injection
    brand_features:
      - Brand-aware responses
      - Competitive analysis queries
      - Market recommendations
      - Cross-brand insights

agents:
  RetailBot:
    version: v2.1
    functions:
      - KPI validation
      - Brand-aware insight generation
      - Competitive analysis
      - Loyalty trend explanation
    brand_context: enabled

  LearnBot:
    version: v1.6
    functions:
      - Onboarding tips
      - Brand profile tutorials
      - Generational insights education
      - Context-aware highlight
    brand_education: enabled

  VibeTestBot:
    version: v1.1
    functions:
      - Widget rendering validation
      - Brand data integrity checks
      - SQL connection validation
      - Click path testing
    brand_validation: enabled

  BrandBot:
    version: v1.0
    functions:
      - Brand intelligence queries
      - Emotional analysis interpretation
      - Bundling recommendations
      - Cross-brand insights
      - Competitive positioning
    capabilities: [emotional_analysis, bundling_engine, generational_insights]

  Caca:
    version: v1.1
    functions:
      - QA orchestration
      - YAML manifest checking
      - Brand data quality assurance
    brand_audits: enabled

  Dash:
    version: v1.0
    functions:
      - Layout audit
      - Visual regression detection
      - Brand UI component validation
    brand_ui_checks: enabled

build:
  framework: Next.js 14
  ui: Tailwind CSS + Cruip UI
  state: Zustand
  data_source: Supabase + SQL Server
  brand_intelligence: Enhanced Brand Dictionary + Emotional Context + Bundling Engine
  ai_backend: Pulser Agents with Brand Context
  ci_cd: Vercel (GitHub main)

sql_server_integration:
  schema: 
    - BrandDictionary (7 tables)
    - EmotionalInsights (3 tables)
    - BundlingOpportunities (3 tables)
  procedures: 8 stored procedures
  api_layer: TypeScript service with connection pooling
  fallback: TypeScript data models

brand_data_inventory:
  total_brands: 100+
  enhanced_profiles: 3 (Alaska, Oishi, Del Monte)
  color_associations: 13
  generational_patterns: 12 (4 generations × 3 brands)
  behavioral_descriptions: 36
  emotional_triggers: 27
  bundling_opportunities: 4
  contextual_factors: 30

audits:
  # Existing audits
  - check: All pages load
  - check: No undefined props
  - check: All navigation links work
  - check: VibeTestBot passes
  - check: LearnBot loads on each page
  - check: KPI cards have live or stub fallback
  
  # NEW Brand Intelligence audits
  - check: Brand Dictionary fuzzy matching works
  - check: SQL Server connection with fallback
  - check: All brand profiles render correctly
  - check: Generational affinity charts display
  - check: Emotional context analysis functional
  - check: Bundling opportunities calculate ROI
  - check: Cross-brand associations load
  - check: BrandBot responds to queries
  - check: Brand-aware RetailBot context works
  - check: Color psychology visualization renders

performance_targets:
  brand_profile_load: < 500ms
  fuzzy_matching: < 100ms per query
  sql_server_response: < 1s with connection pooling
  ui_component_render: < 200ms
  brand_analytics_calculation: < 2s
```

⸻

## 🔄 Migration Strategy from v3.2.0 to v3.3.0

### **Phase 1: Brand Dictionary Enhancement**
1. **Preserve existing fuzzy matching** - Keep current 100+ brand detection
2. **Add sophisticated profiles** - Enhance key brands with deep insights
3. **Deploy SQL Server schema** - Execute migration scripts
4. **Integrate API layer** - TypeScript service with fallback

### **Phase 2: UI Enhancement**
1. **Add Brand Intelligence page** - New navigation item
2. **Enhance existing pages** - Brand-aware components
3. **Update agents** - Brand context integration
4. **Add BrandBot** - New AI specialist

### **Phase 3: Analytics Enhancement**
1. **Emotional Context Analyzer** - Decision triggers and patterns
2. **Bundling Opportunities Engine** - ROI calculations
3. **Cross-brand Analysis** - Competitive intelligence
4. **Performance optimization** - Caching and indexing

⸻

## ✅ Delivery Checklist

### **Brand Intelligence Core:**
- [ ] Enhanced Brand Dictionary (detection + analytics layers)
- [ ] SQL Server schema deployed (7 tables, 8 procedures)
- [ ] TypeScript API service with connection pooling
- [ ] Emotional Context Analyzer functional
- [ ] Bundling Opportunities Engine with ROI calculations
- [ ] Advanced Brand Intelligence UI page

### **Agent Integration:**
- [ ] RetailBot v2.1 with brand awareness
- [ ] LearnBot v1.6 with brand education
- [ ] VibeTestBot v1.1 with brand validation
- [ ] BrandBot v1.0 deployment
- [ ] Brand-aware context in Scout AI Chat

### **Data Quality:**
- [ ] 100+ brands with fuzzy matching
- [ ] 3 enhanced brand profiles (Alaska, Oishi, Del Monte)
- [ ] 12 generational patterns with behaviors
- [ ] 27 emotional triggers mapped
- [ ] 4 bundling opportunities with ROI analysis

### **UI/UX:**
- [ ] Interactive brand profile components
- [ ] Generational affinity visualization
- [ ] Color psychology display
- [ ] Bundling opportunities dashboard
- [ ] Cross-brand analysis interface

### **Performance & Reliability:**
- [ ] All existing audit checks pass
- [ ] Brand intelligence audits pass
- [ ] SQL Server integration with fallback
- [ ] Performance targets met
- [ ] CI/CD pipeline updated

⸻

**Files to Generate:**
• `releases/scout-v3.3.0.yaml` - Production deployment manifest
• `RELEASE_NOTES_v3.3.0.md` - User-facing changelog
• `MIGRATION_GUIDE_v3.2_to_v3.3.md` - Technical migration steps

**Ready for :clodrep deployment lock and production release.**