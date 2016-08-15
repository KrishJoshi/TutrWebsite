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

      var promise = UserService.register(form);
      promise.then(function () {
        $scope.successMessage = "Thank you " + form.firstName + ", you have been successfully registered";
      }, function (error) {
        $scope.errorMessage = "Unable to register: " + error.message;
      });

    };
  });
