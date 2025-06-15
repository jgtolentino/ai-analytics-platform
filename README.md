# AI Analytics Platform - Unified Monorepo

**TBWA's Unified AI Analytics Platform** - Consolidating Scout Analytics (Retail Intelligence) and CES (Creative Effectiveness System) into a single, powerful analytics platform.

## 🏗️ Architecture Overview

```
ai-analytics-platform/
├── apps/
│   ├── scout-dashboard/           # Scout Analytics UI (retail intelligence)
│   └── ces-insights/              # CES Creative Intelligence UI
├── etl/
│   ├── scout/                     # Retail data pipelines & synthetic generators
│   └── ces/                       # Google Drive > SQL ETL for creative assets
├── sql/
│   ├── scout_schema.sql           # DBO schema (retail KPIs, transactions)
│   └── ces_schema.sql             # CES schema (creative assets, audit logs)
├── agents/
│   ├── yummy.yaml                 # ETL controller for both Scout + CES
│   ├── caca.yaml                  # QA validator for both schemas
│   └── learnbot.yaml              # Tutorial overlay system
├── supabase/
│   ├── migrations/                # Database migrations
│   └── functions/                 # Edge functions
└── config/
    ├── deployment_registry.yaml   # Unified deployment tracking
    └── skr/                       # Strategy Knowledge Repository
        ├── scout.yaml
        └── ces.yaml
```

## 🎯 Unified Platform Features

### **Scout Analytics** (Retail Intelligence)
- **Real-time Insights**: 5,000+ daily transactions across 17 Philippine regions
- **Brand Performance**: Alaska, Oishi, Del Monte, Peerless, JTI tracking
- **Consumer Intelligence**: Shopping patterns, demographics, churn prediction
- **Market Intelligence**: Competitive analysis, trend forecasting
- **Performance**: <100ms query response time

### **CES Creative Intelligence**
- **Creative Analysis**: AI-powered effectiveness scoring
- **Campaign Optimization**: Asset analysis from Google Drive
- **Business Outcomes**: ROI, engagement, brand equity prediction
- **Strategy Consultation**: Ask CES conversational AI
- **Framework**: 5-pillar CES methodology

## 🔧 Technical Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Azure OpenAI + PostgreSQL + Edge Functions
- **Database**: Shared PostgreSQL with dual schemas (DBO + CES)
- **Deployment**: Vercel (scout-mvp.vercel.app)
- **AI**: Azure OpenAI API (standardized across all agents)
- **QA**: Caca validation framework (85%+ test coverage)

## 🚀 Deployment Targets

| Service | URL | Purpose |
|---------|-----|---------|
| **Scout Dashboard** | https://scout-mvp.vercel.app | Retail analytics interface |
| **Ask CES API** | https://scout-mvp.vercel.app/api/ask-ces | Creative intelligence assistant |
| **QA Validation** | https://scout-mvp.vercel.app/api/qa/caca | Automated testing endpoint |

## 📊 Data Architecture

### **Shared PostgreSQL Database**
- **`dbo` schema**: Scout Analytics (retail transactions, customers, SKUs)
- **`ces` schema**: Creative assets, campaign analysis, audit logs

### **ETL Pipelines**
- **Scout**: Synthetic data generation + real POS integration
- **CES**: Google Drive asset extraction + creative analysis

### **AI Agents**
- **Yummy**: ETL orchestration for both platforms
- **Caca**: Cross-platform QA validation 
- **LearnBot**: Interactive tutorial system

## 🎨 Brand Coverage

| Brand | Category | Target Market | Key Metrics |
|-------|----------|---------------|-------------|
| **Alaska** | Dairy & Nutrition | Families with children | Market share, velocity, distribution |
| **Oishi** | Snacks & Confectionery | Kids, teens, young adults | Category share, trial rate, repeat purchase |
| **Del Monte** | Processed Foods | Busy families | Category penetration, basket share, loyalty |
| **Peerless** | Beverages | Mass market | Volume share, price position, availability |
| **JTI** | Tobacco | Adult smokers | Market share, price premium, distribution |

## 🌏 Regional Intelligence

