/* search-switch / 0.1.0 / https://github.com/joshrouwhorst/SearchSwitch */(function(){

var SearchSwitch = angular.module( 'SearchSwitch', [] );

SearchSwitch.controller( 'HomeCtrl', ['$scope', 'BackgroundPage', function($scope, BackgroundPage){
  
  $scope.searches = BackgroundPage.searches;

}]);

})();
(function(){

var SearchSwitch = angular.module( 'SearchSwitch', [] );

SearchSwitch.factory( 'BackgroundPage', [function(){
  var backgroundPage = chrome.extension.getBackgroundPage();

  if ( backgroundPage && backgroundPage.SearchSwitch ) {
    return backgroundPage.SearchSwitch;
  } else {
    return false;
  }

}]);

})();


