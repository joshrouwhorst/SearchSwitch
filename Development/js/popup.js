/* search-switch / 0.1.0 / https://github.com/joshrouwhorst/SearchSwitch */angular.module('SearchSwitch', [ 'ngRoute' ])

.config(['$routeProvider', function( $routeProvider ) {

  $routeProvider
    .otherwise({
      redirectTo: 'views/homescreen.html'
    });

}]);
angular.module( 'SearchSwitch' )

.controller( 'HomeScreenCtrl', ['$scope', 'BackgroundPageService', function($scope, BackgroundPageService){
  $scope.BackgroundPageService = BackgroundPageService;
}]);
angular.module( 'SearchSwitch' )

.factory('BackgroundPageService', [function(){
  var backgroundPage = chrome.extension.getBackgroundPage();

  if ( backgroundPage && backgroundPage.SearchSwitch ) {
    return backgroundPage.SearchSwitch;
  } else {
    return false;
  }

}]);