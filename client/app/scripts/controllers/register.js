'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the tutrApp
 */
angular.module('tutrApp')
  .controller('RegisterCtrl', function ($scope, $rootScope, UserService) {
    //$scope.selectedUserType = "Student";
    $scope.performRegister = function(form) {
      $scope.successMessage = null;
      $scope.errorMessage = null;

      if(!$rootScope.currentUserType) {
        if (!$scope.selectedUserType) {
          $scope.errorMessage = "Please select if you're a Student or Tutor";
          form.userType.$error.required = true;
        } else {
          $rootScope.currentUserType = $scope.selectedUserType;
        }
      }

      var promise = UserService.register(form.email, form.password, form.firstName, form.lastName, $rootScope.currentUserType)
        .then(function(data){
        	// success case
        	 $scope.successMessage = "Thank you " + form.firstName + ", you have been successfully registered";
        	$scope.complete = true;
          messageService.loginToChat(user);
          $rootScope.currentUser = user;
          $rootScope.$apply();
        },function(data){
        	// error case
        $scope.errorMessage = "Unable to register: " + data;
        });
   


    };
  });
