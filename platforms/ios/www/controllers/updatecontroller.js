angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('UpdateCtrl', function($scope, $state) {
    $('#clubsDropDown').hide();
    $('#clubTextfield').hide();
    $('#home').show();

    $scope.updateSubmit = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/users',
        data: {
          'firstName': $scope.firstName,
          'lastName': $scope.lastName,
          'email': $scope.email,
          'password': $scope.password
        },
        success: function(data, status) {
          if (data.success == true) {
            $cordovaToast.show('successfully Updated', 'long', 'bottom');
            $state.go('login');
          }
        }
      });
    }
  })
