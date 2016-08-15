'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:TutorCtrl
 * @description
 * # TutorCtrl
 * Controller of the tutrApp
 */
angular.module('tutrApp')
  .controller('TutorCtrl', function ($scope, $routeParams,tutorService, messageService) {
    tutorService.getTutorByPointer($routeParams.tutorId).then(function (tutor) {
      $scope.tutor = tutor;
    });
    $scope.connect = function () {
      console.log("Connecting with");
      console.log($scope.tutor);
      messageService.createNewDialog($scope.tutor);
    };
  });
