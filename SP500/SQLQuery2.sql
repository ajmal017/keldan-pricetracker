
DECLARE @MinDate date = '1950-01-01' 
DECLARE @Date    date = '1950-10-11' 
DECLARE @MaxDate date = '1955-12-31' 


SELECT count(*)
  --S.Date,
  --M.Date          'MidDate',
  --M.Value         'MidValue',
  
  --M.IsHighPeak    'IsUpwardPeak'

FROM
  SP500_Points M
INNER JOIN
  SP500_Points S ON S.IsHighPeak != M.IsHighPeak AND S.Date < M.Date AND S.Date >= @MinDate
--INNER JOIN
--  SP500_Points E ON E.IsHighPeak != M.IsHighPeak AND E.Date > M.Date AND E.Date <= @MInDate
WHERE
  M.Date  = @Date
