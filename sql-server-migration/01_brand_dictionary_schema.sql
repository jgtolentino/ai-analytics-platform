-- Scout Analytics v3.2.0 - Brand Dictionary SQL Server Schema
-- Database: ScoutAnalytics
-- Schema: dbo
-- Purpose: Complete brand intelligence data model for SQL Server integration

USE ScoutAnalytics;
GO

-- =============================================
-- Brand Dictionary Core Tables
-- =============================================

-- Main Brand Dictionary Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BrandDictionary' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.BrandDictionary (
        BrandID NVARCHAR(50) PRIMARY KEY,
        BrandName NVARCHAR(100) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        PrimaryColor NCHAR(7) NULL, -- Hex color code (#FFFFFF)
        EmotionalTone NVARCHAR(20) NULL CHECK (EmotionalTone IN ('warm', 'cool', 'neutral', 'energetic')),
        LoyaltyScore DECIMAL(5,4) NULL CHECK (LoyaltyScore >= 0 AND LoyaltyScore <= 1),
        SwitchingPropensity DECIMAL(5,4) NULL CHECK (SwitchingPropensity >= 0 AND SwitchingPropensity <= 1),
        IsActive BIT DEFAULT 1,
        CreatedDate DATETIME2 DEFAULT GETDATE(),
        ModifiedDate DATETIME2 DEFAULT GETDATE(),
        CreatedBy NVARCHAR(100) DEFAULT SYSTEM_USER,
        ModifiedBy NVARCHAR(100) DEFAULT SYSTEM_USER
    );
    
    PRINT 'Created table: dbo.BrandDictionary';
END
GO

-- Brand Color Associations
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BrandColors' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.BrandColors (
        ColorID INT IDENTITY(1,1) PRIMARY KEY,
        BrandID NVARCHAR(50) NOT NULL,
        ColorHex NCHAR(7) NOT NULL CHECK (ColorHex LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
        ColorType NVARCHAR(20) NOT NULL CHECK (ColorType IN ('primary', 'secondary')),
        ColorName NVARCHAR(50) NULL, -- Optional color name
        SortOrder INT DEFAULT 0,
        CreatedDate DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (BrandID) REFERENCES dbo.BrandDictionary(BrandID) ON DELETE CASCADE,
        UNIQUE(BrandID, ColorHex, ColorType)
    );
    
    PRINT 'Created table: dbo.BrandColors';
END
GO

-- Generational Patterns
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BrandGenerationalPatterns' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.BrandGenerationalPatterns (
        PatternID INT IDENTITY(1,1) PRIMARY KEY,
        BrandID NVARCHAR(50) NOT NULL,
        Generation NVARCHAR(20) NOT NULL CHECK (Generation IN ('genZ', 'millennial', 'genX', 'boomer')),
        AffinityScore DECIMAL(5,4) NOT NULL CHECK (AffinityScore >= 0 AND AffinityScore <= 1),
        CreatedDate DATETIME2 DEFAULT GETDATE(),
        ModifiedDate DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (BrandID) REFERENCES dbo.BrandDictionary(BrandID) ON DELETE CASCADE,
        UNIQUE(BrandID, Generation)
    );
    
    PRINT 'Created table: dbo.BrandGenerationalPatterns';
END
GO

-- Generational Behaviors
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BrandGenerationalBehaviors' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.BrandGenerationalBehaviors (
        BehaviorID INT IDENTITY(1,1) PRIMARY KEY,
        PatternID INT NOT NULL,
        BehaviorDescription NVARCHAR(100) NOT NULL,
        Importance INT DEFAULT 1 CHECK (Importance BETWEEN 1 AND 5), -- 1-5 scale
        CreatedDate DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (PatternID) REFERENCES dbo.BrandGenerationalPatterns(PatternID) ON DELETE CASCADE
    );
    
    PRINT 'Created table: dbo.BrandGenerationalBehaviors';
END
GO

-- Emotional Triggers
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BrandEmotionalTriggers' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.BrandEmotionalTriggers (
        TriggerID INT IDENTITY(1,1) PRIMARY KEY,
        BrandID NVARCHAR(50) NOT NULL,
        TriggerName NVARCHAR(50) NOT NULL,
        TriggerType NVARCHAR(20) NOT NULL CHECK (TriggerType IN ('primary', 'secondary', 'negative')),
        Intensity DECIMAL(3,2) DEFAULT 1.0 CHECK (Intensity >= 0 AND Intensity <= 1), -- 0.0 to 1.0
        CreatedDate DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (BrandID) REFERENCES dbo.BrandDictionary(BrandID) ON DELETE CASCADE,
        UNIQUE(BrandID, TriggerName, TriggerType)
    );
    
    PRINT 'Created table: dbo.BrandEmotionalTriggers';
