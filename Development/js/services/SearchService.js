angular.module('SearchSwitch')

.factory('SearchService', function(Search, StorageService, InitialData){
  var getSearches = function(){
    var searchViews = StorageService.get({
          name: 'searches',
          sync: true
        }),
        searchConfigs = InitialData.searches,
        searches = [];

      for ( var i = 0; i < searchConfigs.length; i++ ){
        if ( searchViews[ searchConfigs[i].name ] !== undefined ){
          searchConfigs[i].view = searchViews[ searchConfigs[i].name ];
        }
        
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

    StorageService.set({
      name: 'searches',
      data: searchConfigs,
      sync: true
    });
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