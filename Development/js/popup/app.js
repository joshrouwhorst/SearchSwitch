angular.module('SearchSwitch', [ 'ngRoute' ])

.config(['$routeProvider', function( $routeProvider ) {

  $routeProvider
    .when('/', {
      templateUrl: 'html/partials/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);