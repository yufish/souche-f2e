
var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var UserStore = require('../store/UserStore');
var AppAction = require('../action/AppAction');
var MsgAction = require('../action/MsgAction');

var API = require('./apiConfig');

// function sendMsgToServer(msgObj){
//     //_socket.emit('msg', msgObj);
//     console.log(msgObj);
// };

// function bind(){
//     //_socket.on('msg-others', function(msg){
//     //    AppAction.receiveMsg(msg);
//     //});
//     console.log('binding... ');
//     console.log('fetch msg from server every N seconds');
// }


// ChatDispatcher.register(function(payload){
//     var action = payload.action;
//     var actionType = action.actionType;

//     switch(actionType){
//         case ChatConstants.MSG_CREATE:
//             var msgObj = action.msgObj;
//             if(msgObj.text.trim() !== ''){
//                 sendMsgToServer(msgObj);
//             }
//             break;
//     }

//     // do nothing... 
// });


function sendMsg(msgObj){
    msgObj.ts = (new Date()).valueOf();
    MsgAction.create(msgObj);

    _data.send(msgObj, function(data, status){
        //console.log(data);
        //console.log(status);
        if(status == 'success' && data.code == '100000'){
            MsgAction.sendSuc(data.data.id, data.data.sendTime, msgObj.ts);
        }
    })
};

var _data = {
    send: function(msg, callback){
        $.getJSON(API.sendMsg, msg, callback);
    }
};

exports.send = sendMsg;