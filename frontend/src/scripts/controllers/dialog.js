'use strict';

/**
 * @ngdoc function
 * @name tutrApp.controller:DialogCtrl
 * @description
 * # DialogCtrl
 * Controller of the tutrApp
 */
angular.module('tutrApp')
  .controller('DialogCtrl', function ($scope, messageService, $routeParams, $rootScope) {

    var setProperties = function () {
      $scope.dialog = messageService.getDialog($routeParams.dialogId);
      $scope.dialogId = $routeParams.dialogId;
      $scope.messages = messageService.messages[$routeParams.dialogId];
      $scope.currentLoggedInUserId = $rootScope.blockUser.user_id;
      setTimeout(function () {
        $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight}, 1000);
      },1000);

    };

    if(messageService.messages[$routeParams.dialogId]) {
      setProperties();
    } else {
      if($rootScope.blockUser) {
        messageService.retrieveChatMessages($routeParams.dialogId).then(function () {
          setProperties();
        });
      } else {
        $scope.$on("userSet", function () {
          messageService.retrieveChatMessages($routeParams.dialogId).then(function () {
            setProperties();
          });
        });
      }
    }

    $rootScope.$on('newMessage', function () {
      if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
        $scope.$apply();
      }

      var messageDiv = $(".messages");
      if ((messageDiv[0].scrollHeight - messageDiv.scrollTop()) <= messageDiv.outerHeight() + 1000) {
        messageDiv.animate({ scrollTop: $(".messages")[0].scrollHeight}, 1000);
      }
    });


    $scope.sendMessage = function() {
      var message = $scope.newMessage;
      if(message && message !== '') {
        messageService.sendMessageToUser($scope.dialog, message);
      }
      $scope.newMessage = '';
    };
  });
