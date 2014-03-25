(function(){

var SearchSwitch = angular.module( 'SearchSwitch', [] );

SearchSwitch.controller( 'HomeCtrl', ['$scope', 'BackgroundPage', function($scope, BackgroundPage){
  
  $scope.searches = BackgroundPage.searches;

}]);

})();