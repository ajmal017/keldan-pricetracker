/*global angular: true */


var mainModule = angular.module('mainModule'); 

mainModule.directive('uiLongTradeListing', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/longTradeListing.htm'
  };

});