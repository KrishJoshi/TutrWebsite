'use strict';

/**
 * @ngdoc service
 * @name tutrApp.subjectService
 * @description
 * # subjectService
 * Factory in the tutrApp.
 */
angular.module('tutrApp')
  .factory('subjectService', function ($q,CacheFactory, $http, $rootScope) {
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
		 return $http.get("/api/subjects/")
        
    };

    var getSubject = function (subjectName) {
      return "here2";
    };

    var getSubjectById = function (subjectId) {
          
     	 return $http.get("/api/subjects/"+subjectId+'/');
    };

    var addNewSubject = function (subjectName) {
      
      return "here4";
    };

    var addOrUpdateSubject = function (subjectName, user) {
      
      return "here5";
    };

    var addSubjectToUser = function (user, subjectList) {
      
      return "here6";
    };


// Public API here
    return {
      getAllSubjects: getAllSubjects,
      addSubjectToUser: addSubjectToUser,
      getSubjectById:getSubjectById
    };
  });
