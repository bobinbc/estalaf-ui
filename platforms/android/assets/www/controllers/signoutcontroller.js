angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('SignOutCtrl', function($scope, $state, $localStorage, $ionicHistory, $window) {
    $state.go('login');
    $window.localStorage.clear();
    $ionicHistory.clearHistory();
  })
