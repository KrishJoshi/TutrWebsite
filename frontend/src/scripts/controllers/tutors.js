'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:TutorsCtrl
 * @description
 * # TutorsCtrl
 * Controller of the tutrApp
 */
angular.module('tutrApp')
  .controller('TutorsCtrl', function ($scope, tutorService, subjectService, $routeParams) {
    // set available range
    $scope.minPrice = 1;
    $scope.maxPrice = 24;


    $scope.refineOptions = {};

    $scope.refineOptions.time = {min: 1, max: 24};

    $scope.showLoginNudge = false;

    var options = $scope.refineOptions;

    $scope.tutorClicked = function () {
      $scope.showLoginNudge = true;
    };

    var subjectFilter = function (tutor) {
      if (options.subject) {
        var subjectFound = false;
        var subjects = tutor.attributes.subjects;
        if (subjects) {
          for (var j = 0; j < subjects.length; j++) {
            var subject = subjects[j];
            if (subject.attributes.name === options.subject) {
              subjectFound = true;
              break;
            }
          }
        }
        return subjectFound;
      } else {
        return true;
      }
    };

    var distanceFilter = function (tutor) {
      if (options.distance) {
        var isLocationCloseBy = false;
        var userLocation = new Parse.GeoPoint({latitude: 0, longitude: 0});

        navigator.geolocation.getCurrentPosition(function (position) {
          userLocation = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
        });


        if (tutor.attributes.location) {
          if (userLocation.milesTo(tutor.attributes.location) <= options.distance) {
            isLocationCloseBy = true;
          }
        }
        return isLocationCloseBy;
      }
      else {
        return true;
      }
    };

    var timeFilter = function (tutor) {
      if (options.time.min !== 0 && options.time.max !== 24) {
        var withinTime = false;

        if (tutor.attributes.availability) {
          var timing = tutor.attributes.availability.split("-");
          timing.min = parseInt(timing[0]);
          timing.max = parseInt(timing[1]);

          if (timing.min >= options.time.min && timing.max <= options.time.max) {
            withinTime = true;
          }
        }
        return withinTime;
      } else {
        return true;
      }
    };

    var rateFilter = function (tutor) {
      if (options.rate) {
        var isRateLower = false;
        if (tutor.attributes.hourlyRate <= options.rate) {
          isRateLower = true;
        }
        return isRateLower;
      } else {
        return true;
      }
    };

    var filter = function (tutor) {
      var passesAllTests = false;
      if (subjectFilter(tutor) && distanceFilter(tutor) && timeFilter(tutor) && rateFilter(tutor)) {
        passesAllTests = true;
      }
      return passesAllTests;
    };

    $scope.refine = function () {
      var newTutors = [];
      tutorService.getAllTutors().then(function (tutors) {
        for (var i = 0; i < tutors.length; i++) {
          var tutor = tutors[i];
          if (filter(tutor)) {
            newTutors.push(tutor);
          }
        }
        $scope.tutors = newTutors;
      });
    };



    subjectService.getAllSubjects().then(function (result) {
      $scope.subjects = result;
    });

    if($routeParams.subject) {
      $scope.refineOptions.subject = $routeParams.subject;
      $scope.refine();
    } else {
    tutorService.getAllTutors().then(function (tutors) {
      $scope.tutors = tutors;
    });
  }

  });
