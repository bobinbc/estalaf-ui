angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('RegisterCtrl', function($scope, $location, $ionicPopup, $state, $localStorage) {
    $scope.loginPage = function(path) {
      $location.path(path);
    };

    $scope.regSubmit = function() {
      // This is to get the check whether the first alphabet of the first name is capitol,
      // if not will convert it into capitol
      var firstname = $scope.firstName;
      var firstname1 = firstname.slice(1);
      if (firstname.charAt(0) === firstname.charAt(0).toUpperCase()) {
        var firstName = firstname;
      } else {
        var firstName = firstname.charAt(0).toUpperCase().concat(firstname1);
      }
      // This is to check whether the first alphabet of the last name is capitol,
      // if not will convert it into capitol
      var lastname = $scope.lastName;
      var lastname1 = lastname.slice(1);
      if (lastname.charAt(0) === lastname.charAt(0).toUpperCase()) {
        var lastName = lastname;
      } else {
        var lastName = lastname.charAt(0).toUpperCase().concat(lastname1);
      }
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/users',
        data: {
          'firstName': firstName,
          'lastName': lastName,
          'email': $scope.email,
          'password': $scope.password
        },
        success: function(data, status) {
          console.log(data);
          if (data.success == true) {
            $state.go('login');
          }
        }
      });
    };
  });
