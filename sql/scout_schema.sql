-- Scout Analytics Schema (DBO)
-- Philippine Retail Intelligence Database Schema
-- Version: 2.0
-- Last Updated: 2025-01-15

-- =====================================================
-- SCOUT ANALYTICS CORE SCHEMA
-- =====================================================

-- Create DBO schema for Scout Analytics
CREATE SCHEMA IF NOT EXISTS dbo;

-- Set default schema
SET search_path TO dbo, public;

-- =====================================================
-- MASTER DATA TABLES
-- =====================================================

-- Regional hierarchy for Philippine market
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_code VARCHAR(10) UNIQUE NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    population BIGINT,
    characteristics JSONB,
    consumer_behavior JSONB,
    retail_landscape VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Philippine regions
INSERT INTO regions (region_code, region_name, population, characteristics, consumer_behavior, retail_landscape) VALUES
('NCR', 'National Capital Region', 13000000, 
 '{"urban": true, "high_income": true, "diverse": true}',
 '{"brand_conscious": true, "convenience_focused": true}',
 'modern_trade_dominant'),
('R3', 'Region 3 (Central Luzon)', 12000000,
 '{"mixed_urban_rural": true, "agricultural": true}',
 '{"value_conscious": true, "family_oriented": true}',
 'traditional_modern_mix'),
('R4A', 'Region 4A (CALABARZON)', 14000000,
 '{"suburban": true, "growing_middle_class": true}',
 '{"aspirational": true, "brand_aware": true}',
 'expanding_modern_trade'),
('VIS', 'Visayas', 20000000,
 '{"island_provinces": true, "diverse_economies": true}',
 '{"regional_preferences": true, "price_sensitive": true}',
 'traditional_modern_mix'),
('MIN', 'Mindanao', 25000000,
 '{"agricultural": true, "diverse_cultures": true}',
 '{"local_preferences": true, "value_focused": true}',
 'traditional_trade_strong');

-- Brand master data
CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    brand_code VARCHAR(20) UNIQUE NOT NULL,
    brand_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    market_position VARCHAR(50),
    target_demographics JSONB,
    brand_values JSONB,
    owner_company VARCHAR(100),
    launch_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert TBWA brand portfolio
INSERT INTO brands (brand_code, brand_name, category, market_position, target_demographics, brand_values, owner_company) VALUES
('ALASKA', 'Alaska', 'Dairy & Nutrition', 'premium', 
 '["families_with_children", "health_conscious"]',
 '["nutrition", "family", "trust", "quality"]',
 'Alaska Milk Corporation'),
('OISHI', 'Oishi', 'Snacks & Confectionery', 'innovation_leader',
 '["kids", "teens", "young_adults"]',
 '["fun", "innovation", "taste", "excitement"]',
 'Liwayway Holdings Company Limited'),
('DELMONTE', 'Del Monte', 'Processed Foods', 'trusted_brand',
 '["busy_families", "working_professionals"]',
 '["quality", "convenience", "nutrition", "reliability"]',
 'Del Monte Pacific Limited'),
('PEERLESS', 'Peerless', 'Beverages', 'local_champion',
 '["mass_market", "value_conscious"]',
 '["local_pride", "affordability", "refreshment", "community"]',
 'Peerless Products Manufacturing Corporation'),
('JTI', 'JTI', 'Tobacco', 'international_player',
 '["adult_smokers"]',
 '["quality", "heritage", "responsibility"]',
 'Japan Tobacco International');

