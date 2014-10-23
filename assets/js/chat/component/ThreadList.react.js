/**
 * @jsx React.DOM
 */

var React = require('react');

var AppAction = require('../action/AppAction');

var ThreadStore = require('../store/ThreadStore');

var ThreadItem = require('./ThreadItem.react');

// function 

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
            nodes.push( <ThreadItem
                thread={thread}
                itemClick={this.switchThread}
                key={i}
                activeClass={ curThread == thread.id }
            /> );
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
    switchThread: function(e){
        var item = e.target;
        var threadId = item.dataset['threadid'];
        // console.log(threadId);
        AppAction.changeThread( threadId );
    }

});

module.exports = ThreadList;