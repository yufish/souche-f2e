/**
 * @jsx React.DOM
 */

// 带有addons的react lib
var React = require('react/addons');
var cx = React.addons.classSet;

var friendIdPrefix = 'buyer_';

var contextPath = contextPath || '';
var tabId = tabId || '';
function openCrmBuyerInfo(user, name){
    if(user==undefined) user = "";
    if(name==undefined) name = "新增买家用户";
    user = user.replace(/ /g, "");
    // var url = contextPath + "/pages/crm/crm_buyer_info.html?user=" + user;
    var url = contextPath + "/pages/crm/usercard/user_card.html?userid=" + user;
    parent.addTab("buyer-" + user,"买家-" + name + "的信息",url,tabId);
}

var ThreadItem = React.createClass({
    render: function() {
        var classes = cx({
            'thread-item': true,
            active: this.props.activeClass,
            'has-unread': (this.props.unreadCount > 0)
        });

        var thread = this.props.thread;
        var threadName =  thread.friendName || thread.friendId;

        var d = new Date(thread.nearlyMSgTime);
        var lastContact = (d.getMonth()+1) +'月'+d.getDate()+'日';
        return (
            <li
                className={ classes }
                title={ threadName }
                data-threadid={thread.id}
                onClick={this._onClick}
            >
                <span className="thread-name">{ threadName }</span>
                <span className="thread-unread-count">{ this.props.unreadCount }</span>
                <span className="icon icon-info friend-info-btn" onClick={this.openFriendInfo}></span>
                <span className="thread-last-contact">{ lastContact }</span>
            </li>
        );
    },
    _onClick: function(){
        // 不要用e来获取当前el的数据属性
        // 可以直接用this.props哦~
        this.props.itemClickHandler(this.props.thread.id);
    },
    openFriendInfo: function(){
        var crmId = this.props.thread.friendId.substr(friendIdPrefix.length);
        openCrmBuyerInfo(crmId, '');
    }
});

module.exports = ThreadItem;