-- Store/outlet master data
CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    store_code VARCHAR(50) UNIQUE NOT NULL,
    store_name VARCHAR(200) NOT NULL,
    region_id INTEGER REFERENCES regions(region_id),
    store_type VARCHAR(50), -- supermarket, convenience, sari_sari, ecommerce
    chain_name VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    coordinates POINT,
    size_category VARCHAR(20), -- small, medium, large
    status VARCHAR(20) DEFAULT 'active',
    opened_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product (SKU) master data
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    sku_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    brand_id INTEGER REFERENCES brands(brand_id),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    variant VARCHAR(100),
    size VARCHAR(50),
    unit_of_measure VARCHAR(20),
    package_type VARCHAR(50),
    recommended_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    launch_date DATE,
    discontinue_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    product_attributes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer demographics and segmentation
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE,
    region_id INTEGER REFERENCES regions(region_id),
    age_group VARCHAR(20), -- 18-24, 25-34, 35-44, 45-54, 55+
    gender VARCHAR(10),
    income_level VARCHAR(20), -- low, middle, high
    household_size INTEGER,
    occupation_category VARCHAR(50),
    lifestyle_segment VARCHAR(50), -- value_seekers, premium_buyers, brand_loyalists
    preferred_channels JSONB,
    shopping_frequency VARCHAR(20),
    acquisition_date DATE,
    last_purchase_date DATE,
    total_lifetime_value DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TRANSACTIONAL DATA TABLES
-- =====================================================

-- Main transaction table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    transaction_code VARCHAR(100) UNIQUE NOT NULL,
    store_id INTEGER REFERENCES stores(store_id),
    customer_id INTEGER REFERENCES customers(customer_id),
    transaction_date DATE NOT NULL,
    transaction_time TIME,
    total_amount DECIMAL(12,2) NOT NULL,
    total_quantity INTEGER NOT NULL,
    total_items INTEGER NOT NULL,
    payment_method VARCHAR(50),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    channel VARCHAR(50), -- in_store, online, mobile_app
    cashier_id VARCHAR(50),
    receipt_number VARCHAR(100),
    promotion_codes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction line items
