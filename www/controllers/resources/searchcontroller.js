angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('SearchResCtrl', function($scope, $state, $localStorage, $http, $ionicHistory) {
    console.log("hi");
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }

    $('#search').hide();
    $('#home').show();
    $('#create').show();

    $scope.items = [];
    var config = {
      headers: {
        'token': $localStorage.token
      }
    };
    $http.get('https://estalaf-production.herokuapp.com/resources?clubId=' + $localStorage.clubId, config).success(function(data) {
      $.each(data.resources, function(k, v) {
        // console.log(v);
        if (data.resources.length > 0) {
          $('#noMember').hide();
          $scope.items.push({
            name: v.RESOURCE_NAME,
            id: v.RESOURCE_ID,
            description:v.RESOURCE_DESCRIPTION,
            borrowValue:v.RESOURCE_QUANTITY-v.RESOURCE_BORROWEDQUANTITY
          });
        } else {
          $('#noMember').show();
        }
      });
    });

    $scope.reserve=function(id){
      $localStorage.selectedResource=id;
      $state.go('view');
    }
    // $scope.reserve=function(id){
    //   $.ajax({
    //     type:'PUT',
    //     url:'https://estalaf-production.herokuapp.com/clubs/pendingUsers',
    //     headers: {
    //       'token': $localStorage.token
    //     },
    //     data:{'userId':id, 'clubId':$localStorage.id, 'disapprove':true},
    //       success: function(data, status) {
    //         console.log("user deleted");
    //       }
    //     });
    // };
  })
