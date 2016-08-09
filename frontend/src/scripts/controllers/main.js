'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tutrApp
 */
angular.module('tutrApp')
  .controller('MainCtrl', function ($scope, $rootScope, subjectService, $location) {

    $scope.goTo = function () {
      $location.path('/tutors/'+ $scope.subjectSelected);
    };



    subjectService.getAllSubjects().then(function(result){
        $scope.subjects = result;
	    });

    $scope.isStudent = function () {
      $rootScope.currentUserType = $rootScope.userType.Student;
    };

    $scope.isTutor = function () {
      $rootScope.currentUserType = $rootScope.userType.Tutor;
    };
  });
