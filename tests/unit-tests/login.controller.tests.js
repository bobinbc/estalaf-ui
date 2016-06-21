describe('Testing Login Controller', function() {
var _scope, LoginCtrl;
beforeEach(function() {
module('estalaf');
inject(function($rootScope, $controller) {
_scope = $rootScope.$new();
LoginCtrl = $controller('LoginCtrl', {
$scope: _scope
});
});
});
});


// describe('LoginCtrl', function() {
//
//     var controller,
//         userLogin,
//         stateMock,
//         ionicPopupMock;
//
//     // TODO: Load the App Module
//
    // TODO: Instantiate the Controller and Mocks
//
//     describe('#userLogin', function() {
//
//         // TODO: Call doLogin on the Controller
//
//         it('should call login on dinnerService', function() {
//             expect(dinnerServiceMock.login).toHaveBeenCalledWith('test1', 'password1');
//         });
//
//         describe('when the login is executed,', function() {
//             it('if successful, should change state to my-dinners', function() {
//
//                 // TODO: Mock the login response from DinnerService
//
//                 expect(stateMock.go).toHaveBeenCalledWith('my-dinners');
//             });
//
//             it('if unsuccessful, should show a popup', function() {
//
//                 // TODO: Mock the login response from DinnerService
//
//                 expect(ionicPopupMock.alert).toHaveBeenCalled();
//             });
//         });
//     })
// });
