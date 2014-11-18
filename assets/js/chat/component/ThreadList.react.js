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
            threads: ThreadStore.getAll()
        };
    },
    componentDidMount: function() {
        ThreadStore.addChangeListener(this._changeHandler);
        // UnreadStore.addChangeListener();
    },
    componentWillUnmount: function() {
        ThreadStore.removeChangeListener(this._changeHandler);
        // UnreadStore.removeChangeListener();
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
                var unread = UnreadStore.getCountByThread(thread.id);
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
            threads: ThreadStore.getAll()
        });
    },
    switchThread: function(threadId){
        // 如果点击的就是当前激活的thread
        if( ThreadStore.getCurThread() === threadId ){

        }
        else{
            AppAction.changeThread( threadId );
        }
    }

});

module.exports = ThreadList;