angular.module('SearchSwitch')

.factory('StorageService', function(){
  var onSearchChangedFuncs = [];

  var modules = [];

  var onChanged = function( options ){
    modules[ options.name ] = options;
  };

  var set = function( options ){
    var setOpts = {},
        syncLocal = options.sync ? 'sync': 'local';

    setOpts[ options.name ] = options.data;

    chrome.storage[ syncLocal ].set( setOpts, function(){
      if (options.callback){
        options.callback();
      }
    });
  };

  var get = function( options ){
    var syncLocal = options.sync ? 'sync': 'local';

    return chrome.storage[ syncLocal ].get( options.name );
  };

  chrome.storage.onChanged.addListener(function( changes, namespace ){
    var type, i;

    for ( type in changes ){

      if ( modules[type] &&
           modules[type].onChanged ){
        for ( i = 0; i < modules[type].onChanged.length; i++ ){
          modules[type].onChanged[i]( changes[type] );
        }
      }
    }
  });


  return {
    onChanged: onChanged,
    set: set,
    get: get
  };
});