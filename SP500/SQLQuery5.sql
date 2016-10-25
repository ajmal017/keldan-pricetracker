DROP PROCEDURE dbo.SplitPoints
go

DELETE FROM SP500_Breaks
go

CREATE PROCEDURE dbo.SplitPoints
(
  @FromDate date = '1950',
  @ToDate   date = '2020',
  @Depth    int  = 0
)
AS

IF @FromDate = @ToDate
  RETURN 0

DECLARE @StartDate date  
DECLARE @MidDate   date  
DECLARE @EndDate   date  

SELECT TOP 1
  @StartDate = Date
FROM
  dbo.SP500_Points
WHERE
  Date BETWEEN @FromDate AND @ToDate
ORDER BY
  Date Asc
 
SELECT TOP 1
  @EndDate = Date
FROM
  dbo.SP500_Points
WHERE
  Date BETWEEN @FromDate AND @ToDate
ORDER BY
  Date DESC
 
DECLARE @n   float       
DECLARE @Sx  float       
DECLARE @Sy  float       
DECLARE @Sxx float       
DECLARE @Syy float       
DECLARE @Sxy float   

SELECT 
  @n   = count(*),    
  @Sx  = sum(x),      
  @Sy  = sum(y),      
  @Sxx = sum(x*x),    
  @Syy = sum(y*y),     
  @Sxy = sum(x*y) 
FROM 
  (
  SELECT
    cast(datediff(day,'1950',Date) as float) 'X',
    Value                                    'y'
  FROM
    dbo.SP500_Points 
  WHERE
    Date BETWEEN @StartDate AND @EndDate 
  ) DATA   

IF @n    = 0 
OR @Sx   = 0
OR @Sy   = 0
OR @Sxx  = 0
OR @Syy  = 0
OR @Sxy  = 0
  RETURN 0

DECLARE @B float
DECLARE @A float
DECLARE @R float

SELECT @B =  ((@n*@Sxy) - (@Sx*@Sy)) / ( (@n*@Sxx - (@Sx*@Sx) )  )

SELECT @A = ((1/@n)*@Sy) - (@B*(1/@n)*@Sx)

SELECT @R = ((@n*@Sxy)-(@Sx*@Sy)) / sqrt( ((@n*@Sxx)-(@Sx*@Sx)) * ((@n*@Syy)-(@Sy*@Sy)) )

DECLARE @StartValue float
DECLARE @MidValue   float
DECLARE @EndValue   float

DECLARE @StartEstimate float
DECLARE @EndEstimate   float

DECLARE @Buffer      float 
DECLARE @StartBuffer date 
DECLARE @EndBuffer   date 

SELECT
  @StartValue    = value,
  @StartEstimate = @A + (@B*datediff(day,'1950',Date))
FROM
  dbo.SP500_Points 
WHERE
  Date = (SELECT min(date) FROM dbo.SP500_Points WHERE Date BETWEEN @StartDate AND @EndDate )

SELECT
  @EndValue    = value,
  @EndEstimate = @A + (@B*datediff(day,'1950',Date))
FROM
  dbo.SP500_Points 
WHERE
  Date = (SELECT max(date) FROM dbo.SP500_Points WHERE Date BETWEEN @StartDate AND @EndDate )

SET @Buffer      = datediff(day, @StartDate,  @EndDate) * 0.05
SET @StartBuffer = dateadd(day,  @Buffer,     @StartDate)
SET @EndBuffer   = dateadd(day,  @Buffer*-1,  @EndDate)
 
SELECT TOP 1 
  @MidDate = Date 
FROM
  dbo.SP500_Points 
WHERE
  Date BETWEEN @StartDate AND @EndDate
ORDER BY
  abs( Value - (@A + (@B*datediff(day,'1950',Date))) ) DESC
  
IF @MidDate = @StartDate OR @MidDate = @EndDate BEGIN

  SELECT TOP 1 
    @MidDate = Date                                     
  FROM
  (
    SELECT TOP 1  
      Date,  
      CASE 
        WHEN datediff(day,@StartDate,Date) < datediff(day,@EndDate,Date) 
          THEN datediff(day,@StartDate,Date)
          ELSE datediff(day,@EndDate,Date)
      END 'DistanceFromEnd'                                   
    FROM
      dbo.SP500_Points 
    WHERE
      Date > @StartBuffer  AND Date < @EndBuffer                  
    AND
      abs( Value - (@A + (@B*datediff(day,'1950',Date))) ) / abs(Value) < 0.01
    ORDER BY
      2 DESC
  ) data
  
  --EXEC dbo.SplitPoints '1950-01-09',	'2000-03-24' 
END  

SELECT 
  @MidValue = Value 
FROM
  dbo.SP500_Points 
WHERE
  Date = @MidDate
 
IF NOT EXISTS (SELECT 1 FROM SP500_Breaks WHERE StartDate = @StartDate AND MidDate = @MidDate AND EndDate = @EndDate)
SELECT 
  @StartDate                            'StartDate', 
  @MidDate                              'MidDate', 
  @EndDate                              'EndDate',
  @StartValue                           'StartValue',
  @MidValue                             'MidValue',
  @EndValue                             'EndValue',
  @StartEstimate                        'StartEstimate',
  @EndEstimate                          'EndEstimate',
  @A                                    'AFactor',
  @B                                    'BFactor',
  @R                                    'Coifecent',
  datediff(day,@StartDate, @EndDate)    'Duration',
  @Depth+1                              'Depth'
 
RETURN @@rowcount
go  

INSERT INTO SP500_Breaks
(
  [StartDate],      
  [MidDate],        
  [EndDate],        
  [StartValue],     
  [MidValue],       
  [EndValue],       
  [StartEstimate],  
  [EndEstimate],    
  [AFactor],        
  [BFactor],        
  [Coifecent],      
  [Duration],       
  [Depth]          

)
EXEC dbo.SplitPoints  

SELECT * FROM SP500_Breaks
go







      
