/*global angular: true */


var mainModule = angular.module('mainModule'); 

mainModule.directive('uiMarketCard', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/marketCard.htm'
  };

});