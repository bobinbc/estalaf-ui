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
.controller('SearchResCtrl', function($scope, $state, $localStorage, $http) {
      $('#search').hide();
      $('#home').show();

    $scope.items = [];
    var config = {
      headers: {
        'token': $localStorage.token
      }
    };
    $http.get('https://estalaf-production.herokuapp.com/', config).success(function(data) {
      $.each(data.clubUsers, function(k, v){
        if(v.Users.length>0){
          $('#noMember').hide();
        $.each(v.Users, function(k, v) {
          $scope.items.push({
            first: v.FIRST_NAME,
            last: v.LAST_NAME,
            id:v.USER_ID
          });
        });
      }
      else{
        $('#noMember').show();
      }
      });
    });

    $scope.borrow=function(id){
    $.ajax({
      type:'PUT',
      url:'https://estalaf-production.herokuapp.com/resources,
      headers: {
        'clubId': $localStorage.id,
        'token': $localStorage.token
      },
      data:{'userId':id, 'clubId':$localStorage.id},
        success: function(data, status) {
          console.log("user added");
        }
      });
    };

    $scope.reserve=function(id){
      $.ajax({
        type:'PUT',
        url:'https://estalaf-production.herokuapp.com/clubs/pendingUsers',
        headers: {
          'token': $localStorage.token
        },
        data:{'userId':id, 'clubId':$localStorage.id, 'disapprove':true},
          success: function(data, status) {
            console.log("user deleted");
          }
        });
      };
  })
.controller('RegisterCtrl', function($scope, $location, $ionicPopup, $state, $localStorage) {
    $scope.loginPage = function(path) {
      $location.path(path);
    };
    $scope.regSubmit = function() {
      // This is to get the check whether the first alphabet of the first name is capitol,
      // if not will convert it into capitol
      var firstname=$scope.firstName;
      var firstname1=firstname.slice(1);
      if (firstname.charAt(0) === firstname.charAt(0).toUpperCase()){
        var firstName=firstname;
      }else{
        var firstName=firstname.charAt(0).toUpperCase().concat(firstname1);
      }
      // This is to check whether the first alphabet of the last name is capitol,
      // if not will convert it into capitol
      var lastname=$scope.lastName;
      var lastname1=lastname.slice(1);
      if(lastname.charAt(0)===lastname.charAt(0).toUpperCase()){
        var lastName=lastname;
      }
      else{
        var lastName=lastname.charAt(0).toUpperCase().concat(lastname1);
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
    $('#range').hide();
    $('#or').hide();
    $('#hideClick').hide();
    $('#memberApproval').hide();
    $('#home').hide();
    $('#clubName').html('Select Club');
    $('#clubs').empty();
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
              $('#clubsDropDown').hide();
              $('#clubTextfield').show();

              $.each(v.Clubs, function(k, v) {
                var name = v.CLUB_NAME;
                $("#clubNameDisplay").html(name);
                $('#clubName').html(name);
              });
            } else if (v.Clubs.length > 1) {
              $('#clubsDropDown').show();
              $('#clubTextfield').hide();
              $("#clubs").append(
                $('<option value="Select Club" selected> ' +"Select Club" +'</option>')
              );
              $.each(v.Clubs, function(k, v) {
                if (v.Club_User.ROLE == "ADMIN") {
                  $("#clubs").append(
                    $('<option value="' + v.Club_User.ROLE + ',' + v.CLUB_ID + '"> ' + "A\t" + v.CLUB_NAME + '</option>')
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
      var role1 = this.value;
      var role2 = role1.split(",");
      var role = role2.shift();
      var name = $('#clubs :selected').text();
      $("#clubName").text(name);

      if (role == "Select club") {
        $('#range').hide();
        $('#or').hide();
        $('#hideClick').hide();
        $('#memberApproval').hide();

      } else if (role == "PENDING-MEMBER") {
        $('#range').hide();
        $('#or').hide();
        $('#hideClick').hide();
        $('#memberApproval').hide();

      } else if (role == "ADMIN") {
        var val = this.value;
        var val1 = val.split(",");
        var id = val1.pop();
        $localStorage.id = id;
        $('#range').show();
        $('#or').show();
        $('#hideClick').show();
        $('#memberApproval').show();

      } else if (role == "MEMBER") {
        $('#range').hide();
        $('#or').hide();
        $('#hideClick').hide();
        $('#memberApproval').hide();
      }
    });
    $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        alert(imageData.text);
        //  console.log("format" + imageData.format);
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
    $scope.toggleChange=function(){
      console.log("hi");
    }
  })
.controller('AddResCtrl', function($scope, $state, $localStorage) {
    $('#memberApproval').hide();
    $('#home').show();

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
            // console.log("fail");
          }
        }
      });
    }
  })
.controller('MemberCtrl', function($scope, $state, $localStorage, $http) {
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
      $.each(data.clubUsers, function(k, v){
        if(v.Users.length>0){
          $('#noMember').hide();
        $.each(v.Users, function(k, v) {

          $scope.items.push({
            first: v.FIRST_NAME,
            last: v.LAST_NAME,
            id:v.USER_ID
          });
        });
      }
      else{
        $('#noMember').show();
      }
      });
    });

    $scope.add=function(id){
    $.ajax({
      type:'PUT',
      url:'https://estalaf-production.herokuapp.com/clubs/pendingUsers',
      headers: {
        'token': $localStorage.token
      },
      data:{'userId':id, 'clubId':$localStorage.id},
        success: function(data, status) {
          console.log("user added");
        }
      });
    };

    $scope.delete=function(id){
      $.ajax({
        type:'PUT',
        url:'https://estalaf-production.herokuapp.com/clubs/pendingUsers',
        headers: {
          'token': $localStorage.token
        },
        data:{'userId':id, 'clubId':$localStorage.id, 'disapprove':true},
          success: function(data, status) {
            console.log("user deleted");
          }
        });
      };
  });
