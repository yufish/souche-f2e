/**
 * @jsx React.DOM
 */

/*
 * 整合多个组件 构建chat应用
 * 
 * 
 */


// var socket = null

var React = require('react');
var AppAction = require('../action/AppAction');

var ThreadStore = require('../store/ThreadStore');
var UserStore = require('../store/UserStore');

var ThreadList = require('./ThreadList.react');
var Dialog = require('./MsgList.react');
var Compose = require('./Compose.react');

var socketMsg = require('../server/Msg');
var AppServer = require('../server/appInit');

// AppServer.getInitialData(function(){
//     AppServer.init();
// });


var ChatApp = React.createClass({
    getInitialState: function(){
        return {
            threadW: 150,
            dialogH: 350,
            composeH: 150
        };
    },
    componentDidMount: function() {
        console.log('chat app mounted');
        AppServer.init();
    },
    render: function() {
        var threadStyle = {
            float: 'left',
            width: this.state.threadW + 'px'
        };
        var dialogStyle = {
            marginLeft: this.state.threadW + 'px',
            height: this.state.dialogH + 'px'
        };
        var compostStyle = {
            marginLeft: this.state.threadW + 'px',
            height: this.state.composeH + 'px'
        };

        return (
            <div id="chat-window">
                <ThreadList style={threadStyle}/>
                <Dialog style={dialogStyle} />
                <Compose style={compostStyle} textsHandler={this._sendMsg}/>
            </div>
        );
    },
    _sendMsg: function(text){
        //var newMsgId = uuid.v4();
        var newMsgId = '';
        var curThread = ThreadStore.getCurThread();
        var curUser = UserStore.getCurUser();
        AppAction.createMsg(text, newMsgId, curThread, curUser);
    }
});

module.exports = ChatApp;