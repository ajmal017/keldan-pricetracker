/*global angular: true */


var mainModule = angular.module('mainModule'); 

mainModule.directive('uiOpenSalesListing', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/openSalesListing.htm'
  };

});