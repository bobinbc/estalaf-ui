//angular.module('estalaf.controllers', ['ngStorage', 'ngCordova', 'ionic-numberpicker'])
//
//.controller('dropDownCtrl',function($scope,$state,$localStorage,$ionicSideMenuDelegate, $cordovaToast){
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
