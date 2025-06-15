-- Transaction Count Functions for Dynamic Filtering
-- Provides total and filtered transaction counts
-- Version: 1.0.0

-- Function to get total transactions (unfiltered baseline)
CREATE OR REPLACE FUNCTION get_total_transactions()
RETURNS TABLE(
    total_transactions BIGINT,
    total_revenue NUMERIC,
    avg_order_value NUMERIC,
    unique_customers BIGINT,
    date_range_start DATE,
    date_range_end DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_transactions,
        COALESCE(SUM(t.total_amount), 0)::NUMERIC as total_revenue,
        COALESCE(AVG(t.total_amount), 0)::NUMERIC as avg_order_value,
        COUNT(DISTINCT t.customer_id)::BIGINT as unique_customers,
        MIN(t.transaction_date)::DATE as date_range_start,
        MAX(t.transaction_date)::DATE as date_range_end
    FROM dbo.transactions t;
END;
$$;

-- Function to get filtered transactions with dynamic WHERE clause
CREATE OR REPLACE FUNCTION get_filtered_transactions(
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    region_names TEXT[] DEFAULT NULL,
    brand_names TEXT[] DEFAULT NULL,
    category_names TEXT[] DEFAULT NULL,
    store_names TEXT[] DEFAULT NULL,
    gender_filter TEXT[] DEFAULT NULL,
    weekday_filter TEXT DEFAULT 'all', -- 'weekday', 'weekend', 'all'
    time_periods TEXT[] DEFAULT NULL -- 'morning', 'afternoon', 'evening', 'night'
)
RETURNS TABLE(
    filtered_transactions BIGINT,
    filtered_revenue NUMERIC,
    avg_order_value NUMERIC,
    unique_customers BIGINT,
    filter_ratio NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_count BIGINT;
BEGIN
    -- Get total transaction count for ratio calculation
    SELECT COUNT(*) INTO total_count FROM dbo.transactions;
    
    RETURN QUERY
    SELECT 
        COUNT(t.transaction_id)::BIGINT as filtered_transactions,
        COALESCE(SUM(t.total_amount), 0)::NUMERIC as filtered_revenue,
        COALESCE(AVG(t.total_amount), 0)::NUMERIC as avg_order_value,
        COUNT(DISTINCT t.customer_id)::BIGINT as unique_customers,
        CASE 
            WHEN total_count > 0 THEN (COUNT(t.transaction_id)::NUMERIC / total_count::NUMERIC * 100)
            ELSE 0
        END as filter_ratio
    FROM dbo.transactions t
    LEFT JOIN dbo.regions r ON t.region_id = r.region_id
    LEFT JOIN dbo.stores s ON t.store_id = s.store_id
    LEFT JOIN dbo.customers c ON t.customer_id = c.customer_id
    LEFT JOIN dbo.transaction_items ti ON t.transaction_id = ti.transaction_id
    LEFT JOIN dbo.products p ON ti.product_id = p.product_id
    LEFT JOIN dbo.brands b ON p.brand_id = b.brand_id
    WHERE 
        -- Date range filter
        (start_date IS NULL OR t.transaction_date >= start_date) AND
        (end_date IS NULL OR t.transaction_date <= end_date) AND
        
        -- Region filter
        (region_names IS NULL OR r.region_name = ANY(region_names)) AND
        
        -- Brand filter
        (brand_names IS NULL OR b.brand_name = ANY(brand_names)) AND
        
        -- Category filter
        (category_names IS NULL OR p.category = ANY(category_names)) AND
        
        -- Store filter
        (store_names IS NULL OR s.store_name = ANY(store_names)) AND
        
        -- Gender filter
        (gender_filter IS NULL OR c.gender = ANY(gender_filter)) AND
        
        -- Weekday/Weekend filter
        (weekday_filter = 'all' OR 
         (weekday_filter = 'weekday' AND EXTRACT(DOW FROM t.transaction_date) BETWEEN 1 AND 5) OR
         (weekday_filter = 'weekend' AND EXTRACT(DOW FROM t.transaction_date) IN (0, 6))) AND
        
        -- Time of day filter
        (time_periods IS NULL OR
         ('morning' = ANY(time_periods) AND EXTRACT(HOUR FROM t.transaction_date) BETWEEN 6 AND 11) OR
         ('afternoon' = ANY(time_periods) AND EXTRACT(HOUR FROM t.transaction_date) BETWEEN 12 AND 17) OR
         ('evening' = ANY(time_periods) AND EXTRACT(HOUR FROM t.transaction_date) BETWEEN 18 AND 23) OR
         ('night' = ANY(time_periods) AND EXTRACT(HOUR FROM t.transaction_date) BETWEEN 0 AND 5));
END;
$$;

-- Function to get transaction count comparison (total vs filtered)
CREATE OR REPLACE FUNCTION get_transaction_comparison(
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    region_names TEXT[] DEFAULT NULL,
    brand_names TEXT[] DEFAULT NULL,
    category_names TEXT[] DEFAULT NULL,
    store_names TEXT[] DEFAULT NULL,
    gender_filter TEXT[] DEFAULT NULL,
    weekday_filter TEXT DEFAULT 'all',
    time_periods TEXT[] DEFAULT NULL
)
RETURNS TABLE(
    total_transactions BIGINT,
    filtered_transactions BIGINT,
    total_revenue NUMERIC,
    filtered_revenue NUMERIC,
    filter_ratio NUMERIC,
    showing_label TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_filters BOOLEAN;
    total_data RECORD;
    filtered_data RECORD;
BEGIN
    -- Check if any filters are applied
    has_filters := (
        start_date IS NOT NULL OR
        end_date IS NOT NULL OR
        region_names IS NOT NULL OR
        brand_names IS NOT NULL OR
        category_names IS NOT NULL OR
        store_names IS NOT NULL OR
        gender_filter IS NOT NULL OR
        weekday_filter != 'all' OR
        time_periods IS NOT NULL
    );
    
    -- Get total data
    SELECT * INTO total_data FROM get_total_transactions();
    
    IF has_filters THEN
        -- Get filtered data
        SELECT * INTO filtered_data FROM get_filtered_transactions(
            start_date, end_date, region_names, brand_names, 
            category_names, store_names, gender_filter, 
            weekday_filter, time_periods
        );
        
        RETURN QUERY
        SELECT 
            total_data.total_transactions,
            filtered_data.filtered_transactions,
            total_data.total_revenue,
            filtered_data.filtered_revenue,
            filtered_data.filter_ratio,
            CASE 
                WHEN filtered_data.filter_ratio = 100 THEN 'Showing all transactions'
                ELSE 'Showing ' || filtered_data.filtered_transactions || ' of ' || total_data.total_transactions || ' transactions (' || ROUND(filtered_data.filter_ratio, 1) || '%)'
            END as showing_label;
    ELSE
        -- No filters applied, return total data
        RETURN QUERY
        SELECT 
            total_data.total_transactions,
            total_data.total_transactions as filtered_transactions,
            total_data.total_revenue,
            total_data.total_revenue as filtered_revenue,
            100.0::NUMERIC as filter_ratio,
            'Showing all ' || total_data.total_transactions || ' transactions'::TEXT as showing_label;
    END IF;
END;
$$;

-- Function to get filter options for dropdowns
CREATE OR REPLACE FUNCTION get_filter_options()
RETURNS TABLE(
    regions TEXT[],
    brands TEXT[],
    categories TEXT[],
    stores TEXT[],
    genders TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT ARRAY_AGG(DISTINCT region_name ORDER BY region_name) FROM dbo.regions) as regions,
        (SELECT ARRAY_AGG(DISTINCT brand_name ORDER BY brand_name) FROM dbo.brands) as brands,
        (SELECT ARRAY_AGG(DISTINCT category ORDER BY category) FROM dbo.products) as categories,
        (SELECT ARRAY_AGG(DISTINCT store_name ORDER BY store_name) FROM dbo.stores) as stores,
        (SELECT ARRAY_AGG(DISTINCT gender ORDER BY gender) FROM dbo.customers WHERE gender IS NOT NULL) as genders;
END;
$$;

-- Function to get real-time transaction count with auto-refresh
CREATE OR REPLACE FUNCTION get_live_transaction_count(
    refresh_seconds INTEGER DEFAULT 300 -- 5 minutes default
)
RETURNS TABLE(
    current_count BIGINT,
    last_hour_count BIGINT,
    today_count BIGINT,
    growth_rate NUMERIC,
    last_updated TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM dbo.transactions)::BIGINT as current_count,
        (SELECT COUNT(*) FROM dbo.transactions WHERE transaction_date >= NOW() - INTERVAL '1 hour')::BIGINT as last_hour_count,
        (SELECT COUNT(*) FROM dbo.transactions WHERE DATE(transaction_date) = CURRENT_DATE)::BIGINT as today_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM dbo.transactions WHERE DATE(transaction_date) = CURRENT_DATE - 1) > 0 THEN
                ((SELECT COUNT(*) FROM dbo.transactions WHERE DATE(transaction_date) = CURRENT_DATE)::NUMERIC / 
                 (SELECT COUNT(*) FROM dbo.transactions WHERE DATE(transaction_date) = CURRENT_DATE - 1)::NUMERIC - 1) * 100
            ELSE 0
        END as growth_rate,
        NOW() as last_updated;
END;
$$;

-- Function to log filter usage for analytics
CREATE OR REPLACE FUNCTION log_filter_usage(
    user_session TEXT,
    filters_applied JSONB,
    result_count BIGINT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    log_id INTEGER;
BEGIN
    INSERT INTO filter_usage_logs (
        user_session,
        filters_applied,
        result_count,
        created_at
    ) VALUES (
        user_session,
        filters_applied,
        result_count,
        NOW()
    ) RETURNING filter_usage_logs.id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- Create filter usage logging table
CREATE TABLE IF NOT EXISTS filter_usage_logs (
    id SERIAL PRIMARY KEY,
    user_session TEXT,
    filters_applied JSONB,
    result_count BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_total_transactions() TO authenticated;
GRANT EXECUTE ON FUNCTION get_filtered_transactions(DATE, DATE, TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_transaction_comparison(DATE, DATE, TEXT[], TEXT[], TEXT[], TEXT[], TEXT[], TEXT, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_filter_options() TO authenticated;
GRANT EXECUTE ON FUNCTION get_live_transaction_count(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION log_filter_usage(TEXT, JSONB, BIGINT) TO authenticated;
GRANT SELECT, INSERT ON filter_usage_logs TO authenticated;
GRANT USAGE ON SEQUENCE filter_usage_logs_id_seq TO authenticated;