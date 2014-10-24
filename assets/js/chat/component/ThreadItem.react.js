/**
 * @jsx React.DOM
 */

var React = require('react');

var ThreadItem = React.createClass({
    render: function() {
        //var users = this.props.thread.members.map(function(u){
        //    return u.alias;
        //});
        var thread = this.props.thread;
        var threadName =  thread.friendName || thread.friendId;
        return (
            <li
                className={"thread-item" + (this.props.activeClass? ' active':'') }
                title={ threadName }
                onClick={this.props.itemClick}
                data-threadid={thread.friendId}
            >
                { threadName }
                { '  lastContact: '}
                { thread.last_connect }
            </li>
        );
    }
});

module.exports = ThreadItem;