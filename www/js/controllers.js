angular.module('estalaf.controllers', ['ngStorage','ngCordova'])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $http, $localStorage) {
  $scope.signIn = function() {

    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/login',
      data: {
        'email': $scope.email,
        'password': $scope.password
      },
      success: function(data, status) {
        if (data.success == true) {
            $localStorage.token = data.token.value;
            console.log($localStorage.token);
          console.log(data);
          $state.go('create');
        } else if (data.success == false) {
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        }
      }
    });
  }
})

.controller('RegisterCtrl', function($scope, $location, $http, $state) {
    $scope.loginPage = function(path) {
      $location.path(path);
    };

    $scope.regSubmit = function() {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/users',
        data: {
          'firstName': $scope.firstName,
          'lastName': $scope.lastName,
          'email': $scope.email,
          'password': $scope.password
        },
        success: function(data, status) {
          console.log(data);
          if (data.success == true) {
            console.log("hi");
            $state.go('login');

          }
        }
      });
    };
  })
  .controller('CreateCtrl', function($scope, $http, $ionicPopup, $state, $localStorage) {
      $scope.createClub = function() {
          $.ajax({
            type: 'POST',
            url: 'http://localhost:5000/clubs',
            data: {
              'clubName': $scope.clubName,
              'clubDescription': $scope.clubDescription,
              'token': $localStorage.token
            },
            success: function(data, status) {
              console.log(data);
              if (data.success == true) {
                console.log(data);
                $state.go('home');
              } else if (data.success == false) {
                console.log("fail");
              }
            }
          });
        }
      })
        .controller('HomeCtrl', function($scope, $cordovaBarcodeScanner) {

          $scope.scanBarcode = function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
              alert(imageData.text);
              console.log("format" + imageData.format);
            }, function(error) {
              console.log("An Error: " + error);
            });
          }
        });
