angular.module('estalaf.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
  $scope.data = {};
  $scope.signIn = function() {
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
      $state.go('home');
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})

.controller('RegisterCtrl', function($scope, $location, $http, $state) {
  $scope.loginPage = function(path) {
    $location.path(path);
  };

  $scope.user = {};

  $scope.regSubmit = function() {
    $http({
        method: 'POST',
        url: '/',
        data: $scope.user,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .success(function(data) {
        if (data.success) {
          $state.go('login');
        } else if (data.errors) {
          console.log("error");
        }
      });
  };
});
