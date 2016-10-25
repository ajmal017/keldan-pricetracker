var mainModule = angular.module('mainModule'); 

mainModule.factory('$PositionFactory', ['$TradeFactory', function ($TradeFactory){   
  'use strict';
  
  var Position = function(date, amount){

     this.id     = Math.floor((1+Math.random())*0x100000);

     this.currentDate        = undefined;
     this.currentHigh        = undefined;
     this.currentLow         = undefined;
                             
     this.short              = false;

     this.positiveDrifts     =   [ 0.1,  0.7,  1.5];
     this.negativeDrifts     =   [-0.1, -0.7, -1.5];  
     this.timeBuckets        =   [5, 14, 30];
 
     this.balance            = Number(amount);
     this.availableBalance   = Number(amount);
     this.gearing            = 1;
     this.commision          = 2;
 
     this.openTrades         = [];
     this.closedTrades       = [];
     this.shortTrades        = [];
     this.longTrades         = [];  
     this.orders             = []; 
     this.sales              = []; 
     this.movements          = []; 
      
     this.expectedProfit     = 0;

     this.profitStop         = undefined;
     this.lossStop           = undefined;
 
     this.movements.push(
       {openingDate: date, balance: amount}
     );
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Position.prototype.closePosition = function(){

    var items        = this.openTrades;
    var ids          = []
    var i;

    for(i=0; i<items.length; i=i+1) {

       ids.push(items[i].id);
    }
      
    for(i=0; i<ids.length; i=i+1) {

      this.addSale(ids[i]);
    } 
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Position.prototype.calculateExposure = function(date, high, low){

    var i;     
    var items        = this.openTrades;

    this.currentDate  = date;
    this.currentHigh  = high;
    this.currentLow   = low;

    this.expectedProfit = 0;

    this._fulfilOrders();
    this._fulfilSales();
    
    for(i=items.length-1; i>-1; i=i-1) {

      items[i].calculateExposure(date, high, low);

      this.expectedProfit += items[i].expectedProfit;

      if ((this.lossStop) && (items[i].expectedProfit <= (this.lossStop*-1))) {
        
        this.addSale(items[i].id);
      }
      
      if ((this.profitStop) && (items[i].expectedProfit  >= this.profitStop)) {
        
        this.addSale(items[i].id);
      }
    } 
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
  Position.prototype.addOrder = function(amount, short){

    var trade = new $TradeFactory(amount, short);

    var fundsNeeded;

    this.orders.push( trade );
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  Position.prototype.addSale = function(tradeID){
    
    var i;  

    //for(i=0; i<this.openTrades.length; i=i+1) {
    for(i=this.openTrades.length-1; i>=-1; i=i-1) {

      if (this.openTrades[i].id === tradeID){       
        
        this.sales.push(this.openTrades[i]);

        this.openTrades.splice(i,1);

        break;
      }
    }
    
    //for(i=0; i<this.shortTrades.length; i=i+1) { 
    for(i=this.shortTrades.length-1; i>-1; i=i-1) {

      if (this.shortTrades[i].id === tradeID){
        
        this.shortTrades.splice(i,1);

        break;
      }
    }
     
    //for(i=0; i<this.longTrades.length; i=i+1) {
    for(i=this.longTrades.length-1; i>-1; i=i-1) {

      if (this.longTrades[i].id === tradeID){
        
        this.longTrades.splice(i,1);

        break;
      }
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  Position.prototype._fulfilOrders = function(){

    var i;  
    
    var date        = this.currentDate;  
    var shortPrice  = this.currentHigh;  
    var longPrice   = this.currentLow;   

    var priceMet;
    var order;

    for(i=0; i<this.orders.length; i=i+1) {

      priceMet = (Math.random() * Math.abs(shortPrice - longPrice)) + Math.min(shortPrice,longPrice);
      order    = this.orders[i];

      this._openTrade(order, date, priceMet); 
    }

    this.orders = [];
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  Position.prototype._fulfilSales = function(){

    var i;  
    
    var date        = this.currentDate;  
    var shortPrice  = this.currentHigh;  
    var longPrice   = this.currentLow;   

    var priceMet;
    var sale;

    for(i=0; i<this.sales.length; i=i+1) {

      priceMet = (Math.random() * Math.abs(Number(shortPrice) - Number(longPrice))) + Math.min(Number(shortPrice),Number(longPrice));
      sale     = this.sales[i];

      this._closeTrade( sale, date, priceMet ); 
    }

    this.sales = [];
  }; 
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  Position.prototype._openTrade = function(trade, date, priceMet){

    trade.openTrade(date, priceMet)

    trade.setAside          = Math.round(trade.openingValue / this.gearing) + this.commision;

    this.availableBalance = this.availableBalance - trade.setAside;

    this.openTrades.push(trade);

    if (trade.short){

      this.shortTrades.push(trade);
    } else{

      this.longTrades.push(trade);
    }

  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  Position.prototype._closeTrade = function(trade, date, priceMet){
    
    trade.closeTrade(date, priceMet);

    //var setAside          = Math.round(trade.openingValue / this.gearing) + this.commision;
                          
    this.balance          = this.balance          + trade.profit - this.commision;
    this.availableBalance = this.availableBalance + trade.profit - this.commision + trade.setAside;

    trade.balance         = this.balance;

    this.closedTrades.push( trade );
    this.movements.push(    trade );

  };  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  return Position;

}]);
