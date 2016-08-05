angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])

.controller('MemberCtrl', function($scope, $state, $localStorage, $http) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').show();

    $scope.items = [];
    var config = {
      headers: {
        'clubId': $localStorage.id,
        'token': $localStorage.token
      }
    };
    $http.get('https://estalaf-production.herokuapp.com/clubs/pendingUsers', config).success(function(data) {
      $.each(data.clubUsers, function(k, v) {
        if (v.Users.length > 0) {
          $('#noMember').hide();
          $.each(v.Users, function(k, v) {

            $scope.items.push({
              first: v.FIRST_NAME,
              last: v.LAST_NAME,
              id: v.USER_ID
            });
          });
        } else {
          $('#noMember').show();
        }
      });
    });

    $scope.add = function(id) {
      $.ajax({
        type: 'PUT',
        url: 'https://estalaf-production.herokuapp.com/clubs/pendingUsers',
        headers: {
          'token': $localStorage.token
        },
        data: {
          'userId': id,
          'clubId': $localStorage.id
        },
        success: function(data, status) {
          console.log("user added");
        }
      });
    };

    $scope.delete = function(id) {
      $.ajax({
        type: 'PUT',
        url: 'https://estalaf-production.herokuapp.com/clubs/pendingUsers',
        headers: {
          'token': $localStorage.token
        },
        data: {
          'userId': id,
          'clubId': $localStorage.id,
          'disapprove': true
        },
        success: function(data, status) {
          console.log("user deleted");
        }
      });
    };
  })
