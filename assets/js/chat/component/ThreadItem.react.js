/**
 * @jsx React.DOM
 */

var React = require('react');

var ThreadItem = React.createClass({
    render: function() {
        var users = this.props.thread.members.map(function(u){
            return u.alias;
        });
        return (
            <li
                className={"thread-item" + (this.props.activeClass? ' active':'') }
                title={this.props.thread.name + '\n' + users.join(', ')}
                onClick={this.props.itemClick}
                data-threadid={this.props.thread.id}
            >
                {this.props.thread.name}
            </li>
        );
    }
});

module.exports = ThreadItem;