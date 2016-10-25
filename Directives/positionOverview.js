/*global angular: true */

var mainModule = angular.module('mainModule'); 

mainModule.directive('uiPositionOverview', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/positionOverview.htm'
  };

});