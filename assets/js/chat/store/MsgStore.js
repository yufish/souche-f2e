var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');
var AppAction = require('../action/AppAction');

var UserStore = require('./UserStore');
var ThreadStore = require('./ThreadStore');

var CHANGE_EVENT = 'change';


var MsgData = {};

var _dataHandler = {
    init: function(msgs){
        msgs.forEach(function(m){

            // 初始化时 先将所有消息都当做未读
            AppAction.addUnread(m.threadId);

            MsgData[m.id] = m;
            var u = UserStore.getById(m.sender);
            if(u){
                MsgData[m.id].senderName = UserStore.getById(m.sender).name || m.sender;
            }
        });
    },
    // 新建的msg只有一个时间戳 还没有id
    create: function(msgObj){
        // 给时间戳添加两个下划线 形成字符串
        // 避免obj属性按数字顺序排列
        var tmpId = msgObj.ts + '__';
        MsgData[tmpId] = merge({}, msgObj);
        // 把发送时间存起来, 待会用来辨识这个未经返回的msg
        MsgData[tmpId].time = msgObj.ts;
        MsgData[tmpId].messageType = msgObj.type;
        MsgData[tmpId].id = tmpId;
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
    schedualUpdate: function(msgs){
        msgs.forEach(function(m){
            if( !MsgData[m.id] ){
                MsgData[m.id] = m;

                // 当前thread 不增加unread
                if( m.threadId === ThreadStore.getCurThread() ){

                }
                else{
                    AppAction.addUnread(m.threadId);
                }
            }
            else{
                _dataHandler.update(m.id, m);
            }
        });
    },
    receive: function(msgObj){
        msgObj.user = UserStore.getById(msgObj.user);
        MsgData[msgObj.id] = msgObj;
    }
};

var MsgStore = merge(EventEmitter.prototype, {
    getAll: function(){
        var all = [];
        for( var i in MsgData){
            all.push(MsgData[i]);
        }
        return all;
    },
    getByThreadId: function(threadId){
        var msgs = [];
        for(var m in MsgData){
            // 唉, 这个架构设计的
            // Q1: msg的sender属性是发送者, 而发送者作为了thread的id
            // Q2: 获取一个对话的所有消息数据, 不光要send是某ID, 还要获取"我发送给他的"
            //      即 receiver是该ID的...
            if(MsgData[m].sender === threadId || MsgData[m].receiver === threadId){
               msgs.push(MsgData[m]);
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
            ChatDispatcher.waitFor([ThreadStore.dispatchToken, UserStore.dispatchToken]);
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
            var reqTime = action.reqTime;

            // 临时的消息的id为发送时间 + __
            var rawMsgId = reqTime+'__';
            rawMsg = MsgData[rawMsgId];
            rawMsg.id = msgId;
            // 更新为发送成功的时间
            rawMsg.time = time;
            // 将raw的msg删掉
            delete MsgData[rawMsgId];
            // 将服务器返回的ID msg存起来
            MsgData[msgId] = rawMsg
            
            MsgStore.emitChange();
            break;
        case ChatConstants.MSG_SEND_FAIL:
            
            break;
        case ChatConstants.SCHEDUAL_UPDATE:
            ChatDispatcher.waitFor([UserStore.dispatchToken, ThreadStore.dispatchToken]);
            _dataHandler.schedualUpdate(action.msgs);
            MsgStore.emitChange();
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
