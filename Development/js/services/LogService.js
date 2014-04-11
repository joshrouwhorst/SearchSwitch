angular.module('SearchSwitch')

.factory('LogService', function(){
  var output = function( message, type ){
    if (type){
      type = '[' + type + '] ';
    } else {
      type = '';
    }

    console.log( Date() + ": " + type + message );
  };

  var warning = function( message ){
    output( message, 'WARNING');
  };

  var error = function(){
    ouput( message, 'ERROR' );
  };

  return {
    output: output,
    warning: warning,
    error: error
  };
});