/* search-switch / 0.1.0 / https://github.com/joshrouwhorst/SearchSwitch */angular.module('SearchSwitch', [ 'ngRoute' ])

.config(['$routeProvider', function( $routeProvider ) {

  $routeProvider
    .when('/', {
      templateUrl: 'html/partials/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
angular.module( 'SearchSwitch' )

.controller( 'HomeCtrl', ['$scope', 'BackgroundPageService', function($scope, BackgroundPageService){
  $scope.BackgroundPageService = BackgroundPageService;
  $scope.searches = BackgroundPageService.searches;
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