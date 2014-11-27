/**
 * @jsx React.DOM
 */

var React = require('react');

var UserStore = require('../store/UserStore');

var Tool = require('../util/tool');

var MsgItem = React.createClass({

    render: function() {
        var msg = this.props.msg;
        var classNameArr = ['msg-item'];
        var msgId = msg.id || '';
        if( UserStore.isCurUser(msg.sender) ){
            classNameArr.push('sendbyme');
        }
        var d = new Date(msg.time);
        var sendTime = Tool.makeDouble(d.getMonth()+1) + '-' + Tool.makeDouble(d.getDate());
        sendTime += ' ';
        sendTime += Tool.makeDouble(d.getHours()   ) + ':';
        sendTime += Tool.makeDouble(d.getMinutes() ) + ':';
        sendTime += Tool.makeDouble(d.getSeconds() );

        var msgText = null;
        if( msg.messageType == '2' ){
            msgText = <p className="msg-text"><img src={msg.content} className="msg-img"/></p>;
        }
        else if(msg.messageType == '3'){
            msgText = <p className="msg-text"><a href={"http://souche.com/pages/choosecarpage/flash-car-detail.html?carId="+ msg.content } className="msg-carid-link" target="_black">{msg.content}</a></p>;
        }
        else{
            msgText = <p className="msg-text">{msg.content}</p>;
        }
        
        return (
            <li className={classNameArr.join(' ')} data-msgid={msgId}>
                <img className="msg-user-avatar" src={msg.senderHeadImg} />
                <div className="msg-content-ctn">
                    <div className="msg-header">
                        <p className="msg-user-name">{msg.senderName}</p>
                        <p className="msg-sendtime">{ sendTime }</p>
                    </div>
                    {msgText}
                </div>
            </li>
        );
    }

});

module.exports = MsgItem;