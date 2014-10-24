// ThreadStore.js

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var UserStore = require('./UserStore');

var CHANGE_EVENT = 'change';

// 存储区
var threads = {};
var curThread = '';



// set 方法们, 本文件内部维护数据
function initThreadData(serverThreads){
    serverThreads.forEach(function(t){
        // 以聊天的对象的id作为thread的id
        threads[t.friendId] = t;
        //threads[t.id].members = t.members.map(function(userid){
        //    return UserStore.getById( userid );
        //});
    });
    // init 时 取第一个id
    changeThread(serverThreads[0].id);
}
function changeThread(newId){
    curThread = newId;
}


// exports出去的 只有get  没有set 
var ThreadStore = merge(EventEmitter.prototype, {
    getAll: function(){
        return threads;
    },
    getCurThread: function(){
        return curThread;
    },
    emitChange: function(){
        this.emit(CHANGE_EVENT);
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
        case ChatConstants.APP_INIT:
            ChatDispatcher.waitFor([UserStore.dispatchToken]);
            initThreadData( action.threads );
            // ~~不触发change, 最后在msgstore中触发~~
            ThreadStore.emitChange();
            break;
        case ChatConstants.CHANGE_THREAD:
            // if()  // 检查是否是可用的uuid?
            changeThread( action.newId );
            ThreadStore.emitChange();
            break;
    };
});


module.exports = ThreadStore;