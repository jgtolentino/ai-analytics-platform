-- CES (Creative Effectiveness System) Schema
-- TBWA Creative Intelligence Database Schema
-- Version: 2.0
-- Last Updated: 2025-01-15

-- =====================================================
-- CES CREATIVE INTELLIGENCE SCHEMA
-- =====================================================

-- Create CES schema for Creative Effectiveness System
CREATE SCHEMA IF NOT EXISTS ces;

-- Set search path
SET search_path TO ces, public;

-- =====================================================
-- CAMPAIGN & PROJECT MANAGEMENT
-- =====================================================

-- Campaign master data
CREATE TABLE campaigns (
    campaign_id SERIAL PRIMARY KEY,
    campaign_code VARCHAR(50) UNIQUE NOT NULL,
    campaign_name VARCHAR(200) NOT NULL,
    brand_name VARCHAR(100), -- Links to Scout brands
    client_name VARCHAR(100),
    agency VARCHAR(100) DEFAULT 'TBWA',
    campaign_type VARCHAR(50), -- awareness, conversion, consideration
    industry VARCHAR(100),
    region VARCHAR(100),
    target_audience JSONB,
    budget DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'PHP',
    start_date DATE,
    end_date DATE,
    launch_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, completed, cancelled
    objectives JSONB,
    kpis JSONB,
    creative_brief TEXT,
    strategy_summary TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creative asset management
CREATE TABLE creative_assets (
    asset_id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(campaign_id),
    asset_code VARCHAR(100) UNIQUE NOT NULL,
    asset_name VARCHAR(200) NOT NULL,
    asset_type VARCHAR(50), -- video, image, audio, document, presentation
    format VARCHAR(50), -- mp4, jpg, png, pdf, pptx
    file_path TEXT,
    google_drive_id VARCHAR(200),
    file_size_bytes BIGINT,
    duration_seconds INTEGER, -- for video/audio assets
    dimensions VARCHAR(50), -- for visual assets
    aspect_ratio VARCHAR(20),
    resolution VARCHAR(50),
    content_text TEXT, -- extracted text content
    visual_description TEXT,
    audio_description TEXT,
    technical_metadata JSONB,
    creative_metadata JSONB,
    tags JSONB,
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active',
    created_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyzed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign performance metrics
CREATE TABLE campaign_performance (
    performance_id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(campaign_id),
    metric_date DATE NOT NULL,
    channel VARCHAR(100), -- digital, tv, radio, print, ooh, social
    platform VARCHAR(100), -- facebook, youtube, tv_network, etc.
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    spend DECIMAL(15,2) DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    reach BIGINT DEFAULT 0,
    frequency DECIMAL(5,2) DEFAULT 0,
    ctr DECIMAL(8,4) DEFAULT 0, -- click-through rate
    cpm DECIMAL(10,2) DEFAULT 0, -- cost per mille
    cpc DECIMAL(10,2) DEFAULT 0, -- cost per click
    cpa DECIMAL(10,2) DEFAULT 0, -- cost per acquisition
    roas DECIMAL(8,2) DEFAULT 0, -- return on ad spend
    engagement_rate DECIMAL(5,4) DEFAULT 0,
    video_completion_rate DECIMAL(5,4) DEFAULT 0,
    brand_recall DECIMAL(5,2) DEFAULT 0,
    brand_recognition DECIMAL(5,2) DEFAULT 0,
    sentiment_score DECIMAL(3,2) DEFAULT 0, -- -1 to 1
    share_rate DECIMAL(5,4) DEFAULT 0,
    save_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, metric_date, channel, platform)
);

-- =====================================================
-- CES FRAMEWORK & ANALYSIS
-- =====================================================

-- CES creative features scoring
CREATE TABLE creative_feature_scores (
    score_id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES creative_assets(asset_id),
    campaign_id INTEGER REFERENCES campaigns(campaign_id),
    analysis_date DATE NOT NULL,
    analyst_type VARCHAR(50), -- ai_analysis, human_expert, hybrid
    
    -- Core CES Pillars (0-10 scale)
    memorability DECIMAL(3,1), 
    brand_connection DECIMAL(3,1),
    emotional_resonance DECIMAL(3,1),
    clear_communication DECIMAL(3,1),
    action_strength DECIMAL(3,1),
    
    -- Content Features
    visual_impact DECIMAL(3,1),
    storytelling_quality DECIMAL(3,1),
    brand_integration DECIMAL(3,1),
    message_hierarchy DECIMAL(3,1),
    
    -- Design Features
    color_psychology DECIMAL(3,1),
    typography_effectiveness DECIMAL(3,1),
    layout_composition DECIMAL(3,1),
    visual_consistency DECIMAL(3,1),
    
    -- Messaging Features
    headline_strength DECIMAL(3,1),
    copy_clarity DECIMAL(3,1),
    tone_appropriateness DECIMAL(3,1),
    action_oriented_language DECIMAL(3,1),
    
    -- Targeting Features
    audience_relevance DECIMAL(3,1),
    cultural_sensitivity DECIMAL(3,1),
    demographic_alignment DECIMAL(3,1),
    psychographic_match DECIMAL(3,1),
    
    -- Channel Features
    format_optimization DECIMAL(3,1),
    platform_native_feel DECIMAL(3,1),
    technical_quality DECIMAL(3,1),
    cross_platform_consistency DECIMAL(3,1),
    
    -- Overall CES Score
    total_ces_score DECIMAL(4,1),
    ces_grade VARCHAR(5), -- A+, A, A-, B+, B, B-, C+, C, C-
    
    -- Analysis metadata
    confidence_score DECIMAL(3,2), -- 0-1 confidence in analysis
    analysis_method JSONB,
    feature_weights JSONB,
    analyst_notes TEXT,
    
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(asset_id, analysis_date, analyst_type)
);

-- Business outcome predictions
CREATE TABLE business_outcome_predictions (
    prediction_id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(campaign_id),
    asset_id INTEGER REFERENCES creative_assets(asset_id),
    analysis_date DATE NOT NULL,
    prediction_model VARCHAR(100),
    
    -- Business Outcomes (0-10 scale)
    media_efficiency DECIMAL(3,1), -- cost-effectiveness
    conversion_potential DECIMAL(3,1), -- purchase intent
    brand_equity_impact DECIMAL(3,1), -- brand building
    engagement_potential DECIMAL(3,1), -- audience engagement
    
    -- Performance Predictions
    predicted_ctr DECIMAL(5,4),
    predicted_conversion_rate DECIMAL(5,4),
    predicted_brand_recall DECIMAL(5,2),
    predicted_engagement_rate DECIMAL(5,4),
    predicted_roi DECIMAL(8,2),
    predicted_reach_potential DECIMAL(5,2),
    
    -- Risk Assessments
    performance_risk VARCHAR(20), -- low, medium, high
    brand_safety_risk VARCHAR(20),
    execution_complexity VARCHAR(20),
    
    -- Confidence intervals
    prediction_confidence DECIMAL(3,2), -- 0-1
    lower_bound JSONB, -- lower confidence intervals
    upper_bound JSONB, -- upper confidence intervals
    
    model_version VARCHAR(20),
    training_data_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, asset_id, analysis_date, prediction_model)
);

