(function(){      

var Factory;
 
var injector = angular.injector([ 'ng', 'mainModule' ])

injector.invoke(function($TradeFactory) {  

  Factory = $TradeFactory; 

});

beforeEach(function(){

});  

  
describe('$TradeFactory', function (){ 

  it('should ba a function', function () { 

    expect(angular.isFunction(Factory)).toBe(true);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should have a function - openTrade', function () { 

    expect(angular.isFunction(Factory.prototype.openTrade)).toBe(true);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


  it('should create an object', function () { 

    var trade = new Factory();

    expect(angular.isObject(trade)).toBe(true);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should create an object with the correct values - 750 - true', function () { 

    var amount = 750;
    var short  = true;

    var trade = new Factory(amount, short);

    expect( trade.amount ).toBe(amount);
    expect( trade.short  ).toBe(short);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should have a method openTrade - 1950-02-16 - 16.99', function () { 

    var amount = 750;
    var short  = true;

    var date   = '1950-02-16';         
    var price  = 16.99;

    var trade = new Factory(amount, short);

    trade.openTrade(date, price);

    expect( trade.openingDate  ).toBe(date );
    expect( trade.openingPrice ).toBe(price);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should calculateExposure correctly - 13 - (187) ', function () { 

    var amount = 750;
    var short  = true;

    var date   = '1950-02-16';         
    var price  = 16.99;

    var trade = new Factory(amount, short);

    trade.openTrade(date, price);

    trade.calculateExposure('1950-02-17', 17.15, 17.15);
    trade.calculateExposure('1950-02-20', 17.20, 17.20);
    trade.calculateExposure('1950-02-21', 17.17, 17.17);
    trade.calculateExposure('1950-02-23', 17.21, 17.21);
    trade.calculateExposure('1950-02-24', 17.28, 17.28);
    trade.calculateExposure('1950-02-27', 17.28, 17.28);
    trade.calculateExposure('1950-02-28', 17.22, 17.22);
    trade.calculateExposure('1950-03-01', 17.24, 17.24);

    expect( trade.age            ).toBe(13 );
    expect( trade.expectedProfit ).toBe(-187);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


  it('should close correctly - 1950-03-01 - 13 - (187) ', function () { 

    var amount = 750;
    var short  = true;

    var date   = '1950-02-16';         
    var price  = 16.99;

    var trade = new Factory(amount, short);

    trade.openTrade(date, price);

    trade.calculateExposure('1950-02-17', 17.15, 17.15);
    trade.calculateExposure('1950-02-20', 17.20, 17.20);
    trade.calculateExposure('1950-02-21', 17.17, 17.17);
    trade.calculateExposure('1950-02-23', 17.21, 17.21);
    trade.calculateExposure('1950-02-24', 17.28, 17.28);
    trade.calculateExposure('1950-02-27', 17.28, 17.28);
    trade.calculateExposure('1950-02-28', 17.22, 17.22);

    trade.closeTrade('1950-03-01', 17.24);

    expect( trade.closingDate  ).toBe('1950-03-01');
    expect( trade.closingPrice ).toBe(17.24);
    expect( trade.profit       ).toBe(-187);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

});


}());    

