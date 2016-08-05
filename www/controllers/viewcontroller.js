angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('viewCtrl',function($scope,$state,$localStorage){
   var obj=$localStorage.selectedResource;
    $scope.resCode = obj.id;
    $scope.borrowStatus = obj.borrowValue;
    $scope.resName = obj.name;
    $scope.resDescription = obj.description;

    $scope.viewResource=function(){
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/resources/users',
        headers: {
          'token': $localStorage.token
        },
        data: {
          'clubId': $localStorage.clubId,
          'resourceCode': obj.id
        },
        success: function(data, status) {
          $state.go('home');
          alert(data.message);
          alert(status);
          if (data.success == true) {
            alert(data);
//              $scope.resName = obj.resName;
//              $scope.resDescription = obj.resDescription;
          } else {
            alert("error");
          }


          // console.log(data);
        }
      });
    }

  });
