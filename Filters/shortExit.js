/*global angular: true */

var mainModule = angular.module('mainModule'); 

mainModule.filter('shortExit', function() {

  'use strict';
                                             
  return function(input) {
    
    var out = "";
    
    if ( input === true ) {
      out = 'Buy to close';
    } else if ( input === false ) {
      out = 'Sell to close';
    }

    return out;
  };

});                