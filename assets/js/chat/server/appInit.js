// appInit.js
// get all data: users, threads, msgs

// use demo data as fetched from server
//var users = require('../demoData/userData');
//var threads = require('../demoData/threadData');
//var msgs = require('../demoData/msgData');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var AppAction = require('../action/AppAction');


// ------------ some config ------------
var baseUrl= 'http://115.29.10.121:10086/soucheweb/pages/app/thumbelina/messageAction/';

var url = {
    sendMsg: baseUrl + 'send.json',
    getMsg: baseUrl + 'receive.json',
    getChatList: baseUrl + 'getChatList.json',
    deleteChat: baseUrl + 'deleteChat.json'
};

var user = 'buyer_gnKtBtN';
// ------------ some config ------------

function appInitFail(msg){
    console.log(msg|| '获取数据失败...');
}

function appInit(){
    _data.getChatList(true, function(data, status){
        console.log(data);
        console.log(status);
        console.log('--------------------------------------');
        if( data.code == '100000'){
            var chatList = data.data.chatList;
            AppAction.appInit( [], chatList, [] );
        }
        else{
            appInitFail();
        }

    });
    _data.getMsgs(1414050886673, function(data, status){
        console.log(data);
        console.log(status);
    });
}

function getInitialData(){
    setTimeout(appInit, 10);
}

var _data = {
    // param: Boolean blAll, 是全部, 还是只是未读的
    getChatList: function(blAll, callback){
        $.get(url.getChatList, {unread: blAll}, function(data, status){
            data = JSON.parse(data);
            callback(data, status);
        });
    },
    // 获取和谁聊天数据
    getMsgs: function(receiver, lastReqTime, callback){
        var param = {
            receiver: 'buyer_18767104050',
            lastRequireTime: lastReqTime
        };
        $.get(url.getMsg, param, callback);
    }
};

ChatDispatcher.register(function(payload){
    var action = payload.action;
    var actionType = action.actionType;

    switch(actionType){
        case ChatConstants.USER_LOGIN:
            getInitialData();
            break;
    }

    // do nothing... 
});

exports.init = appInit;
exports.getInitialData = getInitialData;