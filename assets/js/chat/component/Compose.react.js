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



/*
* 折中的办法: 既然现在img是单独发送的, 那就先把获取到的img单独展示
* 不再加到编辑的文本中, 可以避免很多复杂性
*
*
* */

var React = require('react');

var ComposeInput = require('./ComposeInput.react');
var ComposeCarid = require('./ComposeTool-Carid.react');
var ComposePic = require('./ComposeTool-Pic.react');
var ComposePreviewImg = require('./ComposePreview-Img.react');

var Compose = React.createClass({
    propTypes: {
        textsHandler: React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        return {
            img: null
        }
    },
    componentDidMount: function(){
    },
    render: function() {
        var imgPreviewClassArr = [];
        if( this.state.img ){
            imgPreviewClassArr.push('active');
        }
        return (
            <div className="compose-ctn"  style={this.props.style}>
                <div className="compose-toolbar" onClick={this._noBubble}>
                    <ComposeCarid
                        validator={this._validateCarid}
                        submitCarid={this.props.sendCarid}
                    />

                    <ComposePic previewImg={this._previewImg}/>

                </div>
                <ComposeInput submitHandler={this.submitText}/>
                <ComposePreviewImg img={this.state.img}/>
            </div>
        );
    },
    submitText: function(text){
        this.props.sendText(text);
    },
    _noBubble: function(e){
        // 点击到toolbar之内不要隐藏...
        // 貌似无效啊...
        // 是因为绑在body上的和绑在这里的事件不是一个体系的吗```
        e.stopPropagation();
    },
    _insertText: function(){

    },
    _validateCarid: function(input){
        // 暂时找不到生成carid的规则, 一律返回true
        return true;
    },
    // 下层负责文件选择的组件传值过来
    // 会是input.files[0] 或者 纯文本的文件名
    // 根据当前浏览器的support而定
    _previewImg: function(img){
        this.setState({img: img})
    }
});

module.exports = Compose;