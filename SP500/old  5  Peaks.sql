DELETE FROM SP500_Peaks
go

DECLARE @ACCURCY int = 2
 
DECLARE @RATIO        decimal(9,8) = round((1+sqrt(5))/2,@ACCURCY)
DECLARE @PERFECTRATIO decimal(9,8) = (1+sqrt(5))/2

DECLARE @Date date  

DECLARE @MinDate date = '1950-01-01'
DECLARE @MaxDate date = '1950-12-31'

DECLARE @PEAKS TABLE
(
StartDate                       date   NOT NULL,
StartValue                      float  NOT NULL,
MidDate                         date   NOT NULL,
MidValue                        float  NOT NULL,
EndDate                         date   NOT NULL,
EndValue                        float  NOT NULL,
IsUpwardPeak                    bit    NOT NULL,

FirstPriceDifference            float  NOT NULL,
FirstTimeDifference             float  NOT NULL,
FirstPriceTimeDifference        float      NULL,

SecondPriceDifference           float  NOT NULL,
SecondTimeDifference            float  NOT NULL,
SecondPriceTimeDifference       float      NULL,

Ratio                           float      NULL,
Accuracy                        float      NULL
)

DECLARE DATES CURSOR FOR 
  SELECT DISTINCT
    StartDate  
  FROM
    dbo.SP500_Slopes
  WHERE
   StartDate BETWEEN @MinDate AND @MaxDate                

OPEN DATES

FETCH NEXT FROM DATES INTO @Date

WHILE @@FETCH_STATUS = 0 BEGIN

  DELETE FROM @PEAKS

  INSERT INTO @PEAKS
  (
    StartDate,
    StartValue,
    MidDate,
    MidValue,
    EndDate,
    EndValue,
    IsUpwardPeak,
    FirstPriceDifference,
    FirstTimeDifference,
    SecondPriceDifference,
    SecondTimeDifference,
    FirstPriceTimeDifference,
    SecondPriceTimeDifference,
    Ratio,
    Accuracy
  )
  SELECT  
    S.Date          'StartDate',
    S.Value         'StartValue',
    M.Date          'MidDate',
    M.Value         'MidValue',
    E.Date          'EndDate',
    E.Value         'EndValue',
    
    M.IsHighPeak    'IsUpwardPeak',
    
    abs(S.Value - M.Value)                                        'FirstPriceDifference',
    abs(datediff(day,S.Date,M.Date))                              'FirstTimeDifference',  
    
    abs(E.Value - M.Value)                                        'SecondPriceDifference',
    abs(datediff(day,E.Date,M.Date))                              'SecondTimeDifference',   
    
    abs( (S.Value - M.Value) * (datediff(day,S.Date,M.Date)) )    'FirstPriceTimeDifference',  
            
    abs( (E.Value - M.Value) * (datediff(day,E.Date,M.Date)) )    'SecondPriceTimeDifference', 
             
    abs( (S.Value - M.Value) * (datediff(day,S.Date,M.Date)) ) /
    abs( (E.Value - M.Value) * (datediff(day,E.Date,M.Date)) )    'Ratio', 
                                
    abs(
    @PERFECTRATIO - 
    (
    abs( (S.Value - M.Value) * (datediff(day,S.Date,M.Date)) ) /
    abs( (E.Value - M.Value) * (datediff(day,E.Date,M.Date)) ) 
    ) 
    )                                                             'Accuracy'         

  FROM
    SP500_Points M
  INNER JOIN
    SP500_Points S ON S.IsHighPeak = M.IsHighPeak AND S.Date < M.Date --AND S.Date >= @MinDate
  INNER JOIN
    SP500_Points E ON E.IsHighPeak = M.IsHighPeak AND E.Date > M.Date --AND E.Date <= @MaxDate
  WHERE
    M.Date  = @Date    
  AND
    abs( (E.Value - M.Value) * (datediff(day,E.Date,M.Date)) ) <> 0
  AND
    abs( (S.Value - M.Value) * (datediff(day,S.Date,M.Date)) ) < abs( (E.Value - M.Value) * (datediff(day,E.Date,M.Date)) )
  ORDER BY   
    @RATIO - 
    (
    abs( (S.Value - M.Value) * (datediff(day,S.Date,M.Date)) ) /
    abs( (E.Value - M.Value) * (datediff(day,E.Date,M.Date)) )  
    )   DESC
    
  INSERT INTO SP500_Peaks           
    SELECT TOP 1 
      * 
    FROM 
      @PEAKS
    WHERE
      @RATIO = round(Ratio,@ACCURCY)
    ORDER BY Accuracy asc  
    
  --SELECT @Date, @@rowcount  

  FETCH NEXT FROM DATES INTO @Date
END 

CLOSE DATES;
DEALLOCATE DATES;
go

select count(*) 'SP500_Peaks' FROM SP500_Peaks
GO


 