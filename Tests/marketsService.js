(function(){

 
var service;
 
var injector = angular.injector([ 'ng', 'mainModule' ])

injector.invoke(function($marketsService) {

  service = $marketsService;    
});

beforeEach(function(){

  if (window.console) {
    window.console.log('$marketsservice.id: ' + service.id);
  }
});

describe('$marketsservice', function (){
  
  it('should have the function - chooseMarket', function () { 

    expect(angular.isFunction(service.chooseMarket)).toBe(true);
  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

  xit('should choose the correct market - SP500', function () {

    var name = 'SP500';
    var done;

    service.chooseMarket(name).then(function(){

      done = true;
    });

    waitsFor(function(){return done});

    runs(function(){

      expect(service.selectedMarket.name).toBe(name);
    });


  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  it('should loadInitialPriceswith the correct number of historical prices - 388', function () { 

    var name    = 'SP500';
    var date    = '1950-02-24';
    var amount  = 5000;
    var done;

    runs(function(){

      service.chooseMarket(name).then(function(market){

        service.loadInitialPrices(market).then(function(x){
      
          done = true;       
        });      
      }); 
  
    });

    waitsFor(function(){return done});

    runs(function(){

      expect(service.selectedMarket.name).toBe(name);
      expect(service.selectedMarket.historicalPrices.length).toBe(388);

      service.selectedMarket.currentPrice     = undefined;
      service.selectedMarket.historicalPrices = [];
      service.selectedMarket.positions        = [];

      service.markets = [];
    });
    
 });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

  it('should openPosition(1950-02-24) with the correct number of historical prices - 37', function () { 

    var name    = 'SP500';
    var date    = '1950-02-24';
    var amount  = 5000;
    var done;

    runs(function(){

      service.chooseMarket(name).then(function(market){

        service.loadPrices(market, date).then(function(x){
      
          service.openPosition(market, date, amount).then(function(x){
            
            done = true;
          
          });          
        });      
      }); 
  
    });

    waitsFor(function(){return done});

    runs(function(){

      expect(service.selectedMarket.name).toBe(name);
      expect(service.selectedMarket.historicalPrices.length).toBe(37);
      
      expect(service.selectedMarket.positions.length).toBe(1);
      expect(service.selectedMarket.positions[0].balance).toBe(amount);
    });
    
 });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

  it('should nextPrice() with the correct number of historical prices - 39', function () { 

    var name    = 'SP500';
    var date    = '1950-02-24';
    var amount  = 5000;
    var done;

    runs(function(){

      service.chooseMarket(name).then(function(market){

        service.loadPrices(market, date).then(function(x){
      
            done = true;
                   
        });      
      }); 
  
    });

    waitsFor(function(){return done});

    runs(function(){

      done = false;

      service.loadNextPrice(service.selectedMarket).then(function(){
            
            done = true;    
      });          
    });

    waitsFor(function(){return done});

    runs(function(){

      expect(service.selectedMarket.name).toBe(name);
      expect(service.selectedMarket.historicalPrices.length).toBe(39);
      
    });
    
 });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     

   

});

}());