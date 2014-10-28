/**
 * @jsx React.DOM
 */

var React = require('react');

var ComposeCarid = React.createClass({
    ele: null,
    componentDidMount: function(){
        this.ele = $(this.getDOMNode());
    },
    render: function() {
        return (
            <div className="compose-tool compose-carid">
                <div className="compose-tool-icon" onClick={this._activeTool}></div>
                <div className="compose-tool-content">
                    <input type="text" id="carid-input" placeholder="请输入carid" onBlur={this._hideTool} />
                    <div className="btn btn-primary" id="send-carid">发送</div>
                </div>
            </div>
        );
    },
    _activeTool: function(){
        if(this.ele.hasClass('active')){
            this.ele.removeClass('active');
        }
        else{
            this.ele.addClass('active');
            this.ele.find('input').focus();
        }
    },
    // 通过添加timer来控制"点击本tool时不隐藏" 哈哈 解决啦~
    // 但是其他没有blur事件的弹出怎么做隐藏呢...
    _hideTool: function(){
        this.ele.removeClass('active');
    }
    // enterKey submit
    // click submit
    // and so on....

});

module.exports = ComposeCarid;