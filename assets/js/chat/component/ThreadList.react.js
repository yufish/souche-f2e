/**
 * @jsx React.DOM
 */

var React = require('react');

var AppAction = require('../action/AppAction');

var ThreadStore = require('../store/ThreadStore');
var ThreadItem = require('./ThreadItem.react');

var Tool = require('../util/tool');


var ThreadList = React.createClass({
    getInitialState: function() {
        return {
            threads: []
        };
    },
    componentDidMount: function() {
        // store初始化完成的事件
        ThreadStore.addInitListener(this._initHandler);
        // 其他事件: 切换thread 标记已读... new unread, new thread...
        ThreadStore.addChangeListener(this._changeHandler);
    },
    componentWillUnmount: function() {
        ThreadStore.removeChangeListener(this._changeHandler);
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
    _initHandler: function(){
        this.setState({
            threads: this.getInitThreadData()
        });
    },
    // change发生时, 为了不变更thread的排序, 为每一个thread单独获取数据
    _changeHandler: function(threadHaveNewUnread, threadTotalNew){
        var threads = this.state.threads;
        var newData = threads.map(function(t){
            return ThreadStore.getById(t.id);
        });
        // 某些thread有未读
        // 遍历, 挪到头部去
        if( threadHaveNewUnread && threadHaveNewUnread.length > 0 ){
            threadHaveNewUnread.forEach(function(tu){
                var tuIndex = null;
                var findTu = newData.some(function(t, i){
                    if( tu.id === t.id){
                        tuIndex = i;
                        return true;
                    }
                    return false;
                });
                if(findTu){
                    newData.splice(tuIndex, 1);
                    newData.unshift(tu);
                }
            });
        }
        // 有新thread, 加在头部
        if(threadTotalNew && threadTotalNew.length > 0){
            threadTotalNew.forEach(function(tn){
                newData.unshift(tn);
            });
        }

        this.setState({
            threads: newData
        });
    },
    switchThread: function(threadId){
        // 如果点击的就是当前激活的thread
        if( ThreadStore.getCurThread() === threadId ){

        }
        else{
            AppAction.changeThread( threadId );
        }
    },
    getInitThreadData: function(){
        var threads = ThreadStore.getAll();

        // 如果是刚初始化的时候
        // 按未读 进行一下排序
        threads.sort(function(a, b){
            return b.unreadCount - a.unreadCount;
        });

        return threads;
    }
});

module.exports = ThreadList;