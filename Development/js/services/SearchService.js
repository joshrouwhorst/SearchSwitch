angular.module('SearchSwitch')

.factory('SearchService', function(Search, StorageService, InitialData){
  var getSearches = function(){
    var searchConfigs = StorageService.getSearches(),
      searches = [];

      for ( var i = 0; i < searchConfigs.length; i++ ){
        searches.push( new Search( searchConfigs[i] ) );
      }
  };

  var setSearches = function( searches ){
    var searchConfigs = [];

    for (var i = 0; i < searches.length; i++ ){
      if (searches[i].properties){
        searchConfigs.push( searches[i].properties );
      } else {
        searchConfigs.push( searches[i] );
      }
    }

    StorageService.setSearches( searchConfigs );
  };

  var checkInitalValues = function(){
    if ( !StorageService.getSearches() ){
      StorageService.setSearches( InitialData.searches );
    }
  };

  return {
    getSearches: getSearches,
    setSearches: setSearches,
    checkInitalValues: checkInitalValues
  };
});