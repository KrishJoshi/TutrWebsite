'use strict';

/**
 * @ngdoc service
 * @name tutrApp.UserService
 * @description
 * # UserService
 * Factory in the tutrApp.
 */
angular.module('tutrApp')
  .factory('UserService', function ($rootScope, messageService, $q) {
    var register = function (form) {
      var deferred = $q.defer();
      var user = new Parse.User();

      user.setEmail(form.email);
      user.setUsername(form.email);
      user.setPassword(form.password);
      user.set("firstName", form.firstName);
      user.set("lastName", form.lastName);


      user.signUp(null, {
        success: function (user) {
          messageService.loginToChat(user);
          $rootScope.currentUser = user;
          $rootScope.$apply();
          addRoleToUser(user, $rootScope.currentUserType);
          deferred.resolve(user);
        },
        error: function (error) {
          deferred.reject(error);
        }
      });
      return deferred.promise;
    };




    var signIn = function (form) {
      var deferred = $q.defer();
      var loginHandler = {
        success: function(user) {
          $rootScope.currentUser = user;
          $rootScope.$apply();

          messageService.loginToChat(user);

          getRoleByUser(user).then(function (role) {
            $rootScope.currentUserType = role.attributes.name;
          });

          deferred.resolve(user);
        },
        error: function(user, error) {
          deferred.reject(error);
        }
      };


      Parse.User.logIn(form.email, form.password, loginHandler);

      return deferred.promise;
    };

    var addRoleToUser = function (user, newRole) {
      var deferred = $q.defer();

      $rootScope.currentUserType = newRole;

      var query = new Parse.Query(Parse.Role);
      query.equalTo("name", $rootScope.currentUserType);
      query.first({
        success: function (role) {
          console.log(role);

          role.getUsers().add(user);
          role.save();
          deferred.resolve(true);
        }, error: function (returnObj, error) {
          deferred.reject(false);
          console.log(error);
        }
      });


      return deferred.promise;
    };

    var changeUserRole = function (user, newRole) {
      var query = new Parse.Query(Parse.Role);
      query.find().then(function (returnData) {
        for (var i = 0; i < returnData.length; i++) {
          var role = returnData[i];
          role.getUsers().remove(user);
          role.save();
        }
        addRoleToUser(user, newRole);
      });
    };

    var getRoleByUser = function (user) {
      var deferred = $q.defer();
      var query = new Parse.Query(Parse.Role);
      query.equalTo("users", user);
      query.first().then(function (role) {
        if(role) {
          deferred.resolve(role);
        }
        else {
          deferred.reject(false);
        }
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var getUsersByRole = function (role) {
      var deferred = $q.defer();
      var query = new Parse.Query(Parse.Role);
      query.equalTo("name", role);

      query.first().then(function (role) {
        var query = role.relation('users').query();

        query.include("subjects");
        query.find().then(function (users) {
          deferred.resolve(users);
        }, function (error) {
          deferred.reject(error);
        });
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    // Public API here
    return {
      register: register,
      getUsersByRole: getUsersByRole,
      addRoleToUser: addRoleToUser,
      changeUserRole: changeUserRole,
      getRoleByUser: getRoleByUser,
      signIn: signIn
    };
  });
