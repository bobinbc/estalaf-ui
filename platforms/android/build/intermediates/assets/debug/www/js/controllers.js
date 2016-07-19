angular.module('estalaf.controllers', ['ngStorage', 'ngCordova'])

.controller('LoginCtrl', function ($scope, $ionicPopup, $state, $http, $localStorage, $cordovaOauth) {
    $scope.signIn = function () {
        $.ajax({
            type: 'POST',
            url: 'https://estalaf-production.herokuapp.com/login',
            data: {
                'email': $scope.email,
                'password': $scope.password
            },
            success: function (data, status) {
                if (data.success == true) {
                    $localStorage.token = data.token.value;
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
    $scope.googleLogin = function () {
        $cordovaOauth.google("178964518843-uhsk0ar6q0m3im3jekjhdhj34f1i89fk.apps.googleusercontent.com", "7Ot1ZGxEflfyV_X6VSBqd8z8").then(function (result) {
            console.log(JSON.stringify(result));
        }, function (error) {
            console.log(error);
        });
    }
})

.controller('RegisterCtrl', function ($scope, $location, $ionicPopup, $http, $state, $localStorage, $cordovaOauth) {

        $scope.loginPage = function (path) {
            $location.path(path);
        };
        $scope.regSubmit = function () {
            $.ajax({
                type: 'POST',
                url: 'https://estalaf-production.herokuapp.com/users',
                data: {
                    'firstName': $scope.firstName,
                    'lastName': $scope.lastName,
                    'email': $scope.email,
                    'password': $scope.password
                },
                success: function (data, status) {
                    if (data.success == true) {
                        $state.go('login');
                    }
                }
            });
        };
        $scope.googleRegistration = function () {
            var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + "178964518843-uhsk0ar6q0m3im3jekjhdhj34f1i89fk.apps.googleusercontent.com" + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
        ref.addEventListener('loadstart', function(event) { 
            if((event.url).startsWith("http://localhost/callback")) {
                requestToken = (event.url).split("code=")[1];
                $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + "178964518843-uhsk0ar6q0m3im3jekjhdhj34f1i89fk.apps.googleusercontent.com" + "&client_secret=" + "7Ot1ZGxEflfyV_X6VSBqd8z8" + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                    .success(function(data) {
                        accessToken = data.access_token;
                        $location.path("/secure");
                    })
                    .error(function(data, status) {
                        alert("ERROR: " + data);
                    });
                ref.close();
            }
        });
        }
            
//            $cordovaOauth.google("178964518843-uhsk0ar6q0m3im3jekjhdhj34f1i89fk.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"])
////                 .then(function(result, data) {
////            $cordovaOauth.google("178964518843-uhsk0ar6q0m3im3jekjhdhj34f1i89fk.apps.googleusercontent.com", "7Ot1ZGxEflfyV_X6VSBqd8z8")
//                .then(
//                    function (result) {
//                        console.log(JSON.stringify(result));
//                    },
//                    function (error) {
//                        console.log(error);
//                    });
//        };
    })
    .controller('JoinCtrl', function ($scope, $state, $ionicPopup, $localStorage) {
        $scope.join = function () {
            $state.go('create');
        };
        $scope.joinClub = function () {
            $.ajax({
                type: 'POST',
                url: 'https://estalaf-production.herokuapp.com/clubs/users',
                data: {
                    'clubCode': $scope.clubCode,
                    'token': $localStorage.token
                },
                success: function (data, status) {
                    console.log($scope.clubCode);
                    if (data.success == true) {
                        $state.go('home');
                    } else if (data.success == false) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Invalid code!',
                            template: 'Please check your code!!!'
                        });
                    }
                }
            });
        }
    })
    .controller('CreateCtrl', function ($scope, $http, $ionicPopup, $state, $localStorage) {
        $scope.createClub = function () {
            $.ajax({
                type: 'POST',
                url: 'https://estalaf-production.herokuapp.com/clubs',
                data: {
                    'clubName': $scope.clubName,
                    'clubDescription': $scope.clubDescription,
                    'token': $localStorage.token
                },
                success: function (data, status) {
                    if (data.success == true) {
                        $state.go('home');
                    } else if (data.success == false) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Invalid club!',
                            template: 'Please check your club name!!'
                        });
                    }
                }
            });
        }
    })
    .controller('HomeCtrl', function ($scope, $cordovaBarcodeScanner, $ionicSideMenuDelegate, $state, $ionicPopup, $localStorage, $window, $ionicHistory) {

        $scope.scanBarcode = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                alert(imageData.text);
                console.log("format" + imageData.format);
            }, function (error) {
                console.log("An Error: " + error);
            });
        };
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.addResource = function () {
            $state.go('addResource');
        };
        $scope.create = function () {
            $state.go('create');
        };
        $scope.join = function () {
            $scope.data = {};
            $ionicPopup.show({
                template: '<input type="text" ng-model="data.clubCode">',
                title: 'Enter club code',
                subTitle: 'Please Enter club Code',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
        }, {
                    text: '<b>Join</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $.ajax({
                            type: 'POST',
                            url: 'https://estalaf-production.herokuapp.com/clubs/users',
                            data: {
                                'clubCode': $scope.data.clubCode,
                                'token': $localStorage.token
                            },
                            success: function (data, status) {
                                if (data.success == true) {
                                    $state.go('home');
                                } else if (data.success == false) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Invalid code!',
                                        template: 'Please check your code!!!'
                                    });
                                }
                            }
                        });
                    }
        }]
            });
        };
        $scope.logout = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Sign Out',
                template: 'Do you want to sign Out?',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $window.localStorage.clear();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $window.location.reload(true);
                    $state.go('login');
                } else {
                    console.log('You clicked on "Cancel" button');
                }
            });
        };
    })
    .controller('AddResCtrl', function ($scope, $http, $ionicPopup, $state, $localStorage) {

        $scope.addResource = function () {
            $.ajax({
                type: 'POST',
                url: 'https://estalaf-production.herokuapp.com/resources',
                data: {
                    'resourceName': $scope.resourceName,
                    'resourceDescription': $scope.resourceDescription,
                    'resourceCode': 'xyz',
                    'clubId': 4,
                    // 'resourceMcode':
                    // 'manual':true,
                    // 'resourceQuantity':
                    'manual': false,
                    'token': $localStorage.token
                },
                success: function (data, status) {
                    if (data.success == true) {
                        $state.go('home');
                    } else if (data.success == false) {
                        console.log("fail");
                    }
                }
            });
        }
    });