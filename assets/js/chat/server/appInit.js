// appInit.js
// get all data: users, threads, msgs

// use demo data as fetched from server
//var users = require('../demoData/userData');
//var threads = require('../demoData/threadData');
//var msgs = require('../demoData/msgData');

var EP = require('eventproxy');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var AppAction = require('../action/AppAction');

var API = require('./apiConfig');

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

            var lastReqTime = Date.now() - 3600*24*1000;
            var ep = new EP();
            ep.after('get msg',chatList.length, function(msgListArr){
                console.log(msgListArr);
                var allMsgs = [];
                msgListArr.forEach(function(ml){
                    allMsgs = allMsgs.concat(ml);
                });
                var initData = getDataFromRaw(chatList, allMsgs);
                AppAction.appInit( initData.users, initData.threads, initData.msgs);
            });

            chatList.forEach(function(chat){
                _data.getMsgs(chat.friendId, lastReqTime, function(data, status){
                    if( data.code == '100000' ){
                        var msgData = data.data.msgList;
                        ep.emit('get msg', msgData);
                    }
                    else{
                        appInitFail('获取和 '+(chat.friendName||chat.friendId)+' 的聊天消息失败...');
                    }
                });
            });
        }
        else{
            appInitFail();
        }

    });
}

function getDataFromRaw(threads, msgs){
    var users = threads.map(function(t){
        return {
            name: t.friendName || t.friendId,
            id: t.friendId,
            avatar: t.friendImg
        }
    });

    // 按时间排序
    msgs.sort(function(a, b){
        return (new Date(a.time)).valueOf() - (new Date(b.time)).valueOf();
    })

    return {
        users: users,
        threads: threads,
        msgs: msgs
    };
}

function getInitialData(){
    setTimeout(appInit, 10);
}

var _data = {
    // param: Boolean blAll, 是全部, 还是只是未读的
    getChatList: function(blAll, callback){
        $.getJSON(API.getChatList, {unread: !blAll}, function(data, status){
            callback(data, status);
        });
    },
    // 获取和谁聊天数据
    getMsgs: function(receiver, lastReqTime, callback){
        var param = {
            receiver: receiver,
            lastRequireTime: lastReqTime
        };
        $.getJSON(API.getMsg, param, callback);
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