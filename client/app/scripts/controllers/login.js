'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the tutrApp
 */
angular.module('tutrApp')
  .controller('LoginCtrl', function($scope, $rootScope, messageService, UserService, $window, $location, Facebook) {
   
    $scope.performLogin =  function(form){
    
        UserService.signIn(form.email, form.password)
        .then(function(data){
        	// success case
				$rootScope.currentUser = UserService.authPromise;
				$rootScope.$apply();
				$rootScope.loginToChat();
				$window.location.href = '/#/profile';
         
        },function(data){
        	// error case
        	$scope.errorMessage = "Unable to log in: " + data;
        	        });
    
    };

    $scope.fbLogin = function() {
      $scope.successMessage = null;
      $scope.errorMessage = null;

      //Parse.FacebookUtils.logIn(null, loginHandler);
    };
    $scope.login_fb = function(){
           Facebook.login().then(function(response){
               //we come here only if JS sdk login was successful so lets 
               //make a request to our new view. I use Restangular, one can
               //use regular http request as well.
               
               var code = 'Facebook';
               var access_token = response.authResponse.accessToken;
              UserService.facebook(access_token, code)
        .then(function(data){
        	// success case
        	console.log(data);
				$rootScope.currentUser = UserService.authPromise;
				$rootScope.$apply();
				$rootScope.loginToChat();
				$window.location.href = '/#/profile';
         
        },function(data){
        	// error case
        	$scope.errorMessage = "Unable to log in: " + data;
        	        });  
           });
        }
           
    $scope.resetPassword = function(form) {
      $scope.successMessage = null;
      $scope.errorMessage = null;

     /* Parse.User.requestPasswordReset(form.email, {
        success: function() {
          $scope.successMessage = "A password reset link has been sent to your email address";
        },
        error: function(error) {
          $scope.errorMessage = "Could not reset password: " + error.message;
        }
      });*/
    };
  });
