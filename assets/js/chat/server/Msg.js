
var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var UserStore = require('../store/UserStore');
var AppAction = require('../action/AppAction');


function sendMsgToServer(msgObj){
    //_socket.emit('msg', msgObj);
    console.log(msgObj);
};

function bind(){
    //_socket.on('msg-others', function(msg){
    //    AppAction.receiveMsg(msg);
    //});
    console.log('binding... ');
    console.log('fetch msg from server every N seconds');
}


ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        case ChatConstants.MSG_CREATE:
            var msgObj = action.msgObj;
            if(msgObj.text.trim() !== ''){
                sendMsgToServer(msgObj);
            }
            break;
    }

    // do nothing... 
});


exports.init = function(socket){
    bind();
}