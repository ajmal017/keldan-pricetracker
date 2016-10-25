/*global angular: true */

var mainModule = angular.module('mainModule'); 

angular.element(document.querySelector('head'))
       .append('<link id="MarketHistory-css" href="./directives/templates/MarketHistory.css" rel="stylesheet">');

mainModule.directive('uiMarketHistory', function($window) {
  'use strict';
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var display = function(scope, element){

    var ele    = d3.select('#divMarketData')[0][0];
    var width  = ele.clientWidth;
    var height = ele.clientHeight;

    var i;

    var data = [];

    var openTrades;
    var high;

    if (scope.position){                                openTrades = scope.position.openTrades;      }
    if ((scope.market)&&(scope.market.currentPrice)){   high       = scope.market.currentPrice.high; }

    var stop = scope.market.historicalPrices.length - 1 - scope.historicalDuration;
    
    stop = d3.max([0, stop]);

    for(i=scope.market.historicalPrices.length - 1; i>=stop; i=i-1) {
      
      data.push(scope.market.historicalPrices[i]);
    }

    data.reverse();

    drawD3Graph(width, height, data, openTrades, high); 

    if(!scope.$$phase) { scope.$apply(); } 
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var drawD3Graph = function(width, height, data, trades, currentPrice){
  
    var margin = 20;

    width   = (width  - (2*margin));
    height  = (height - (2*margin));

    var getMarketHigh = function(d){

      return d.high;
    }

    var getMarketLow = function(d){

      return d.low;
    }

    var getMarketDate = function(d){

      return d3.time.format("%Y-%m-%d").parse( d.date );
    }

    var getTradePrice = function(d){

      return d.openingPrice;
    }

    var getTradeDate = function(d){

      return d3.time.format("%Y-%m-%d").parse( d.openingDate );
    } 

    var getTradeMarker = function(d){

      if ( d.short === true ) {
        return '▼';
      } else if ( d.short === false ) {
        return '▲';
      }
    }

    var getTradeHorzontalOffset = function(d){

      if ( d.short === true ) {
        return 16;
      } else if ( d.short === false ) {
        return -8;
      }
    }

    var getTradeHorzontalMargin = function(d){

      if ( d.short === true ) {
        return 28;
      } else if ( d.short === false ) {
        return -20;
      }
    }
    
    var getTradeColor = function(d){

      if ( d.expectedProfit  < 0 ) {
        return 'red';
      } else {
        return 'green';// green #45B845 
      }
    }       
    var yScale = d3.scale
                   .linear()
                   .domain([d3.min(data, getMarketLow),     d3.max(data, getMarketHigh) ] )
                   .range( [0 + margin,                          height - margin        ] );

    var xScale = d3.time
                   .scale()
                   .domain([d3.min(data, getMarketDate),   d3.max(data, getMarketDate)  ] )
                   .range( [0 + margin,                          width - (margin*2)     ] );


    var svg = d3.select('#svgChart')
                .style('width',  width   + 'px')
                .style('height', height  + 'px');

    var pathHighs = svg.select('#pathHighLine')
                       .attr('transform', 'translate(0, ' + height + ')');

    var pathLows = svg.select('#pathLowLine')
                      .attr('transform', 'translate(0, ' + height + ')');

    var pathHighs = svg.select('#pathHighArea')
                       .attr('transform', 'translate(0, ' + height + ')');

    var pathLows = svg.select('#pathLowArea')
                      .attr('transform', 'translate(0, ' + height + ')');

    var lineLows  = d3.svg
                      .line()
                      .x(function(d,i) { return      xScale( getMarketDate(d)   ); })
                      .y(function(d)   { return -1 * yScale( getMarketLow(d)    ); })


    var lineHighs = d3.svg
                      .line()
                      .x(function(d,i) { return      xScale( getMarketDate(d)   ); })
                      .y(function(d)   { return -1 * yScale( getMarketHigh(d)   ); })


    var areaHighs = d3.svg
                      .area()
                      .x(function(d,i) { return      xScale( getMarketDate(d)   ); })
                      .y1(function(d)  { return -1 * yScale( getMarketHigh(d)   ); })
                      .y0(height)

    var areaLows  = d3.svg
                      .area()
                      .x(function(d,i) { return      xScale( getMarketDate(d)   ); })
                      .y1(function(d)  { return -1 * yScale( getMarketLow(d)    ); })
                      .y0(height)

    svg.select('#pathHighLine')
       .attr('d', lineHighs(data));

    svg.select('#pathLowLine')
      .attr('d', lineLows(data));

    svg.select('#pathHighArea')
       .attr('d', areaHighs(data));

    svg.select('#pathLowArea')
      .attr('d', areaLows(data));

     svg.select('#textCurrentPrice')
       .attr('transform', 'translate(0, ' + height + ')')
       .attr('x', function(){ 
         return width - (margin*2) + 2;                                   
       } ) 
       .attr('y', function(){ 
         return -1 * yScale(currentPrice) + 4;
       } )   
       .text(function(){ 
         return currentPrice;                              
       } );

    svg.select('#groupTrades')
       .remove();

    var group =svg.append('svg:g')
                  .attr('transform', 'translate(0, ' + height + ')')
                  .attr('id', 'groupTrades');

    var lastData = data.length - 1;

    if ((lastData > 0) && ( data[lastData].high !== data[lastData].low)){
    
      svg.select('#pathHighLine').classed('HistoryLine', false).classed('HistoryBorder', true)
      svg.select('#pathLowLine' ).classed('HistoryLine', false).classed('HistoryBorder', true)
    
    } else {
    
      svg.select('#pathHighLine').classed('HistoryLine', true).classed('HistoryBorder', false)
      svg.select('#pathLowLine' ).classed('HistoryLine', true).classed('HistoryBorder', false)
    }


    if ( (trades) && (trades.length) ){

      group.selectAll('circle')  
           .data(trades)
           .enter()
           .append("circle")
           .attr("cx", function(d,i) {
             return      xScale(getTradeDate(d)  ) ;  
           } )
           .attr("cy", function(d,i) {
             return -1 * yScale(getTradePrice(d) ) ; 
           } )
           .attr("r", 6);

      var texts = group.selectAll('text')  
           .data(trades)
           .enter();

      texts.append("text")
        .attr("dx", function(d,i) {
          return  (    xScale(getTradeDate(d))  - 6  );  
        } )
        .attr("dy", function(d,i) {
          return (-1 * yScale(getTradePrice(d)) + getTradeHorzontalOffset(d)  ); 
        } )
        .text( function(d){ 
          return getTradeMarker(d); 
        } )
        .attr("fill",  
        function(d){          
          return getTradeColor(d); 
        } );  
    
      texts.append("text")
             .attr("dx", function(d,i) {
               return  (    xScale(getTradeDate(d))  - 6  );  
             } )
             .attr("dy", function(d,i) {
               return (-1 * yScale(getTradePrice(d)) + (getTradeHorzontalMargin(d))  ); 
             } )
             .text( function(d){ 
               return d.expectedProfit; 
             } )
             .attr("fill",  
              function(d){          
               return getTradeColor(d); 
             } );  
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return {
    restrict:    'EA',
    templateUrl: './directives/templates/marketHistory.htm',

    controller: function($scope){
      $scope.inputSize = '?'
    },  
    
    link: function(scope, element) {

      var win = angular.element($window);      
    
      display(scope, element);

      scope.$watch('historicalDuration', function(newValue, oldValue) {
      
        display(scope, element);

        var ele;

        ele = angular.element(element).find('#button30'); ele.removeClass('btn-info'); ; ele.removeClass('btn-default'); ;if (newValue === 30   ) {ele.addClass('btn-info');} else {ele.addClass('btn-default');} 
        ele = angular.element(element).find('#button90'); ele.removeClass('btn-info'); ; ele.removeClass('btn-default'); ;if (newValue === 90   ) {ele.addClass('btn-info');} else {ele.addClass('btn-default');} 
        ele = angular.element(element).find('#button1Y'); ele.removeClass('btn-info'); ; ele.removeClass('btn-default'); ;if (newValue === 365  ) {ele.addClass('btn-info');} else {ele.addClass('btn-default');} 
        ele = angular.element(element).find('#button5Y'); ele.removeClass('btn-info'); ; ele.removeClass('btn-default'); ;if (newValue === 1826 ) {ele.addClass('btn-info');} else {ele.addClass('btn-default');} 
        ele = angular.element(element).find('#buttonAT'); ele.removeClass('btn-info'); ; ele.removeClass('btn-default'); ;if (newValue === 99999) {ele.addClass('btn-info');} else {ele.addClass('btn-default');} 

      }, false);

      scope.$watch('market.historicalPrices.length', function(newValue, oldValue) {
      
        display(scope, element);
      }, false);

      win.bind('resize', function(){
        
        display(scope, element);

      })
    }
  };
});


