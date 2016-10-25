/*global angular: true */


var mainModule = angular.module('mainModule'); 

mainModule.directive('uiShortTradeListing', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/shortTradeListing.htm'
  };

});