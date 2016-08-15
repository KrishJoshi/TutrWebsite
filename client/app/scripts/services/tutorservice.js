'use strict';

/**
 * @ngdoc service
 * @name tutrApp.tutorService
 * @description
 * # tutorService
 * Factory in the tutrApp.
 */
angular.module('tutrApp')
  .factory('tutorService', function ($q, CacheFactory, UserService) {
    // Service logic
    var tutorCacheId = 'tutorCache';

    if (!CacheFactory.get(tutorCacheId)) {
      // or CacheFactory('bookCache', { ... });
      CacheFactory.createCache(tutorCacheId, {
        maxAge: 60 * 60 * 1000, // 1 hour
        deleteOnExpire: 'aggressive'
      });
    }

    var tutorCache = CacheFactory.get(tutorCacheId);

    var tutorsNearMe = [];




    var getAllTutors = function () {
      var deferred = $q.defer();

      if (tutorCache.info().size === 0) {
        UserService.getUsersByRole("Tutor").then(function (tutorsFromServer) {
          tutorCache.put(tutorCacheId, tutorsFromServer);
          deferred.resolve(tutorsFromServer);
        });

        //var query = new Parse.Query(Parse.User);
        //query.include("subjects");
        //query.find().then(function (tutorsFromServer) {
        //  tutorCache.put(tutorCacheId, tutorsFromServer);
        //
        //  deferred.resolve(tutorsFromServer);
        //});
      } else {
        deferred.resolve(tutorCache.get(tutorCacheId));
      }

      return deferred.promise;
    };

    var getTutorsNearBy = function (currentLocaton) {
      var deferred = $q.defer();

      if (tutorsNearMe.length === 0) {
        var query = new Parse.Query(Parse.User);
        query.include("subjects");
        query.near("location", currentLocaton);
        query.find().then(function (tutors) {
          tutorsNearMe = tutors;
          deferred.resolve(tutors);
          return tutors;
        });
      } else {
        deferred.resolve(tutorsNearMe);
      }
      return deferred.promise;
    };

    var getTutorById = function (tutorId) {
      var tutors = tutorCache.get(tutorCacheId);

      for (var i = 0; i < tutors.length; i++) {
        var tutor = tutors[i];
        if (tutor.id === tutorId) {
          return tutor;
        }
      }
    };

    var getTutorByPointer = function (pointer) {
      var deferred = $q.defer();

      var tutors = tutorCache.get(tutorCacheId);


      if (tutors) {
        deferred.resolve(tutors[pointer]);
      }
      else {
        getAllTutors().then(function () {
          tutors = tutorCache.get(tutorCacheId);
          deferred.resolve(tutors[pointer]);
        });
      }

      return deferred.promise;
    };

    // Public API here
    return {
      getAllTutors: getAllTutors,
      getTutorsNearBy: getTutorsNearBy,
      getTutorById: getTutorById,
      getTutorByPointer: getTutorByPointer
    };
  });
