DELETE FROM SP500_PriceTime
go

INSERT INTO SP500_PriceTime
(
	[StartDate] ,
	[EndDate],
	[IsHighPeak],
	[PriceDifference] ,
	[TimeDifference] 
)

SELECT
  S.Date,
  E.Date,
  isnull(E.IsHighPeak, E.IsLowPeak-1),
  
  CASE 
    WHEN E.IsHighPeak = 1 THEN E.High - S.High 
    WHEN E.IsLowPeak  = 1 THEN E.Low  - S.Low   
  END,
  
  datediff(day,S.Date,E.Date)  
  
FROM
  (SELECT * FROM SP500 WHERE IsHighPeak  = 1 OR IsLowPeak   = 1  ) S
INNER JOIN                     
  (SELECT * FROM SP500 WHERE IsHighPeak  = 1 OR IsLowPeak   = 1  ) E ON E.Date > S.Date

UPDATE SP500_PriceTime SET
  [PriceTimeDifference] = [PriceDifference] * [TimeDifference]

SELECT TOP 500 * FROM SP500_PriceTime