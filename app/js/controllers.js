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
    load_apis();
  }

  function fatal_error(err) {
    $scope.fatal_error = err;
    $scope.$apply();
  }

  function load_apis() {

    var apis_to_load = 0;

    function callback(load_resp) {
      $log.log('3. gapi.client.load() -> ', load_resp);
      if (load_resp) {
        fatal_error(load_resp);
        return;
      }
      if (--apis_to_load == 0) {
        $scope.authorize(true);
      }
    }

    function load() {
      apis_to_load++;
      $log.log('2. gapi.client.load(' + arguments[0] + ', ' + arguments[1] + ', ...)');
      gapi.client.load.apply(this, arguments);
    }

    load('oauth2', 'v2', callback);
    load('directory', 'v1', callback, ROOT);
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
          if (apiResp.state || apiResp.error_message) {
            fatal_error(apiResp);
            return;
          }

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
