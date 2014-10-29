/**
 * @jsx React.DOM
 */

var React = require('react');
var ImagePreview = require('./ComposePreview-Img.react');

var PicSelect = React.createClass({
    getInitialState: function(){
        return {img: null};
    },
    componentDidMount: function(){
        this.picInput = this.refs['pic-input'].getDOMNode();
    },
    // 传过来的props有变更, 就会触发updated事件,
    // 也就是说组件不一定更新了, 只是这个过程走完了
    componentDidUpdate: function(){
        //console.log('updated... ');
        if( this.props.enterUpload){
            // exec upload
            // exec callback
            this.refs['upload-form'].submit();
        }
    },
    render: function() {
        var picToolClassArr = ['compose-tool', 'compose-pic'];
        if(this.state.img){
            picToolClassArr.push('active');
        }
        return (
            <div className={picToolClassArr.join(' ')}>
                <a className="compose-tool-icon" onClick={this._triggerFileInput}></a>
                <div className="compose-tool-content">
                    <form name="msg-pic-upload" id="msg-pic-upload"
                        ref="upload-form"
                        method="POST" target="pic_upload_iframe" encType="multipart/form-data"
                        action={this.props.imgUploadUrl}
                        onSubmit={this._watchRes}
                    >
                        <input type="file" accept="image/*" name="file_info" ref="pic-input" id="pic-input" onChange={this._showPicPreview} />
                        <span className="tip-text">也可以继续编辑消息, 回车后一起发送. 或者</span>
                        <input type="submit" id="upload-imp-btn" value="上传并发送"/>
                    </form>
                    {/* iframe for watch response of post */}
                    <iframe name="pic_upload_iframe" id="pic_upload_iframe"></iframe>
                    <ImagePreview img={this.state.img}
                        unChooseImg={this._unChooseImg}
                    />
                </div>
            </div>
        );
    },
    _triggerFileInput: function(){
        $(this.picInput).trigger('click');
    },
    _showPicPreview: function(){
        // 根据浏览器的capability
        // 传file 或者 pathname
        if( window.FileReader ){
            this.setState({
                img: this.picInput.files[0]
            });
        }
        else{
            var picPath = this.picInput.value;
            this.setState({
                img: picPath
            });
        }
        this.props.chooseImg();
    },
    _unChooseImg: function(){
        this.setState({img: null});
        this.props.unChooseImg();
        this.picInput.value = '';
    },
    _watchRes: function(e){
        var uploadIframe = window.frames[ 'pic_upload_iframe' ];
        var watchTimer = setInterval( function(){
            var resStr = $.trim(uploadIframe.document.body.innerText);
            if( resStr ){
                clearInterval( watchTimer );
                uploadIframe.document.body.innHTML = '';
                var res;
                try{
                    res = JSON.parse( resStr );
                    
                }
                // 只去catch parseJSON的错误
                catch(e){
                    alert('上传图片失败... 请稍后重试')
                    this.props.uploadCallback( null );
                    return;
                }
                if(res.code == '100000'){
                    this.props.uploadCallback( res.data.path );
                }
                else{
                    console.log('upload img failed...');
                    this.props.uploadCallback(null);
                }
                this._unChooseImg();
            }
        }.bind(this), 200 );
    }

});

module.exports = PicSelect;