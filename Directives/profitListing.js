/*global angular: true */


var mainModule = angular.module('mainModule'); 

mainModule.directive('uiProfitListing', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/profitListing.htm'
  };

});