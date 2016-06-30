angular.module('estalaf.controllers', ['ngStorage', 'ngCordova'])

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
          $state.go('joinClub');
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

.controller('RegisterCtrl', function($scope, $location,$ionicPopup, $http, $state) {
    $scope.loginPage = function(path) {
      $location.path(path);
    };

    $scope.passwordTouch=function(){
      var alertPopup = $ionicPopup.alert({
        title: 'Password Format',
        template: 'It should contain alphanumeric & special charectors'
      });
    }

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
  .controller('JoinCtrl',function ($scope,$state,$ionicModal){
    // $scope.join=function(){
    //   $state.go('create');
    // }
    $ionicModal.fromTemplateUrl('templates/createClub.html', {
    scope: $scope,
    animation: 'fade-in-scale'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

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
  .controller('HomeCtrl', function($scope, $cordovaBarcodeScanner,$ionicSideMenuDelegate) {

    // $scope.scanBarcode = function() {
    //   $cordovaBarcodeScanner.scan().then(function(imageData) {
    //     alert(imageData.text);
    //     console.log("format" + imageData.format);
    //   }, function(error) {
    //     console.log("An Error: " + error);
    //   });
    // }
    $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  })
.controller('AddResCtrl', function($scope,$http, $ionicPopup, $state) {

    $scope.addResource = function() {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/resource',
        data: {
          'resourceName': $scope.resourceName,
          'resourceDescription': $scope.resourceDescription,
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
  });
