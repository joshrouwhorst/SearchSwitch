angular.module( 'SearchSwitch' )

.controller( 'HomeCtrl', ['$scope', 'BackgroundPageService', function($scope, BackgroundPageService){
  $scope.BackgroundPageService = BackgroundPageService;
  $scope.searches = BackgroundPageService.searches;
}]);