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
        if( this.props.uploadCallback instanceof Function){
            // exec upload
            // exec callback
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
                        method="GET" target="pic_upload_iframe" enctype="multipart/form-data"
                        action={this.props.imgUploadUrl}>
                        <input type="file" accept="image/*" ref="pic-input" id="pic-input" onChange={this._showPicPreview} />
                    </form>
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
    },
    _uploadImg: function(){

    }

});

module.exports = PicSelect;