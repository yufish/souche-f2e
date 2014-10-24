/**
 * @jsx React.DOM
 */

/*
 * 编写内容的区域
 *      最初只是一个content-editable的容器
 *      慢慢可以增加 拖拽支持
 *              表情支持
 *              粘贴支持
 *              页面内截图
 *      都是基于"selection插入"
 */

var React = require('react');
var ComposeInput = require('./ComposeInput.react.js');

var Compose = React.createClass({
    propTypes: {
        textsHandler: React.PropTypes.func.isRequired
    },

    render: function() {
        return (
            <div className="compose-ctn"  style={this.props.style}>
                <ComposeInput submitHandler={this.submitText}/>
            </div>
        );
    },
    submitText: function(text){
        this.props.textsHandler(text);
    }
});

module.exports = Compose;