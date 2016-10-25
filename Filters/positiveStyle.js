/*global angular: true */

var mainModule = angular.module('mainModule'); 

mainModule.filter('positiveStyle', function() {

  'use strict';

  return function(input, firstStyle, secondStyle) {
    
    var out = "";
    
    if ( Number(input) >= 0 ) {
      out = firstStyle;
    } else {
      out = secondStyle;
    }

    return out;
  };

});