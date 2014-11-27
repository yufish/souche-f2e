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
var curThread = '';



// set 方法们, 本文件内部维护数据
function initThreadData(serverThreads){
    serverThreads.forEach(function(t){
        // 以聊天的对象的id作为thread的id
        t.id = t.friendId;
        ThreadData[t.id] = t;
    });
    // init 时 取第一个id
    if( serverThreads[0] ){
        changeThread(serverThreads[0].id);
    }
}
function changeThread(newId){
    curThread = newId;
}

function updateThread(id, updates){
    for(var key in updates){
        ThreadData[id][key] = updates[key];
    }
}
// 增加 / 更新  先不管删除了
function updateThreadData(threads){
    var after = function(){};
    // 如果之前一直没有数据
    // 就在有更新之后 设定current thread
    if( Tool.isEmptyObj(ThreadData) ){
        after = function(){
            if( threads.length > 0 ){
                changeThread(threads[0].id);
            }
        }
    }
    threads.forEach(function(t){
        t.id = t.friendId;
        if( !ThreadData[t.id] ){
            ThreadData[t.id] = t;
        }
        else{
            updateThread(t.id, t);
        }
    });
    after();
}


// exports出去的 只有get  没有set 
var ThreadStore = merge(EventEmitter.prototype, {
    getAll: function(){
        return ThreadData;
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
        case ChatConstants.SCHEDUAL_UPDATE:
            ChatDispatcher.waitFor([UserStore.dispatchToken]);
            updateThreadData(action.threads);
            ThreadStore.emitChange();
            break;
    };
});


module.exports = ThreadStore;