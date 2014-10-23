// appInit.js
// get all data: users, threads, msgs

// use demo data as fetched from server
//var users = require('../demoData/userData');
//var threads = require('../demoData/threadData');
//var msgs = require('../demoData/msgData');

var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constant/ChatConstants');

var AppAction = require('../action/AppAction');

function appInit(){
    //AppAction.appInit( users, threads, msgs );
}

function getInitialData(){
    setTimeout(appInit, 10);
}


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