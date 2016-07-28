angular.module('estalaf', ['ionic','estalaf.controllers','ngCordova'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

  });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
            controller:'RegisterCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller:'LoginCtrl'
    })
    .state('joinClub',{
      url:'/joinClub',
      templateUrl:'templates/joinClub.html',
      controller:'JoinCtrl'
    })
    .state('create',{
      url:'/create',
      cache: false,
      templateUrl:'templates/createClub.html',
      controller:'CreateCtrl'
    })
    .state('home',{
      url:'/home',
      cache: false,
      templateUrl:'templates/home.html',
      controller:'HomeCtrl'
    })
    .state('addResource',{
      url:'/addResource',
      cache: false,
      templateUrl:'templates/addResource.html',
      controller:'AddResCtrl'
    })
    .state('searchResource',{
      url:'/searchResource',
      cache: false,
      templateUrl:'templates/searchResource.html',
      controller:'SearchResCtrl'
    })
    .state('member',{
      url:'/member',
      cache: false,
      templateUrl:'templates/member.html',
      controller:'MemberCtrl'
    });
  $urlRouterProvider.otherwise('/register');
});