-- Creative optimization recommendations
CREATE TABLE optimization_recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES creative_assets(asset_id),
    campaign_id INTEGER REFERENCES campaigns(campaign_id),
    analysis_date DATE NOT NULL,
    
    recommendation_type VARCHAR(50), -- feature_improvement, outcome_optimization, creative_iteration
    priority VARCHAR(20), -- high, medium, low
    category VARCHAR(50), -- content, design, messaging, targeting, channel
    
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    rationale TEXT,
    expected_impact TEXT,
    implementation_effort VARCHAR(20), -- low, medium, high
    estimated_timeline VARCHAR(50),
    
    -- Specific recommendations
    feature_to_improve VARCHAR(100),
    current_score DECIMAL(3,1),
    target_score DECIMAL(3,1),
    improvement_actions JSONB,
    
    -- Success metrics
    success_criteria JSONB,
    measurement_method TEXT,
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, implemented, rejected
    implementation_notes TEXT,
    results_summary TEXT,
    
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMPETITIVE ANALYSIS & BENCHMARKING
-- =====================================================

-- Competitive creative analysis
CREATE TABLE competitive_analysis (
    analysis_id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(campaign_id),
    competitor_brand VARCHAR(100),
    competitor_campaign VARCHAR(200),
    analysis_date DATE NOT NULL,
    
    -- Competitive metrics
    share_of_voice DECIMAL(5,2), -- percentage
    creative_similarity_score DECIMAL(3,2), -- 0-1
    message_differentiation DECIMAL(3,2), -- 0-1
    execution_quality_gap DECIMAL(3,1), -- -10 to 10
    
    -- CES comparison
    competitor_ces_score DECIMAL(4,1),
    ces_advantage DECIMAL(4,1), -- our score - competitor score
    stronger_features JSONB,
    weaker_features JSONB,
    
    -- Market context
    category_benchmarks JSONB,
    performance_benchmarks JSONB,
    
    insights TEXT,
    strategic_implications TEXT,
    
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AI & AUTOMATION TRACKING
-- =====================================================

-- AI analysis audit trail
CREATE TABLE ai_analysis_logs (
    log_id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES creative_assets(asset_id),
    analysis_type VARCHAR(100), -- feature_scoring, outcome_prediction, content_extraction
    ai_model VARCHAR(100), -- azure_openai_gpt4, custom_ces_model
    model_version VARCHAR(50),
    
    -- Input data
    input_data JSONB,
    context_data JSONB,
    
    -- Processing details
    processing_time_ms INTEGER,
    tokens_used INTEGER,
    api_cost DECIMAL(10,4),
    
    -- Output data
    output_data JSONB,
    confidence_scores JSONB,
    
    -- Quality metrics
    human_validation BOOLEAN,
    accuracy_score DECIMAL(3,2), -- when human validated
    feedback TEXT,
    
    error_message TEXT,
    status VARCHAR(20), -- success, error, timeout
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Drive integration tracking
CREATE TABLE gdrive_sync_logs (
    sync_id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(campaign_id),
    gdrive_folder_id VARCHAR(200),
    sync_type VARCHAR(50), -- full_sync, incremental, asset_update
    
    files_discovered INTEGER DEFAULT 0,
    files_processed INTEGER DEFAULT 0,
    files_failed INTEGER DEFAULT 0,
    
    sync_start_time TIMESTAMP,
    sync_end_time TIMESTAMP,
    sync_duration_seconds INTEGER,
    
    sync_status VARCHAR(20), -- running, completed, failed, partial
    error_details JSONB,
    
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Indexes for query performance
CREATE INDEX idx_campaigns_brand ON campaigns(brand_name);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_creative_assets_campaign ON creative_assets(campaign_id);
CREATE INDEX idx_creative_assets_type ON creative_assets(asset_type);
CREATE INDEX idx_creative_feature_scores_asset ON creative_feature_scores(asset_id);
CREATE INDEX idx_creative_feature_scores_date ON creative_feature_scores(analysis_date);
CREATE INDEX idx_campaign_performance_date ON campaign_performance(metric_date);
CREATE INDEX idx_campaign_performance_campaign ON campaign_performance(campaign_id);

-- Materialized views for CES dashboard performance
CREATE MATERIALIZED VIEW mv_ces_campaign_summary AS
SELECT 
    c.campaign_name,
    c.brand_name,
    c.campaign_type,
    c.status,
    COUNT(ca.asset_id) as asset_count,
    AVG(cfs.total_ces_score) as avg_ces_score,
    MAX(cfs.total_ces_score) as best_ces_score,
    AVG(bop.media_efficiency) as avg_media_efficiency,
    AVG(bop.conversion_potential) as avg_conversion_potential,
    SUM(cp.spend) as total_spend,
    SUM(cp.impressions) as total_impressions,
    AVG(cp.ctr) as avg_ctr,
    c.created_at
FROM campaigns c
LEFT JOIN creative_assets ca ON c.campaign_id = ca.campaign_id
LEFT JOIN creative_feature_scores cfs ON ca.asset_id = cfs.asset_id
LEFT JOIN business_outcome_predictions bop ON ca.asset_id = bop.asset_id
LEFT JOIN campaign_performance cp ON c.campaign_id = cp.campaign_id
WHERE c.created_at >= CURRENT_DATE - INTERVAL '180 days'
GROUP BY c.campaign_id, c.campaign_name, c.brand_name, c.campaign_type, c.status, c.created_at;

CREATE MATERIALIZED VIEW mv_ces_feature_trends AS
SELECT 
    cfs.analysis_date,
    AVG(cfs.memorability) as avg_memorability,
    AVG(cfs.brand_connection) as avg_brand_connection,
    AVG(cfs.emotional_resonance) as avg_emotional_resonance,
    AVG(cfs.clear_communication) as avg_clear_communication,
    AVG(cfs.action_strength) as avg_action_strength,
    AVG(cfs.total_ces_score) as avg_total_ces_score,
    COUNT(*) as analysis_count
FROM creative_feature_scores cfs
WHERE cfs.analysis_date >= CURRENT_DATE - INTERVAL '365 days'
GROUP BY cfs.analysis_date
ORDER BY cfs.analysis_date;

-- Refresh materialized views function
CREATE OR REPLACE FUNCTION refresh_ces_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mv_ces_campaign_summary;
    REFRESH MATERIALIZED VIEW mv_ces_feature_trends;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CES ANALYSIS FUNCTIONS
-- =====================================================

-- Calculate CES score from individual features
CREATE OR REPLACE FUNCTION calculate_ces_score(
    p_memorability DECIMAL DEFAULT 0,
    p_brand_connection DECIMAL DEFAULT 0,
    p_emotional_resonance DECIMAL DEFAULT 0,
    p_clear_communication DECIMAL DEFAULT 0,
    p_action_strength DECIMAL DEFAULT 0
)
RETURNS DECIMAL AS $$
DECLARE
    total_score DECIMAL;
    weighted_score DECIMAL;
BEGIN
    -- CES framework weights: Memorability (25%), Brand Connection (25%), 
    -- Emotional Resonance (20%), Clear Communication (15%), Action Strength (15%)
    weighted_score := (
        p_memorability * 0.25 +
        p_brand_connection * 0.25 +
        p_emotional_resonance * 0.20 +
        p_clear_communication * 0.15 +
        p_action_strength * 0.15
    );
    
    RETURN ROUND(weighted_score, 1);
END;
$$ LANGUAGE plpgsql;

-- Get CES analysis summary
CREATE OR REPLACE FUNCTION get_ces_analysis(
    p_campaign_id INTEGER DEFAULT NULL,
    p_brand_name VARCHAR DEFAULT NULL,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    campaign_name VARCHAR,
    brand_name VARCHAR,
    asset_count INTEGER,
    avg_ces_score DECIMAL,
    strongest_feature VARCHAR,
    weakest_feature VARCHAR,
    optimization_opportunities INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.campaign_name,
        c.brand_name,
        COUNT(DISTINCT ca.asset_id)::INTEGER as asset_count,
        AVG(cfs.total_ces_score)::DECIMAL as avg_ces_score,
        (CASE 
            WHEN AVG(cfs.memorability) >= GREATEST(AVG(cfs.brand_connection), AVG(cfs.emotional_resonance), AVG(cfs.clear_communication), AVG(cfs.action_strength))
                THEN 'memorability'
            WHEN AVG(cfs.brand_connection) >= GREATEST(AVG(cfs.memorability), AVG(cfs.emotional_resonance), AVG(cfs.clear_communication), AVG(cfs.action_strength))
                THEN 'brand_connection'
            WHEN AVG(cfs.emotional_resonance) >= GREATEST(AVG(cfs.memorability), AVG(cfs.brand_connection), AVG(cfs.clear_communication), AVG(cfs.action_strength))
                THEN 'emotional_resonance'
            WHEN AVG(cfs.clear_communication) >= GREATEST(AVG(cfs.memorability), AVG(cfs.brand_connection), AVG(cfs.emotional_resonance), AVG(cfs.action_strength))
                THEN 'clear_communication'
            ELSE 'action_strength'
        END)::VARCHAR as strongest_feature,
        (CASE 
            WHEN AVG(cfs.memorability) <= LEAST(AVG(cfs.brand_connection), AVG(cfs.emotional_resonance), AVG(cfs.clear_communication), AVG(cfs.action_strength))
                THEN 'memorability'
            WHEN AVG(cfs.brand_connection) <= LEAST(AVG(cfs.memorability), AVG(cfs.emotional_resonance), AVG(cfs.clear_communication), AVG(cfs.action_strength))
                THEN 'brand_connection'
            WHEN AVG(cfs.emotional_resonance) <= LEAST(AVG(cfs.memorability), AVG(cfs.brand_connection), AVG(cfs.clear_communication), AVG(cfs.action_strength))
                THEN 'emotional_resonance'
            WHEN AVG(cfs.clear_communication) <= LEAST(AVG(cfs.memorability), AVG(cfs.brand_connection), AVG(cfs.emotional_resonance), AVG(cfs.action_strength))
                THEN 'clear_communication'
            ELSE 'action_strength'
        END)::VARCHAR as weakest_feature,
        COUNT(DISTINCT or_rec.recommendation_id)::INTEGER as optimization_opportunities
    FROM campaigns c
    LEFT JOIN creative_assets ca ON c.campaign_id = ca.campaign_id
    LEFT JOIN creative_feature_scores cfs ON ca.asset_id = cfs.asset_id
    LEFT JOIN optimization_recommendations or_rec ON ca.asset_id = or_rec.asset_id 
        AND or_rec.status = 'pending'
    WHERE cfs.analysis_date >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    AND (p_campaign_id IS NULL OR c.campaign_id = p_campaign_id)
    AND (p_brand_name IS NULL OR c.brand_name = p_brand_name)
    GROUP BY c.campaign_name, c.brand_name
    ORDER BY avg_ces_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Get creative recommendations
CREATE OR REPLACE FUNCTION get_creative_recommendations(
    p_campaign_id INTEGER DEFAULT NULL,
    p_priority VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    recommendation_title VARCHAR,
    campaign_name VARCHAR,
    priority VARCHAR,
    category VARCHAR,
    expected_impact TEXT,
    implementation_effort VARCHAR,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        orec.title::VARCHAR as recommendation_title,
        c.campaign_name::VARCHAR,
        orec.priority::VARCHAR,
        orec.category::VARCHAR,
        orec.expected_impact::TEXT,
        orec.implementation_effort::VARCHAR,
        orec.status::VARCHAR
    FROM optimization_recommendations orec
    JOIN campaigns c ON orec.campaign_id = c.campaign_id
    WHERE (p_campaign_id IS NULL OR orec.campaign_id = p_campaign_id)
    AND (p_priority IS NULL OR orec.priority = p_priority)
    ORDER BY 
        CASE orec.priority 
            WHEN 'high' THEN 1 
            WHEN 'medium' THEN 2 
            WHEN 'low' THEN 3 
        END,
        orec.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_feature_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for data access control
CREATE POLICY ces_campaigns_policy ON campaigns
    FOR ALL
    TO authenticated
    USING (true); -- Customize based on user roles and client access

CREATE POLICY ces_assets_policy ON creative_assets
    FOR ALL
    TO authenticated
    USING (true); -- Customize based on user roles and client access

-- =====================================================
-- DATA VALIDATION & CONSTRAINTS
-- =====================================================

-- Check constraints for CES scores (0-10 scale)
ALTER TABLE creative_feature_scores ADD CONSTRAINT chk_ces_scores_range 
    CHECK (
        memorability >= 0 AND memorability <= 10 AND
        brand_connection >= 0 AND brand_connection <= 10 AND
        emotional_resonance >= 0 AND emotional_resonance <= 10 AND
        clear_communication >= 0 AND clear_communication <= 10 AND
        action_strength >= 0 AND action_strength <= 10 AND
        total_ces_score >= 0 AND total_ces_score <= 10
    );

-- Check constraints for business outcomes (0-10 scale)
ALTER TABLE business_outcome_predictions ADD CONSTRAINT chk_outcome_range 
    CHECK (
        media_efficiency >= 0 AND media_efficiency <= 10 AND
        conversion_potential >= 0 AND conversion_potential <= 10 AND
        brand_equity_impact >= 0 AND brand_equity_impact <= 10 AND
        engagement_potential >= 0 AND engagement_potential <= 10
    );

-- =====================================================
-- COMMENTS & DOCUMENTATION
-- =====================================================

COMMENT ON SCHEMA ces IS 'CES (Creative Effectiveness System) - TBWA Creative Intelligence Database Schema';
COMMENT ON TABLE campaigns IS 'Campaign master data for creative effectiveness analysis';
COMMENT ON TABLE creative_assets IS 'Creative asset metadata and Google Drive integration';
COMMENT ON TABLE creative_feature_scores IS 'AI-powered CES framework scoring (5 pillars + 20 features)';
COMMENT ON TABLE business_outcome_predictions IS 'Predictive analytics for campaign business outcomes';
COMMENT ON TABLE optimization_recommendations IS 'AI-generated recommendations for creative optimization';
COMMENT ON FUNCTION calculate_ces_score IS 'Calculates weighted CES score from 5 core pillars';
COMMENT ON MATERIALIZED VIEW mv_ces_campaign_summary IS 'Campaign performance dashboard view - refreshed every 15 minutes';

-- =====================================================
-- INITIAL SETUP
-- =====================================================

-- Grant permissions for application users
-- GRANT USAGE ON SCHEMA ces TO ces_app_user;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA ces TO ces_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ces TO ces_app_user;