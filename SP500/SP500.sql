
INSERT INTO SP500
(   
  [Date], 
  [PriorDate], 
  [NextDate], 
  [Open], 
  [High], 
  [Low], 
  [Close] 
)

SELECT  
  cast([date]  as date),  
  null,  
  null,  
  cast([open]  as float),
  cast([high]  as float),
  cast([low]   as float),
  cast([close] as float) 
FROM
  [table]
ORDER BY 1
GO

UPDATE C SET
  PriorDate = (SELECT MAX(date) FROM SP500 WHERE date < C.date) 
FROM 
  SP500 C
LEFT JOIN 
  SP500 P ON C.date = P.date
  
UPDATE C SET
  NextDate = (SELECT MIN(date) FROM SP500 WHERE date > C.date) 
FROM 
  SP500 C
LEFT JOIN 
  SP500 N ON C.date = N.date  
  
UPDATE C SET

  [IsHighPeak] = CASE  WHEN  P.High < C.High AND C.High > N.High THEN 1  END,  
  [IsLowPeak]  = CASE  WHEN  P.Low  > C.Low  AND C.Low  < N.Low  THEN 1  END 

FROM
  SP500 C
INNER JOIN
  SP500 P ON P.Date = C.PriorDate
INNER JOIN
  SP500 N ON N.Date = C.NextDate
  
UPDATE C SET
  PeakInRatio  = (C.High - P.High)/C.High,
  PeakOutRatio = (C.High - N.High)/C.High 
FROM
  SP500 C
INNER JOIN
  SP500 P ON P.Date = C.PriorDate
INNER JOIN
  SP500 N ON N.Date = C.NextDate
WHERE
  C.IsHighPeak = 1
  
UPDATE C SET
  PeakInRatio  = -1* (C.Low - P.Low)/C.Low ,
  PeakOutRatio = -1* (C.Low - N.Low)/C.Low   
FROM
  SP500 C
INNER JOIN
  SP500 P ON P.Date = C.PriorDate
INNER JOIN                                                                  
  SP500 N ON N.Date = C.NextDate
WHERE
  C.IsLowPeak = 1
    

SELECT TOP 10 * FROM [table] ORDER BY 1
SELECT TOP 10 * FROM [SP500] ORDER BY 1


