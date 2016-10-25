/*global angular: true */


var mainModule = angular.module('mainModule'); 

mainModule.directive('uiOpenOrdersListing', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/openOrdersListing.htm'
  };

});