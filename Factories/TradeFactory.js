var mainModule = angular.module('mainModule'); 

mainModule.factory('$TradeFactory', [ function (){   

  var Trade = function(amount, short){

    this.id     = Math.floor((1+Math.random())*0x100000);

    this.amount    = Number(amount);
    this.short     = short;

    this.openingDate         = undefined;
    this.openingPrice        = undefined;

    this.closingDate         = undefined;
    this.closingPrice        = undefined;
    this.profit              = undefined;

    this.expectedProfit      = undefined;
    this.age                 = undefined;

    this.setAside            = undefined;

  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  Trade.prototype.openTrade = function(date, priceMet){

    this.openingDate         = date;
    this.openingPrice        = priceMet;

    this.openingValue = this.openingPrice * this.amount;
  }; 
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Trade.prototype.closeTrade = function(date, priceMet){

    this.calculateExposure(date, priceMet, priceMet);

    this.closingDate         = date;
    this.closingPrice        = priceMet;
    
    this.profit              = this.expectedProfit;  
  }; 
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  Trade.prototype.calculateExposure = function(date, highPrice, lowPrice){

    if(this.closingDate) { return; }

    var start = new Date(this.openingDate);
    var end   = new Date(this.closingDate || date);

    this.age = Math.round( (end-start) / (1000*60*60*24) );

    if (this.short){

       this.expectedProfit = Math.round( this.amount * (this.openingPrice - Number(highPrice)   ) );
    } else {

       this.expectedProfit = Math.round( this.amount * (Number(lowPrice)  - this.openingPrice   ) );
    }
  }; 
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return Trade;

}]);
