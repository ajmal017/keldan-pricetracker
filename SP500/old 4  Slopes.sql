DELETE FROM SP500_Slopes
go

DECLARE @Date date

DECLARE DATES CURSOR FOR 
  SELECT
    Date 
  FROM
    SP500_Points 
 
  --AND  
  --  Date < '1950-07-31'                 

OPEN DATES

FETCH NEXT FROM DATES INTO @Date

WHILE @@FETCH_STATUS = 0 BEGIN

  INSERT INTO SP500_Slopes
  (
	  [StartDate] ,
	  [EndDate],
	  [IsUpwardSlope],
	  [PriceDifference] ,
	  [TimeDifference],
	  [PriceTimeDifference] 
  )

  SELECT
    S.Date,
    E.Date,
    E.IsHighPeak,
    E.Value - S.Value,
    datediff(day,S.Date,E.Date),
    (E.Value - S.Value) * datediff(day,S.Date,E.Date)   
  FROM
    SP500_Points S
  INNER JOIN                     
    SP500_Points E ON E.Date > S.Date
  WHERE
    (
     (S.IsHighPeak  = 1 AND E.IsHighPeak = 0) OR
     (S.IsHighPeak  = 0 AND E.IsHighPeak = 1) 
    )                                             AND
    S.Date = @Date
  
  --SELECT @Date, @@rowcount
  
  FETCH NEXT FROM DATES INTO @Date
END 

CLOSE DATES;
DEALLOCATE DATES;
go

SELECT count(*) 'SP500_Slopes' FROM  SP500_Slopes 
go
 