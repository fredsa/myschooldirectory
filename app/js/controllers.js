'use strict';

/* Controllers */

function PageController($scope, $http, $log, $window, $timeout) {

  var ROOT = '/_ah/api';
  var CLIENT_ID = '707601816431.apps.googleusercontent.com';
  var CLIENT_SECRET = '_dkXUOzknvFh2M3FGc7Fhqjd';
  var SCOPE_EMAIL = 'https://www.googleapis.com/auth/userinfo.email';
  //var SCOPE_USERINFO = 'https://www.googleapis.com/auth/userinfo.profile';
  var SCOPES = [SCOPE_EMAIL];

  $scope.school = 'School';

  var LOAD_PROGRESS_STATES = [
    [10, 'Loading JavaScript client'],
    [20, 'Loading APIs'],
    [40, 'Authorizing'],
    [60, 'Signing in'],
    [80, 'Accessing API'],
    [100, 'Done'],
  ];

  $scope.reload = function() {
    $window.location.reload();
  }

  function set_progress(step, msg) {
    var state = LOAD_PROGRESS_STATES[step];
    $scope.progress_percent = state[0];
    $scope.progress_msg = state[1] + '...';
    //$log.log(state);
  }

  set_progress(0);

  // called by the HTML page once our API client is ready
  $window.gapi_ready = function() { $scope.$apply(function() {
    $scope.api_ready = true;
    load_apis();
  })};

  function fatal_error(err) {
    $scope.fatal_error = err;
  }

  function load_apis() {
    set_progress(1);

    var apis_to_load = 0;

    function callback(load_resp) { $scope.$apply(function() {
      set_progress(2);
      $log.log('gapi.client.load() -> ', load_resp);
      if (load_resp) {
        fatal_error(load_resp);
        return;
      }
      if (--apis_to_load == 0) {
        authorize(true);
      }
    }) };

    function load() {
      apis_to_load++;
      //$log.log('gapi.client.load(' + arguments[0] + ', ' + arguments[1] + ', ...)');
      gapi.client.load.apply(this, arguments);
    }

    load('oauth2', 'v2', callback);
    load('directory', 'v1', callback, ROOT);
  }

  function authorize(immediate) {
    set_progress(3);

    gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: immediate,
        response_type: 'token id_token',
    }, function(authResp) { $scope.$apply(function() {
      $log.log('gapi.auth.authorize(immediate=' + immediate + ') -> ', authResp);
      if (!authResp || authResp.error) {
        $scope.authfail = true;
        // abort
        return;
      }

      set_progress(4);
      get_user();
    }) });

  };

  function get_user() {
    gapi.client.oauth2.userinfo.get().execute(function(userinfo) { $scope.$apply(function() {
      $log.log('gapi.client.oauth2.userinfo.get() -> ', userinfo);
      if (userinfo.code) {
        if (immediate) {
          authorize(false);
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

      use_api();
    }) });
  }

  function use_api() {
    set_progress(5);
    gapi.client.directory.parentguardian.list()
    .execute(function(apiResp) { $scope.$apply(function() {
      $log.log('gapi.client.directory.parentguardian.list() -> ', apiResp);
      if (apiResp.state || apiResp.error_message) {
        fatal_error(apiResp);
        return;
      }

      $scope.parents = apiResp.items;
    }) });

    gapi.client.directory.child.list()
    .execute(function(apiResp) { $scope.$apply(function() {
      $log.log('gapi.client.directory.child.list() -> ', apiResp);
      if (apiResp.state || apiResp.error_message) {
        fatal_error(apiResp);
        return;
      }

      $scope.children = apiResp.items;
    }) });
  }

  $scope.signin = function() {
    authorize(false);
  }

  $scope.get_config = function() {
    return $http.get('/api/get_config')
    .success(function(data, status, headers, config) {
       $scope.config = data;
       $scope.school = data.school;
    });
  };

  //$scope.get_config();

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
