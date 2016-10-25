/*global angular: true */


var mainModule = angular.module('mainModule'); 

angular.element(document.querySelector('head'))
       .append('<link id="positionCard-css" href="./directives/templates/positionCard.css" rel="stylesheet">');

mainModule.directive('uiPositionCard', function() {
  'use strict';

  return {
    restrict:    'EA',
    templateUrl: './directives/templates/positionCard.htm'
  };

});