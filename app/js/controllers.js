'use strict';

/* Controllers */

function PageController($scope, $http, $log, $window) {

  var ROOT = '/_ah/api';
  var CLIENT_ID = '707601816431.apps.googleusercontent.com';
  var CLIENT_SECRET = '_dkXUOzknvFh2M3FGc7Fhqjd';
  var SCOPE_EMAIL = 'https://www.googleapis.com/auth/userinfo.email';
  var SCOPE_USERINFO = 'https://www.googleapis.com/auth/userinfo.profile';
  var SCOPES = [SCOPE_EMAIL, SCOPE_USERINFO];
  //var SCOPES = ['https://www.googleapis.com/auth/userinfo.email'];

  // called by the HTML page once our API client is ready
  $window.gapi_ready = function() {
    $log.log('1. gapi_ready()');
    $scope.api_ready = true;
    $scope.$apply();
    load_api();
  }

  function load_api() {
    gapi.client.load('directory', 'v1', api_loaded, ROOT);
  }

  function api_loaded(load_api_resp) {
    $log.log('2. gapi.client.load("directory") -> ', load_api_resp);

    // TODO: remove retry functionality, or at least add exponential backoff
    if (load_api_resp) {
      //$log.warn('RETRY client load:', load_api_resp.error);
      //$timeout(load_api, 1000);
      return;
    }

    load_oauth2();
  };

  function load_oauth2() {
    gapi.client.load('oauth2', 'v2', function(load_oauth2_resp2) {
      $log.log('3. gapi.client.load("oauth2") -> ', load_oauth2_resp2);
      $scope.authorize(true);
    });
  }

  $scope.authorize = function(immediate) {

    //gapi.client.setApiKey('AIzaSyA-RaSQdn4FPG7luv2dqUnmkk8B39CqlrQ');
    gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: immediate,
        response_type: 'token id_token',
    }, function(authResp) {
      // {state: "", access_token: "ya29.AHESR2wsf7CTl4B6_1h",
      //  token_type: "Bearer", expires_in: "3600",
      //  id_token: "eyJhbGciOi8WKIvVhSD70bmFpCeQDXscxPKwN-AssQPTR8"}
      $log.log('4. gapi.auth.authorize(immediate=' + immediate + ') -> ', authResp);
      if (!authResp || authResp.error) {
        $scope.authfail = true;
        $scope.$apply();
        // abort
        return;
      }

      gapi.client.oauth2.userinfo.get().execute(function(userinfo) {
        $log.log('5. gapi.client.oauth2.userinfo.get() -> ', userinfo);
        if (userinfo.code) {
          if (immediate) {
            $scope.authorize(false);
          }
          return;
        }
        if (userinfo.verified_email) {
          $scope.email = userinfo.email;
        }
        var token = gapi.auth.getToken();
        //$log.log('token=', token);
        token.access_token = token.id_token;
        //$log.log('gapi.auth.setToken(', token, ')');
        gapi.auth.setToken(token);

        gapi.client.directory.parentguardian.list()
        .execute(function(apiResp) {
          $log.log('6. gapi.client.directory.parentguardian.list() -> ', apiResp);
          $scope.parents = apiResp.items;
          $scope.$apply();
        });

      });

     });

  };

  $scope.signin = function() {
    $scope.authorize(false);
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

function MainController($scope, $log) {
  $scope.save = function() {
    $scope.disable = true;
    $log.log('Saving...');
    gapi.client.directory.parentguardian.put($scope.parents[0])
    .execute(function(resp) {
      $scope.disable = false;
      $log.log('Saved.');
    });
  }
}

function FamilyController($scope) {
}
