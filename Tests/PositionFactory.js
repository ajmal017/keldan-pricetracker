(function(){      

var Factory;
 
var injector = angular.injector([ 'ng', 'mainModule' ])

injector.invoke(function($PositionFactory) {  

  Factory = $PositionFactory; 
});

beforeEach(function(){

});  

  
describe('$PositionFactory', function (){ 

  it('should ba a function', function () { 

    expect(angular.isFunction(Factory)).toBe(true);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should have a function - closePosition', function () { 

    expect(angular.isFunction(Factory.prototype.closePosition)).toBe(true);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


  it('should create objects with the correct values - 1950-02-24 - 5000', function () { 

    var date  = '1950-02-24';
    var value = 5000;

    var position = new Factory(date, value);

    expect(angular.isObject(position)).toBe(true);

    expect(position.balance).toBe(value);
    expect(position.availableBalance).toBe(value);

    expect(position.movements.length).toBe(1);
    expect(position.movements[0].balance).toBe(value);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  it('should have a balance with calculateExposures without trades - 5000', function () { 

    var date  = '1950-02-24';
    var value = 5000;

    var position = new Factory(date, value);

    position.calculateExposure('1950-02-17', 17.15, 17.15);
    position.calculateExposure('1950-02-20', 17.20, 17.20);
    position.calculateExposure('1950-02-21', 17.17, 17.17);
    position.calculateExposure('1950-02-23', 17.21, 17.21);
    position.calculateExposure('1950-02-24', 17.28, 17.28);
    position.calculateExposure('1950-02-27', 17.28, 17.28);
    position.calculateExposure('1950-02-28', 17.22, 17.22);
    position.calculateExposure('1950-03-01', 17.24, 17.24); 

    expect(position.currentDate).toBe('1950-03-01');
    expect(position.currentHigh).toBe(17.24);
    expect(position.currentLow).toBe(17.24);
    expect(position.balance).toBe(value);
    expect(position.availableBalance).toBe(value);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


  it('should have a availableBalance with calculateExposures with open trades - 2422', function () { 

    var date  = '1950-02-24';
    var value = 5000;

    var position = new Factory(date, value);

    position.calculateExposure('1950-02-17', 17.15, 17.15);
    position.calculateExposure('1950-02-20', 17.20, 17.20);
    position.addOrder(750, true);
      expect(position.orders.length).toBe(1);
      expect(position.openTrades.length).toBe(0);
    position.calculateExposure('1950-02-21', 17.17, 17.17);
      expect(position.orders.length).toBe(0);
      expect(position.openTrades.length).toBe(1);
    position.calculateExposure('1950-02-23', 17.21, 17.21);
    position.calculateExposure('1950-02-24', 17.28, 17.28);
    position.calculateExposure('1950-02-27', 17.28, 17.28);
    position.calculateExposure('1950-02-28', 17.22, 17.22);
    position.calculateExposure('1950-03-01', 17.24, 17.24); 

    expect(position.currentDate).toBe('1950-03-01');
    expect(position.currentHigh).toBe(17.24);
    expect(position.currentLow).toBe(17.24);
    expect(position.balance).toBe(value);
    expect(position.availableBalance).toBe(2422);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


  it('should have a availableBalance with calculateExposures with closed trades - 2422', function () { 

    var date  = '1950-02-24';
    var value = 5000;

    var position = new Factory(date, value);

    position.calculateExposure('1950-02-17', 17.15, 17.15);
    position.calculateExposure('1950-02-20', 17.20, 17.20);
    position.addOrder(750, true);
      expect(position.orders.length).toBe(1);
      expect(position.openTrades.length).toBe(0);
    position.calculateExposure('1950-02-21', 17.17, 17.17);
      expect(position.orders.length).toBe(0);
      expect(position.openTrades.length).toBe(1);

    position.calculateExposure('1950-02-23', 17.21, 17.21);
    position.calculateExposure('1950-02-24', 17.28, 17.28);
    position.calculateExposure('1950-02-27', 17.28, 17.28);
    position.calculateExposure('1950-02-28', 17.22, 17.22);
       position.addSale(position.openTrades[0].id);
    position.calculateExposure('1950-03-01', 17.24, 17.24); 

    expect(position.currentDate).toBe('1950-03-01');
    expect(position.currentHigh).toBe(17.24);
    expect(position.currentLow).toBe(17.24);
    expect(position.balance).toBe(4946);
    expect(position.availableBalance).toBe(4946);
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 



});

}());    

