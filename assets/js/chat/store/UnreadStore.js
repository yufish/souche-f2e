var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var CHANGE_EVENT = 'change';

// threadId : how-many-unread
var UnreadData = {};

function clearUnread(threadId){
    UnreadData[threadId] = 0;
}
function clearAll(){
    for(var i in UnreadData){
        UnreadData[i] = 0;
    }
}
function addUnread(threadId){
    if(UnreadData[threadId]){
        UnreadData[threadId] += 1;
    }
    else{
        UnreadData[threadId] = 1;
    }
}

var UnreadStore = merge(EventEmitter.prototype, {
    getCountByThread: function( threadId ){
        return ~~UnreadData[threadId];
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    }
});

UnreadStore.dispatchToken = ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        case ChatConstants.ADD_UNREAD:
            var threadId = action.threadId;
            addUnread(threadId);
            break;
        case ChatConstants.CLEAR_THREAD_UNREAD:
            break;
        case ChatConstants.CLEAR_ALL_UNREAD:
            break;
        default:
            return;
    }
    UnreadStore.emitChange();
});

module.exports = UnreadStore;