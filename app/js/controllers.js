'use strict';

/* Controllers */

function PageController($scope, $http, $log, $window) {

  var ROOT = '/_ah/api';

  // called by the HTML page once our API client is ready
  $window.api_ready = function() {
    $scope.$apply($scope.load_api);
  }

  $scope.load_api = function() {
    $log.log('client api id ready');
    $scope.api_ready = true;
    gapi.client.load('directory', 'v1', $scope.api_loaded, ROOT);
  }

  $scope.api_loaded = function() {
    $log.log('directory client load is done');

    gapi.client.directory.parentguardian.list()
    .execute(function(result) {
      $log.log('got back list result', result);
      $log.log('- result.items', result.items);
      $log.log('- result.nextPageToken', result.nextPageToken);
      $scope.parents = result.items;
      $scope.$apply();
    });
  }

  $scope.get_config = function() {
    return $http.get('/api/get_config')
    .success(function(data, status, headers, config) {
       $scope.config = data;
       $scope.school = data.school;
    });
  };

  //$scope.get_config();

  $scope.children = [{
      first_name: 'Sophia',
      last_name: 'Smith',
    }, {
       first_name: 'Jacob',
       last_name: 'Smith',
       publish_name: true,
    }
  ];

}

function MainController($scope) {
}

function FamilyController($scope) {
}
