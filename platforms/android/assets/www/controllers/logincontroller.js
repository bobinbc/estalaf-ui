angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('LoginCtrl', function($scope, $cordovaToast, $state, $localStorage) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    // if($localStorage.token == 'undefined'){
    //   $state.go('home');
    // }
    // else{
    $scope.signIn = function() {
        $.ajax({
          type: 'POST',
          url: 'https://estalaf-production.herokuapp.com/login',
          data: {
            'email': $scope.email,
            'password': $scope.password
          },
          success: function(data, status) {
            if (data.success == true) {
              $localStorage.token = data.token.value;
              $state.go('home');
            } else if (data.success == false) {
              $cordovaToast.show('Invalid Credentials', 'long', 'bottom')
            }
          }
        });
      }
      // }
  })
