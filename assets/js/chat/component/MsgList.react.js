/**
 * @jsx React.DOM
 */


/*
 * 渲染消息/对话列表
 * 
 * 
 */
var React = require('react');

var UserStore = require('../store/UserStore');
var MsgStore = require('../store/MsgStore');
var ThreadStore = require('../store/ThreadStore');

var Tool = require('../util/tool');


// 临时存储的thread, 这个优化有没有必要呢... 
var oldCurThread = null;

function getAllMsg(){
    var newCurThreadId = ThreadStore.getCurThread();
    // if( newCurThreadId != oldCurThread ){
    //     oldCurThread = newCurThreadId;
    // }
    // else{
    //     return false;
    // }
    return {
        msgData: MsgStore.getByThreadId( newCurThreadId )
    };
};



var MsgList = React.createClass({
    getInitialState: function() {
        return getAllMsg();
    },
    componentDidMount: function() {
        this._ele = this.getDOMNode();
        this._lastHeight = this._ele.scrollHeight;
        MsgStore.addChangeListener( this._updateAllMsg );
        ThreadStore.addChangeListener( this._updateAllMsg );
    },
    componentWillUnmount: function() {
        MsgStore.removeChangeListener( this._updateAllMsg );
        ThreadStore.removeChangeListener( this._updateAllMsg );
    },
    componentDidUpdate: function(){
        this._scrollToBottom();
    },
    render: function() {
        var msgItems = [];

        if( Tool.isEmptyObj(this.state.msgData) ){
            var noMsgTip = '还没有对话消息...';
            return <ol className="msg-list"  style={this.props.style}>
                <li className="no-msg-tip">{noMsgTip}</li>
            </ol>
        }

        for(var i in this.state.msgData){
            var msg = this.state.msgData[i];
            var classNameArr = ['msg-item'];
            var msgId = msg.id || '';
            //if( UserStore.isCurUser(msg.user.id) ){
            //    classNameArr.push('sendbyme');
            //}
            var d = new Date();
            var sendTime = Tool.makeDouble(d.getMonth()+1) + '-' + Tool.makeDouble(d.getDay());
            sendTime += ' ';
            sendTime += Tool.makeDouble(d.getHours()   ) + ':';
            sendTime += Tool.makeDouble(d.getMinutes() ) + ':';
            sendTime += Tool.makeDouble(d.getSeconds() );
            
            var node = (
                <li className={classNameArr.join(' ')} key={i} data-msgid={msgId}>
                    <img className="msg-user-avatar" src={msg.senderHeadImg} />
                    <div className="msg-content-ctn">
                        <div className="msg-header">
                            <p className="msg-user-name">{msg.sender}</p>
                            <p className="msg-sendtime">{ sendTime }</p>
                        </div>
                        <p className="msg-text">{msg.content}</p>
                    </div>
                </li>
            );
            msgItems.push( node );
        }

        return (
            <ol className="msg-list"  style={this.props.style}>
                {msgItems}
            </ol>
        );
    },
    _ele: null,
    _lastHeight: 0,
    _updateAllMsg: function(){
        this.setState( getAllMsg() );
    },
    _scrollToBottom: function(){
        var newHeight = this._ele.scrollHeight;
        if( newHeight !== this._lastHeight ){
            this._ele.scrollTop = newHeight;
            this._lastHeight = newHeight;
        }
    }
});

module.exports = MsgList;