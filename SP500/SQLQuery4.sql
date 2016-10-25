
DECLARE @DATA TABLE( x float, y float)


INSERT INTO @DATA VALUES( 1.47,  52.21  )    
INSERT INTO @DATA VALUES( 1.50,  53.12  )     
INSERT INTO @DATA VALUES( 1.52,  54.48  )    
INSERT INTO @DATA VALUES( 1.55,  55.84  )     
INSERT INTO @DATA VALUES( 1.57,  57.20  )
INSERT INTO @DATA VALUES( 1.60,  58.57  )     
INSERT INTO @DATA VALUES( 1.63,  59.93  )    
INSERT INTO @DATA VALUES( 1.65,  61.29  )    
INSERT INTO @DATA VALUES( 1.68,  63.11  )    
INSERT INTO @DATA VALUES( 1.70,  64.47  )     
INSERT INTO @DATA VALUES( 1.73,  66.28  )     
INSERT INTO @DATA VALUES( 1.75,  68.10  )    
INSERT INTO @DATA VALUES( 1.78,  69.92  )   
INSERT INTO @DATA VALUES( 1.80,  72.19  )    
INSERT INTO @DATA VALUES( 1.83,  74.46  )

--INSERT INTO @DATA
--  SELECT
--    datediff(day,'1950',Date),
--    Value
--  FROM
--    dbo.SP500_Points 
--  WHERE
--    Date < '1953'
 
DECLARE @n   float       
DECLARE @Sx  float       
DECLARE @Sy  float       
DECLARE @Sxx float       
DECLARE @Syy float       
DECLARE @Sxy float   

SELECT @n   = count(*),    
       @Sx  = sum(x),      
       @Sy  = sum(y),      
       @Sxx = sum(x*x),    
       @Syy = sum(y*y),     
       @Sxy = sum(x*y) FROM @DATA   

DECLARE @B float
DECLARE @A float
DECLARE @R float

SELECT @B =  ((@n*@Sxy) - (@Sx*@Sy)) / ( (@n*@Sxx - (@Sx*@Sx) )  )

SELECT @A = ((1/@n)*@Sy) - (@B*(1/@n)*@Sx)

SELECT @R = ((@n*@Sxy)-(@Sx*@Sy)) / sqrt( ((@n*@Sxx)-(@Sx*@Sx)) * ((@n*@Syy)-(@Sy*@Sy)) )



SELECT @B
SELECT @A
SELECT @R
     
      
