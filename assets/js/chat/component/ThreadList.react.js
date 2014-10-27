/**
 * @jsx React.DOM
 */

var React = require('react');

var AppAction = require('../action/AppAction');

var ThreadStore = require('../store/ThreadStore');

var ThreadItem = require('./ThreadItem.react');


var ThreadList = React.createClass({
    getInitialState: function() {
        return {
            threads: ThreadStore.getAll()
        };
    },
    componentDidMount: function() {
        ThreadStore.addChangeListener(this._changeHandler);
    },
    componentWillUnmount: function() {
        ThreadStore.removeChangeListener(this._changeHandler);
    },
    render: function() {
        var curThread = ThreadStore.getCurThread();
        var nodes = [];
        for(var i in this.state.threads){
            var thread = this.state.threads[i];
            nodes.push(
                <ThreadItem
                    thread={thread}
                    itemClickHandler={this.switchThread}
                    key={i}
                    activeClass={ curThread == thread.id }
                />
            );
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