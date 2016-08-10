angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
    .controller('JoinCtrl', function ($scope, $state, $cordovaToast, $localStorage) {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $cordovaToast.show('No Internet Connection', 'long', 'bottom');
            }
        }
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
                    console.log(data);
                    if (data.success == true) {
                        $state.go('home');
                    } else if (data.success == false) {
                        $cordovaToast.show('Invalid club code', 'long', 'bottom');
                    }
                }
            });
        }
    })
