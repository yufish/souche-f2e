/**
 * @jsx React.DOM
 */

var React = require('react');

var AppAction = require('../action/AppAction');

var ThreadStore = require('../store/ThreadStore');
var UnreadStore = require('../store/UnreadStore');

var ThreadItem = require('./ThreadItem.react');

var Tool = require('../util/tool');


var ThreadList = React.createClass({
    getInitialState: function() {
        return {
            threads: this.getThreadData()
        };
    },
    componentDidMount: function() {
        ThreadStore.addChangeListener(this._changeHandler);
        UnreadStore.addChangeListener(this._changeHandler);
    },
    componentWillUnmount: function() {
        ThreadStore.removeChangeListener(this._changeHandler);
        UnreadStore.removeChangeListener(this._changeHandler);
    },
    render: function() {
        var curThread = ThreadStore.getCurThread();
        var nodes = [];

        if( Tool.isEmptyObj(this.state.threads) ){
            nodes.push(
                <li className="thread-item no-chat-yet" key="000">没有对话</li>
            );
        }
        else{
            for(var i in this.state.threads){
                var thread = this.state.threads[i];
                var unread = this.state.threads[i].unreadCount;
                nodes.push(
                    <ThreadItem
                        thread={thread}
                        unreadCount={unread}
                        itemClickHandler={this.switchThread}
                        key={i}
                        activeClass={ curThread == thread.id }
                    >
                    </ThreadItem>
                );
            }
        }

        return (
            <ul className="thread-list" style={this.props.style}>
                {nodes}
            </ul>
        );
    },
    _changeHandler: function(){
        this.setState({
            threads: this.getThreadData()
        });
    },
    switchThread: function(threadId){
        // 如果点击的就是当前激活的thread
        if( ThreadStore.getCurThread() === threadId ){

        }
        else{
            AppAction.changeThread( threadId );
            AppAction.clearThreadUnread( threadId );
        }
    },
    getThreadData: function(){
        var threads = ThreadStore.getAll();
        for( var i in threads ){
            var t = threads[i];
            t.unreadCount = UnreadStore.getCountByThread(t.id);
        }
        return threads;
    }

});

module.exports = ThreadList;