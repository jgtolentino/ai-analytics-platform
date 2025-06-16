-- Scout Analytics v3.2.0 - Brand Dictionary Stored Procedures
-- Database: ScoutAnalytics
-- Purpose: Comprehensive stored procedures for brand intelligence analytics

USE ScoutAnalytics;
GO

-- =============================================
-- Core Brand Dictionary Procedures
-- =============================================

-- Get Complete Brand Profile with All Associated Data
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'GetBrandProfile')
    DROP PROCEDURE dbo.GetBrandProfile;
GO

CREATE PROCEDURE dbo.GetBrandProfile
    @BrandID NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Main brand information
    SELECT 
        bd.BrandID,
        bd.BrandName,
        bd.Category,
        bd.PrimaryColor,
        bd.EmotionalTone,
        bd.LoyaltyScore,
        bd.SwitchingPropensity,
        bd.CreatedDate,
        bd.ModifiedDate
    FROM dbo.BrandDictionary bd
    WHERE bd.BrandID = @BrandID AND bd.IsActive = 1;
    
    -- Color associations
    SELECT 
        bc.ColorHex,
        bc.ColorType,
        bc.ColorName,
        bc.SortOrder
    FROM dbo.BrandColors bc
    WHERE bc.BrandID = @BrandID
    ORDER BY bc.ColorType, bc.SortOrder;
    
    -- Generational patterns with behaviors
    SELECT 
        gp.Generation,
        gp.AffinityScore,
        STRING_AGG(gb.BehaviorDescription, ', ') WITHIN GROUP (ORDER BY gb.Importance DESC) AS Behaviors,
        AVG(CAST(gb.Importance AS FLOAT)) AS AvgImportance
    FROM dbo.BrandGenerationalPatterns gp
    LEFT JOIN dbo.BrandGenerationalBehaviors gb ON gp.PatternID = gb.PatternID
    WHERE gp.BrandID = @BrandID
    GROUP BY gp.Generation, gp.AffinityScore
    ORDER BY gp.AffinityScore DESC;
    
    -- Emotional triggers
    SELECT 
        et.TriggerName,
        et.TriggerType,
        et.Intensity
    FROM dbo.BrandEmotionalTriggers et
    WHERE et.BrandID = @BrandID
    ORDER BY et.TriggerType, et.Intensity DESC;
    
    -- Brand associations
    SELECT 
        ba.AssociatedBrand,
        ba.AssociationType,
        ba.Strength
    FROM dbo.BrandAssociations ba
    WHERE ba.BrandID = @BrandID
    ORDER BY ba.Strength DESC;
    
    -- Contextual factors
    SELECT 
        cf.FactorType,
        cf.FactorKey,
        cf.FactorValue
    FROM dbo.BrandContextualFactors cf
    WHERE cf.BrandID = @BrandID
    ORDER BY cf.FactorType, cf.FactorKey;
END
GO

PRINT 'Created procedure: GetBrandProfile';

-- =============================================
-- Brand Analytics Procedures
-- =============================================

-- Get Brand Analytics Summary
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'GetBrandAnalytics')
    DROP PROCEDURE dbo.GetBrandAnalytics;
GO

CREATE PROCEDURE dbo.GetBrandAnalytics
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        bd.Category,
        COUNT(*) AS BrandCount,
        AVG(bd.LoyaltyScore) AS AvgLoyaltyScore,
        AVG(bd.SwitchingPropensity) AS AvgSwitchingPropensity,
        MAX(bd.LoyaltyScore) AS MaxLoyaltyScore,
        MIN(bd.LoyaltyScore) AS MinLoyaltyScore,
        -- Generational averages
        AVG(CASE WHEN gp.Generation = 'genZ' THEN gp.AffinityScore END) AS GenZ_AvgAffinity,
        AVG(CASE WHEN gp.Generation = 'millennial' THEN gp.AffinityScore END) AS Millennial_AvgAffinity,
        AVG(CASE WHEN gp.Generation = 'genX' THEN gp.AffinityScore END) AS GenX_AvgAffinity,
        AVG(CASE WHEN gp.Generation = 'boomer' THEN gp.AffinityScore END) AS Boomer_AvgAffinity,
        -- Top performing generation per category
        (SELECT TOP 1 Generation 
         FROM dbo.BrandGenerationalPatterns gp2 
         INNER JOIN dbo.BrandDictionary bd2 ON gp2.BrandID = bd2.BrandID 
         WHERE bd2.Category = bd.Category 
         GROUP BY Generation 
         ORDER BY AVG(AffinityScore) DESC) AS TopPerformingGeneration
    FROM dbo.BrandDictionary bd
    LEFT JOIN dbo.BrandGenerationalPatterns gp ON bd.BrandID = gp.BrandID
    WHERE bd.IsActive = 1
    GROUP BY bd.Category
    ORDER BY AvgLoyaltyScore DESC;
