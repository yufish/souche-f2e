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

// 直接上传
// 立即发出消息
function handUploadCallback(imgUrl){
    // this.setState({
    //     uploadedImg: imgUrl
    // });
    if(imgUrl){
        this.props.sendPic(imgUrl)
    }
}

// 暂时用不到发图&文
// 现在只有单纯的图
// 所以 haveImg, enterUpload的逻辑都先用不着
// 留着吧
function enterUploadCallback(imgUrl){
    this.props.sendTnP(text, imgUrl);
    this.setState({
        haveImg: false,
        enterUpload: false,
        picUploadCallback: handUploadCallback.bind(this)
    });
}

var Compose = React.createClass({
    propTypes: {
        sendText: React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        return {
            picUploadCallback: handUploadCallback.bind(this),
            enterUpload: false
        };
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
                <div className="compose-toolbar">
                    <ComposeCarid
                        validator={this._validateCarid}
                        submitCarid={this.props.sendCarid}
                    />

                    <ComposePic
                        chooseImg={this._choosedImg}
                        unChooseImg={this._unChooseImg}
                        uploadCallback={this.state.picUploadCallback}
                        enterUpload={this.state.enterUpload}
                        imgUploadUrl={this.props.imgUploadUrl}
                    />

                </div>
                <ComposeInput submitHandler={this._submitText} validator={this._textValidator}/>
            </div>
        );
    },
    // 由于更多的发送方式 搞得程序越来越复杂了...
    _textValidator: function(text){
        if(this.haveImg){
            return true;
        }
        else if( text.trim() ){
            return true;
        }
        else{
            return false;
        }
    },
    _submitText: function(text){
        if( this.haveImg ){
            this.setState({
                picUploadCallback: enterUploadCallback.bind(this),
                enterUpload: true
            });
        }
        else{
            this.props.sendText(text);
        }
    },
    _insertText: function(){

    },
    _validateCarid: function(input){
        // 暂时找不到生成carid的规则, 一律返回true
        return true;
    },
    // 此时发送消息前会先submit图片, 然后提交文本内容
    _choosedImg: function(img){
        this.haveImg = true;
    },
    // 将有图片这个flag置为false
    _unChooseImg: function(){
        this.haveImg = false;
    }
});

module.exports = Compose;