DECLARE @CHART TABLE ( results geometry )

DECLARE @StartDate   date = '1950'
DECLARE @EndDate     date = '2020'
DECLARE @ScaleFactor int = 6

DECLARE @IncludeHigh        bit = 0
DECLARE @IncludeLow         bit = 0
DECLARE @IncludeInterp      bit = 0
DECLARE @IncludeBreaks      bit = 0
DECLARE @IncludeMids        bit = 0
DECLARE @IncludeSlopes      bit = 0
DECLARE @IncludeWaves       bit = 1


DECLARE @Depth int = null
 

------------------------------------------------------------------------------------------------------------------------
--SP500 High
------------------------------------------------------------------------------------------------------------------------
IF (@IncludeHigh = 1) 
INSERT INTO @CHART SELECT  geometry::STGeomFromText( 'LINESTRING(' + line + ')', 0 )  FROM  
( SELECT STUFF((SELECT ',' + 

     CAST( XValue     AS VARCHAR(30) ) + ' ' + 
     CAST( YValue     AS VARCHAR(30) ) 
     
     FROM (
     ----------------------------------------------------------------------
        SELECT  
          datediff(day, '1950', Date) 'XValue',  
          High   * @ScaleFactor       'YValue'
        FROM
          SP500    
        WHERE
          Date BETWEEN @StartDate AND @EndDate 
     ----------------------------------------------------------------------
     ) DATA

     ORDER BY XValue
     
     FOR XML PATH('')), 1, 1, '')  'line'       
) DATA 

------------------------------------------------------------------------------------------------------------------------
--SP500 Low
------------------------------------------------------------------------------------------------------------------------
IF (@IncludeLow = 1) 
INSERT INTO @CHART SELECT  geometry::STGeomFromText( 'LINESTRING(' + line + ')', 0 )  FROM  
( SELECT STUFF((SELECT ',' + 

     CAST( XValue     AS VARCHAR(30) ) + ' ' + 
     CAST( YValue     AS VARCHAR(30) ) 
     
     FROM (
     ----------------------------------------------------------------------
        SELECT  
          datediff(day, '1950', Date) 'XValue',  
          low  * @ScaleFactor         'YValue'
        FROM
          SP500  
        WHERE
          Date BETWEEN @StartDate AND @EndDate 
     ----------------------------------------------------------------------
     ) DATA

     ORDER BY XValue
     
     FOR XML PATH('')), 1, 1, '')  'line'       
) DATA 
  
 
------------------------------------------------------------------------------------------------------------------------
--SP500 Breaks
------------------------------------------------------------------------------------------------------------------------
IF (@IncludeInterp = 1) 
INSERT INTO @CHART SELECT geometry::STGeomFromText(  
 
     'LINESTRING ( ' +
     CAST( X1Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y1Value          AS VARCHAR(30) ) + ', ' +
     
     --CAST( X2Value          AS VARCHAR(30) ) + ' '  + 
     --CAST( Y2Value          AS VARCHAR(30) ) + ', ' +
     
     CAST( X3Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y3Value          AS VARCHAR(30) ) +  
     ' )', 0) 
     FROM 
     (
     ----------------------------------------------------------------------
        SELECT top 500 
          datediff(day, '1950', StartDate) 'X1Value',  
          StartEstimate  * @ScaleFactor       'Y1Value',
          datediff(day, '1950', MidDate)   'X2Value',  
          MidValue  * @ScaleFactor         'Y2Value', 
          datediff(day, '1950', EndDate)   'X3Value',  
          EndEstimate  * @ScaleFactor         'Y3Value' 
        FROM
          SP500_Breaks  
        WHERE
          MidDate BETWEEN @StartDate AND @EndDate   
        AND 
          Depth = ISNULL(@Depth, Depth)
     ----------------------------------------------------------------------
     ) DATA

     ORDER BY X2Value  

------------------------------------------------------------------------------------------------------------------------
--SP500 Breaks
------------------------------------------------------------------------------------------------------------------------
IF (@IncludeBreaks = 1) 
INSERT INTO @CHART SELECT geometry::STGeomFromText(  
 
     'LINESTRING ( ' +
     CAST( X1Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y1Value          AS VARCHAR(30) ) + ', ' +
     
     CAST( X2Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y2Value          AS VARCHAR(30) ) + ', ' +
     
     CAST( X3Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y3Value          AS VARCHAR(30) ) +  
     ' )', 0) 
     FROM 
     (
     ----------------------------------------------------------------------
        SELECT top 500 
          datediff(day, '1950', StartDate) 'X1Value',  
          StartValue  * @ScaleFactor       'Y1Value',
          datediff(day, '1950', MidDate)   'X2Value',  
          MidValue  * @ScaleFactor         'Y2Value', 
          datediff(day, '1950', EndDate)   'X3Value',  
          EndValue  * @ScaleFactor         'Y3Value' 
        FROM
          SP500_Breaks  
        WHERE
          MidDate BETWEEN @StartDate AND @EndDate     AND 
          Depth = ISNULL(@Depth,Depth)
     ----------------------------------------------------------------------
     ) DATA

     ORDER BY X2Value  
     
