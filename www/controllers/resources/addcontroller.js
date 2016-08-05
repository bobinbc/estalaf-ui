angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('AddResCtrl', function($scope, $state, $localStorage,$cordovaToast) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').show();

    $scope.numberPickerObject = {
      inputValue: 0,
      minValue: 1,
      maxValue: 50,
      precision: 1,
      format: "WHOLE",
      titleLabel: 'Quantity',
      setLabel: 'Set',
      closeLabel: 'Close',
      setButtonType: 'button-positive',
      closeButtonType: 'button-stable',
      callback: function(val) {
        $scope.quantityNo = val;
      }
    };

    $scope.addResource = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/resources',
        data: {
          'resourceName': $scope.resourceName,
          'resourceDescription': $scope.resourceDescription,
          'resourceMCode': $scope.resourceId,
          'clubId': $localStorage.id,
          'manual': true,
          'resourceQuantity': $scope.quantityNo,
          'token': $localStorage.token
        },
        success: function(data, status) {
          if (data.success == true) {
            $cordovaToast.show('No Internet Connection', 'long', 'bottom');
            $state.go('home');
          } else if (data.success == false) {
            console.log("fail");
          }
        }
      });
    }
  })