CREATE TABLE transaction_items (
    item_id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(transaction_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    line_number INTEGER,
    promotion_applied BOOLEAN DEFAULT FALSE,
    promotion_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANALYTICS & INSIGHTS TABLES
-- =====================================================

-- Daily aggregated metrics per store/brand/product
CREATE TABLE daily_metrics (
    metric_id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    store_id INTEGER REFERENCES stores(store_id),
    brand_id INTEGER REFERENCES brands(brand_id),
    product_id INTEGER REFERENCES products(product_id),
    region_id INTEGER REFERENCES regions(region_id),
    total_sales DECIMAL(12,2),
    total_units INTEGER,
    transaction_count INTEGER,
    unique_customers INTEGER,
    average_basket_size DECIMAL(10,2),
    market_share DECIMAL(5,2),
    velocity DECIMAL(10,2), -- units per store per day
    stockout_flag BOOLEAN DEFAULT FALSE,
    promotion_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(metric_date, store_id, brand_id, product_id)
);

-- Customer behavior analytics
CREATE TABLE customer_behavior (
    behavior_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    analysis_date DATE NOT NULL,
    purchase_frequency DECIMAL(5,2), -- purchases per month
    average_basket_value DECIMAL(10,2),
    preferred_brands JSONB,
    preferred_categories JSONB,
    seasonal_patterns JSONB,
    churn_risk_score DECIMAL(3,2), -- 0-1 probability
    loyalty_score DECIMAL(3,2), -- 0-1 loyalty index
    next_purchase_prediction DATE,
    customer_lifetime_value DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(customer_id, analysis_date)
);

-- Market share and competitive intelligence
CREATE TABLE market_intelligence (
    intel_id SERIAL PRIMARY KEY,
    analysis_date DATE NOT NULL,
    region_id INTEGER REFERENCES regions(region_id),
    category VARCHAR(100),
    brand_id INTEGER REFERENCES brands(brand_id),
    market_share_value DECIMAL(5,2), -- percentage
    market_share_volume DECIMAL(5,2), -- percentage
    competitive_index DECIMAL(5,2), -- relative to category average
    price_position VARCHAR(20), -- premium, mainstream, value
    distribution_coverage DECIMAL(5,2), -- percentage of stores
    promotion_intensity DECIMAL(5,2), -- percentage of sales on promotion
    trend_direction VARCHAR(10), -- growing, stable, declining
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(analysis_date, region_id, category, brand_id)
);

-- Product substitution and cannibalization analysis
CREATE TABLE substitution_analysis (
    substitution_id SERIAL PRIMARY KEY,
    analysis_date DATE NOT NULL,
    primary_product_id INTEGER REFERENCES products(product_id),
    substitute_product_id INTEGER REFERENCES products(product_id),
    substitution_rate DECIMAL(5,4), -- 0-1 probability
    cannibalization_impact DECIMAL(10,2), -- revenue impact
    cross_elasticity DECIMAL(8,4),
    affinity_score DECIMAL(3,2), -- basket affinity
    regional_variance JSONB, -- substitution patterns by region
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(analysis_date, primary_product_id, substitute_product_id)
);

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Indexes for query performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_store ON transactions(store_id);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transaction_items_product ON transaction_items(product_id);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date);
CREATE INDEX idx_daily_metrics_composite ON daily_metrics(metric_date, store_id, brand_id);

-- Materialized views for dashboard performance
CREATE MATERIALIZED VIEW mv_brand_performance AS
SELECT 
    b.brand_name,
    r.region_name,
    dm.metric_date,
    SUM(dm.total_sales) as total_sales,
    SUM(dm.total_units) as total_units,
    AVG(dm.market_share) as avg_market_share,
    COUNT(DISTINCT dm.store_id) as store_count
FROM daily_metrics dm
JOIN brands b ON dm.brand_id = b.brand_id
JOIN regions r ON dm.region_id = r.region_id
WHERE dm.metric_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY b.brand_name, r.region_name, dm.metric_date;

CREATE MATERIALIZED VIEW mv_transaction_trends AS
SELECT 
    transaction_date,
    COUNT(*) as transaction_count,
    SUM(total_amount) as total_sales,
    AVG(total_amount) as avg_basket_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM transactions
WHERE transaction_date >= CURRENT_DATE - INTERVAL '365 days'
GROUP BY transaction_date
ORDER BY transaction_date;

-- Refresh materialized views function
CREATE OR REPLACE FUNCTION refresh_scout_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mv_brand_performance;
    REFRESH MATERIALIZED VIEW mv_transaction_trends;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SCOUT ANALYTICS FUNCTIONS
-- =====================================================

-- Get brand performance summary
CREATE OR REPLACE FUNCTION get_brand_performance(
    p_brand_code VARCHAR DEFAULT NULL,
    p_region_code VARCHAR DEFAULT NULL,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    brand_name VARCHAR,
    region_name VARCHAR,
    total_sales DECIMAL,
    total_units INTEGER,
    market_share DECIMAL,
    growth_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.brand_name,
        r.region_name,
        SUM(dm.total_sales)::DECIMAL as total_sales,
        SUM(dm.total_units)::INTEGER as total_units,
        AVG(dm.market_share)::DECIMAL as market_share,
        CASE 
            WHEN LAG(SUM(dm.total_sales)) OVER (PARTITION BY b.brand_id, r.region_id ORDER BY dm.metric_date) > 0
            THEN ((SUM(dm.total_sales) - LAG(SUM(dm.total_sales)) OVER (PARTITION BY b.brand_id, r.region_id ORDER BY dm.metric_date)) 
                  / LAG(SUM(dm.total_sales)) OVER (PARTITION BY b.brand_id, r.region_id ORDER BY dm.metric_date) * 100)::DECIMAL
            ELSE 0::DECIMAL
        END as growth_rate
    FROM daily_metrics dm
    JOIN brands b ON dm.brand_id = b.brand_id
    JOIN regions r ON dm.region_id = r.region_id
    WHERE dm.metric_date >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    AND (p_brand_code IS NULL OR b.brand_code = p_brand_code)
    AND (p_region_code IS NULL OR r.region_code = p_region_code)
    GROUP BY b.brand_name, r.region_name, b.brand_id, r.region_id, dm.metric_date
    ORDER BY total_sales DESC;
END;
$$ LANGUAGE plpgsql;

-- Get consumer insights
CREATE OR REPLACE FUNCTION get_consumer_insights(
    p_region_code VARCHAR DEFAULT NULL,
    p_segment VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    customer_segment VARCHAR,
    customer_count INTEGER,
    avg_basket_value DECIMAL,
    purchase_frequency DECIMAL,
    top_brands JSONB,
    churn_risk DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.lifestyle_segment as customer_segment,
        COUNT(*)::INTEGER as customer_count,
        AVG(cb.average_basket_value)::DECIMAL as avg_basket_value,
        AVG(cb.purchase_frequency)::DECIMAL as purchase_frequency,
        jsonb_agg(cb.preferred_brands) as top_brands,
        AVG(cb.churn_risk_score)::DECIMAL as churn_risk
    FROM customers c
    JOIN customer_behavior cb ON c.customer_id = cb.customer_id
    JOIN regions r ON c.region_id = r.region_id
    WHERE cb.analysis_date >= CURRENT_DATE - INTERVAL '7 days'
    AND (p_region_code IS NULL OR r.region_code = p_region_code)
    AND (p_segment IS NULL OR c.lifestyle_segment = p_segment)
    GROUP BY c.lifestyle_segment
    ORDER BY customer_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Get transaction trends
CREATE OR REPLACE FUNCTION get_transaction_trends(
    p_days_back INTEGER DEFAULT 90
)
RETURNS TABLE (
    trend_date DATE,
    transaction_count INTEGER,
    total_sales DECIMAL,
    avg_basket_value DECIMAL,
    growth_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        transaction_date as trend_date,
        COUNT(*)::INTEGER as transaction_count,
        SUM(total_amount)::DECIMAL as total_sales,
        AVG(total_amount)::DECIMAL as avg_basket_value,
        CASE 
            WHEN LAG(SUM(total_amount)) OVER (ORDER BY transaction_date) > 0
            THEN ((SUM(total_amount) - LAG(SUM(total_amount)) OVER (ORDER BY transaction_date)) 
                  / LAG(SUM(total_amount)) OVER (ORDER BY transaction_date) * 100)::DECIMAL
            ELSE 0::DECIMAL
        END as growth_rate
    FROM transactions
    WHERE transaction_date >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY transaction_date
    ORDER BY transaction_date;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Create policies for data access control
CREATE POLICY scout_analytics_policy ON customers
    FOR ALL
    TO authenticated
    USING (true); -- Customize based on user roles

CREATE POLICY scout_transactions_policy ON transactions
    FOR ALL
    TO authenticated
    USING (true); -- Customize based on user roles

-- =====================================================
-- DATA VALIDATION & CONSTRAINTS
-- =====================================================

-- Check constraints for data quality
ALTER TABLE transactions ADD CONSTRAINT chk_positive_amount 
    CHECK (total_amount >= 0);

ALTER TABLE transaction_items ADD CONSTRAINT chk_positive_quantity 
    CHECK (quantity > 0);

ALTER TABLE daily_metrics ADD CONSTRAINT chk_market_share_range 
    CHECK (market_share >= 0 AND market_share <= 100);

-- =====================================================
-- COMMENTS & DOCUMENTATION
-- =====================================================

COMMENT ON SCHEMA dbo IS 'Scout Analytics - Philippine Retail Intelligence Database Schema';
COMMENT ON TABLE brands IS 'Master data for TBWA brand portfolio (Alaska, Oishi, Del Monte, Peerless, JTI)';
COMMENT ON TABLE regions IS 'Philippine regional hierarchy and market characteristics';
COMMENT ON TABLE transactions IS 'Point-of-sale transaction records across retail outlets';
COMMENT ON TABLE daily_metrics IS 'Pre-aggregated daily performance metrics for dashboard queries';
COMMENT ON FUNCTION get_brand_performance IS 'Returns brand performance summary with growth rates';
COMMENT ON MATERIALIZED VIEW mv_brand_performance IS 'Optimized view for brand performance dashboards - refreshed every 15 minutes';

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Create scheduled job to refresh materialized views (if using pg_cron)
-- SELECT cron.schedule('refresh-scout-views', '*/15 * * * *', 'SELECT refresh_scout_analytics_views();');

-- Grant permissions for application users
-- GRANT USAGE ON SCHEMA dbo TO scout_app_user;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA dbo TO scout_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA dbo TO scout_app_user;