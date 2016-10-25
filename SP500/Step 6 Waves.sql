DELETE FROM SP500_Waves
GO

DECLARE @ACCURCY int = 2
 
DECLARE @RATIO        decimal(9,8) = round((1+sqrt(5))/2,@ACCURCY)
DECLARE @PERFECTRATIO decimal(9,8) = (1+sqrt(5))/2

DECLARE @TEMP  TABLE  
(
  [FirstWaveStartDate]                 date  NOT NULL, 
  [FirstWaveEndDate]                   date  NOT NULL,
  [SecondWaveStartDate]                date  NOT NULL, 
  [SecondWaveEndDate]                  date  NOT NULL,
  [ThirdWaveStartDate]                 date      NULL, 
  [ThirdWaveEndDate]                   date      NULL 
)

INSERT INTO @TEMP
SELECT DISTINCT 
  F.StartDate, 
  F.EndDate,
  S.StartDate, 
  S.EndDate, 
  T.StartDate, 
  T.EndDate
FROM
  SP500_Slopes F
INNER JOIN
  SP500_Slopes S ON round(S.PriceTimeDifference, @ACCURCY) = round(F.PriceTimeDifference * @RATIO, @ACCURCY) 
                 AND S.IsUpwardSlope = F.IsUpwardSlope 
                 AND S.StartDate     > F.EndDate 
                 AND S.Depth         = F.Depth
                 AND S.PriceTimeDifference <> 0
LEFT OUTER JOIN
  SP500_Slopes T ON round(T.PriceTimeDifference, @ACCURCY) = round(S.PriceTimeDifference * @RATIO, @ACCURCY) 
                 AND T.IsUpwardSlope = S.IsUpwardSlope 
                 AND T.StartDate     > S.EndDate 
                 AND T.Depth         = S.Depth
                 AND T.PriceTimeDifference <> 0
                 
INSERT INTO dbo.SP500_Waves
(
  FirstWaveStartDate,  
  FirstWaveEndDate,   
  SecondWaveStartDate, 
  SecondWaveEndDate,   
  ThirdWaveStartDate,  
  ThirdWaveEndDate    
)
SELECT DISTINCT  
  FirstWaveStartDate,      
  FirstWaveEndDate,        
  SecondWaveStartDate,     
  SecondWaveEndDate,       
  min(ThirdWaveStartDate),      
  min(ThirdWaveEndDate)   
FROM
  @TEMP T
WHERE
  ThirdWaveStartDate     IS NOT NULL AND
  ThirdWaveEndDate       IS NOT NULL
GROUP BY  
  FirstWaveStartDate,      
  FirstWaveEndDate,        
  SecondWaveStartDate,     
  SecondWaveEndDate        

INSERT INTO dbo.SP500_Waves
(
  FirstWaveStartDate,  
  FirstWaveEndDate,   
  SecondWaveStartDate, 
  SecondWaveEndDate,   
  ThirdWaveStartDate,  
  ThirdWaveEndDate    
)
SELECT DISTINCT  
  FirstWaveStartDate,      
  FirstWaveEndDate,        
  SecondWaveStartDate ,    
  SecondWaveEndDate,       
  ThirdWaveStartDate,      
  ThirdWaveEndDate        
FROM
  @TEMP T
WHERE
  NOT EXISTS (SELECT 1 FROM SP500_Waves WHERE FirstWaveStartDate = T.FirstWaveStartDate  AND 
                                              FirstWaveEndDate   = T.FirstWaveEndDate    AND 
                                              SecondWaveStartDate= T.SecondWaveStartDate AND
                                              SecondWaveEndDate  = T.SecondWaveEndDate   )
AND
  ThirdWaveStartDate     IS NULL AND
  ThirdWaveEndDate       IS NULL

UPDATE W SET FirstWaveStartValue  = Value FROM dbo.SP500_Waves W INNER JOIN dbo.SP500_Points P ON P.Date = W.FirstWaveStartDate
UPDATE W SET SecondWaveStartValue = Value FROM dbo.SP500_Waves W INNER JOIN dbo.SP500_Points P ON P.Date = W.SecondWaveStartDate
UPDATE W SET ThirdWaveStartValue  = Value FROM dbo.SP500_Waves W INNER JOIN dbo.SP500_Points P ON P.Date = W.ThirdWaveStartDate
  
UPDATE W SET FirstWaveEndValue  = Value FROM dbo.SP500_Waves W INNER JOIN dbo.SP500_Points P ON P.Date = W.FirstWaveEndDate
UPDATE W SET SecondWaveEndValue = Value FROM dbo.SP500_Waves W INNER JOIN dbo.SP500_Points P ON P.Date = W.SecondWaveEndDate
UPDATE W SET ThirdWaveEndValue  = Value FROM dbo.SP500_Waves W INNER JOIN dbo.SP500_Points P ON P.Date = W.ThirdWaveEndDate
  
  