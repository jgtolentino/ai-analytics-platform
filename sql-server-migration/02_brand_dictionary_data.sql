-- Scout Analytics v3.2.0 - Brand Dictionary Data Migration
-- Database: ScoutAnalytics
-- Purpose: Insert sophisticated brand intelligence data from TypeScript models

USE ScoutAnalytics;
GO

-- =============================================
-- Data Migration: Brand Dictionary
-- =============================================

PRINT 'Starting Brand Dictionary data migration...';

-- Insert Main Brand Data
INSERT INTO dbo.BrandDictionary (BrandID, BrandName, Category, PrimaryColor, EmotionalTone, LoyaltyScore, SwitchingPropensity)
VALUES 
    ('alaska', 'Alaska Milk', 'Dairy & Nutrition', '#E8F4FD', 'cool', 0.8200, 0.2800),
    ('oishi', 'Oishi', 'Snacks & Confectionery', '#FF6B35', 'energetic', 0.6500, 0.5500),
    ('delmonte', 'Del Monte', 'Processed Foods', '#228B22', 'warm', 0.7800, 0.3500);

PRINT 'Inserted 3 brands into BrandDictionary table';

-- =============================================
-- Alaska Milk Brand Data
-- =============================================

-- Alaska Color Associations
INSERT INTO dbo.BrandColors (BrandID, ColorHex, ColorType, ColorName, SortOrder)
VALUES 
    ('alaska', '#E8F4FD', 'primary', 'Light Sky Blue', 1),
    ('alaska', '#FFFFFF', 'secondary', 'White', 2),
    ('alaska', '#87CEEB', 'secondary', 'Sky Blue', 3),
    ('alaska', '#B0E0E6', 'secondary', 'Powder Blue', 4);

-- Alaska Generational Patterns
DECLARE @AlaskaPatternID_GenZ INT, @AlaskaPatternID_Millennial INT, @AlaskaPatternID_GenX INT, @AlaskaPatternID_Boomer INT;

INSERT INTO dbo.BrandGenerationalPatterns (BrandID, Generation, AffinityScore)
VALUES 
    ('alaska', 'genZ', 0.7200),
    ('alaska', 'millennial', 0.8500),
    ('alaska', 'genX', 0.7800),
    ('alaska', 'boomer', 0.6500);

-- Get Pattern IDs for Alaska behaviors
SELECT @AlaskaPatternID_GenZ = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'alaska' AND Generation = 'genZ';
SELECT @AlaskaPatternID_Millennial = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'alaska' AND Generation = 'millennial';
SELECT @AlaskaPatternID_GenX = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'alaska' AND Generation = 'genX';
SELECT @AlaskaPatternID_Boomer = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'alaska' AND Generation = 'boomer';

-- Alaska Generational Behaviors
INSERT INTO dbo.BrandGenerationalBehaviors (PatternID, BehaviorDescription, Importance)
VALUES 
    -- Gen Z Behaviors
    (@AlaskaPatternID_GenZ, 'health-conscious', 5),
    (@AlaskaPatternID_GenZ, 'ingredient-focused', 4),
    (@AlaskaPatternID_GenZ, 'social-sharing', 3),
    
    -- Millennial Behaviors
    (@AlaskaPatternID_Millennial, 'family-oriented', 5),
    (@AlaskaPatternID_Millennial, 'nutrition-aware', 5),
    (@AlaskaPatternID_Millennial, 'brand-loyal', 4),
    
    -- Gen X Behaviors
    (@AlaskaPatternID_GenX, 'value-seeking', 5),
    (@AlaskaPatternID_GenX, 'trusted-brands', 5),
    (@AlaskaPatternID_GenX, 'bulk-buying', 3),
    
    -- Boomer Behaviors
    (@AlaskaPatternID_Boomer, 'traditional-preferences', 5),
    (@AlaskaPatternID_Boomer, 'doctor-recommended', 4),
    (@AlaskaPatternID_Boomer, 'routine-based', 4);

-- Alaska Emotional Triggers
INSERT INTO dbo.BrandEmotionalTriggers (BrandID, TriggerName, TriggerType, Intensity)
VALUES 
    ('alaska', 'family_health', 'primary', 0.90),
    ('alaska', 'child_nutrition', 'primary', 0.85),
    ('alaska', 'trusted_quality', 'primary', 0.88),
    ('alaska', 'convenience', 'secondary', 0.65),
    ('alaska', 'affordability', 'secondary', 0.70),
    ('alaska', 'tradition', 'secondary', 0.60),
    ('alaska', 'artificial_ingredients', 'negative', 0.80),
    ('alaska', 'high_sugar', 'negative', 0.75),
    ('alaska', 'expensive', 'negative', 0.70);

