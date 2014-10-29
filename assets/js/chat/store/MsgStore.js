var EventEmitter = require('events').EventEmitter;
var assign = require('react/lib/Object.assign');

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
            MsgData[m.id].senderName = UserStore.getById(m.sender).name || m.sender;
        });
    },
    // 新建的msg只有一个时间戳 还没有id
    create: function(msgObj){
        // 给时间戳添加两个下划线 形成字符串
        // 避免obj属性按数字顺序排列
        var tmpId = msgObj.ts + '__';
        MsgData[tmpId] = assign({}, msgObj);
        MsgData[tmpId].time = msgObj.ts;
        // 里面的用户信息... 本人/发送者的信息. 唉 在没有自己的消息之前是得不到的
        var user = UserStore.getById( UserStore.getCurUser() );
        if(user){
            MsgData[tmpId].sender = user.id;
            MsgData[tmpId].senderHeadImg = user.avatar;
            MsgData[tmpId].senderName = user.name;
        }

    },
    update: function(id, updates){
        for(var key in updates){
            MsgData[id][key] = updates[key];
        }
    },
    receive: function(msgObj){
        msgObj.user = UserStore.getById(msgObj.user);
        MsgData[msgObj.id] = msgObj;
    }
};

var MsgStore = assign(EventEmitter.prototype, {
    getAll: function(){
        return MsgData;
    },
    getByThreadId: function(threadId){
        var msgs = {};
        for(var m in MsgData){
            // 唉, 这个架构设计的
            // Q1: msg的sender属性是发送者, 而发送者作为了thread的id
            // Q2: 获取一个对话的所有消息数据, 不光要send是某ID, 还要获取"我发送给他的"
            //      即 receiver是该ID的...
            if(MsgData[m].sender === threadId || MsgData[m].receiver === threadId){
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
            msgObj = action.msg;
            if( msgObj.content.trim() !== '' ){
                _dataHandler.create( msgObj );
                MsgStore.emitChange();
            }
            break;
        case ChatConstants.MSG_SEND_SUC:
            var msgId = action.id;
            var time = action.sendTime;
            // 作为msgId, ts还要加两个下划线
            var tsId = action.reqTime + '__';
            _dataHandler.update( tsId, {id: msgId, time: time } );
            MsgStore.emitChange();
            break;
        case ChatConstants.MSG_SEND_FAIL:
            
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
