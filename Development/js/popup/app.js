angular.module('SearchSwitch', [ 'ngRoute' ])

.config(['$routeProvider', function( $routeProvider ) {

  $routeProvider
    .otherwise({
      redirectTo: 'views/homescreen.html'
    });

}]);