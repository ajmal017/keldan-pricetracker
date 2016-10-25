/*global window, angular: true */   

var mainModule = angular.module('mainModule'); 

mainModule.factory('$MarketDataFactory',  ['$PositionFactory', function ($PositionFactory){
 'use strict';

  var MarketData = function(name){

     this.id               = Math.floor((1+Math.random())*0x100000);

     this.name             = name;
     this.currentPrice     = undefined;
     this.historicalPrices = [];
     this.positions        = [];
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  MarketData.prototype.openPosition = function(date, amount){      
    /*ignore jslint start*/
    var position = new $PositionFactory(date, amount);
     /*ignore jslint end*/
    this.positions.push( position );

    if (this.currentPrice){

      position.calculateExposure(this.currentPrice.date, this.currentPrice.high, this.currentPrice.low );
    }

    return position;
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  MarketData.prototype.addPrice = function(price){

    var i;

    var items = this.positions;

    for(i=0;i<this.historicalPrices.length;i=i+1){

      if (this.historicalPrices[i].date === price.date) {

        return;
         
      } else if (this.historicalPrices[i].date > price.date) {

        this.historicalPrices.splice(i-1,0,price);

        return;
      }
    }

    this.currentPrice = price;

    this.historicalPrices.push(price);
    
    for(i=0; i<items.length; i=i+1) {

      items[i].calculateExposure(price.date, price.high, price.low );
    }
  }; 
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return MarketData;

}]);
