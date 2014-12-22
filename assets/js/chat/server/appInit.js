// appInit.js
// get all data: users, threads, msgs

var EP = require('eventproxy');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var AppAction = require('../action/AppAction');

var API = require('./apiConfig');

function appInitFail(msg){
    console.log(msg|| '获取数据失败...');
}

function appInit(){
    _data.getAllData(false, function(chatList, msgListArr){

        // curUser应该怎么找...
        // 之前是必须遍历融合后的msg啊...
        filterOutOnlyWelcome(chatList, msgListArr);


        var allMsgs = [];
        msgListArr.forEach(function(ml){
            allMsgs = allMsgs.concat(ml);
        });
        var initData = getDataFromRaw(chatList, allMsgs);
        // console.table( initData.users );
        AppAction.appInit( initData.users, initData.threads, initData.msgs);
    });

    setInterval(function(){
    //setTimeout(function(){
        _data.getAllData(true,function(chatList, msgListArr){
            var allMsgs = [];
            msgListArr.forEach(function(ml){
                allMsgs = allMsgs.concat(ml);
            });
            var schedualData = getDataFromRaw(chatList, allMsgs);
            AppAction.schedualUpdate( schedualData.users, schedualData.threads, schedualData.msgs );
        });
    }, 10*1000);
}

function getDataFromRaw(threads, msgs, needFilter){
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
        else if( idInObjArr( m.receiver, users, 'id' ) ){
            curUser = {
                name: '我',
                id: m.sender,
                avatar: m.senderHeadImg
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

function filterOutOnlyWelcome(threads, msgListArr){
    var mlRemove = [], tlRemove = [];
    msgListArr.forEach(function(ml, index){
        // 如果里面只有一条消息, 而且发送者是不是对话对象
        //if( ml.length == 0 || (ml.length === 1 && ml[0].sender !== ml[0].talkingWith) ){
        if(ml.length === 1 && ml[0].sender !== ml[0].talkingWith ){
            mlRemove.push(index);

            var emptyThreadId = ml[0].threadId;
            // 使用every来尽快退出循环
            var removeSuc = !threads.every(function(t,i ){
                 if( t.friendId == emptyThreadId ){
                     tlRemove.push(i);
                     return false;
                 }
                return true;
            });
        }
        // 不需要删除的msgList

        else{
            //console.log('\n');
            if( ml.length> 0 ){
                //console.log( ml.length, ml[0].sender, '  vs  ', ml[0].talkingWith );
            }
            else{
                //console.log('遇到一个完全没有消息的...')
            }
        }
    });
    //console.log(mlRemove);
    //console.log(tlRemove);
    // 从后往前splice
    mlRemove.reverse().forEach(function(indexToRemove){
        msgListArr.splice(indexToRemove, 1);
    });

    // 反向排序后从后往前删除
    tlRemove.sort(function(a, b){
        return b-a;
    }).forEach(function(indexToRemove){
        threads.splice(indexToRemove, 1);
    });

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
    getChatList: function(blUnread, callback){
        $.getJSON(API.getChatList, {unread: blUnread}, function(data, status){
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
    },

    /* 把数据正规化:
     * chatList 添加threadId属性, 用friendId  
     * msg, 每一条增加threadId属性, 方便辨别
     */ 
    getAllData: function( blOnlyUnread ,callback){
        _data.getChatList(blOnlyUnread, function(data, status){
            if( data.code == '100000'){
                var chatList = data.data.chatList;

                var aDayAgo = Date.now() - 3600*24*1000;
                var ep = new EP();
                ep.after('get msg',chatList.length, function(msgListArr){
                    // console.log(msgListArr);
                    callback(chatList, msgListArr );
                });

                chatList.forEach(function(chat){
                    chat.threadId = chat.friendId;
                    var lastReqTime;
                    if( (new Date(chat.nearlyMSgTime)).valueOf() < aDayAgo ){
                        lastReqTime = (new Date(chat.nearlyMSgTime)).valueOf() - 1000;
                    }
                    else{
                        lastReqTime = aDayAgo;
                    }
                    _data.getMsgs(chat.friendId, lastReqTime, function(data, status){
                        if( data.code == '100000' ){
                            var msgData = data.data.msgList;
                            // 弥补架构问题, 添加threadId到每一条msg
                            msgData.forEach(function(m){
                                m.threadId = chat.friendId;
                                m.talkingWith = chat.friendId;
                            });
                            //console.log(chat.friendId);
                            ep.emit('get msg', msgData);
                        }
                        else{
                            appInitFail('获取和 '+(chat.friendName||chat.friendId)+' 的聊天消息失败...');
                            ep.emit('get msg', []);
                        }
                    });
                });
            }
            else{
                appInitFail();
            }
        });
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