END
GO

PRINT 'Created procedure: GetBrandAnalytics';

-- Get Generational Analysis Across All Brands
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'GetGenerationalAnalysis')
    DROP PROCEDURE dbo.GetGenerationalAnalysis;
GO

CREATE PROCEDURE dbo.GetGenerationalAnalysis
    @Generation NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @Generation IS NOT NULL
    BEGIN
        -- Specific generation analysis
        SELECT 
            bd.BrandID,
            bd.BrandName,
            bd.Category,
            gp.AffinityScore,
            STRING_AGG(gb.BehaviorDescription, ', ') WITHIN GROUP (ORDER BY gb.Importance DESC) AS KeyBehaviors,
            COUNT(gb.BehaviorID) AS BehaviorCount
        FROM dbo.BrandDictionary bd
        INNER JOIN dbo.BrandGenerationalPatterns gp ON bd.BrandID = gp.BrandID
        LEFT JOIN dbo.BrandGenerationalBehaviors gb ON gp.PatternID = gb.PatternID
        WHERE gp.Generation = @Generation AND bd.IsActive = 1
        GROUP BY bd.BrandID, bd.BrandName, bd.Category, gp.AffinityScore
        ORDER BY gp.AffinityScore DESC;
    END
    ELSE
    BEGIN
        -- Cross-generational comparison
        SELECT 
            bd.BrandID,
            bd.BrandName,
            bd.Category,
            AVG(CASE WHEN gp.Generation = 'genZ' THEN gp.AffinityScore END) AS GenZ_Affinity,
            AVG(CASE WHEN gp.Generation = 'millennial' THEN gp.AffinityScore END) AS Millennial_Affinity,
            AVG(CASE WHEN gp.Generation = 'genX' THEN gp.AffinityScore END) AS GenX_Affinity,
            AVG(CASE WHEN gp.Generation = 'boomer' THEN gp.AffinityScore END) AS Boomer_Affinity,
            -- Calculate generation spread (max - min affinity)
            MAX(gp.AffinityScore) - MIN(gp.AffinityScore) AS GenerationSpread,
            -- Find dominant generation
            (SELECT TOP 1 Generation 
             FROM dbo.BrandGenerationalPatterns gp2 
             WHERE gp2.BrandID = bd.BrandID 
             ORDER BY AffinityScore DESC) AS DominantGeneration
        FROM dbo.BrandDictionary bd
        INNER JOIN dbo.BrandGenerationalPatterns gp ON bd.BrandID = gp.BrandID
        WHERE bd.IsActive = 1
        GROUP BY bd.BrandID, bd.BrandName, bd.Category
        ORDER BY GenerationSpread DESC;
    END
END
GO

PRINT 'Created procedure: GetGenerationalAnalysis';

-- =============================================
-- Brand Comparison Procedures
-- =============================================

-- Compare Two Brands
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'CompareBrands')
    DROP PROCEDURE dbo.CompareBrands;
GO

