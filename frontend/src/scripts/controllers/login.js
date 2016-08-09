'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the tutrApp
 */
angular.module('tutrApp')
  .controller('LoginCtrl', function($scope, $rootScope, messageService, UserService, $window) {
    var loginHandler = {
      success: function(user) {
        $rootScope.currentUser = user;
        $rootScope.$apply();

        $rootScope.loginToChat();

        $window.location.href = '/#/profile';
      },
      error: function(user, error) {
        $scope.errorMessage = "Unable to log in: " + error.message;
      }
    };

    $scope.performLogin = function(form) {
      $scope.successMessage = null;
      $scope.errorMessage = null;

      Parse.User.logIn(form.email, form.password, loginHandler);
    };

    $scope.fbLogin = function() {
      $scope.successMessage = null;
      $scope.errorMessage = null;

      Parse.FacebookUtils.logIn(null, loginHandler);
    };

    $scope.resetPassword = function(form) {
      $scope.successMessage = null;
      $scope.errorMessage = null;

      Parse.User.requestPasswordReset(form.email, {
        success: function() {
          $scope.successMessage = "A password reset link has been sent to your email address";
        },
        error: function(error) {
          $scope.errorMessage = "Could not reset password: " + error.message;
        }
      });
    };
  });
