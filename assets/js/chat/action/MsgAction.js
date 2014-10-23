
// 声明所有的action
// 由哪个dispatcher负责分发
// 分发的payload中的actionType是什么
// 这个action所需要的参数, 接收并传给分发器

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatlConstants = require('../constant/ChatConstants');

var MsgActions = {
    create: function(text, msgId){
        ChatDispatcher.handleViewAction({
            actionType: ChatlConstants.MSG_CREATE,
            text: text,
            msgId: msgId
        })
    },
    receive: function(msgObj){
        ChatDispatcher.handlerServerAction({
            actionType: ChatlConstants.MSG_RECEIVE,
            msgObj: msgObj
        });
    }
};


module.exports = MsgActions;

