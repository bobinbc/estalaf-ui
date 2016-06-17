angular.module('estalaf.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
  $scope.data={};
  $scope.signIn=function(){
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
          $state.go('home');
      }).error(function(data) {
          var alertPopup = $ionicPopup.alert({
              title: 'Login failed!',
              template: 'Please check your credentials!'
          });
      });
  };
 
  // $scope.userColor='solid 1px red';
  // $scope.userColor='solid 1px green';
  // $scope.passColor='solid 1px red';
  // $scope.passColor='solid 1px green';
})

.controller('RegisterCtrl', function($scope,$location) {
  $scope.loginPage=function(path){
    $location.path(path);
};
});
