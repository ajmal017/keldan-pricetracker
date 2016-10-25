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
  [Import]
ORDER BY 1
GO

UPDATE C SET
  PriorDate = (SELECT MAX(date) FROM SP500 WHERE date < C.date) 
FROM 
  SP500 C
LEFT JOIN 
  SP500 P ON C.date = P.date
go
  
UPDATE C SET
  NextDate = (SELECT MIN(date) FROM SP500 WHERE date > C.date) 
FROM 
  SP500 C
LEFT JOIN 
  SP500 N ON C.date = N.date 
go

SELECT count(*) 'SP500' FROM  SP500 
go 