-- Alaska Brand Associations
INSERT INTO dbo.BrandAssociations (BrandID, AssociatedBrand, AssociationType, Strength)
VALUES 
    ('alaska', 'Nestle', 'competitor', 0.85),
    ('alaska', 'Bear Brand', 'competitor', 0.80),
    ('alaska', 'Carnation', 'competitor', 0.75);

-- Alaska Contextual Factors
INSERT INTO dbo.BrandContextualFactors (BrandID, FactorType, FactorKey, FactorValue)
VALUES 
    ('alaska', 'timeOfDay', 'morning', 0.4500),
    ('alaska', 'timeOfDay', 'afternoon', 0.2500),
    ('alaska', 'timeOfDay', 'evening', 0.3000),
    ('alaska', 'seasonality', 'q1', 0.2200),
    ('alaska', 'seasonality', 'q2', 0.2800),
    ('alaska', 'seasonality', 'q3', 0.2500),
    ('alaska', 'seasonality', 'q4', 0.2500),
    ('alaska', 'occasions', 'daily', 0.7000),
    ('alaska', 'occasions', 'special', 0.2000),
    ('alaska', 'occasions', 'gifting', 0.1000);

PRINT 'Completed Alaska Milk brand data migration';

-- =============================================
-- Oishi Brand Data
-- =============================================

-- Oishi Color Associations
INSERT INTO dbo.BrandColors (BrandID, ColorHex, ColorType, ColorName, SortOrder)
VALUES 
    ('oishi', '#FF6B35', 'primary', 'Orange Red', 1),
    ('oishi', '#FFD700', 'secondary', 'Gold', 2),
    ('oishi', '#FF4500', 'secondary', 'Orange Red', 3),
    ('oishi', '#FFA500', 'secondary', 'Orange', 4);

-- Oishi Generational Patterns
DECLARE @OishiPatternID_GenZ INT, @OishiPatternID_Millennial INT, @OishiPatternID_GenX INT, @OishiPatternID_Boomer INT;

INSERT INTO dbo.BrandGenerationalPatterns (BrandID, Generation, AffinityScore)
VALUES 
    ('oishi', 'genZ', 0.8800),
    ('oishi', 'millennial', 0.7500),
    ('oishi', 'genX', 0.4500),
    ('oishi', 'boomer', 0.2500);

-- Get Pattern IDs for Oishi behaviors
SELECT @OishiPatternID_GenZ = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'oishi' AND Generation = 'genZ';
SELECT @OishiPatternID_Millennial = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'oishi' AND Generation = 'millennial';
SELECT @OishiPatternID_GenX = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'oishi' AND Generation = 'genX';
SELECT @OishiPatternID_Boomer = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'oishi' AND Generation = 'boomer';

-- Oishi Generational Behaviors
INSERT INTO dbo.BrandGenerationalBehaviors (PatternID, BehaviorDescription, Importance)
VALUES 
    -- Gen Z Behaviors
    (@OishiPatternID_GenZ, 'impulse-buying', 5),
    (@OishiPatternID_GenZ, 'flavor-seeking', 5),
    (@OishiPatternID_GenZ, 'social-snacking', 4),
    
    -- Millennial Behaviors
    (@OishiPatternID_Millennial, 'nostalgia-driven', 4),
    (@OishiPatternID_Millennial, 'sharing-occasions', 4),
    (@OishiPatternID_Millennial, 'convenience', 5),
    
    -- Gen X Behaviors
    (@OishiPatternID_GenX, 'family-purchases', 4),
    (@OishiPatternID_GenX, 'value-conscious', 5),
    (@OishiPatternID_GenX, 'occasional-treats', 3),
    
    -- Boomer Behaviors
    (@OishiPatternID_Boomer, 'grandchildren-focused', 3),
    (@OishiPatternID_Boomer, 'health-concerned', 4),
    (@OishiPatternID_Boomer, 'selective', 4);