CREATE PROCEDURE dbo.CompareBrands
    @BrandID1 NVARCHAR(50),
    @BrandID2 NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Basic comparison
    SELECT 
        'Basic Metrics' AS ComparisonType,
        bd1.BrandName AS Brand1_Name,
        bd1.Category AS Brand1_Category,
        bd1.LoyaltyScore AS Brand1_Loyalty,
        bd1.SwitchingPropensity AS Brand1_Switching,
        bd2.BrandName AS Brand2_Name,
        bd2.Category AS Brand2_Category,
        bd2.LoyaltyScore AS Brand2_Loyalty,
        bd2.SwitchingPropensity AS Brand2_Switching,
        ABS(bd1.LoyaltyScore - bd2.LoyaltyScore) AS LoyaltyDifference,
        ABS(bd1.SwitchingPropensity - bd2.SwitchingPropensity) AS SwitchingDifference
    FROM dbo.BrandDictionary bd1
    CROSS JOIN dbo.BrandDictionary bd2
    WHERE bd1.BrandID = @BrandID1 AND bd2.BrandID = @BrandID2;
    
    -- Generational comparison
    SELECT 
        gp1.Generation,
        gp1.AffinityScore AS Brand1_Affinity,
        gp2.AffinityScore AS Brand2_Affinity,
        ABS(gp1.AffinityScore - gp2.AffinityScore) AS AffinityDifference,
        CASE 
            WHEN gp1.AffinityScore > gp2.AffinityScore THEN @BrandID1
            WHEN gp2.AffinityScore > gp1.AffinityScore THEN @BrandID2
            ELSE 'Tie'
        END AS StrongerBrand
    FROM dbo.BrandGenerationalPatterns gp1
    INNER JOIN dbo.BrandGenerationalPatterns gp2 ON gp1.Generation = gp2.Generation
    WHERE gp1.BrandID = @BrandID1 AND gp2.BrandID = @BrandID2
    ORDER BY AffinityDifference DESC;
    
    -- Emotional trigger overlap
    SELECT 
        et1.TriggerName,
        et1.TriggerType AS Brand1_TriggerType,
        et1.Intensity AS Brand1_Intensity,
        et2.TriggerType AS Brand2_TriggerType,
        et2.Intensity AS Brand2_Intensity,
        CASE 
            WHEN et2.TriggerName IS NOT NULL THEN 'Shared'
            ELSE 'Unique to ' + @BrandID1
        END AS TriggerStatus
    FROM dbo.BrandEmotionalTriggers et1
    LEFT JOIN dbo.BrandEmotionalTriggers et2 ON et1.TriggerName = et2.TriggerName AND et2.BrandID = @BrandID2
    WHERE et1.BrandID = @BrandID1
    
    UNION ALL
    
    SELECT 
        et2.TriggerName,
        NULL AS Brand1_TriggerType,
        NULL AS Brand1_Intensity,
        et2.TriggerType AS Brand2_TriggerType,
        et2.Intensity AS Brand2_Intensity,
        'Unique to ' + @BrandID2 AS TriggerStatus
    FROM dbo.BrandEmotionalTriggers et2
    LEFT JOIN dbo.BrandEmotionalTriggers et1 ON et2.TriggerName = et1.TriggerName AND et1.BrandID = @BrandID1
    WHERE et2.BrandID = @BrandID2 AND et1.TriggerName IS NULL
    ORDER BY TriggerStatus, TriggerName;
END
GO

PRINT 'Created procedure: CompareBrands';

-- =============================================
-- Data Management Procedures
-- =============================================

-- Update Brand Generational Affinity
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'UpdateGenerationalAffinity')
    DROP PROCEDURE dbo.UpdateGenerationalAffinity;
GO

