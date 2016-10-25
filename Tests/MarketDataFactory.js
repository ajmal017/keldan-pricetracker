(function(){

var Factory;
 
var injector = angular.injector([ 'ng', 'mainModule' ])

injector.invoke(function($MarketDataFactory) {

  Factory = $MarketDataFactory;  
});

beforeEach(function(){

});
  
describe('$MarketDataFactory', function (){ 

  it('should ba a function', function () { 

    expect(angular.isFunction(Factory)).toBe(true);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should have a function - addPrice', function () { 

    expect(angular.isFunction(Factory.prototype.addPrice)).toBe(true);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should create objects with the correct name - SP500', function () { 

    var newName = 'SP500';

    var o = new Factory(newName);

    expect(angular.isObject(o)).toBe(true);

    expect(o.id).toBeDefined();
    expect(o.name).toBe(newName);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should create objects with the correct name - FTSE100', function () { 

    var newName = 'FTSE100';

    var o = new Factory(newName);

    expect(angular.isObject(o)).toBe(true);

    expect(o.name).toBe(newName);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should create objects with empty history', function () { 

    var newName = 'SP500';

    var o = new Factory(newName);

    expect(o.historicalPrices).not.toBeUndefined();
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should create a position - 5000', function () { 

    var newName = 'SP500';
    var date    = '1950-02-24';
    var value   = 5000;

    var o = new Factory(newName);

    o.openPosition(date, value);

    expect(o.positions[0].balance).toBe(value);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  
});




}());