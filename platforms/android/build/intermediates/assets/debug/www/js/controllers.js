angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])

.controller('LoginCtrl', function($scope, $cordovaToast, $state, $localStorage) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    // if($localStorage.token == 'undefined'){
    //   $state.go('home');
    // }
    // else{
    $scope.signIn = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/login',
        data: {
          'email': $scope.email,
          'password': $scope.password
        },
        success: function(data, status) {
          if (data.success == true) {
            $localStorage.token = data.token.value;
            $state.go('home');
          } else if (data.success == false) {
            $cordovaToast.show('Invalid Credentials', 'long', 'bottom')
          }
        }
      });
    }
  // }
  })
  .controller('RegisterCtrl', function($scope, $location, $ionicPopup, $state, $localStorage) {
    $scope.loginPage = function(path) {
      $location.path(path);
    };

    $scope.regSubmit = function() {
      // This is to get the check whether the first alphabet of the first name is capitol,
      // if not will convert it into capitol
      var firstname = $scope.firstName;
      var firstname1 = firstname.slice(1);
      if (firstname.charAt(0) === firstname.charAt(0).toUpperCase()) {
        var firstName = firstname;
      } else {
        var firstName = firstname.charAt(0).toUpperCase().concat(firstname1);
      }
      // This is to check whether the first alphabet of the last name is capitol,
      // if not will convert it into capitol
      var lastname = $scope.lastName;
      var lastname1 = lastname.slice(1);
      if (lastname.charAt(0) === lastname.charAt(0).toUpperCase()) {
        var lastName = lastname;
      } else {
        var lastName = lastname.charAt(0).toUpperCase().concat(lastname1);
      }
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/users',
        data: {
          'firstName': firstName,
          'lastName': lastName,
          'email': $scope.email,
          'password': $scope.password
        },
        success: function(data, status) {
          console.log(data);
          if (data.success == true) {
            $state.go('login');
          }
        }
      });
    };
  })
  .controller('JoinCtrl', function($scope, $state, $cordovaToast, $localStorage) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
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
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').hide();
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
  .controller('HomeCtrl', function($scope, $filter, $location, $cordovaToast, $cordovaBarcodeScanner, $state, $localStorage, $window) {
    $('#range').hide();
    $('#or').hide();
    $('#hideClick').hide();
    $('#memberApproval').hide();
    $('#home').hide();
    $('#clubName').html('Select Club');
    $('#clubs').empty();
    $('#search').hide();
    $('#create').show();
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }

    $scope.addResourcePage = function(path) {
      $location.path(path);
    };

    $.ajax({
      type: 'GET',
      url: 'https://estalaf-production.herokuapp.com/clubs/users',
      headers: {
        'token': $localStorage.token
      },
      success: function(data, status) {
        if (data.success == true) {
          $.each(data.clubUsers, function(k, v) {
            console.log(v.Clubs.length );
            if(v.Clubs.length == 0){
              $('#clubsDropDown').hide();
              $('#clubTextfield').hide();
            }
            else if (v.Clubs.length == 1) {
              $("#showAdminIcon").hide();
              $('#clubsDropDown').hide();
              $('#clubTextfield').show();

              $.each(v.Clubs, function(k, v) {
                var name = v.CLUB_NAME;
                $localStorage.clubId=v.CLUB_ID;
                $('#clubName').html(name);

                if(v.Club_User.ROLE== "ADMIN"){
                  $localStorage.id =v.CLUB_ID;
                  document.getElementById('displayName').value=name;
                  $("#showAdminIcon").show();
                  $("#displayName").css('color','#9900ff');
                  $('#memberApproval').show();
                  $('#search').show();
                }
                else if(v.Club_User.ROLE== "PENDING-MEMBER"){
                   document.getElementById('displayName').value=name;
                   $("#showAdminIcon").hide();
                   $("#displayName").css('color','#A9A9A9');
                   $('#memberApproval').hide();
                   $('#search').hide();
                }
                 else if(v.Club_User.ROLE== "MEMBER"){
                   document.getElementById('displayName').value=name;
                   $("#showAdminIcon").hide();
                   $("#displayName").css('color','black');
                   $('#search').show();
                 }
               });
            } else if (v.Clubs.length > 1) {
              $("#showIcon").hide();
              $('#clubsDropDown').show();
              $('#clubTextfield').hide();
              $("#clubs").css('color','black');
              $("#clubs").append(
                $('<option value="Select Club" selected> ' + "Select Club" + '</option>')
              );
              $.each(v.Clubs, function(k, v) {
                if (v.Club_User.ROLE == "ADMIN") {
                  $("#clubs").append(
                    $('<option value="' + v.Club_User.ROLE + ',' + v.CLUB_ID + '" >' + v.CLUB_NAME + '</option>')
                  );

                } else if (v.Club_User.ROLE == "PENDING-MEMBER") {

                  $("#clubs").append(
                    $('<option  value="' + v.Club_User.ROLE + '">' + "P\t" + v.CLUB_NAME + '</option>')
                  );
                } else if (v.Club_User.ROLE == "MEMBER") {

                  $("#clubs").append(
                    $('<option value="' + v.Club_User.ROLE + ',' + v.CLUB_ID + '">' + v.CLUB_NAME + '</option>')
                  );
                }

              });
            }

          });
        }
      }
    });

    $('#clubs').on('change', function() {
      $('#showIcon').hide();
      var role1 = this.value;
      var role2 = role1.split(",");
      var clubid=role2.pop();
      $localStorage.clubId=clubid;
      var role = role2.shift();
      var name = $('#clubs :selected').text();
      $("#clubName").text(name);
      $("#clubs").css('color','black');

      if (role == "Select club") {
        $('#showIcon').hide();
        $('#range').hide();
        $('#or').hide();
        $('#hideClick').hide();
        $('#memberApproval').hide();
        $('#search').hide();


      } else if (role == "PENDING-MEMBER") {
        $('#showIcon').hide();
        $('#range').hide();
        $('#or').hide();
        $('#hideClick').hide();
        $('#memberApproval').hide();
        $('#search').hide();
         $("#clubs").css('color','#A9A9A9');

      } else if (role == "ADMIN") {
        $('#showIcon').show();
        var val = this.value;
        var val1 = val.split(",");
        var id = val1.pop();
        $localStorage.id = id;
        $('#range').show();
        $('#or').show();
        $('#hideClick').show();
        $('#memberApproval').show();
        $('#search').show();
        $("#clubs").css('color','#9900ff');


      } else if (role == "MEMBER") {
        $('#showIcon').hide();
        $('#range').hide();
        $('#or').hide();
        $('#hideClick').hide();
        $('#memberApproval').hide();
        $('#search').show();
        $("#clubs").css('color','black');
      }
    });
    $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        var n =imageData.text;
        // var n="nithin";

        if(n==""){
          alert("Please Scan again");
        }
        else{
          if($scope.toggle)
          {
            $.ajax({
              type:'POST',
              url:'https://estalaf-production.herokuapp.com/resources/users',
              headers: {
                'token': $localStorage.token
              },
              data:{
                'clubId': $localStorage.clubId ,
                'resourceCode':n
              },
                success: function(data, status) {
                  alert(data.message);
                  alert(status);
                  if(data.success== true){
                    alert(data);
                  }
                  else{
                    alert("error");
                  }


                  // console.log(data);
                }
              });



          }
          else{

        $localStorage.scan=n;
        $state.go('scanResource');
}
      }
        // alert("format" + imageData.text);
      }, function(error) {
        //  console.log("An Error: " + error);
      });
    };
    // $scope.toggleLeft = function() {
    //   $ionicSideMenuDelegate.toggleLeft();
    // };
    $scope.addResource = function() {
      $state.go('addResource');
    };
    // $scope.toggleChange = function() {
    //
    // };
  })
  .controller('AddResCtrl', function($scope, $state, $localStorage) {
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
  .controller('ScanResCtrl', function($scope, $state, $localStorage) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').show();

    $scope.resourceCode=$localStorage.scan;
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
          if (data.success == true) {
            $cordovaToast.show('Item added Succesfully', 'long', 'bottom');
            $state.go('home');
          } else if (data.success == false) {
            console.log("fail");
          }
        }
      });
    }
  })
  .controller('SearchResCtrl', function($scope, $state, $localStorage, $http,$ionicHistory) {
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
        if (data.resources.length > 0) {
          $('#noMember').hide();
          $scope.items.push({
            first: v.RESOURCE_NAME,
            id: v.RESOURCE_ID
          });
        } else {
          $('#noMember').show();
        }
      });
    });

    // $scope.borrow=function(id){
    // $.ajax({
    //   type:'PUT',
    //   url:'https://estalaf-production.herokuapp.com/resources,
    //   headers: {
    //     'clubId': $localStorage.id,
    //     'token': $localStorage.token
    //   },
    //   data:{'userId':id, 'clubId':$localStorage.id},
    //     success: function(data, status) {
    //       console.log("user added");
    //     }
    //   });
    // };
    //
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
  .controller('SignOutCtrl',function($scope, $state,$localStorage,$ionicHistory,$window){
   $state.go('login');
   $window.localStorage.clear();
    $ionicHistory.clearHistory();
  })
  .controller('UpdateCtrl',function($scope,$state){
    $('#clubsDropDown').hide();
    $('#clubTextfield').hide();
    $('#home').show();

    $scope.updateSubmit=function(){
      $.ajax({
        type:'POST',
        url:'https://estalaf-production.herokuapp.com/users',
        data:{
          'firstName':$scope.firstName,
          'lastName':$scope.lastName,
          'email':$scope.email,
          'password':$scope.password
        },
        success:function(data,status){
        if(data.success == true){
            $cordovaToast.show('successfully Updated', 'long', 'bottom');
            $state.go('login');
        }
        }
      });
    }
  });
  // .controller('dropDownCtrl',function($scope,$state,$localStorage,$ionicSideMenuDelegate){
  //   $.ajax({
  //     type: 'GET',
  //     url: 'https://estalaf-production.herokuapp.com/clubs/users',
  //     headers: {
  //       'token': $localStorage.token
  //     },
  //     success: function(data, status) {
  //       if (data.success == true) {
  //         $.each(data.clubUsers, function(k, v) {
  //           console.log(v.Clubs.length );
  //          if (v.Clubs.length == 1) {
  //             $("#showAdminIcon").hide();
  //             $('#clubsDropDown').hide();
  //             $('#clubTextfield').show();
  //
  //             $.each(v.Clubs, function(k, v) {
  //               var name = v.CLUB_NAME;
  //               $localStorage.clubId=v.CLUB_ID;
  //               $('#clubName').html(name);
  //
  //               if(v.Club_User.ROLE== "ADMIN"){
  //                 $localStorage.id =v.CLUB_ID;
  //                 document.getElementById('displayName').value=name;
  //                 $("#showAdminIcon").show();
  //                 $("#displayName").css('color','#9900ff');
  //                 $('#memberApproval').show();
  //                 $('#search').show();
  //               }
  //               else if(v.Club_User.ROLE== "PENDING-MEMBER"){
  //                  document.getElementById('displayName').value=name;
  //                  $("#showAdminIcon").hide();
  //                  $("#displayName").css('color','#A9A9A9');
  //                  $('#memberApproval').hide();
  //                  $('#search').hide();
  //               }
  //                else if(v.Club_User.ROLE== "MEMBER"){
  //                  document.getElementById('displayName').value=name;
  //                  $("#showAdminIcon").hide();
  //                  $("#displayName").css('color','black');
  //                  $('#search').show();
  //                }
  //              });
  //           } else if (v.Clubs.length > 1) {
  //             $("#showIcon").hide();
  //             $('#clubsDropDown').show();
  //             $('#clubTextfield').hide();
  //             $("#clubs").css('color','black');
  //             $("#clubs").append(
  //               $('<option value="Select Club" selected> ' + "Select Club" + '</option>')
  //             );
  //             $.each(v.Clubs, function(k, v) {
  //               if (v.Club_User.ROLE == "ADMIN") {
  //                 $("#clubs").append(
  //                   $('<option value="' + v.Club_User.ROLE + ',' + v.CLUB_ID + '" >' + v.CLUB_NAME + '</option>')
  //                 );
  //
  //               } else if (v.Club_User.ROLE == "PENDING-MEMBER") {
  //
  //                 $("#clubs").append(
  //                   $('<option  value="' + v.Club_User.ROLE + '">' + "P\t" + v.CLUB_NAME + '</option>')
  //                 );
  //               } else if (v.Club_User.ROLE == "MEMBER") {
  //
  //                 $("#clubs").append(
  //                   $('<option value="' + v.Club_User.ROLE + ',' + v.CLUB_ID + '">' + v.CLUB_NAME + '</option>')
  //                 );
  //               }
  //
  //             });
  //           }
  //
  //         });
  //       }
  //     }
  //   });
  //
  //   $('#clubs').on('change', function() {
  //     $('#showIcon').hide();
  //     var role1 = this.value;
  //     var role2 = role1.split(",");
  //     var clubid=role2.pop();
  //     $localStorage.clubId=clubid;
  //     var role = role2.shift();
  //     var name = $('#clubs :selected').text();
  //     $("#clubName").text(name);
  //     $("#clubs").css('color','black');
  //
  //     if (role == "Select club") {
  //       $('#showIcon').hide();
  //       $('#range').hide();
  //       $('#or').hide();
  //       $('#hideClick').hide();
  //       $('#memberApproval').hide();
  //       $('#search').hide();
  //
  //
  //     } else if (role == "PENDING-MEMBER") {
  //       $('#showIcon').hide();
  //       $('#range').hide();
  //       $('#or').hide();
  //       $('#hideClick').hide();
  //       $('#memberApproval').hide();
  //       $('#search').hide();
  //        $("#clubs").css('color','#A9A9A9');
  //
  //     } else if (role == "ADMIN") {
  //       $('#showIcon').show();
  //       var val = this.value;
  //       var val1 = val.split(",");
  //       var id = val1.pop();
  //       $localStorage.id = id;
  //       $('#range').show();
  //       $('#or').show();
  //       $('#hideClick').show();
  //       $('#memberApproval').show();
  //       $('#search').show();
  //       $("#clubs").css('color','#9900ff');
  //
  //
  //     } else if (role == "MEMBER") {
  //       $('#showIcon').hide();
  //       $('#range').hide();
  //       $('#or').hide();
  //       $('#hideClick').hide();
  //       $('#memberApproval').hide();
  //       $('#search').show();
  //       $("#clubs").css('color','black');
  //     }
  //   });
  //   $scope.toggleLeft = function() {
  //     $ionicSideMenuDelegate.toggleLeft();
  //   };
// });
