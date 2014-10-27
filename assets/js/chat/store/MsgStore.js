var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var UserStore = require('./UserStore');
var ThreadStore = require('./ThreadStore');

var CHANGE_EVENT = 'change';


var MsgData = {};

var _dataHandler = {
    init: function(msgs){
        msgs.forEach(function(m){
            MsgData[m.id] = m;
        });
    },
    // 当前用户创建新msg只需要传递内容
    create: function(msgObj){
        MsgData[msgObj.id] = merge({}, msgObj);
        MsgData[msgObj.id].user = UserStore.getById( msgObj.user );
    },
    receive: function(msgObj){
        msgObj.user = UserStore.getById(msgObj.user);
        MsgData[msgObj.id] = msgObj;
    }
};

var MsgStore = merge(EventEmitter.prototype, {
    getAll: function(){
        return MsgData;
    },
    getByThreadId: function(threadId){
        var msgs = {};
        for(var m in MsgData){
            // 唉, 这个架构设计的
            // msg的sender属性是发送者, 而发送者作为了thread的id
            if(MsgData[m].sender === threadId){
               msgs[m] = MsgData[m];
            }
        }
        return msgs;
    },
    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback)
    },
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback)
    }
});


// 在dispatcher 分发器上注册处理函数
// 针对不同的actionType调用不同的函数
// 最后统一做一次emitChange

// 注册更多的action handler: CRUD 
ChatDispatcher.register(function(payload){
    var action = payload.action;
    var text;

    switch(action.actionType){
        case ChatConstants.APP_INIT:
            ChatDispatcher.waitFor([ThreadStore.dispatchToken]);
            _dataHandler.init(action.msgs);
            MsgStore.emitChange();
            break;
        case ChatConstants.MSG_CREATE:
            msgObj = action.msgObj;
            if( msgObj.text.trim() !== '' ){
                _dataHandler.create( msgObj );
                MsgStore.emitChange();
            }
            break;
        case ChatConstants.MSG_RECEIVE:
            _dataHandler.receive( action.msgObj );
            MsgStore.emitChange();
            break;
        default:
            // console.log('no store handler registed on this action: ', action.actionType)
            break;
    }
    return true;
});


module.exports = MsgStore;