------------------------------------------------------------------------------------------------------------------------
--SP500 Mids
------------------------------------------------------------------------------------------------------------------------
IF (@IncludeMids = 1) 
INSERT INTO @CHART SELECT  geometry::STGeomFromText( 'LINESTRING(' + line + ')', 0 )  FROM  
( SELECT STUFF((SELECT ',' + 

     CAST( XValue     AS VARCHAR(30) ) + ' ' + 
     CAST( YValue     AS VARCHAR(30) ) 
     
     FROM (
     ----------------------------------------------------------------------
        SELECT DISTINCT 
          datediff(day, '1950', MidDate) 'XValue',  
          MidValue * @ScaleFactor        'YValue'
        FROM
          dbo.SP500_Breaks 
        WHERE
          MidDate BETWEEN @StartDate AND @EndDate AND
          Depth = ISNULL(@Depth,Depth)
     ----------------------------------------------------------------------
     ) DATA

     ORDER BY XValue
     
     FOR XML PATH('')), 1, 1, '')  'line'       
) DATA 

------------------------------------------------------------------------------------------------------------------------
--SP500 Mids
------------------------------------------------------------------------------------------------------------------------
IF (@IncludeSlopes = 1) 
INSERT INTO @CHART SELECT  geometry::STGeomFromText( 'LINESTRING(' + line + ')', 0 )  FROM  
( SELECT STUFF((SELECT ',' + 

     CAST( XValue     AS VARCHAR(30) ) + ' ' + 
     CAST( YValue     AS VARCHAR(30) ) 
     
     FROM (
     ----------------------------------------------------------------------
        SELECT DISTINCT 
          datediff(day, '1950', StartDate) 'XValue',  
          StartValue * @ScaleFactor        'YValue'
        FROM
          dbo.SP500_Slopes 
        WHERE
          StartDate BETWEEN @StartDate AND @EndDate AND
          Depth = ISNULL(@Depth,Depth)
        UNION SELECT   
          datediff(day, '1950', EndDate) 'XValue',  
          EndValue * @ScaleFactor        'YValue'
        FROM
          dbo.SP500_Slopes 
        WHERE
          StartDate BETWEEN @StartDate AND @EndDate AND
          Depth = ISNULL(@Depth,Depth)
     ----------------------------------------------------------------------
     ) DATA

     ORDER BY XValue
     
     FOR XML PATH('')), 1, 1, '')  'line'       
) DATA 

------------------------------------------------------------------------------------------------------------------------
--SP500 Waves
------------------------------------------------------------------------------------------------------------------------
IF (@IncludeWaves = 1) 
INSERT INTO @CHART SELECT geometry::STGeomFromText(  
--SELECT
     'MULTILINESTRING (( ' +
     CAST( X1Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y1Value          AS VARCHAR(30) ) + ', ' +
     
     CAST( X2Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y2Value          AS VARCHAR(30) ) +  
     ' ),' +
     
     ISNULL(
     ' ( ' +
     CAST( X3Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y3Value          AS VARCHAR(30) ) + ', ' +
     
     CAST( X4Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y4Value          AS VARCHAR(30) ) +  
     ' )' ,'')  +
     
     isnull(
     ', ( ' +
     CAST( X5Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y5Value          AS VARCHAR(30) ) + ', ' +
     
     CAST( X6Value          AS VARCHAR(30) ) + ' '  + 
     CAST( Y6Value          AS VARCHAR(30) ) +  
     ' )' ,'')  + ')'
     
     
     , 0) 
     FROM 
     (
     ----------------------------------------------------------------------
        SELECT  
          datediff(day, '1950', FirstWaveStartDate)  'X1Value',  
          FirstWaveStartValue  * @ScaleFactor        'Y1Value',
          datediff(day, '1950', FirstWaveEndDate)    'X2Value',  
          FirstWaveEndValue  * @ScaleFactor          'Y2Value',

          datediff(day, '1950', SecondWaveStartDate) 'X3Value',  
          SecondWaveStartValue  * @ScaleFactor       'Y3Value',
          datediff(day, '1950', SecondWaveEndDate)   'X4Value',  
          SecondWaveEndValue  * @ScaleFactor         'Y4Value',

          datediff(day, '1950', ThirdWaveStartDate)  'X5Value',  
          ThirdWaveStartValue  * @ScaleFactor        'Y5Value',
          datediff(day, '1950', ThirdWaveEndDate)    'X6Value',  
          ThirdWaveEndValue  * @ScaleFactor          'Y6Value' 
        FROM
          SP500_Waves  
        WHERE
          FirstWaveStartDate BETWEEN @StartDate AND @EndDate  
     ----------------------------------------------------------------------
     ) DATA

     ORDER BY X2Value  

SELECT * FROM @CHART
  
