// ThreadStore.js

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var UserStore = require('./UserStore');

var Tool = require('../util/tool');


var CHANGE_EVENT = 'change';


// 存储区
var ThreadData = {};
var curThread = null;



// set 方法们, 本文件内部维护数据
function initThreadData(serverThreads){
    serverThreads.forEach(function(t){
        // 以聊天的对象的id作为thread的id
        t.id = t.friendId;
        t.unreadCount = 0;
        ThreadData[t.id] = t;
    });
}
function changeThread(newId){
    curThread = newId;
}

function updateThread(id, updates){
    for(var key in updates){
        ThreadData[id][key] = updates[key];
    }
}

// 未读消息的操作
function addUnread(threadId){
    ThreadData[threadId].unreadCount++;
}
function clearUnread(threadId){
    ThreadData[threadId].unreadCount = 0;
}
function clearAll(){
    for(var i in ThreadData){
        UnreadData[i].unreadCount = 0;
    }
}

// exports出去的 只有get  没有set 
var ThreadStore = merge(EventEmitter.prototype, {
    getAll: function(){
        var arr = [];
        for(var t in ThreadData){
            arr.push(ThreadData[t]);
        }
        return arr;
    },
    getById: function(id){
        return ThreadData[id];
    },
    getCurThread: function(){
        return curThread;
    },
    emitChange: function(haveNewUnread, totalNewThread){
        this.emit(CHANGE_EVENT, haveNewUnread, totalNewThread);
    },
    emitInitDone: function(){
        this.emit('thread_init_done');
    },
    addInitListener: function(cb){
        this.on('thread_init_done', cb);
    },
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb)
    },
    removeChangeListener: function(){
        this.removeListener(CHANGE_EVENT, cb);
    },
    // 处理action的句柄
    dispatchToken: null
});

ThreadStore.dispatchToken = ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        // app 初始时
        case ChatConstants.APP_INIT:
            ChatDispatcher.waitFor([UserStore.dispatchToken]);
            initThreadData( action.threads );

            var msgs = action.msgs;
            msgs.forEach(function(m){
                addUnread(m.threadId);
            });

            ThreadStore.emitInitDone();
            break;
        case ChatConstants.CHANGE_THREAD:
            // if()  // 检查是否是可用的uuid?
            changeThread( action.newId );
            clearUnread( action.newId );
            ThreadStore.emitChange();
            break;
        case ChatConstants.SCHEDUAL_UPDATE:
            ChatDispatcher.waitFor([UserStore.dispatchToken]);
            // 某些thread有新消息
            if( action.threads.length > 0 ){
                var threads = action.threads, msgs = action.msgs;
                var haveNewUnread = [], totalNewThread = [];
                var curThread = ThreadData.getCurThread();
                threads.forEach(function(t){
                    // 该thread已存在
                    if( ThreadData[t.id] ){
                        updateThread(id, t);
                        if( t.id !== curThread ){
                            haveNewUnread.push(t);
                        }
                    }
                    else{
                        ThreadData[t.id] = t;
                        totalNewThread.push(t);
                    }
                });
                msgs.forEach(function(m){
                    if(m.threadId !== curThread){
                        addUnread(m.threadId);
                    }
                });
                ThreadStore.emitChange(haveNewUnread, totalNewThread);
            }
            break;
    };
});

// tests...
//setTimeout(function(){
//    ThreadStore.emitChange([{id: 'buyer_0GMvI8i8S8', friendName: 'test new unread', unreadCount: 6}, {id: 'buyer_0CAhAn6IIt', friendName: '2222',unreadCount: 1}]);
//}, 7000);
//
//setTimeout(function(){
//    ThreadStore.emitChange([], [{id: 'test new thread',friendName: 'test new thread', unreadCount: 1}, {id: '4444', friendName: 'test new 444', unreadCount: 1}]);
//}, 14000);

module.exports = ThreadStore;