CREATE PROCEDURE dbo.UpdateGenerationalAffinity
    @BrandID NVARCHAR(50),
    @Generation NVARCHAR(20),
    @NewAffinityScore DECIMAL(5,4)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate inputs
        IF @NewAffinityScore < 0 OR @NewAffinityScore > 1
        BEGIN
            RAISERROR('Affinity score must be between 0 and 1', 16, 1);
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM dbo.BrandDictionary WHERE BrandID = @BrandID AND IsActive = 1)
        BEGIN
            RAISERROR('Brand ID not found or inactive', 16, 1);
            RETURN;
        END
        
        -- Update the affinity score
        UPDATE dbo.BrandGenerationalPatterns
        SET AffinityScore = @NewAffinityScore,
            ModifiedDate = GETDATE()
        WHERE BrandID = @BrandID AND Generation = @Generation;
        
        IF @@ROWCOUNT = 0
        BEGIN
            -- Insert if doesn't exist
            INSERT INTO dbo.BrandGenerationalPatterns (BrandID, Generation, AffinityScore)
            VALUES (@BrandID, @Generation, @NewAffinityScore);
        END
        
        COMMIT TRANSACTION;
        
        SELECT 
            @BrandID AS BrandID,
            @Generation AS Generation,
            @NewAffinityScore AS NewAffinityScore,
            'Success' AS Status,
            GETDATE() AS UpdatedDate;
            
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        
        SELECT 
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_NUMBER() AS ErrorNumber,
            'Failed' AS Status;
    END CATCH
END
GO

PRINT 'Created procedure: UpdateGenerationalAffinity';

-- Add New Brand to Dictionary
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'AddNewBrand')
    DROP PROCEDURE dbo.AddNewBrand;
GO

CREATE PROCEDURE dbo.AddNewBrand
    @BrandID NVARCHAR(50),
    @BrandName NVARCHAR(100),
    @Category NVARCHAR(50),
    @PrimaryColor NCHAR(7) = NULL,
    @EmotionalTone NVARCHAR(20) = NULL,
    @LoyaltyScore DECIMAL(5,4) = NULL,
    @SwitchingPropensity DECIMAL(5,4) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if brand already exists
        IF EXISTS (SELECT 1 FROM dbo.BrandDictionary WHERE BrandID = @BrandID)
        BEGIN
            RAISERROR('Brand ID already exists', 16, 1);
            RETURN;
        END
        
        -- Insert new brand
        INSERT INTO dbo.BrandDictionary (
            BrandID, BrandName, Category, PrimaryColor, 
            EmotionalTone, LoyaltyScore, SwitchingPropensity
        )
        VALUES (
            @BrandID, @BrandName, @Category, @PrimaryColor,
            @EmotionalTone, @LoyaltyScore, @SwitchingPropensity
        );
        
        COMMIT TRANSACTION;
        
        SELECT 
            @BrandID AS BrandID,
            @BrandName AS BrandName,
            'Successfully added' AS Status,
            GETDATE() AS CreatedDate;
            
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        
        SELECT 
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_NUMBER() AS ErrorNumber,
            'Failed' AS Status;
    END CATCH
END
GO

PRINT 'Created procedure: AddNewBrand';

-- =============================================
-- Reporting Procedures
-- =============================================

-- Generate Brand Performance Report
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'GenerateBrandPerformanceReport')
    DROP PROCEDURE dbo.GenerateBrandPerformanceReport;
GO

