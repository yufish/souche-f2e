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
var ComposeCarid = require('./ComposeTool-Carid.react.js');

var Compose = React.createClass({
    propTypes: {
        textsHandler: React.PropTypes.func.isRequired
    },
    componentDidMount: function(){
        // 由toolbar负责把所有的tool隐藏
        //$(document.body).on('click', function(){
        //    var allTools = $('.compose-tool');
        //    allTools.removeClass('active');
        //});
        //$(this.getDOMNode()).on('click', function(e){
        //    // 一旦使用jquery的事件就会吧react的事件逻辑破坏掉...
        //    e.stopPropagation();
        //});
    },

    render: function() {

        return (
            
            <div className="compose-ctn"  style={this.props.style}>
                <div className="compose-toolbar" onClick={this._noBubble}>
                    <ComposeCarid />
                </div>
                <ComposeInput submitHandler={this.submitText}/>
            </div>
        );
    },
    submitText: function(text){
        this.props.textsHandler(text);
    },
    _noBubble: function(e){
        // 点击到toolbar之内不要隐藏...
        // 貌似无效啊...
        // 是因为绑在body上的和绑在这里的事件不是一个体系的吗```
        e.stopPropagation();
    },
    _insertText: function(){

    }
});

module.exports = Compose;