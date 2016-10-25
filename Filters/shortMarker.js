/*global angular: true */

var mainModule = angular.module('mainModule'); 

mainModule.filter('shortMarker', function() {

  'use strict';

  return function(input) {
    
    var out = "";
    
    if ( input === true ) {
      out = '▼';
    } else if ( input === false ) {
      out = '▲';
    }

    return out;
  };

});