/*global window, angular: true */

var mainModule = angular.module('mainModule'); 

mainModule.service('$marketsService', ['$MarketDataFactory', '$http', '$q', '$window', function ($MarketDataFactory, $http, $prommise, $window){
  'use strict';
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  this.id      = Math.floor((1+Math.random())*0x100000);

  this.markets = [];

  this.restURL = $window.location.href.replace($window.location.search, ''     )
                                      .replace('Tests/TestRunner.html', 'REST/') 
                                      .replace('PriceTracker.html',     'REST/');

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  this.selectedMarket = null; 
  this.chooseMarket = function(marketName){

    var i;
    var found;
    var defer = $prommise.defer();

    for(i=0;i<this.markets.length;i++){
    
      if ( this.markets[i].name === marketName){

        found = this.markets[i];
        break;
      }
    };

    if (! found){

      found = new $MarketDataFactory(marketName);

      this.markets.push(found);
    };

    this.selectedMarket = found; 
    
    defer.resolve(found);

    return defer.promise;
  };/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  this.selectedPosition = null; 
  this.openPosition = function(market, date, amount){

    var self = this;
    var defer = $prommise.defer();

    //return this.loadPrices(market, date).then(function(){
    
      self.selectedPosition = market.openPosition(date,amount);

      defer.resolve(self.selectedPosition);

      return defer.promise;
    //});
  };/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  this.loadNextPrices = function(){

    var i;
    var promises = [];

    for(i=0;i<this.markets.length;i++){
    
      promises.push( this.markets[i].loadNextPrice() );

    };

    return $q.all(promises);
  };/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  this.loadFirstPrice = function(market){

    var self = this;
    var url  = this.restURL + market.name + '/firstPrice.json';

    return $http({method: 'GET', url: url}).
      success(function(data, status, headers, config) {
        
        market.addPrice(data);

        self._logData(url,data);
      }).
      error(function(data, status, headers, config) {
        alert(data);
      });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  this.loadInitialPrices = function(market, type){

    var i;
    var self = this;
    var url  = this.restURL + market.name + '/initialLoad.json';

    if (type){
    
      url  = url.replace('.json', '.' + type + '.json');
    }

    return $http({method: 'GET', url: url}).
      success(function(data, status, headers, config) {
        
        for(i=0;i<data.length;i++){

          market.addPrice(data[i]);

          self._logData(url,data[i]);
        }
      }).
      error(function(data, status, headers, config) {
        alert(data);
      });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  this.loadNextPrice = function(market){

    if (market.historicalPrices.length === 0){

      var self   = this;
      
      return  this.loadFirstPrice(market).then(function(){ 
      
        return self.loadNextPrice(market) 
      
      });
 
    }

    var self = this;
    var url = this.restURL + market.name + '/prices/'  + market.currentPrice.nextDate + '.json';

    return $http({method: 'GET', url: url}).
      success(function(data, status, headers, config) {
        
        market.addPrice(data);

        self._logData(url,data);
      }).
      error(function(data, status, headers, config) {
        alert(data);
      });
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
 
  this.loadPrice = function(market, date){

    if (market.historicalPrices.length === 0){

      var self   = this;
      var toDate = date;
      
      return  this.loadFirstPrice(market).then(function(){ 
      
        return  self.loadPrices(market, toDate) 
      
      });
    }

    var url      = this.restURL + market.name + '/prices/'  + date + '.json';
    var self     = this;

    return $http({method: 'GET', url: url}).
      success(function(data, status, headers, config) {

        market.addPrice(data);

        self._logData(url,data);
      }).
      error(function(data, status, headers, config) {
      
        alert(data);
      
      });
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  this.loadPrices = function(market, toDate){

    if (market.historicalPrices.length === 0){

      var self   = this;
      
      return  this.loadFirstPrice(market).then(function(){ 
      
        return  self.loadPrices(market, toDate) 
      
      });
    }

    var url      = this.restURL + market.name + '/prices/'  + market.currentPrice.nextDate + '.json';
    var self     = this;

    var promise = $http({method: 'GET', url: url}).
      success(function(data, status, headers, config) {

        market.addPrice(data);

        self._logData(url,data);

        promise.isResolved = true;
      }).
      error(function(data, status, headers, config) {
                                                                
        alert(data);
      
        promise.isRejected= true;
      }).then(function(){
      
        if (market.currentPrice.date < toDate)
          return self.loadPrices(market, toDate);

      });

    return promise;
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  this._logData = function(url, data){

   if (window.console) {
     window.console.log(url);
     window.console.log(JSON.stringify(data));
     window.console.log('///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////');
   }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]);



