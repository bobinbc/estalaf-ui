angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])

.controller('LoginCtrl', function($scope, $cordovaToast, $state, $localStorage) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
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
  .controller('HomeCtrl', function($scope, $filter, $location, $cordovaToast, $cordovaBarcodeScanner, $ionicSideMenuDelegate, $state, $localStorage, $window) {
    $('#range').hide();
    $('#or').hide();
    $('#hideClick').hide();
    $('#memberApproval').hide();
    $('#home').hide();
    $('#clubName').html('Select Club');
    $('#clubs').empty();
    $('#search').hide();
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
            if (v.Clubs.length == 1) {
              $("#showAdminIcon").hide();
              $('#clubsDropDown').hide();
              $('#clubTextfield').show();

              $.each(v.Clubs, function(k, v) {
                var name = v.CLUB_NAME;
                $('#clubName').html(name);
                if(v.Club_User.ROLE== "ADMIN"){
                  document.getElementById('displayName').value=name;
                  $("#showAdminIcon").show();
                  $("#displayName").css('color','#9900ff');
                }
                else if(v.Club_User.ROLE== "PENDING-MEMBER"){
                   document.getElementById('displayName').value=name;
                   $("#showAdminIcon").hide();
                   $("#displayName").css('color','#A9A9A9');
                }
                 else if(v.Club_User.ROLE== "MEMBER"){
                   document.getElementById('displayName').value=name;
                   $("#showAdminIcon").hide();
                   $("#displayName").css('color','black');
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
                console.log(  location.clubId);
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
                    $('<option value="' + v.Club_User.ROLE + '">' + v.CLUB_NAME + '</option>')
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
        var n = imageData.text;
        // $scope.resourceId = n;
        // alert(n);
        // $state.go('addResource');


        alert("format" + imageData.text);
      }, function(error) {
        //  console.log("An Error: " + error);
      });
    };
    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.addResource = function() {
      $state.go('addResource');
    };
    $scope.toggleChange = function() {
      console.log("hi");
    }
  })
  .controller('AddResCtrl', function($scope, $state, $localStorage) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();

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
            $state.go('home');
          } else if (data.success == false) {
            console.log("fail");
          }
        }
      });
    }
  })
  .controller('SearchResCtrl', function($scope, $state, $localStorage, $http) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }

    $('#search').hide();
    $('#home').show();

    $scope.items = [];
    var config = {
      headers: {
        'token': $localStorage.token
      }
    };
    $http.get('https://estalaf-production.herokuapp.com/resources?clubId=' + $localStorage.id, config).success(function(data) {
      $.each(data.resources, function(k, v) {
        console.log(v);
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
  });
