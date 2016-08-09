'use strict';

/**
* @ngdoc function
* @name tutrApp.controller:MessagesCtrl
* @description
* # MessagesCtrl
* Controller of the tutrApp
*/
angular.module('tutrApp')
  .controller('MessagesCtrl', function ($scope, messageService) {
      $scope.messageDialogs =  messageService.dialogs;

  });
