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

        var d = new Date(thread.nearlyMSgTime);
        var lastContact = (d.getMonth()+1) +'月'+d.getDay()+'日';
        return (
            <li
                className={"thread-item" + (this.props.activeClass? ' active':'') }
                title={ threadName }
                data-threadid={thread.id}
                onClick={this._onClick}
            >
                <span className="thread-name">{ threadName }</span>
                <span className="thread-last-contact">{ lastContact }</span>
            </li>
        );
    },
    _onClick: function(){
        // 不要用e来获取当前el的数据属性
        // 可以直接用this.props哦~
        this.props.itemClickHandler(this.props.thread.id);
    }
});

module.exports = ThreadItem;