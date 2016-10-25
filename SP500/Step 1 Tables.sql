USE Waveform
GO

-------------------------------------------------------------------------------------------------------------------------------------------------------------
--SP500
-------------------------------------------------------------------------------------------------------------------------------------------------------------
DROP TABLE SP500
GO

CREATE TABLE [dbo].[SP500](
	[Date]       [date]  NOT NULL,
	[Open]       [float] NOT NULL,
	[High]       [float] NOT NULL,
	[Low]        [float] NOT NULL,
	[Close]      [float] NOT NULL, 
	[PriorDate]  [date]      NULL,
	[NextDate]   [date]      NULL
 CONSTRAINT [PK_SP500] PRIMARY KEY CLUSTERED 
(
	[Date] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


-------------------------------------------------------------------------------------------------------------------------------------------------------------
--SP500_Points
-------------------------------------------------------------------------------------------------------------------------------------------------------------
DROP TABLE SP500_Points
GO

CREATE TABLE [dbo].[SP500_Points](
	[Date]         date     NOT NULL,
	[Value]        float    NOT NULL,
	[IsHighPeak]   bit      NOT NULL,
	[PeakInRatio]  float        NULL, 
	[PeakOutRatio] float        NULL
 CONSTRAINT [PK_SP500_Points] PRIMARY KEY CLUSTERED 
(
	[Date] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

-------------------------------------------------------------------------------------------------------------------------------------------------------------
--SP500_Slopes
-------------------------------------------------------------------------------------------------------------------------------------------------------------
DROP TABLE SP500_Slopes
GO

CREATE TABLE [dbo].[SP500_Slopes]
(
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NOT NULL,
	[IsUpwardSlope] bit not null,
	[PriceDifference] float null,
	[TimeDifference] int null,
	[PriceTimeDifference] float null
 CONSTRAINT [PK_SP500_Slopes] PRIMARY KEY CLUSTERED 
(
	[StartDate] ASC,
	[EndDate] ASC 
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

CREATE NONCLUSTERED INDEX [SK1_SP500_Slopes] ON [dbo].[SP500_Slopes] 
(
	[StartDate] ASC,
	[IsUpwardSlope] ASC,
	[PriceTimeDifference] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [SK2_SP500_Slopes] ON [dbo].[SP500_Slopes] 
(
	[EndDate] ASC,
	[IsUpwardSlope] ASC,
	[PriceTimeDifference] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO


-------------------------------------------------------------------------------------------------------------------------------------------------------------
--SP500_Breaks
-------------------------------------------------------------------------------------------------------------------------------------------------------------
DROP TABLE SP500_Breaks
GO

CREATE TABLE [dbo].[SP500_Breaks]
(
  [StartDate]                 date  NOT NULL, 
  [MidDate]                   date  NOT NULL, 
  [EndDate]                   date  NOT NULL,
  [StartValue]                float NOT NULL,
  [MidValue]                  float NOT NULL,
  [EndValue]                  float NOT NULL,
  [StartEstimate]             float NOT NULL,
  [EndEstimate]               float NOT NULL,
  [AFactor]                   float NOT NULL,
  [BFactor]                   float NOT NULL,
  [Coifecent]                 float NOT NULL,
  [Duration]                  float NOT NULL,
  [Depth]                     int   NOT NULL,
  [FirstPriceTimeDifference]  float     NULL,
  [SecondPriceTimeDifference] float     NULL,
CONSTRAINT [PK_SP500_Breaks] PRIMARY KEY CLUSTERED 
(
	[StartDate] ASC,
	[MidDate] ASC,
	[EndDate] ASC 
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

-------------------------------------------------------------------------------------------------------------------------------------------------------------
--SP500_Slopes
-------------------------------------------------------------------------------------------------------------------------------------------------------------
DROP TABLE SP500_Slopes
GO

CREATE TABLE [dbo].[SP500_Slopes]
(
  [Depth]                     int   NOT NULL, 
  [StartDate]                 date  NOT NULL, 
  [EndDate]                   date  NOT NULL,
  [StartValue]                float NOT NULL,
  [EndValue]                  float NOT NULL,
  [IsUpwardSlope]             bit       NULL,
  [PriceTimeDifference]       float     NULL,
CONSTRAINT [PK_SP500_Slopes] PRIMARY KEY CLUSTERED 
(
	[Depth]     ASC,
	[StartDate] ASC,
	[EndDate]   ASC 
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

-------------------------------------------------------------------------------------------------------------------------------------------------------------
--SP500_Waves
-------------------------------------------------------------------------------------------------------------------------------------------------------------
DROP TABLE SP500_Waves
GO

CREATE TABLE [dbo].[SP500_Waves]
(
  [FirstWaveStartDate]                 date  NOT NULL, 
  [FirstWaveEndDate]                   date  NOT NULL,
  [SecondWaveStartDate]                date  NOT NULL, 
  [SecondWaveEndDate]                  date  NOT NULL,
  [ThirdWaveStartDate]                 date      NULL, 
  [ThirdWaveEndDate]                   date      NULL,
  [FirstWaveStartValue]                float     NULL, 
  [FirstWaveEndValue]                  float     NULL,
  [SecondWaveStartValue]               float     NULL, 
  [SecondWaveEndValue]                 float     NULL,
  [ThirdWaveStartValue]                float     NULL, 
  [ThirdWaveEndValue]                  float     NULL,
CONSTRAINT [PK_SP500_Waves] PRIMARY KEY CLUSTERED 
(
  [FirstWaveStartDate]   ASC,
  [FirstWaveEndDate]     ASC,
  [SecondWaveStartDate]  ASC,
  [SecondWaveEndDate]    ASC 
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
   