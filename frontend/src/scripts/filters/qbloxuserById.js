'use strict';

/**
 * @ngdoc filter
 * @name tutrApp.filter:qbloxUser
 * @function
 * @description
 * # qbloxUser
 * Filter in the tutrApp.
 */
angular.module('tutrApp')
  .filter('qbloxUserById', function (messageService) {
    return function (input) {
       var users = messageService.listOfUsers;

      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if(user.id === input){
          return user.full_name;
        }
      }
    };
  });