END
GO

-- Cross-Brand Associations
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BrandAssociations' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.BrandAssociations (
        AssociationID INT IDENTITY(1,1) PRIMARY KEY,
        BrandID NVARCHAR(50) NOT NULL,
        AssociatedBrand NVARCHAR(100) NOT NULL,
        AssociationType NVARCHAR(20) DEFAULT 'competitor' CHECK (AssociationType IN ('competitor', 'complementary', 'substitute', 'aspirational')),
        Strength DECIMAL(3,2) DEFAULT 0.5 CHECK (Strength >= 0 AND Strength <= 1),
        CreatedDate DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (BrandID) REFERENCES dbo.BrandDictionary(BrandID) ON DELETE CASCADE,
        UNIQUE(BrandID, AssociatedBrand)
    );
    
    PRINT 'Created table: dbo.BrandAssociations';
END
GO

-- Contextual Factors
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BrandContextualFactors' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.BrandContextualFactors (
        FactorID INT IDENTITY(1,1) PRIMARY KEY,
        BrandID NVARCHAR(50) NOT NULL,
        FactorType NVARCHAR(20) NOT NULL CHECK (FactorType IN ('timeOfDay', 'seasonality', 'occasions')),
        FactorKey NVARCHAR(20) NOT NULL,
        FactorValue DECIMAL(5,4) NOT NULL CHECK (FactorValue >= 0 AND FactorValue <= 1),
        CreatedDate DATETIME2 DEFAULT GETDATE(),
        ModifiedDate DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (BrandID) REFERENCES dbo.BrandDictionary(BrandID) ON DELETE CASCADE,
        UNIQUE(BrandID, FactorType, FactorKey)
    );
    
    PRINT 'Created table: dbo.BrandContextualFactors';
END
GO

-- =============================================
-- Indexes for Performance Optimization
-- =============================================

-- Brand Dictionary Indexes
CREATE NONCLUSTERED INDEX IX_BrandDictionary_Category 
ON dbo.BrandDictionary (Category) 
INCLUDE (BrandName, LoyaltyScore, SwitchingPropensity);

CREATE NONCLUSTERED INDEX IX_BrandDictionary_LoyaltyScore 
ON dbo.BrandDictionary (LoyaltyScore DESC);

-- Generational Patterns Indexes
CREATE NONCLUSTERED INDEX IX_BrandGenerationalPatterns_Generation 
ON dbo.BrandGenerationalPatterns (Generation) 
INCLUDE (BrandID, AffinityScore);

CREATE NONCLUSTERED INDEX IX_BrandGenerationalPatterns_AffinityScore 
ON dbo.BrandGenerationalPatterns (AffinityScore DESC);

-- Emotional Triggers Indexes
CREATE NONCLUSTERED INDEX IX_BrandEmotionalTriggers_TriggerType 
ON dbo.BrandEmotionalTriggers (TriggerType) 
INCLUDE (BrandID, TriggerName, Intensity);

-- Contextual Factors Indexes
CREATE NONCLUSTERED INDEX IX_BrandContextualFactors_FactorType 
ON dbo.BrandContextualFactors (FactorType, FactorKey) 
INCLUDE (BrandID, FactorValue);

PRINT 'Created performance indexes for Brand Dictionary tables';
GO

-- =============================================
-- Audit Triggers
-- =============================================

-- Audit trigger for Brand Dictionary updates
CREATE TRIGGER TR_BrandDictionary_UpdateModified
ON dbo.BrandDictionary
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE bd
    SET ModifiedDate = GETDATE(),
        ModifiedBy = SYSTEM_USER
    FROM dbo.BrandDictionary bd
    INNER JOIN inserted i ON bd.BrandID = i.BrandID;
END
GO

-- Audit trigger for Generational Patterns updates
CREATE TRIGGER TR_BrandGenerationalPatterns_UpdateModified
ON dbo.BrandGenerationalPatterns
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE bgp
    SET ModifiedDate = GETDATE()
    FROM dbo.BrandGenerationalPatterns bgp
    INNER JOIN inserted i ON bgp.PatternID = i.PatternID;
END
GO

-- Audit trigger for Contextual Factors updates
CREATE TRIGGER TR_BrandContextualFactors_UpdateModified
ON dbo.BrandContextualFactors
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE bcf
    SET ModifiedDate = GETDATE()
    FROM dbo.BrandContextualFactors bcf
    INNER JOIN inserted i ON bcf.FactorID = i.FactorID;
END
GO

PRINT 'Created audit triggers for Brand Dictionary tables';
PRINT 'Brand Dictionary SQL Server schema deployment complete!';
GO