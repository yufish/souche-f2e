var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var ThreadStore = require('./ThreadStore');
var UserStore = require('./UserStore');

var CHANGE_EVENT = 'change';
var HAVE_NEW_UNREAD_EVENT = 'new_unread';
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
    emitNewUnread: function(msg){
        this.emit(HAVE_NEW_UNREAD_EVENT, msg);
    },
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    addNewUnreadListener: function(cb){
        this.on(HAVE_NEW_UNREAD_EVENT, cb);
    },
    removeNewUnreadListener: function(cb){
        this.removeListener(HAVE_NEW_UNREAD_EVENT, cb);
    }
});

// for test
var smsg = null;

UnreadStore.dispatchToken = ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        // app init时 全部设为未读
        case ChatConstants.APP_INIT:
            ChatDispatcher.waitFor([ThreadStore.dispatchToken]);
            var msgs = action.msgs;
            var curActiveThread = ThreadStore.getCurThread();
            msgs.forEach(function(m){
                var friend = m.threadId;
                // 不属于当前激活的thread的
                if( m.threadId != curActiveThread){
                    addUnread(m.threadId);
                }
            });
            UnreadStore.emitChange();
            // for test
            smsg = msgs[Math.ceil(Math.random()*8)];

            break;
        // 定期更新时, 检查得到的msg
        case ChatConstants.SCHEDUAL_UPDATE:
            var msgs = action.msgs;
            var curActiveThread = ThreadStore.getCurThread();
            var curUser = UserStore.getCurUser();
            msgs.forEach(function(m){
                var friend = m.threadId;
                // 别人发过来的
                // 且不属于当前激活的thread的
                if(m.sender !== friend && m.threadId != curActiveThread){
                    addUnread(m.threadId);
                    UnreadStore.emitNewUnread(m);
                }
            });
            break;
        // 点击thread时, 清除unread
        case ChatConstants.CLEAR_THREAD_UNREAD:
            var threadId = action.threadId;
            clearUnread(threadId);
            UnreadStore.emitChange();
            break;
        case ChatConstants.CLEAR_ALL_UNREAD:
            break;
        default:
            return;
    }
});

setTimeout(function(){
    addUnread(smsg.threadId);
    UnreadStore.emitNewUnread( smsg );
}, 8000);

module.exports = UnreadStore;