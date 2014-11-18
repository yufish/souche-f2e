/**
 * @jsx React.DOM
 */

var React = require('react');

var friendIdPrefix = 'buyer_';

var contextPath = contextPath || '';
function openCrmSalerInfo(user, name){
    if(user==undefined) {
        user = "";
        name = "新增卖家用户";
    }

    user = user.replace(/ /g, "");
    
    var url = contextPath + "/pages/crm/crm_saler_info.html?user=" + user;
    //var url = contextPath + "/pages/crm/usercard/user_card.html?userid=" + user;还是用老页面，卖家
    parent.addTab(user,"卖家-" + name + "的信息",url,tabId);
}

var ThreadItem = React.createClass({
    render: function() {
        //var users = this.props.thread.members.map(function(u){
        //    return u.alias;
        //});
        var thread = this.props.thread;
        var threadName =  thread.friendName || thread.friendId;

        var d = new Date(thread.nearlyMSgTime);
        var lastContact = (d.getMonth()+1) +'月'+d.getDate()+'日';
        return (
            <li
                className={"thread-item" + (this.props.activeClass? ' active':'') }
                title={ threadName }
                data-threadid={thread.id}
                onClick={this._onClick}
            >
                <span className="thread-name">{ threadName }</span>
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
        openCrmSalerInfo(crmId, '');
    }
});

module.exports = ThreadItem;