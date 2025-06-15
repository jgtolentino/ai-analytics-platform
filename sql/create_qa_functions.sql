-- QA Validation Database Functions
-- Required for Direct Query QA Validator
-- Version: 1.0.0

-- Function to execute custom queries for QA validation
CREATE OR REPLACE FUNCTION execute_custom_query(query_text TEXT)
RETURNS TABLE(result JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rec RECORD;
    result_json JSONB := '[]'::JSONB;
BEGIN
    -- Security check: Only allow SELECT statements
    IF NOT (TRIM(UPPER(query_text)) LIKE 'SELECT%') THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed for QA validation';
    END IF;
    
    -- Execute the query and collect results
    FOR rec IN EXECUTE query_text LOOP
        result_json := result_json || to_jsonb(rec);
    END LOOP;
    
    RETURN QUERY SELECT result_json;
END;
$$;

-- Function to validate dashboard metrics against database
CREATE OR REPLACE FUNCTION validate_dashboard_metrics(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    metric_name TEXT,
    database_value NUMERIC,
    calculation_query TEXT,
    validation_timestamp TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Total transactions
    RETURN QUERY
    SELECT 
        'total_transactions'::TEXT,
        COUNT(*)::NUMERIC,
        'SELECT COUNT(*) FROM dbo.transactions WHERE transaction_date >= ''' || start_date || ''' AND transaction_date <= ''' || end_date || ''''::TEXT,
        NOW()
    FROM dbo.transactions 
    WHERE transaction_date >= start_date AND transaction_date <= end_date;
    
    -- Total revenue
    RETURN QUERY
    SELECT 
        'total_revenue'::TEXT,
        COALESCE(SUM(total_amount), 0)::NUMERIC,
        'SELECT SUM(total_amount) FROM dbo.transactions WHERE transaction_date >= ''' || start_date || ''' AND transaction_date <= ''' || end_date || ''''::TEXT,
        NOW()
    FROM dbo.transactions 
    WHERE transaction_date >= start_date AND transaction_date <= end_date;
    
    -- Average order value
    RETURN QUERY
    SELECT 
        'avg_order_value'::TEXT,
        COALESCE(AVG(total_amount), 0)::NUMERIC,
        'SELECT AVG(total_amount) FROM dbo.transactions WHERE transaction_date >= ''' || start_date || ''' AND transaction_date <= ''' || end_date || ''''::TEXT,
        NOW()
    FROM dbo.transactions 
    WHERE transaction_date >= start_date AND transaction_date <= end_date;
    
    -- Unique customers
    RETURN QUERY
    SELECT 
        'unique_customers'::TEXT,
        COUNT(DISTINCT customer_id)::NUMERIC,
        'SELECT COUNT(DISTINCT customer_id) FROM dbo.transactions WHERE transaction_date >= ''' || start_date || ''' AND transaction_date <= ''' || end_date || ''''::TEXT,
        NOW()
    FROM dbo.transactions 
    WHERE transaction_date >= start_date AND transaction_date <= end_date;
END;
$$;

-- Function to get regional performance data for validation
CREATE OR REPLACE FUNCTION validate_regional_data(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    region_name TEXT,
    txn_count BIGINT,
    total_revenue NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.region_name::TEXT,
        COUNT(t.transaction_id) as txn_count,
        COALESCE(SUM(t.total_amount), 0) as total_revenue
    FROM dbo.transactions t
    JOIN dbo.regions r ON t.region_id = r.region_id
    WHERE t.transaction_date >= start_date AND t.transaction_date <= end_date
    GROUP BY r.region_name
    ORDER BY txn_count DESC;
END;
$$;

-- Function to get brand performance data for validation
CREATE OR REPLACE FUNCTION validate_brand_data(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    brand_name TEXT,
    brand_revenue NUMERIC,
    item_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.brand_name::TEXT,
        COALESCE(SUM(ti.total_price), 0) as brand_revenue,
        COUNT(ti.item_id) as item_count
    FROM dbo.transaction_items ti
    JOIN dbo.products p ON ti.product_id = p.product_id
    JOIN dbo.brands b ON p.brand_id = b.brand_id
    JOIN dbo.transactions t ON ti.transaction_id = t.transaction_id
    WHERE t.transaction_date >= start_date AND t.transaction_date <= end_date
    GROUP BY b.brand_name
    ORDER BY brand_revenue DESC;
END;
$$;

-- Function to get gender distribution for validation
CREATE OR REPLACE FUNCTION validate_gender_data(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    gender TEXT,
    customer_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.gender::TEXT,
        COUNT(DISTINCT c.customer_id) as customer_count
    FROM dbo.customers c
    JOIN dbo.transactions t ON c.customer_id = t.customer_id
    WHERE t.transaction_date >= start_date AND t.transaction_date <= end_date
    GROUP BY c.gender
    ORDER BY customer_count DESC;
END;
$$;

-- Function to get top categories for validation
CREATE OR REPLACE FUNCTION validate_category_data(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
    category TEXT,
    item_count BIGINT,
    category_revenue NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.category::TEXT,
        COUNT(ti.item_id) as item_count,
        COALESCE(SUM(ti.total_price), 0) as category_revenue
    FROM dbo.transaction_items ti
    JOIN dbo.products p ON ti.product_id = p.product_id
    JOIN dbo.transactions t ON ti.transaction_id = t.transaction_id
    WHERE t.transaction_date >= start_date AND t.transaction_date <= end_date
    GROUP BY p.category
    ORDER BY item_count DESC
    LIMIT limit_count;
END;
$$;

-- Create QA validation log table
CREATE TABLE IF NOT EXISTS qa_validation_logs (
    log_id SERIAL PRIMARY KEY,
    validation_type TEXT NOT NULL,
    schema_version TEXT,
    total_validations INTEGER,
    passed_validations INTEGER,
    failed_validations INTEGER,
    pass_rate DECIMAL(5,2),
    validation_details JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT DEFAULT 'system'
);

-- Function to log QA validation results
CREATE OR REPLACE FUNCTION log_qa_validation(
    validation_type TEXT,
    schema_version TEXT DEFAULT '1.1.1',
    total_validations INTEGER DEFAULT 0,
    passed_validations INTEGER DEFAULT 0,
    failed_validations INTEGER DEFAULT 0,
    validation_details JSONB DEFAULT '{}'::JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    log_id INTEGER;
    pass_rate DECIMAL(5,2);
BEGIN
    -- Calculate pass rate
    pass_rate := CASE 
        WHEN total_validations = 0 THEN 0 
        ELSE (passed_validations::DECIMAL / total_validations::DECIMAL) * 100 
    END;
    
    -- Insert validation log
    INSERT INTO qa_validation_logs (
        validation_type,
        schema_version,
        total_validations,
        passed_validations,
        failed_validations,
        pass_rate,
        validation_details
    ) VALUES (
        validation_type,
        schema_version,
        total_validations,
        passed_validations,
        failed_validations,
        pass_rate,
        validation_details
    ) RETURNING qa_validation_logs.log_id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION execute_custom_query(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_dashboard_metrics(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_regional_data(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_brand_data(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_gender_data(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_category_data(DATE, DATE, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION log_qa_validation(TEXT, TEXT, INTEGER, INTEGER, INTEGER, JSONB) TO authenticated;

-- Grant permissions on QA log table
GRANT SELECT, INSERT ON qa_validation_logs TO authenticated;
GRANT USAGE ON SEQUENCE qa_validation_logs_log_id_seq TO authenticated;