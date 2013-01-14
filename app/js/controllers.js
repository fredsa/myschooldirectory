'use strict';

/* Controllers */

function PageController($scope, $http) {

  $scope.get_config = function() {
    return $http.get('/api/get_config')
    .success(function(data, status, headers, config) {
       $scope.config = data;
       $scope.school = data.school;
    });
  };

  $scope.get_config();

  $scope.parents = [{
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'john@example.com',
      publish_name: true,
    }
  ];

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
