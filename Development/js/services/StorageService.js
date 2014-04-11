angular.module('SearchSwitch')

.factory('StorageService', function(){
  var onSearchChangedFuncs = [];

  var setSearches = function( options ){
    chrome.storage.sync.set({
      'searches': options.searches
    }, function(){
      if (options.callback){
        options.callback();
      }
    });
  };

  var onSearchChanged = function( func ){
    onSearchChangedFuncs.push( func );
  };

  var getSearches = function(){
    return chrome.storage.sync.get('searches');
  };

  var callSearchChanged = function( changes ){
    for ( var i = 0; i < onSearchChangedFuncs.length; i++ ){
      onSearchChangedFuncs[i]( changes.newValue );
    }
  };

  chrome.storage.onChanged.addListener(function( changes, namespace ){

    for ( var type in changes ){
      switch ( type ){
        case 'searches':
          callSearchChanged( changes[type] );
          break;

        default:
          break;
      }
    }
  });


  return {
    setSearches: setSearches,
    onSearchChanged: onSearchChanged,
    getSearches: getSearches
  };
});