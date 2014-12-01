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
        UnreadStore.addNewUnreadListener(this._haveNewUnread);
    },
    componentWillUnmount: function() {
        ThreadStore.removeChangeListener(this._changeHandler);
        UnreadStore.removeChangeListener(this._changeHandler);
        UnreadStore.removeChangeListener(this._haveNewUnread);
    },
    render: function() {
        var curThread = ThreadStore.getCurThread();
        var nodes = [];
        var threads = this.state.threads;

        if( threads.length <= 0 ){
            nodes.push(
                <li className="thread-item no-chat-yet" key="000">没有对话</li>
            );
        }
        else{
            var self = this;
            threads.forEach(function(thread){
                var unread = thread.unreadCount;
                var key = thread.id;
                nodes.push(
                    <ThreadItem
                        thread={thread}
                        unreadCount={unread}
                        itemClickHandler={self.switchThread}
                        key={key}
                        activeClass={ curThread == thread.id }
                    >
                    </ThreadItem>
                );
            });
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
    // 在有新的unread时
    // 将该thread放到最上面
    // 注意该thread的数据要更新哦~
    _haveNewUnread: function(msg){
        var unreadThread = null;
        var unreadThreadIndex = null;
        var threads = this.state.threads;
        var unreadThreadInList = threads.some(function(t, i){
            if( t.id === msg.threadId){
                unreadThreadIndex = i;
                return true;
            }
            return false;
        });
        if(unreadThreadInList){
            unreadThread = threads.splice(unreadThreadIndex, 1)[0];
            unreadThread.unreadCount = UnreadStore.getCountByThread(unreadThread.id);
            threads.unshift(unreadThread);
            this.setState({
                threads: threads
            });
        }
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
        threads.forEach(function(t){
            t.unreadCount = UnreadStore.getCountByThread(t.id);
        });
        // 如果是刚初始化的时候
        // 按未读 进行一下排序
        if( !this.state || this.state.threads.length <= 0 ){
            threads.sort(function(a, b){
                return b.unreadCount - a.unreadCount;
            });
        }

        // console.log('--------');
        // threads.forEach(function(t){
        //     console.log(t.unreadCount);
        // });
        
        return threads;
    }

});

module.exports = ThreadList;