'use strict';

/**
 * @ngdoc service
 * @name tutrApp.messageService
 * @description
 * # messageService
 * Factory in the tutrApp.
 */
angular.module('tutrApp')
  .factory('messageService', function ($q, $rootScope) {
    var listOfUsers = [];
    var dialogs = {};
    var currentLoggedInUserId = [];
    var messages = [];
    var contacts = [];

    var createQblox = function () {
      var config = {
        chatProtocol: {
          active: 2
        },
        debug: false
      };
      QB.init(26337, 'MkgE4ke6EsCGSsu', '5emhh3z5nwytLDR', config);
    };

    var getUsers = function () {
      QB.users.listUsers({}, function (err, users) {
        if (users) {
          for (var i = 0; i < users.items.length; i++) {
            var user = users.items[i].user;
            listOfUsers.push(user);
          }
        } else {
          // error
        }
      });
    };

    var userLoggedInCallback = function (user, parseUser, deferred) {
      currentLoggedInUserId = user.user_id;
      getUsers();
      QB.chat.connect({userId: currentLoggedInUserId, password: parseUser.id}, function (err, roster) {
        if (!err) {
          contacts = roster;
        }
      });
      QB.chat.onMessageListener = onMessage;
      getDialogslist().then(function () {
        deferred.resolve(user);
      });
    };

    var signUpUser = function (parseUser, deferred) {
      QB.createSession(function (err, result) {
        if (result) {
          var params = {
            email: parseUser.attributes.username,
            password: parseUser.id,
            full_name: parseUser.attributes.firstName
          };
          QB.users.create(params, function (err, result) {
            if (result) {
              QB.login(params, function (err, result) {
                userLoggedInCallback(result, parseUser, deferred);
              });
            }
          });
        }
      });
    };

    var loginToChat = function (parseUser) {
      var deferred = $q.defer();

      QB.createSession({email: parseUser.attributes.username, password: parseUser.id}, function (err, res) {
        if (res) {
          userLoggedInCallback(res, parseUser, deferred);
        } else {
          signUpUser(parseUser, deferred);
        }
      });
      return deferred.promise;
    };

    var logoutFromChat = function () {
      QB.chat.disconnect();
    };

    var findBloxUser = function (email) {
      for (var i = 0; i < listOfUsers.length; i++) {
        var user = listOfUsers[i];
        if (user.email.toLowerCase() === email.toLowerCase()) {
          return user;
        }
      }
    };


    var retrieveChatMessages = function (dialogId) {
      var deferred = $q.defer();
      // Load messages history
      //
      var params = {chat_dialog_id: dialogId, sort_asc: 'date_sent', limit: 100, skip: 0};
      QB.chat.message.list(params, function (err, msgs) {
        messages[dialogId] = msgs;
        deferred.resolve(messages[dialogId]);
      });
      return deferred.promise;
    };

    var getDialog = function (dialogId) {
      function find() {
        var foundDialog = false;
        for (var i = 0; i < dialogs.items.length; i++) {
          var dialog = dialogs.items[i];
          if (dialog._id === dialogId) {
            foundDialog = dialog;
            break;
          }
        }
        return foundDialog;
      }

      var d = find();
      if (d) {
        return d;
      } else {
        getDialogslist().then(function () {
          return find(dialogId);
        });
      }

    };

    var getDialogslist = function () {
      var deferred = $q.defer();
      var filters = null;
      QB.chat.dialog.list(filters, function (err, resDialogs) {
        if (err) {
        } else {
          angular.copy(resDialogs, dialogs);
          deferred.resolve(dialogs);
        }
      });

      return deferred.promise;
    };

    var createNewDialog = function (withUser) {
      var user = findBloxUser(withUser.attributes.username);
      console.log("User Found:");
      console.log(user);
      var params = {
        type: 3,
        occupants_ids: user.id
      };
      QB.chat.dialog.create(params, function (err, createdDialog) {
        if (err) {
          console.log(err);
        } else {
          getDialogslist();
          console.log(createdDialog);
        }
      });
    };

    var sendMessageToUser = function (dialog, message) {
      var msg = {
        type: 'chat',
        body: message,
        extension: {
          save_to_history: 1
        },
        senderId: currentLoggedInUserId
      };
      var opponentId = QB.chat.helpers.getRecipientId(dialog.occupants_ids, currentLoggedInUserId);

      QB.chat.send(opponentId, msg);

      var messageObj = {
        sender_id: currentLoggedInUserId,
        recipient_id: opponentId,
        message: msg.body,
        created_at: Date.now()
      };
      messages[dialog._id].items.push(messageObj);
      $rootScope.$broadcast('newMessage');
    };


    function onMessage(userId, msg) {
      console.log(msg);

      var message = {
        sender_id: userId,
        recipient_id: currentLoggedInUserId,
        message: msg.body,
        created_at: Date.now()
      };

      var dialog_id = msg.dialog_id;

      if (messages[dialog_id]) {
        messages[dialog_id].items.push(message);
      }
      else {
        messages[dialog_id] = {items: []};
        messages[dialog_id].items.push(message);
      }

      if (messages[dialog_id].unread_messages_count) {
        messages[dialog_id].unread_messages_count++;
      }
      else {
        messages[dialog_id].unread_messages_count = 1;
      }

      $rootScope.$broadcast('newMessage');
    }


    // Public API here
    return {
      createQblox: createQblox,
      loginToChat: loginToChat,
      logoutFromChat: logoutFromChat,
      createNewDialog: createNewDialog,
      getDialogslist: getDialogslist,
      getDialog: getDialog,
      dialogs: dialogs,
      sendMessageToUser: sendMessageToUser,
      listOfUsers: listOfUsers,
      retrieveChatMessages: retrieveChatMessages,
      messages: messages,
      currentLoggedInUserId: currentLoggedInUserId
    };
  }
);
