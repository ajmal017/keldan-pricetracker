/*global window, angular, beforeEach, describe, it, xit, expect, runs, waitsFor: true */

(function(){

'use strict';

var service;
 
var injector = angular.injector([ 'ng', 'mainModule' ]);

injector.invoke(function($newsService) {

  service = $newsService;    
});

describe('$newsService', function (){
  
  it('should have the function - setDate', function () { 

    expect(angular.isFunction(service.setDate)).toBe(true);
  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
  
  it('should have topStoryCount - 3', function () { 

    expect(service.topStoryCount).toBe(3);
  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
  
  it('should have the story for 1951-02-03- Tennessee Williams', function () { 

    service.setDate('1951-02-03');

    expect(service.topStories.length).toBe(3);

    expect( service.topStories[0].trim() ).toEqual('Tennessee Williams\' "Rose Tattoo," premieres in NYC'                );
    expect( service.topStories[1].trim() ).toEqual('Largest purse to date in horse racing, $144,323, won by Great Circle');
    expect( service.topStories[2].trim() ).toEqual('Dick Button wins US skating title for 6th time'                      );
  });////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
});

}());
