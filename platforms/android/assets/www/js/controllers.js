angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
// This is login controller
.controller('LoginCtrl', function($scope, $cordovaToast, $state, $localStorage) {
    // This is to check for internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    // This is the function for login.
    // Here we are sending the email and password to the server
    // if the callback is successful he can login or else it will show the error messsage
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
  // This is register controller
  .controller('RegisterCtrl', function($scope, $location, $cordovaToast, $state, $localStorage) {
    // This function is to move to login page on click of login button
    $scope.loginPage = function(path) {
      $location.path(path);
    };
    // This function is for registration
    // Here we are sending the personal details to the server
    // if the callback is successful he can register or else it will show the error messsage
    $scope.regSubmit = function() {
      // This is to check whether the first alphabet of the first name is capitol,
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
          if (data.success == true) {
            $state.go('login');
          }
        }
      });
    };
  })
  // This is Join club controller
  .controller('JoinCtrl', function($scope, $state, $cordovaToast, $localStorage) {
    // This is to check the internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    // This function is to move to createClub page on click of create button
    $scope.join = function() {
      $state.go('create');
    };
    // This function is for joining the clubs
    // Here we are sending the club code to the server
    // if the callback is successful he can register or else it will show the error messsage
    $scope.joinClub = function() {
      $.ajax({
        type: 'POST',
        url: 'https://estalaf-production.herokuapp.com/clubs/users',
        data: {
          'clubCode': $scope.clubCode,
          'token': $localStorage.token
        },
        success: function(data, status) {
          if (data.success == true) {
            $cordovaToast.show('successfully Joined the club', 'short', 'bottom');
            $state.go('home');
          } else if (data.success == false) {
            $cordovaToast.show('Invalid club code', 'long', 'bottom');
          }
        }
      });
    }
  })
  // This is create club controller
  .controller('CreateCtrl', function($scope, $cordovaToast, $state, $localStorage) {
    // This is to check the internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').hide();
    // This function is to create the club
    // Here we are sending the club name, description and token to the server
    // if the callback is successful he can create the club or else it will show the error messsage
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
          console.log(data);
          if (data.success == true) {
            $cordovaToast.show('club created', 'long', 'bottom');
            $state.go('home');
          } else if (data.success == false) {
            $cordovaToast.show('Invalid club Name', 'long', 'bottom');
          }
        }
      });
    };
  })
  // This is the home controller
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
    // This is to check the internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
      // This function is to move to manual entry of resource page on click of manual entry button
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
                $localStorage.clubId = v.CLUB_ID;
                $('#clubName').html(name);

                if (v.Club_User.ROLE == "ADMIN") {
                  $localStorage.id = v.CLUB_ID;
                  document.getElementById('displayName').value = name;
                  $("#showAdminIcon").show();
                  $("#displayName").css('color', '#9900ff');
                  $('#memberApproval').show();
                  $('#search').show();
                } else if (v.Club_User.ROLE == "PENDING-MEMBER") {
                  document.getElementById('displayName').value = name;
                  $("#showAdminIcon").hide();
                  $("#displayName").css('color', '#A9A9A9');
                  $('#memberApproval').hide();
                  $('#search').hide();
                } else if (v.Club_User.ROLE == "MEMBER") {
                  document.getElementById('displayName').value = name;
                  $("#showAdminIcon").hide();
                  $("#displayName").css('color', 'black');
                  $('#search').show();
                }
              });
            } else if (v.Clubs.length > 1) {
              $("#showIcon").hide();
              $('#clubsDropDown').show();
              $('#clubTextfield').hide();
              $("#clubs").css('color', 'black');
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
      var clubid = role2.pop();
      $localStorage.clubId = clubid;
      var role = role2.shift();
      var name = $('#clubs :selected').text();
      $("#clubName").text(name);
      $("#clubs").css('color', 'black');

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
        $("#clubs").css('color', '#A9A9A9');

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
        $("#clubs").css('color', '#9900ff');


      } else if (role == "MEMBER") {
        $('#showIcon').hide();
        $('#range').hide();
        $('#or').hide();
        $('#hideClick').hide();
        $('#memberApproval').hide();
        $('#search').show();
        $("#clubs").css('color', 'black');
      }
    });
    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
      //This function is for barcode scanning
      // Here we scan the bar code and send it to the template for adding the details
      $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        var n = imageData.text;
        if (n == "") {
          alert("Please Scan again");
        } else {
          if ($scope.toggle) {
            $.ajax({
              type: 'POST',
              url: 'https://estalaf-production.herokuapp.com/resources/users',
              headers: {
                'token': $localStorage.token
              },
              data: {
                'clubId': $localStorage.clubId,
                'resourceCode': n
              },
              success: function(data, status) {
                alert(data.message);
                alert(status);
                if (data.success == true) {
                  alert(data);
                } else {
                  alert("error");
                }
              }
            });
          } else {
            $localStorage.scan = n;
            $state.go('scanResource');
          }
        }
      }, function(error) {});
    };
    $scope.addResource = function() {
      $state.go('addResource');
    };
  })
  // This is the add resource controller
  .controller('AddResCtrl', function($scope, $state, $localStorage, $cordovaToast) {
    // This is to check the internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').show();
    // This is number picker
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
    //This function is for adding the resources manually
    //Here we are sending the resource code, name, description, clubId, quantity and token to the server
    // if the callback is successful resource is added or else it will show the error messsage
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
          console.log(data);
          if (data.success == true) {
            console.log(data);
            // $cordovaToast.show('Resources Added', 'short', 'bottom');
            $state.go('home');
          } else if (data.success == false) {
            $cordovaToast.show('Error Adding Resources ', 'long', 'bottom');
          }
        }
      });
    }
  })
  // This is adding the resource through scanning ccontroller
  .controller('ScanResCtrl', function($scope, $state, $localStorage, $cordovaToast) {
    // This is to check the internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').show();
    // This is to get the scanned bar code
    $scope.resourceCode = $localStorage.scan;
    // This is for number picker
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
       //This function is for adding the resources through scanning
      //Here we are sending the resource code, name, description, clubId, quantity and token to the server
      // if the callback is successful resource is added or else it will show the error messsage
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
            $cordovaToast.show('Resources Added', 'short', 'bottom');
            $state.go('home');
          } else if (!data.success) {
            $cordovaToast.show('Error Adding Resources', 'long', 'bottom');
          }
        }
      });
    }
  })
  // This is search Resource controller
  .controller('SearchResCtrl', function($scope, $state, $localStorage, $http, $ionicHistory,$cordovaToast) {
    // This is to check the internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }

    $('#search').hide();
    $('#home').show();
    $('#create').show();
    // This is to display the resources if it is present
    // Here we are sending the club id and token to the server
    // if the callback is successful list of resources will be seen or else it will show the error messsage
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
          $scope.noMember;
          $scope.items.push({
            name: v.RESOURCE_NAME,
            id: v.RESOURCE_ID,
            description: v.RESOURCE_DESCRIPTION,
            borrowValue: v.RESOURCE_QUANTITY - v.RESOURCE_BORROWEDQUANTITY
          });
        } else {
          $('#noMember').show();
        }
      });
    });

    // This function is to move to the view page where we can see the details of that resource
    $scope.reserve = function(id) {
      $localStorage.selectedResource = id;
      $state.go('view');
    }
  })
  // This is member controller
  .controller('MemberCtrl', function($scope, $state, $localStorage, $http,$cordovaToast) {
    // This is to check the internet connection
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $cordovaToast.show('No Internet Connection', 'long', 'bottom');
      }
    }
    $('#memberApproval').hide();
    $('#home').show();
    $('#create').show();

    // This is to display the list of membership requests
    // Here we are sending the club id and token to the server
    // if the callback is successful list of pending member  will be seen or else it will show the error messsage
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
    // This function is to approve the pending member
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
          $cordovaToast.show('User Approved', 'long', 'bottom');
        }
      });
    };
  //  This function is to disapprove the pending members
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
          $cordovaToast.show('User Rejected', 'long', 'bottom');
        }
      });
    };
  })
  // This controller is to sign out
  .controller('SignOutCtrl', function($scope, $state, $localStorage, $ionicHistory, $window) {
    $window.localStorage.clear();
    $ionicHistory.clearHistory();
    $state.go('login');
  })
  // This is update profile controller
  .controller('UpdateCtrl', function($scope, $state, $localStorage,$cordovaToast) {
    $('#home').show();
    // This function is for updating the personal profile
    // Here we are sending the personal details to the server
    // if the callback is successful data is updated or else it will show the error messsage
    $scope.updateSubmit = function() {
      $.ajax({
        type: 'PUT',
        url: 'https://estalaf-production.herokuapp.com/users',
        headers: {
          'token': $localStorage.token
        },
        data: {
          'firstName': $scope.firstName,
          'lastName': $scope.lastName,
          'password': $scope.password
        },
        success: function(data, status) {
          if (data.success == true) {
            $cordovaToast.show('successfully Updated', 'long', 'bottom');
            $state.go('login');
          }
        }
      });
    }
  })
  // This is view resource controller
  .controller('viewCtrl', function($scope, $state, $localStorage) {
    var obj = $localStorage.selectedResource;
    $scope.resCode = obj.id;
    $scope.borrowStatus = obj.borrowValue;
    $scope.resName = obj.name;
    $scope.resDescription = obj.description;
    // This function is for updating the personal profile
    // Here we are sending the personal details to the server
    // if the callback is successful data is updated or else it will show the error messsage
    $scope.viewResource = function() {
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
          } else {
            alert("error");
          }
        }
      });
    }
  });
