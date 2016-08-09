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
    'parse-angular',
    'parse-angular.enhance',
    'FacebookPatch' /* our facebook angular wrapper so we can use FB.apiAngular instead of FB.api */,
    'ui.bootstrap',
    'angular-cache',
    'ui-rangeSlider',
    'ngProgress',
    'angular-growl',
    'ngTagsInput',
  'irontec.simpleChat',
  'angularMoment'])
  .config(function ($routeProvider, CacheFactoryProvider, growlProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/tutors/', {
        templateUrl: 'views/tutors.html',
        controller: 'TutorsCtrl',
        controllerAs: 'tutors'
      })
      .when('/tutors/:subject', {
        templateUrl: 'views/tutors.html',
        controller: 'TutorsCtrl',
        controllerAs: 'tutors'
      })
      .when('/tutor/:tutorId', {
        templateUrl: 'views/tutor.html',
        controller: 'TutorCtrl',
        controllerAs: 'tutor'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/messages', {
        templateUrl: 'views/messages.html',
        controller: 'MessagesCtrl',
        controllerAs: 'messages'
      })
      .when('/messages/:dialogId', {
        templateUrl: 'views/dialog.html',
        controller: 'DialogCtrl',
        controllerAs: 'dialog'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .otherwise({
        redirectTo: '/'
      });
    angular.extend(CacheFactoryProvider.defaults, {maxAge: 24 * 60 * 60 * 1000});

    growlProvider.globalTimeToLive({success: 3000, error: 3000, warning: 3000, info: 4000});
    growlProvider.globalDisableCountDown(true);
  })
  .run(function ($rootScope, messageService, UserService) {
    // Parse Setup
    Parse.initialize("moFYNNMeQQJGz74zgDsbaaLtQfNM4hPgMLdYz54M", "0I3OWlWDuZV5udNdosU6xWNBnbJamgyOPApQDK77");
    $rootScope.currentUser = Parse.User.current();

    // FACEBOOK init
    window.fbPromise.then(function () {
      Parse.FacebookUtils.init({
        // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
        appId: 849475151774251, // Facebook App ID
        cookie: true, // enable cookies to allow Parse to access the session
        xfbml: true, // parse XFBML
        frictionlessRequests: true // recommended
      });
    });

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
      UserService.getRoleByUser($rootScope.currentUser).then(function (userTypeForServer) {
        $rootScope.currentUserType = userTypeForServer.attributes.name;
      });
    };

    if ($rootScope.currentUser) {
      $rootScope.loginToChat();
    }


    // Global log out function
    $rootScope.logOut = function () {
      Parse.User.logOut();
      $rootScope.currentUser = null;
      messageService.logoutFromChat();
    };

  });
