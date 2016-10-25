/*global window, angular: true */

var mainModule = angular.module('mainModule'); 

mainModule.controller('marketDataController',  ['$scope', '$timeout', '$marketsService', function ($scope, $timeout, $marketsService){ 
   'use strict';
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   this.id      = Math.floor((1+Math.random())*0x100000);

   var i;
   var rawData  = window.rawData;
   var timer;
   var timerInterval = 1000;

   var SHOW_GEARING_START_DATE = '1951-12';
   var SHOW_STOPS_START_DATE   = '1952-08';

   $scope.setGameBreaks = function(dates) {

     SHOW_GEARING_START_DATE = dates[0];
     SHOW_STOPS_START_DATE   = dates[1];

   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////
   var calculatePosition = function(){
    
     $scope.position.calculateExposure($scope.market.currentPrice.date, $scope.market.currentPrice.high, $scope.market.currentPrice.low);

     var shortPrice       = $scope.market.currentPrice.high;
     var longPrice        = $scope.market.currentPrice.low;
     var availableBalance = $scope.position.availableBalance;

     var newShortTradeFundsNeeded =  Math.round($scope.newTradeAmount * shortPrice / $scope.position.gearing); 
     var newLongTradeFundsNeeded  =  Math.round($scope.newTradeAmount * longPrice  / $scope.position.gearing); 
     var newTradeBarred;

     if ((newShortTradeFundsNeeded > availableBalance) || (newLongTradeFundsNeeded > availableBalance)){
       newTradeBarred = true;  
     } else {
       newTradeBarred = false;  
     } 

     $scope.newShortTradeFundsNeeded =  newShortTradeFundsNeeded;
     $scope.newLongTradeFundsNeeded  =  newLongTradeFundsNeeded; 
     $scope.newTradeBarred           =  newTradeBarred;

     if(!$scope.$$phase) { $scope.$apply(); }  
     
   };   
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   var createTimer = function(){

       timer = $timeout( function(){
     
         $marketsService.loadNextPrice($scope.market).then(function(){

           calculatePosition();

           if ((! $scope.showStops) && ($scope.market.currentPrice.date > SHOW_STOPS_START_DATE )){

             $scope.showStops   = true;
             $scope.showHelp[6] = true;
             $scope.isRunning   = false;
             $scope.timerAction = 'Start';

             $scope.position.profitStop  = 200;
             $scope.position.lossStop    = 100;

             timer = undefined;

             return;

            } else if ((! $scope.showGearing) && ($scope.market.currentPrice.date > SHOW_GEARING_START_DATE )){

             $scope.showGearing   = true;
             $scope.showHelp[7]   = true;
             $scope.isRunning     = false;
             $scope.timerAction   = 'Start';

             $scope.newTradeAmount     = 1000;
             $scope.position.gearing   = 5;

             calculatePosition();

             timer = undefined;

             return;
           }            

           createTimer();
                    
         });

       }, timerInterval);
   };
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   
   $scope.market             =  undefined;
   $scope.position           =  undefined;

   $scope.isRunning          = false;
   $scope.timerAction        = 'Start';
   $scope.newTradeAmount     = 200;
   $scope.historicalDuration = 90;

   $scope.showStops          = false;

   $scope.showHelp           = [false, false, false, false, false, false, false, false, false];

   ///////////////////////////////////////////////////////////////////////////////////////////////////
   $scope.nextHelp = function(){

     var i;

     for(i=0;i< $scope.showHelp.length; i=i+1){

       if ($scope.showHelp[i] === true){

         $scope.showHelp[i] = false;

         if (i < $scope.showHelp.length - 1) {

           $scope.showHelp[i+1] = true;
         }

         if(!$scope.$$phase) { $scope.$apply(); } 

         return;
       }
     }
   };
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   $scope.hideHelp = function(){

     var i;

     for(i=0;i< $scope.showHelp.length; i=i+1){

         $scope.showHelp[i] = false;

     }

     if(!$scope.$$phase) { $scope.$apply(); } 
   };
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   $scope.loadPosition = function(name, amount, type){

      return $marketsService.chooseMarket(name).then(function(market){
 
        $scope.market             = market;

        return $marketsService.loadInitialPrices($scope.market, type).then(function(){
      
            return $marketsService.openPosition(market, $scope.market.currentPrice.date, amount).then(function(position){
            
              $scope.position         = position;

              if(!$scope.$$phase) { $scope.$apply(); } 

              calculatePosition();

            });          
        });      
      }); 
   };
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   $scope.loadPositionToDate = function(name, amount, date){

      return $marketsService.chooseMarket(name).then(function(market){
 
        $scope.market             = market;

        return $marketsService.loadPrices($scope.market, date).then(function(){
      
            return $marketsService.openPosition(market, $scope.market.currentPrice.date, amount).then(function(position){
            
              $scope.position         = position;

              if(!$scope.$$phase) { $scope.$apply(); } 

              calculatePosition();

            });          
        });      
      }); 
   };   ///////////////////////////////////////////////////////////////////////////////////////////////////
   $scope.toggleTimer = function(){

     $scope.hideHelp();

     if (timer){

       $timeout.cancel(timer);

       timer = undefined;

       $scope.isRunning   = false;
       $scope.timerAction = 'Start';

     } else {

       createTimer();

       $scope.isRunning   = true;
       $scope.timerAction = 'Stop';
     }


     if(!$scope.$$phase) { $scope.$apply(); } 
   };
   ////////////////////////////////////////////////////////////////////////////////////////////////// 
   $scope.addOrder = function(short){

     $scope.position.addOrder($scope.newTradeAmount, short);

     if(!$scope.$$phase) { $scope.$apply(); } 

   };
   ////////////////////////////////////////////////////////////////////////////////////////////////// 
   $scope.setHistoricalDuration = function(number){

     $scope.$apply( 
       
       $scope.historicalDuration = number   
     ); 

   };
   ////////////////////////////////////////////////////////////////////////////////////////////////// 
   $scope.$watch('market.currentDate', function(/*newVal, oldVal*/) {
    
      calculatePosition();

   });
   ////////////////////////////////////////////////////////////////////////////////////////////////// 
   $scope.$watch('newTradeAmount', function(/*newVal, oldVal*/) {
    
      calculatePosition();
   });
   ///////////////////////////////////////////////////////////////////////////////////////////////////
}]);
   


