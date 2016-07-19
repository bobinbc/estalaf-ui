angular.module('estalaf.controllers', ['ngStorage', 'ngCordova'])

.controller('LoginCtrl', function($scope, $cordovaToast, $state, $localStorage) {
  $scope.signIn = function() {

    $.ajax({
      type: 'POST',
      url: 'https://estalaf-production.herokuapp.com/login',
      data: {
        'email': $scope.email,
        'password': $scope.password
      },
      success: function(data, status) {
        console.log(data);
        if (data.success == true) {
          $localStorage.token = data.token.value;
          $state.go('home');
        } else if (data.success == false) {

          console.log("hi");
          //  $cordovaToast.show('Invalid Credentials', 'long', 'bottom')
        }
      }
    });
  }
})

.controller('RegisterCtrl', function($scope, $location, $ionicPopup, $state, $localStorage) {

  $scope.loginPage = function(path) {
      $location.path(path);
    };
    $scope.regSubmit = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/users',
        data: {
          'firstName': $scope.firstName,
          'lastName': $scope.lastName,
          'email': $scope.email,
          'password': $scope.password
        },
        success: function(data, status) {
          if (data.success == true) {
            $state.go('login');
          }
        }
      });
    };
  })
  .controller('JoinCtrl', function($scope, $state, $cordovaToast, $localStorage) {
    $scope.join = function() {
      $state.go('create');
    };
    $scope.joinClub = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/clubs/users',
        data: {
          'clubCode': $scope.clubCode,
          'token': $localStorage.token
        },
        success: function(data, status) {
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
  .controller('CreateCtrl', function($scope, $cordovaToast, $state, $localStorage) {
    $('#homeHeading').hide();
    $('#createHeading').show();
    $('#memberHeading').hide();
    $('#create').hide();
    $('#memberApproval').hide();
    $('#home').show();
    $scope.createClub = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/clubs',
        data: {
          'clubName': $scope.clubName,
          'clubDescription': $scope.clubDescription,
          'token': $localStorage.token
        },
        success: function(data, status) {
          if (data.success == true) {
            $state.go('home');
          } else if (data.success == false) {
            $cordovaToast.show('Invalid club Name', 'long', 'bottom');
          }
        }
      });
    };
  })
  .controller('HomeCtrl', function($scope, $filter, $location, $cordovaBarcodeScanner, $ionicSideMenuDelegate, $state, $ionicPopup, $localStorage, $window, $ionicHistory) {
    // $('#homeHeading').show();
    // $('#createHeading').hide();
    // $('#memberHeading').hide();
    // $('#home').hide();
    // $('#create').show();
    // $('#memberApproval').show();
    $scope.addResourcePage = function(path) {
        $location.path(path);
      };

      $.ajax({
        type:'GET',
        url:'https://estalaf-production.herokuapp.com/clubs/users',
        data:{
        'token': $localStorage.token
        },
        headers: {  'token': $localStorage.token},
        success:function(data,status){
          console.log(data);
          if(data.success==true){
            $.each(data.clubUsers, function(k,v){
              if(v.Clubs.length==1){
                $('#clubsDropDown').hide();
                $('#clubTextfield').show();
                $.each(v.Clubs, function(k,v){
                  var name=v.CLUB_NAME;
                  $("#clubNameDisplay").html(name);
                  $('#clubName').html(name);
                });
              }
              else if(v.Clubs.length>1){
                $('#clubsDropDown').show();
                $('#clubTextfield').hide();
                $.each(v.Clubs, function(k,v){
                  $("#clubs").append(
                        $('<option value="' + v.Club_User.ROLE+ '">' + v.CLUB_NAME+ '</option>')
                    );
                });
              }

          });
        }
      }
    });

      $('#clubs').on('change',function(){
        var role=this.value;
        var name=$('#clubs :selected').text();
        console.log(role);
        $("#clubName").text(name);

         if(role == "PENDING-MEMBER"){
        $('#range').hide();

        }else if(role == "ADMIN"){
          $('#range').show();

        }
      });
     $scope.scanBarcode = function() {
       $cordovaBarcodeScanner.scan().then(function(imageData) {
         alert(imageData.text);
         console.log("format" + imageData.format);
       }, function(error) {
         console.log("An Error: " + error);
       });
     };
    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.addResource = function() {
      $state.go('addResource');
    };

    // $scope.create = function() {
    //   console.log("hi");
    //   $state.go('create');
    // };
    // $scope.member=function(){
    //   $state.go('member');
    // };
    // $scope.join = function() {
    //   $scope.data = {};
    //   $ionicPopup.show({
    //     template: '<input type="text" ng-model="data.clubCode">',
    //     title: 'Enter club code',
    //     subTitle: 'Please Enter club Code',
    //     scope: $scope,
    //     buttons: [{
    //       text: 'Cancel'
    //     }, {
    //       text: '<b>Join</b>',
    //       type: 'button-positive',
    //       onTap: function(e) {
    //         $.ajax({
    //           type: 'POST',
    //           url: 'https://estalaf-production.herokuapp.com/clubs/users',
    //           data: {
    //             'clubCode': $scope.data.clubCode,
    //             'token': $localStorage.token
    //           },
    //           success: function(data, status) {
    //             if (data.success == true) {
    //               $state.go('home');
    //             } else if (data.success == false) {
    //               var alertPopup = $ionicPopup.alert({
    //                 title: 'Invalid code!',
    //                 template: 'Please check your code!!!'
    //               });
    //             }
    //           }
    //         });
    //       }
    //     }]
    //   });
    // };
    // $scope.logout = function() {
    //   var confirmPopup = $ionicPopup.confirm({
    //     title: 'Sign Out',
    //     template: 'Do you want to sign Out?',
    //   });
    //   confirmPopup.then(function(res) {
    //     if (res) {
    //       $window.localStorage.clear();
    //       $ionicHistory.clearCache();
    //       $ionicHistory.clearHistory();
    //       $window.location.reload(true);
    //       $state.go('login');
    //     } else {
    //       console.log('You clicked on "Cancel" button');
    //     }
    //   });
    // };
  })
  .controller('AddResCtrl', function($scope, $state, $localStorage) {

    $scope.addResource = function() {
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
        success: function(data, status) {
          if (data.success == true) {
            $state.go('home');
          } else if (data.success == false) {
            console.log("fail");
          }
        }
      });
    }
  })
  .controller('MemberCtrl', function($scope,$state,$localStorage){

    // $('#homeHeading').hide();
    // $('#createHeading').hide();
    // $('#memberHeading').show();
    // $('#home').show();
    // $('#memberApproval').hide();
    // var id=$localStorage.clubId;
    // console.log(id);
    // $.ajax({
    //   type:'GET',
    //   url:'https://estalaf-production.herokuapp.com/clubs/pendingUsers',
    //   headers:{'clubId':$localStorage.clubId,'token': $localStorage.token},
    //   success:function(data,status){
    //   //  $scope.items={data.}
    //   }
    // });


  });
