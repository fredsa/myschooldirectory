'use strict';

angular.module('directoryApp', ['directoryApp.filters',
                                'directoryApp.services',
                                'directoryApp.directives'])

.config(function($locationProvider, $routeProvider, $httpProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', {
     templateUrl: '/app/main.html',
     controller: MainController,
  })
  .when('/family/:family_id/', {
     templateUrl: '/app/family.html',
     controller: FamilyController,
  })

})