-- Oishi Emotional Triggers
INSERT INTO dbo.BrandEmotionalTriggers (BrandID, TriggerName, TriggerType, Intensity)
VALUES 
    ('oishi', 'fun', 'primary', 0.92),
    ('oishi', 'excitement', 'primary', 0.88),
    ('oishi', 'social_connection', 'primary', 0.85),
    ('oishi', 'flavor_adventure', 'secondary', 0.80),
    ('oishi', 'youthfulness', 'secondary', 0.75),
    ('oishi', 'energy', 'secondary', 0.78),
    ('oishi', 'boring', 'negative', 0.85),
    ('oishi', 'healthy_only', 'negative', 0.70),
    ('oishi', 'expensive', 'negative', 0.75);

-- Oishi Brand Associations
INSERT INTO dbo.BrandAssociations (BrandID, AssociatedBrand, AssociationType, Strength)
VALUES 
    ('oishi', 'Lays', 'competitor', 0.90),
    ('oishi', 'Piattos', 'competitor', 0.85),
    ('oishi', 'Nova', 'competitor', 0.80);

-- Oishi Contextual Factors
INSERT INTO dbo.BrandContextualFactors (BrandID, FactorType, FactorKey, FactorValue)
VALUES 
    ('oishi', 'timeOfDay', 'morning', 0.1500),
    ('oishi', 'timeOfDay', 'afternoon', 0.3500),
    ('oishi', 'timeOfDay', 'evening', 0.5000),
    ('oishi', 'seasonality', 'q1', 0.2000),
    ('oishi', 'seasonality', 'q2', 0.3000),
    ('oishi', 'seasonality', 'q3', 0.2500),
    ('oishi', 'seasonality', 'q4', 0.2500),
    ('oishi', 'occasions', 'daily', 0.4000),
    ('oishi', 'occasions', 'special', 0.3500),
    ('oishi', 'occasions', 'gifting', 0.2500);

PRINT 'Completed Oishi brand data migration';

-- =============================================
-- Del Monte Brand Data
-- =============================================

-- Del Monte Color Associations
INSERT INTO dbo.BrandColors (BrandID, ColorHex, ColorType, ColorName, SortOrder)
VALUES 
    ('delmonte', '#228B22', 'primary', 'Forest Green', 1),
    ('delmonte', '#32CD32', 'secondary', 'Lime Green', 2),
    ('delmonte', '#90EE90', 'secondary', 'Light Green', 3),
    ('delmonte', '#ADFF2F', 'secondary', 'Green Yellow', 4);

-- Del Monte Generational Patterns
DECLARE @DelMontePatternID_GenZ INT, @DelMontePatternID_Millennial INT, @DelMontePatternID_GenX INT, @DelMontePatternID_Boomer INT;

INSERT INTO dbo.BrandGenerationalPatterns (BrandID, Generation, AffinityScore)
VALUES 
    ('delmonte', 'genZ', 0.5800),
    ('delmonte', 'millennial', 0.8200),
    ('delmonte', 'genX', 0.8800),
    ('delmonte', 'boomer', 0.7500);

-- Get Pattern IDs for Del Monte behaviors
SELECT @DelMontePatternID_GenZ = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'delmonte' AND Generation = 'genZ';
SELECT @DelMontePatternID_Millennial = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'delmonte' AND Generation = 'millennial';
SELECT @DelMontePatternID_GenX = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'delmonte' AND Generation = 'genX';
SELECT @DelMontePatternID_Boomer = PatternID FROM dbo.BrandGenerationalPatterns WHERE BrandID = 'delmonte' AND Generation = 'boomer';

-- Del Monte Generational Behaviors
INSERT INTO dbo.BrandGenerationalBehaviors (PatternID, BehaviorDescription, Importance)
VALUES 
    -- Gen Z Behaviors
    (@DelMontePatternID_GenZ, 'convenience-focused', 5),
    (@DelMontePatternID_GenZ, 'quick-meals', 4),
    (@DelMontePatternID_GenZ, 'brand-aware', 3),
    
    -- Millennial Behaviors
    (@DelMontePatternID_Millennial, 'meal-planning', 5),
    (@DelMontePatternID_Millennial, 'family-cooking', 5),
    (@DelMontePatternID_Millennial, 'time-saving', 4),
    
    -- Gen X Behaviors
    (@DelMontePatternID_GenX, 'trusted-quality', 5),
    (@DelMontePatternID_GenX, 'bulk-shopping', 4),
    (@DelMontePatternID_GenX, 'family-meals', 5),
    
    -- Boomer Behaviors
    (@DelMontePatternID_Boomer, 'brand-loyalty', 5),
    (@DelMontePatternID_Boomer, 'quality-focused', 5),
    (@DelMontePatternID_Boomer, 'traditional-cooking', 4);

