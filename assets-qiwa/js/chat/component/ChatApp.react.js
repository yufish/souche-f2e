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

var Msg = require('../server/Msg');
var AppServer = require('../server/appInit');

var api = require('../server/apiConfig');
// AppServer.getInitialData(function(){
//     AppServer.init();
// });

function getReceiver(){
    // 当前的thread的id就是聊天对象的id
    return ThreadStore.getCurThread();
}


var ChatApp = React.createClass({
    getInitialState: function(){
        return {
            threadW: 250,
            dialogH: 350,
            composeH: 150
        };
    },
    componentDidMount: function() {
        // console.log('chat app mounted');
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
                <Compose style={compostStyle}
                    sendText={this._sendText}
                    sendCarid={this._sendCarid}
                    sendPic={this._sendPic}
                    imgUploadUrl={api.uploadImg}
                />
            </div>
        );
    },
    _sendText: function(text){
        var msg = {
            content: text,
            type: 0,
            receiver: getReceiver()
        };
        Msg.send(msg);
    },
    _sendCarid: function(carid){
        var msg = {
            content: carid,
            type: 3,
            receiver: getReceiver()
        };
        Msg.send(msg);
    },
    // 发送图片
    _sendPic: function(imgUrl){
        var msg = {
            content: imgUrl,
            type: 2,
            receiver: getReceiver()
        };
        Msg.send(msg);
    }
});

module.exports = ChatApp;