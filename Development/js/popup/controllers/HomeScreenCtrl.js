angular.module( 'SearchSwitch' )

.controller( 'HomeScreenCtrl', ['$scope', 'BackgroundPageService', function($scope, BackgroundPageService){
  $scope.BackgroundPageService = BackgroundPageService;
}]);