angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
.controller('ScanResCtrl', function($scope, $state, $localStorage,$cordovaToast) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').show();

    $scope.resourceCode = $localStorage.scan;
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

    $scope.scanResource = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/resources',
        data: {
          'resourceName': $scope.resourceName,
          'resourceDescription': $scope.resourceDescription,
          'resourceCode': $scope.resourceCode,
          'clubId': $localStorage.id,
          'manual': false,
          'resourceQuantity': $scope.quantityNo,
          'token': $localStorage.token
        },
        success: function(data, status) {
          if (data.success) {
            $cordovaToast.show('Item added Succesfully', 'long', 'bottom');
            $state.go('home');
          } else if (!data.success) {
            console.log("fail");
          }
        }
      });
    }
  })
