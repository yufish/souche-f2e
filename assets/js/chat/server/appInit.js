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
                console.log( initData.users );
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
    // 从thread数据中提取出friend的用户数据
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
    });

    // 从消息数据中找到当前用户的id和avatar
    var curUser = null;
    for(var i=0, j=msgs.length; i<j; i++){
        var m = msgs[i];
        if( idInObjArr( m.sender, users, 'id' ) ){
            curUser = {
                name: '我',
                id: m.receiver,
                avatar: m.receiverHeadImg
            }
            users.push(curUser);
            AppAction.userLogin(curUser.id);
            break;
        }
    }

    return {
        users: users,
        threads: threads,
        msgs: msgs
    };
}

function idInObjArr(someId, arr, idProp){
    return arr.some(function(el){
        return someId === el[idProp];
    })
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
            // getInitialData();
            break;
    }

    // do nothing... 
});

exports.init = appInit;
exports.getInitialData = getInitialData;