| Region | Population | Characteristics | Consumer Behavior |
|--------|------------|-----------------|-------------------|
| **NCR** | 13M+ | Urban, high income | Brand conscious, convenience-focused |
| **Region 3** | 12M+ | Mixed urban/rural | Value conscious, family-oriented |
| **Region 4A** | 14M+ | Suburban, middle class | Aspirational, brand-aware |
| **Visayas** | 20M+ | Island provinces | Regional preferences, price-sensitive |
| **Mindanao** | 25M+ | Agricultural, diverse | Local preferences, value-focused |

## 🧠 AI Capabilities

### **Context-Aware Intelligence**
- Brand-specific insights and recommendations
- Regional market customization
- Time-based trend analysis
- Consumer behavior prediction

### **Unified LLM Backend**
- Azure OpenAI standardization across all agents
- Scout prompts for retail analysis
- CES prompts for creative effectiveness
- Legacy compatibility for existing integrations

### **Quality Assurance**
- Automated regression testing via Caca framework
- Performance benchmarking and monitoring
- Response quality validation (>80% keyword relevance)
- Context accuracy verification

## 📈 Performance Metrics

| Metric | Target | Current Status |
|--------|--------|----------------|
| **Query Response Time** | <100ms | ✅ Achieved |
| **Data Freshness** | <15 minutes | ✅ Achieved |
| **System Uptime** | 99.9% | ✅ Monitored |
| **Test Coverage** | 85%+ | ✅ Achieved |
| **User Satisfaction** | 4.5+ CSAT | 🎯 Target |

## 🔄 Development Workflow

### **Setup Commands**
```bash
# Install dependencies
npm install

# Start development servers
npm run dev:scout          # Scout Analytics dashboard
npm run dev:ces            # CES Creative Intelligence

# Run tests
npm run test:caca          # QA validation suite
npm run test:integration   # Cross-platform integration tests

# Deploy
npm run deploy:production  # Deploy to scout-mvp.vercel.app
```

### **Database Operations**
```bash
# Run migrations
npm run db:migrate

# Seed Scout data
npm run seed:scout

# ETL CES assets
npm run etl:ces

# Validate schemas
npm run validate:schemas
```

## 🛡️ Security & Compliance

- **Authentication**: Supabase Auth with SSO
- **Authorization**: Row Level Security (RLS)
- **Encryption**: TLS 1.3 + AES-256 at rest
- **API Security**: Rate limiting + input validation
- **Compliance**: SOC 2 Type II ready, GDPR framework

## 💰 Cost Optimization

| Service | Monthly Cost | Optimization Strategy |
|---------|--------------|----------------------|
| **Azure OpenAI** | $500 | Prompt optimization + caching |
| **Vercel Pro** | $95 | Edge deployment + CDN |
| **Supabase** | $25 | Connection pooling |
| **Monitoring** | $50 | Datadog + Sentry |
| **Total** | **$670** | 40% reduction through consolidation |

## 🗺️ Roadmap

### **Q1 2025**
- ✅ Monorepo consolidation complete
- ✅ Azure OpenAI standardization
- ✅ Unified deployment pipeline
- 🎯 Advanced ML models integration

### **Q2 2025**
- 🎯 Multi-tenant architecture
- 🎯 Southeast Asia expansion
- 🎯 White-label platform options
- 🎯 Mobile app development

### **Q3 2025**
- 🎯 AR/VR data visualization
- 🎯 IoT sensor integration
- 🎯 Advanced AI capabilities
- 🎯 API platform expansion

## 🤝 Contributing

1. **Branch Strategy**: Feature branches from `main`
2. **Code Quality**: ESLint + Prettier + TypeScript strict mode
3. **Testing**: 85%+ coverage required via Caca framework
4. **Documentation**: Update SKR files for major changes
5. **Deployment**: Automated via GitHub Actions

## 📞 Support

- **Technical Issues**: Create GitHub issue with `bug` label
- **Feature Requests**: Create GitHub issue with `enhancement` label  
- **Documentation**: Update relevant SKR files in `config/skr/`
- **Emergency**: Contact platform team via Slack

---

**🚀 Powered by Azure OpenAI • Built with Next.js • Deployed on Vercel**

> "Transforming retail intelligence and creative effectiveness into unified business advantage"