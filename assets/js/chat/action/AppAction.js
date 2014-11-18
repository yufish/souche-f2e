// AppAction.js

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatlConstants = require('../constant/ChatConstants');

var AppAction = {
    // --------------- app ---------------
    // login, temp, just userId
    userLogin: function(userId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.USER_LOGIN,
            userId: userId
        });
    },
    appInit: function(users, threads, msgs){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.APP_INIT,
            users: users,
            threads: threads,
            msgs: msgs
        });
    },

    // --------------- thread ---------------
    changeThread: function(newId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.CHANGE_THREAD,
            newId: newId
        });
    },


    // --------------- msg ---------------
    createMsg: function(text, msgId, threadId, userId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.MSG_CREATE,
            msgObj: {
                id: msgId,
                text: text,
                user: userId,
                thread: threadId,
                time: Date.now()
            }
        })
    },
    // --------------- unread ---------------
    addUnread: function(threadId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.ADD_UNREAD,
            threadId: threadId
        });
    },
    clearUnread: function(threadId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.CLEAR_THREAD_UNREAD,
            threadId: threadId
        });
    },
    clearAllUnread: function(){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.CLEAR_ALL_UNREAD
        });
    },

    // 定时获取数据... 
    schedualUpdate: function(users, threads, msgs){
        ChatDispatcher.handleServerAction({
            actionType: ChatlConstants.SCHEDUAL_UPDATE,
            users: users,
            threads: threads,
            msgs: msgs
        });
    },

    receiveMsg: function(msgObj){
        ChatDispatcher.handlerServerAction({
            actionType: ChatlConstants.MSG_RECEIVE,
            msgObj: msgObj
        });
    }
};

module.exports = AppAction;