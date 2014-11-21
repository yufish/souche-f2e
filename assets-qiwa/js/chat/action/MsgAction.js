
// 声明所有的action
// 由哪个dispatcher负责分发
// 分发的payload中的actionType是什么
// 这个action所需要的参数, 接收并传给分发器

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatlConstants = require('../constant/ChatConstants');

var MsgActions = {
    create: function(msg){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.MSG_CREATE,
            msg: msg 
        })
    },
    // 请求响应来的id, 和服务端记录的时间
    // 以及client发送出去的ts, 用来在store中找到对应的数据
    sendSuc: function(msgId, sendTime, reqTime){
        ChatDispatcher.handleServerAction({
            actionType: ChatlConstants.MSG_SEND_SUC,
            id: msgId,
            sendTime: sendTime,
            reqTime: reqTime
        });
    },
    sendFail: function(res){
        ChatDispatcher.handleServerAction({
            actionType: ChatlConstants.MSG_SEND_FAIL,
            res: res
        });
    },
    receive: function(msgObj){
        ChatDispatcher.handlerServerAction({
            actionType: ChatlConstants.MSG_RECEIVE,
            msgObj: msgObj
        });
    }
};


module.exports = MsgActions;

