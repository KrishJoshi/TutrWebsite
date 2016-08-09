'use strict';

/**
 * @ngdoc service
 * @name tutrApp.subjectService
 * @description
 * # subjectService
 * Factory in the tutrApp.
 */
angular.module('tutrApp')
  .factory('subjectService', function ($q,CacheFactory) {
    // Service logic

    var subjectCacheId = 'subjectCache';

    if (!CacheFactory.get(subjectCacheId)) {
      // or CacheFactory('bookCache', { ... });
      CacheFactory.createCache(subjectCacheId, {
        deleteOnExpire: 'aggressive'
      });
    }

    var subjectCache = CacheFactory.get(subjectCacheId);

    var getAllSubjects = function () {
      var deferred = $q.defer();

      if (subjectCache.info().size === 0) {
        var query = new Parse.Query("Subjects");
        query.include("_Users");
        query.find().then(function (subjectsFromServer) {
          subjectCache.put(subjectCacheId, subjectsFromServer);
          deferred.resolve(subjectsFromServer);
        });
      } else {
        deferred.resolve(subjectCache.get(subjectCacheId));
      }

      return deferred.promise;
    };

    var getSubject = function (subjectName) {
      var deferred = $q.defer();

      getAllSubjects().then(function (allSubjects) {
        for (var i = 0; i < allSubjects.length; i++) {
          var subject = allSubjects[i];
          if(subject.attributes.name === subjectName) {
            deferred.resolve(subject);
            break;
          }
        }
        deferred.reject(false);
      });
      return deferred.promise;
    };

    var getSubjectById = function (subjectId) {
          var deferred = $q.defer();
      getAllSubjects().then(function (allSubjects) {
        for (var i = 0; i < allSubjects.length; i++) {
          var subject = allSubjects[i];
          if(subject.id === subjectId) {
            deferred.resolve(subject);
            break;
          }
        }
        deferred.reject();
      });
      return deferred.promise;
    };

    var addNewSubject = function (subjectName) {
      var deferred = $q.defer();

      var newSubject = new Parse.Object("Subjects");
      newSubject.set('name', subjectName);
      newSubject.save().then(function (subject) {
        deferred.resolve(subject);
      });
      return deferred.promise;
    };

    var addOrUpdateSubject = function (subjectName, user) {
      var deferred = $q.defer();

      getSubject(subjectName).then(function (subject) { // subject found
          user.attributes.subjects.push(subject);
        deferred.resolve(subject);
        }, function () {
          addNewSubject(subjectName).then(function (subject) { // subject not found
            user.attributes.subjects.push(subject);
            deferred.resolve(subject);
          });
        });
      return deferred.promise;
    };

    var addSubjectToUser = function (user, subjectList) {
      var deferred = $q.defer();
      user.attributes.subjects = [];

      var subjectPromises = [];

      for (var i = 0; i < subjectList.length; i++) { // for each subject
        var subjectName = subjectList[i];
        var promise = addOrUpdateSubject(subjectName, user);
        subjectPromises.push(promise);
      }

      $q.all(subjectPromises).then(function(){
        deferred.resolve();
      });

      return deferred.promise;
    };


// Public API here
    return {
      getAllSubjects: getAllSubjects,
      addSubjectToUser: addSubjectToUser,
      getSubjectById:getSubjectById
    };
  });