CREATE PROCEDURE dbo.GenerateBrandPerformanceReport
    @Category NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Main performance metrics
    SELECT 
        bd.BrandID,
        bd.BrandName,
        bd.Category,
        bd.LoyaltyScore,
        bd.SwitchingPropensity,
        -- Calculate performance score (loyalty high, switching low is better)
        (bd.LoyaltyScore + (1 - bd.SwitchingPropensity)) / 2 AS PerformanceScore,
        -- Generational metrics
        (SELECT AVG(AffinityScore) FROM dbo.BrandGenerationalPatterns WHERE BrandID = bd.BrandID) AS AvgGenerationalAffinity,
        (SELECT MAX(AffinityScore) FROM dbo.BrandGenerationalPatterns WHERE BrandID = bd.BrandID) AS MaxGenerationalAffinity,
        (SELECT MIN(AffinityScore) FROM dbo.BrandGenerationalPatterns WHERE BrandID = bd.BrandID) AS MinGenerationalAffinity,
        -- Trigger counts
        (SELECT COUNT(*) FROM dbo.BrandEmotionalTriggers WHERE BrandID = bd.BrandID AND TriggerType = 'primary') AS PrimaryTriggerCount,
        (SELECT COUNT(*) FROM dbo.BrandEmotionalTriggers WHERE BrandID = bd.BrandID AND TriggerType = 'secondary') AS SecondaryTriggerCount,
        (SELECT COUNT(*) FROM dbo.BrandEmotionalTriggers WHERE BrandID = bd.BrandID AND TriggerType = 'negative') AS NegativeTriggerCount,
        -- Association count
        (SELECT COUNT(*) FROM dbo.BrandAssociations WHERE BrandID = bd.BrandID) AS AssociationCount
    FROM dbo.BrandDictionary bd
    WHERE bd.IsActive = 1 
    AND (@Category IS NULL OR bd.Category = @Category)
    ORDER BY PerformanceScore DESC;
    
    -- Category summary if no specific category requested
    IF @Category IS NULL
    BEGIN
        SELECT 
            Category,
            COUNT(*) AS BrandCount,
            AVG(LoyaltyScore) AS AvgLoyalty,
            AVG(SwitchingPropensity) AS AvgSwitching,
            AVG((LoyaltyScore + (1 - SwitchingPropensity)) / 2) AS AvgPerformanceScore
        FROM dbo.BrandDictionary
        WHERE IsActive = 1
        GROUP BY Category
        ORDER BY AvgPerformanceScore DESC;
    END
END
GO

PRINT 'Created procedure: GenerateBrandPerformanceReport';

-- =============================================
-- Search and Discovery Procedures
-- =============================================

-- Search Brands by Criteria
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SearchBrands')
    DROP PROCEDURE dbo.SearchBrands;
GO

CREATE PROCEDURE dbo.SearchBrands
    @SearchTerm NVARCHAR(100) = NULL,
    @Category NVARCHAR(50) = NULL,
    @MinLoyaltyScore DECIMAL(5,4) = NULL,
    @MaxSwitchingPropensity DECIMAL(5,4) = NULL,
    @EmotionalTone NVARCHAR(20) = NULL,
    @Generation NVARCHAR(20) = NULL,
    @MinGenerationalAffinity DECIMAL(5,4) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        bd.BrandID,
        bd.BrandName,
        bd.Category,
        bd.PrimaryColor,
        bd.EmotionalTone,
        bd.LoyaltyScore,
        bd.SwitchingPropensity,
        CASE WHEN @Generation IS NOT NULL THEN gp.AffinityScore ELSE NULL END AS GenerationalAffinity
    FROM dbo.BrandDictionary bd
    LEFT JOIN dbo.BrandGenerationalPatterns gp ON bd.BrandID = gp.BrandID 
        AND (@Generation IS NULL OR gp.Generation = @Generation)
    WHERE bd.IsActive = 1
    AND (@SearchTerm IS NULL OR bd.BrandName LIKE '%' + @SearchTerm + '%')
    AND (@Category IS NULL OR bd.Category = @Category)
    AND (@MinLoyaltyScore IS NULL OR bd.LoyaltyScore >= @MinLoyaltyScore)
    AND (@MaxSwitchingPropensity IS NULL OR bd.SwitchingPropensity <= @MaxSwitchingPropensity)
    AND (@EmotionalTone IS NULL OR bd.EmotionalTone = @EmotionalTone)
    AND (@MinGenerationalAffinity IS NULL OR gp.AffinityScore >= @MinGenerationalAffinity)
    ORDER BY bd.LoyaltyScore DESC;
END
GO

PRINT 'Created procedure: SearchBrands';

-- =============================================
-- Grant Permissions
-- =============================================

-- Grant execute permissions to appropriate roles
-- GRANT EXECUTE ON dbo.GetBrandProfile TO [BrandAnalystRole];
-- GRANT EXECUTE ON dbo.GetBrandAnalytics TO [BrandAnalystRole];
-- GRANT EXECUTE ON dbo.GenerateBrandPerformanceReport TO [BrandAnalystRole];
-- GRANT EXECUTE ON dbo.SearchBrands TO [BrandAnalystRole];

PRINT 'Brand Dictionary stored procedures deployment complete!';
PRINT 'Total procedures created: 8';
GO