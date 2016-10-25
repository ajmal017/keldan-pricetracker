/*global angular: true */

var mainModule = angular.module('mainModule'); 

mainModule.filter('reverseOrder', function() {

  'use strict';

  return function(input) {
    
    if (!angular.isArray(input)) return false;

    return input.slice().reverse();
  };

});