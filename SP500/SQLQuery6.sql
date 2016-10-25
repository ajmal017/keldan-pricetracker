

DECLARE @Depth int = 1
DECLARE @StartDate  date
DECLARE @EndDate   date


WHILE @Depth < 50 BEGIN

  DECLARE DATES CURSOR FOR 
    SELECT DISTINCT
      StartDate,
      MidDate  
    FROM
      dbo.SP500_Breaks 
    WHERE
       Depth = @Depth
    UNION
    SELECT DISTINCT
      MidDate,
      EndDate  
    FROM
      dbo.SP500_Breaks 
    WHERE
       Depth = @Depth
           
  OPEN DATES

  FETCH NEXT FROM DATES INTO @StartDate, @EndDate

  WHILE @@FETCH_STATUS = 0 BEGIN

    --SELECT @StartDate, @EndDate, @Depth

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
    EXEC dbo.SplitPoints @StartDate, @EndDate, @Depth

    FETCH NEXT FROM DATES INTO @StartDate, @EndDate
  END 

  CLOSE DATES;
  DEALLOCATE DATES;

  SET @Depth = @Depth + 1
 
END
go

UPDATE dbo.SP500_Breaks SET
  FirstPriceTimeDifference  = datediff(day, StartDate,  MidDate)  * (StartValue -  MidValue),
  SecondPriceTimeDifference = datediff(day, MidDate,    EndDate)  * (MidValue   -  EndValue)

SELECT count(*) FROM SP500_Breaks  

DELETE FROM SP500_Slopes

INSERT INTO dbo.SP500_Slopes
  SELECT 
   Depth,
   StartDate,
   MidDate,
   StartValue,
   EndValue,
   CASE WHEN StartValue < MidValue THEN 1 ELSE 0 END,
   FirstPriceTimeDifference 
  FROM 
    SP500_Breaks B
  WHERE
    NOT EXISTS (SELECT 1 FROM SP500_Slopes WHERE Depth = B.Depth AND StartDate = B.StartDate AND EndDate = B.MidDate) 
  
INSERT INTO dbo.SP500_Slopes
  SELECT 
   Depth,
   MidDate,
   EndDate,
   EndValue,
   EndValue,
   CASE WHEN MidValue < EndValue THEN 1 ELSE 0 END,
   SecondPriceTimeDifference 
  FROM 
    SP500_Breaks B
  WHERE
    NOT EXISTS (SELECT 1 FROM SP500_Slopes WHERE Depth = B.Depth AND StartDate = B.MidDate AND EndDate = B.EndDate) 
  
 SELECT count(*) FROM SP500_Slopes    
 SELECT * FROM SP500_Slopes  order by 

DECLARE @ACCURCY int = 5
 
DECLARE @RATIO        decimal(9,8) = round((1+sqrt(5))/2,@ACCURCY)
DECLARE @PERFECTRATIO decimal(9,8) = (1+sqrt(5))/2

SELECT count(*)
  --F.StartDate, 
  --F.EndDate,
  --S.StartDate, 
  --S.EndDate,
  --T.StartDate, 
  --T.EndDate
FROM
  SP500_Slopes F
INNER JOIN
  SP500_Slopes S ON round(S.PriceTimeDifference * @RATIO, @ACCURCY) = round(F.PriceTimeDifference, @ACCURCY) 
                 AND S.IsUpwardSlope = F.IsUpwardSlope 
                 AND S.StartDate     > F.EndDate 
                 AND S.Depth         = F.Depth
LEFT OUTER JOIN
  SP500_Slopes T ON round(T.PriceTimeDifference * @RATIO, @ACCURCY) = round(S.PriceTimeDifference, @ACCURCY) 
                 AND T.IsUpwardSlope = S.IsUpwardSlope 
                 AND T.StartDate     > S.EndDate 
                 AND T.Depth         = S.Depth
ORDER BY
  S.StartDate 