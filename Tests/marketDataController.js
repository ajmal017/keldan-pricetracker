(function(){

var scope;
var controller;
 
var injector = angular.injector([ 'ng', 'mainModule' ])

injector.invoke(function($rootScope, $controller) {  

    scope = $rootScope.$new();

    controller = $controller('marketDataController', {$scope: scope} );
});

beforeEach(function(){

  if (window.console) {
    window.console.log('marketDataController.id: ' + controller.id);
  }
});

describe('marketDataController', function (){
  
  it('should have the function - openPosition', function () { 

    expect(angular.isFunction(scope.loadPosition)).toBe(true);
  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
  
  it('should loadPositionToDate(1950-03-03) - 37', function () { 

    var name   = 'SP500';
    var date   = '1950-03-03';
    var amount = 5000;
    var result = 42;
    var done   = false;

    runs(function(){
        
        scope.loadPositionToDate(name, amount, date).then(function(){
        
           done = true;
        }); 
    }); 
 
    waitsFor(function(){ return done});

    runs(function(){

      expect(scope.market.name).toBe(name);
      expect(scope.market.currentPrice.date).toBe(date);    
      expect(scope.position.balance).toBe(amount);       

      expect(scope.market.name).toBe(                                'SP500');                     
      expect(scope.market.currentPrice.date).toBe(                   '1950-03-03');    
      expect(scope.market.currentPrice.open).toBe(                   17.29);    
      expect(scope.market.currentPrice.high).toBe(                   17.29);    
      expect(scope.market.currentPrice.low).toBe(                    17.29);    
      expect(scope.market.currentPrice.close).toBe(                  17.29);    
      expect(scope.market.currentPrice.nextDate).toBe(               '1950-03-06');    
      expect(scope.market.historicalPrices.length).toBe(             42);  
      expect(scope.market.positions.length).toBe(                    1);       

      expect(scope.position.currentDate).toBe(                       '1950-03-03');       
      expect(scope.position.currentHigh).toBe(                       17.29);       
      expect(scope.position.currentLow).toBe(                        17.29);        
                                                                     
      expect(scope.position.short).toBe(                             false);             
                                                                     
      expect(scope.position.positiveDrifts.length).toBe(             3);    
      expect(scope.position.negativeDrifts.length).toBe(             3);    
      expect(scope.position.timeBuckets.length).toBe(                3);       
                                                                     
      expect(scope.position.balance).toBe(                           5000);          
      expect(scope.position.availableBalance).toBe(                  5000);  
      expect(scope.position.gearing).toBe(                           5);           
      expect(scope.position.commision).toBe(                         2);         
                                                                     
      expect(scope.position.openTrades.length).toBe(                 0);        
      expect(scope.position.closedTrades.length).toBe(               0);      
      expect(scope.position.shortTrades.length).toBe(                0);       
      expect(scope.position.longTrades.length).toBe(                 0);        
      expect(scope.position.orders.length).toBe(                     0);            
      expect(scope.position.sales.length).toBe(                      0);             
      expect(scope.position.movements.length).toBe(                  1);         
                                                                     
      expect(scope.position.expectedProfit).toBe(                    0);        
 
      expect(scope.timerAction).toBe(                                'Start');      
      expect(scope.newTradeAmount).toBe(                             750);   

    });

  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
  
  it('should loadPositionToDate(1956-08-16) - 1662', function () { 

    var name   = 'SP500';
    var date   = '1956-08-16';
    var result = 1662;
    var amount = 5000;
    var done   = false;

    runs(function(){
        
        scope.loadPositionToDate(name, amount, date).then(function(){
        
           done = true;
        }); 
    }); 
 
    waitsFor(function(){ return done},20000);

    runs(function(){

      expect(scope.market.historicalPrices.length).toBe(result);
    });

  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
   
 

});

}());



