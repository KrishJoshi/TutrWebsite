'use strict';

/**
 * @ngdoc overview
 * @name tutrApp
 * @description
 * # tutrApp
 *
 * Main module of the application.
 */
angular
  .module('tutrApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    //'parse-angular',
    //'parse-angular.enhance',
    //'FacebookPatch' /* our facebook angular wrapper so we can use FB.apiAngular instead of FB.api */,
    'ui.bootstrap',
    'angular-cache',
    'ui-rangeSlider',
    'ngProgress',
    'angular-growl',
    'ngTagsInput',
  'irontec.simpleChat',
  'angularMoment',
  'ngImgur'])
  .config(function ($routeProvider, CacheFactoryProvider, growlProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/static/views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/about', {
        templateUrl: '/static/views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/tutors/', {
        templateUrl: '/static/views/tutors.html',
        controller: 'TutorsCtrl',
        controllerAs: 'tutors',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/tutors/:subject', {
        templateUrl: '/static/views/tutors.html',
        controller: 'TutorsCtrl',
        controllerAs: 'tutors',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/tutor/:tutorId', {
        templateUrl: '/static/views/tutor.html',
        controller: 'TutorCtrl',
        controllerAs: 'tutor',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/login', {
        templateUrl: '/static/views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/register', {
        templateUrl: '/static/views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/messages', {
        templateUrl: '/static/views/messages.html',
        controller: 'MessagesCtrl',
        controllerAs: 'messages',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/messages/:dialogId', {
        templateUrl: '/static/views/dialog.html',
        controller: 'DialogCtrl',
        controllerAs: 'dialog',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .when('/profile', {
        templateUrl: '/static/views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile',
         resolve: {
          authenticated: ['UserService', function(UserService){
            return UserService.authenticationStatus();
          }],
        }
      })
      .otherwise({
        redirectTo: '/'
      });
    angular.extend(CacheFactoryProvider.defaults, {maxAge: 24 * 60 * 60 * 1000});

    growlProvider.globalTimeToLive({success: 3000, error: 3000, warning: 3000, info: 4000});
   // growlProvider.globalDisableCountDown(true);
  })
  .run(function ($rootScope, messageService, UserService, $http) {
    // Parse Setup
   // Parse.initialize("moFYNNMeQQJGz74zgDsbaaLtQfNM4hPgMLdYz54M", "0I3OWlWDuZV5udNdosU6xWNBnbJamgyOPApQDK77");
   UserService.initialize('http://178.62.41.63:8002/rest-auth', false);

//console.log( $http.defaults.headers.common['Authorization'])

    // FACEBOOK init
  /*  window.fbPromise.then(function () {
      Parse.FacebookUtils.init({
        // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
        appId: 849475151774251, // Facebook App ID
        cookie: true, // enable cookies to allow Parse to access the session
        xfbml: true, // parse XFBML
        frictionlessRequests: true // recommended
      });
    });*/

    $rootScope.userType = {
      Student: "Student",
      Tutor: "Tutor"
    };

    messageService.createQblox();

    $rootScope.loginToChat = function () {
      messageService.loginToChat($rootScope.currentUser).then(function (user) {
        $rootScope.$broadcast('userSet', user);
        $rootScope.blockUser = user;
        $rootScope.messageDialogs =  messageService.dialogs;
      });
       $rootScope.currentUserType = "Tutor"
     /* UserService.getRoleByUser($rootScope.currentUser).then(function (userTypeForServer) {
        $rootScope.currentUserType = userTypeForServer.attributes.name;
      });*/
    };

if ($http.defaults.headers.common['Authorization'] != undefined){
	$rootScope.currentUser = UserService.authPromise;
	 $rootScope.loginToChat();
}

console.log($rootScope.loginToChat)
    // Global log out function
    $rootScope.logOut = function () {
      UserService.logout();
      $rootScope.currentUser = null;
      messageService.logoutFromChat();
    };

  });
