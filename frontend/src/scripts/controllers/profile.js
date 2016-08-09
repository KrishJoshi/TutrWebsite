'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the tutrApp
 */


// TODO: Add saved message
angular.module('tutrApp')
  .controller('ProfileCtrl', function ($scope, $q, $rootScope, UserService, subjectService, growl) {

    var currentUser = $rootScope.currentUser;
    var userBackup = angular.copy($rootScope.currentUser);
    var subjectsBackup = currentUser.attributes.subjects || [];
    var typeBackup;

    $scope.userSubjects = [];

    // Start and End time
    if(typeof($rootScope.currentUser.attributes.availability) === "string") {
      $rootScope.currentUser.attributes.availability = {startTime:"", endTime:""};
    }

    // Get subject list for auto suggest
    $scope.subjects = [];
    subjectService.getAllSubjects().then(function (result) {
      for (var i = 0; i < result.length; i++) {
        var subject = result[i];
        $scope.subjects.push(subject.attributes.name);
      }
    });

    var getSubject = function (subjectId) {
      subjectService.getSubjectById(subjectId).then(function (subject) {
        var subjectText = {text: subject.attributes.name};
        $scope.userSubjects.push(subjectText);
      });
    };

    // Parse user's subjects
    for (var i = 0; i < subjectsBackup.length; i++) {
      var subject = subjectsBackup[i];
      getSubject(subject.id);
    }


    // Get user type
    UserService.getRoleByUser(currentUser).then(function (userTypeForServer) {
      typeBackup = userTypeForServer.attributes.name;
      $scope.currentUserType = userTypeForServer.attributes.name;
    }, function (error) {
      console.log(error);
    });

    // For image generation
    function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 || 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); // jshint ignore:line
      });
      return uuid;
    }

    var addNewImage = function () {
      var deferred = $q.defer();
      if ($scope.newImage) {
        var fileType = $scope.newImage.file.type.split("/")[1];
        var file = new Parse.File(generateUUID() + "." + fileType, {base64: $scope.newImage.dataURL});
        file.save().then(function (image) {
          $rootScope.currentUser.attributes.picture = image;
          deferred.resolve();
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };

    $scope.addLocation = function () {
      console.log("run");
      var deferred = $q.defer();
      if ($rootScope.currentUser.attributes.postCode !== userBackup.attributes.postCode) {
        var locationApi = "http://maps.googleapis.com/maps/api/geocode/json?address={{postCode}},+UK&sensor=false";
        $.get(locationApi.replace("{{postCode}}", $rootScope.currentUser.attributes.postCode), function (returnData) {
          if (returnData.status === 'OK') {

            var loc = returnData.results[0].geometry.location;
            console.log(loc);
            $rootScope.currentUser.attributes.location = new Parse.GeoPoint({latitude: loc.lat, longitude: loc.lng});
            deferred.resolve();
          } else {
            deferred.resolve();
          }
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };
    // TODO: if error then show a error

    var changeUserType = function () {
      var deferred = $q.defer();
      if (typeBackup !== $scope.currentUserType) {
        UserService.changeUserRole($rootScope.currentUser, $scope.currentUserType);
        deferred.resolve();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };

    var addNewSubjects = function () {
      var deferred = $q.defer();
      if (subjectsBackup !== $scope.userSubjects) {
        var subjects = [];
        for (var i = 0; i < $scope.userSubjects.length; i++) {
          var subject = $scope.userSubjects[i];
          subjects.push(subject.text);
        }
        subjectService.addSubjectToUser($rootScope.currentUser, subjects).then(function () {
          deferred.resolve();
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };

    // Saving function
    $scope.save = function () {
      currentUser = $rootScope.currentUser;
      var savePromises = [];

      // Image
      savePromises.push(addNewImage());

      // Location
      savePromises.push(locationAddition());

      // User Type
      savePromises.push(changeUserType());


      // Subjects
      savePromises.push(addNewSubjects());


      // Lets save
      $q.all(savePromises).then(function () {
        Parse.User.current().set($rootScope.currentUser).save(null, {
          success: function (returnData) {
            console.log(returnData);
            growl.success("User changes saved successfully!");
          }, error: function (error) {
            growl.error(error);
          }
        });
      });

    };

    $scope.cancel = function () {

      $rootScope.currentUser = userBackup;
      $scope.newImage = null;
      growl.info("User changes were discarded");
    };
  });
