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

var MsgItem = require('./MsgItem.react');

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
        var list = [];

        if( this.state.msgData.length <=0 ){
            var noMsgTip = '还没有对话消息...';
            // 就算是只有一个元素也要有个key
            list.push(<li className="no-msg-tip" key="0">{noMsgTip}</li>);
        }
        else{
            list = this.state.msgData.map(function(msg, index){
                // console.log( 'key: ', msg.id );
                // key应该放在"component"上
                return <MsgItem msg={msg} key={msg.id} />;
            });
        }

        return (
            <ol className="msg-list"  style={this.props.style}>
                {list}
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