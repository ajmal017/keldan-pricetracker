DELETE FROM SP500_Points
GO

INSERT INTO SP500_Points
(
  [Date],         
  [Value],        
  [IsHighPeak] 
)
SELECT
  C.Date,
  CASE  
    WHEN  P.High < C.High AND C.High > N.High THEN C.High   
    WHEN  P.Low  > C.Low  AND C.Low  < N.Low  THEN C.Low  
  END,
  CASE  
    WHEN  P.High < C.High AND C.High > N.High THEN 1   
    WHEN  P.Low  > C.Low  AND C.Low  < N.Low  THEN 0  
  END 
FROM
  SP500 C
INNER JOIN
  SP500 P ON P.Date = C.PriorDate
INNER JOIN
  SP500 N ON N.Date = C.NextDate
WHERE
  (P.High < C.High AND C.High > N.High ) OR
  (P.Low  > C.Low  AND C.Low  < N.Low  )
  
  
UPDATE D SET
  PeakInRatio  = (C.High - P.High)/C.High,
  PeakOutRatio = (C.High - N.High)/C.High 
FROM
  SP500_Points D
INNER JOIN
  SP500 C ON C.Date = D.Date
INNER JOIN
  SP500 P ON P.Date = C.PriorDate
INNER JOIN
  SP500 N ON N.Date = C.NextDate
WHERE
  D.IsHighPeak = 1
  
UPDATE D SET
  PeakInRatio  = -1* (C.Low - P.Low)/C.Low ,
  PeakOutRatio = -1* (C.Low - N.Low)/C.Low   
FROM
  SP500_Points D
INNER JOIN
  SP500 C ON C.Date = D.Date
INNER JOIN
  SP500 P ON P.Date = C.PriorDate
INNER JOIN                                                                  
  SP500 N ON N.Date = C.NextDate
WHERE
  D.IsHighPeak = 0
go

SELECT count(*) 'SP500_Points' FROM  SP500_Points 
go 