-- Del Monte Emotional Triggers
INSERT INTO dbo.BrandEmotionalTriggers (BrandID, TriggerName, TriggerType, Intensity)
VALUES 
    ('delmonte', 'family_meals', 'primary', 0.90),
    ('delmonte', 'convenience', 'primary', 0.85),
    ('delmonte', 'trusted_quality', 'primary', 0.88),
    ('delmonte', 'nutrition', 'secondary', 0.75),
    ('delmonte', 'value', 'secondary', 0.80),
    ('delmonte', 'versatility', 'secondary', 0.70),
    ('delmonte', 'artificial', 'negative', 0.75),
    ('delmonte', 'processed', 'negative', 0.70),
    ('delmonte', 'unhealthy', 'negative', 0.80);

-- Del Monte Brand Associations
INSERT INTO dbo.BrandAssociations (BrandID, AssociatedBrand, AssociationType, Strength)
VALUES 
    ('delmonte', 'Libbys', 'competitor', 0.85),
    ('delmonte', 'Hunts', 'competitor', 0.80),
    ('delmonte', 'Jolly', 'competitor', 0.75);

-- Del Monte Contextual Factors
INSERT INTO dbo.BrandContextualFactors (BrandID, FactorType, FactorKey, FactorValue)
VALUES 
    ('delmonte', 'timeOfDay', 'morning', 0.2000),
    ('delmonte', 'timeOfDay', 'afternoon', 0.2500),
    ('delmonte', 'timeOfDay', 'evening', 0.5500),
    ('delmonte', 'seasonality', 'q1', 0.2500),
    ('delmonte', 'seasonality', 'q2', 0.2500),
    ('delmonte', 'seasonality', 'q3', 0.2500),
    ('delmonte', 'seasonality', 'q4', 0.2500),
    ('delmonte', 'occasions', 'daily', 0.8000),
    ('delmonte', 'occasions', 'special', 0.1500),
    ('delmonte', 'occasions', 'gifting', 0.0500);

PRINT 'Completed Del Monte brand data migration';

-- =============================================
-- Data Validation Queries
-- =============================================

PRINT 'Running data validation checks...';

-- Validate Brand Count
DECLARE @BrandCount INT;
SELECT @BrandCount = COUNT(*) FROM dbo.BrandDictionary;
PRINT 'Total brands inserted: ' + CAST(@BrandCount AS NVARCHAR(10));

-- Validate Color Associations
DECLARE @ColorCount INT;
SELECT @ColorCount = COUNT(*) FROM dbo.BrandColors;
PRINT 'Total color associations: ' + CAST(@ColorCount AS NVARCHAR(10));

-- Validate Generational Patterns
DECLARE @PatternCount INT;
SELECT @PatternCount = COUNT(*) FROM dbo.BrandGenerationalPatterns;
PRINT 'Total generational patterns: ' + CAST(@PatternCount AS NVARCHAR(10));

-- Validate Behaviors
DECLARE @BehaviorCount INT;
SELECT @BehaviorCount = COUNT(*) FROM dbo.BrandGenerationalBehaviors;
PRINT 'Total generational behaviors: ' + CAST(@BehaviorCount AS NVARCHAR(10));

-- Validate Emotional Triggers
DECLARE @TriggerCount INT;
SELECT @TriggerCount = COUNT(*) FROM dbo.BrandEmotionalTriggers;
PRINT 'Total emotional triggers: ' + CAST(@TriggerCount AS NVARCHAR(10));

-- Validate Brand Associations
DECLARE @AssociationCount INT;
SELECT @AssociationCount = COUNT(*) FROM dbo.BrandAssociations;
PRINT 'Total brand associations: ' + CAST(@AssociationCount AS NVARCHAR(10));

-- Validate Contextual Factors
DECLARE @FactorCount INT;
SELECT @FactorCount = COUNT(*) FROM dbo.BrandContextualFactors;
PRINT 'Total contextual factors: ' + CAST(@FactorCount AS NVARCHAR(10));

-- Summary Report
SELECT 
    'Brand Dictionary Migration Summary' AS ReportType,
    @BrandCount AS TotalBrands,
    @ColorCount AS TotalColors,
    @PatternCount AS TotalPatterns,
    @BehaviorCount AS TotalBehaviors,
    @TriggerCount AS TotalTriggers,
    @AssociationCount AS TotalAssociations,
    @FactorCount AS TotalFactors,
    GETDATE() AS CompletedDate;

PRINT 'Brand Dictionary data migration completed successfully!';
GO