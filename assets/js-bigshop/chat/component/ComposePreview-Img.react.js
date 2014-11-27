/**
 * @jsx React.DOM
 */

var React = require('react');
var path = require('path');


var ComposePreviewImg = React.createClass({

    getInitialState: function(){
        return {
            img: null
        };
    },
    componentDidMount: function(){
        // 提前绑定好onload事件 避免重复绑定
        if(window.FileReader){
            this.reader = new FileReader();
            this.reader.onload = function(){
                this.imgReaded = true;
                this.setState({
                    img: this.reader.result
                });
            }.bind(this);
        }

        // 不是很优雅的避免回调之后setState触发渲染
        // 然后一直循环 的办法
        this.imgReaded = false;
    },
    render: function() {
        var eleClassArr = ['compose-preview-img'];
        var node = null;

        if( this.props.img ){
            eleClassArr.push('active');

            // 根据浏览器选择
            // 显示预览还是只显示文件名
            if(window.FileReader){
                if( !this.imgReaded ){
                    this._readImgFile(this.props.img);
                }
                // 读取base64是个异步的过程
                if(this.state.img){
                    node = <img className="img-previewer" src={this.state.img} />
                }
            }
            else{
                node = <p className="compose-preview-img-name">{ this._getImgName(this.props.img)}</p>;
            }
        }
        this.imgReaded = false;


        return (
            <div className={eleClassArr.join(' ')}>
                {node}
                <a className="btn compose-priview-img-removeimg" onClick={this._removeImg}>移除图片</a>
            </div>
        );
    },
    _readImgFile: function(imgFile){
        //read as base 64
        //then set state
        this.reader.readAsDataURL( imgFile );
    },
    _getImgName: function(imgPath){
        return path.basename(imgPath);
    },
    _removeImg: function(){
        this.setState({img: null});
        this.props.unChooseImg();
    }

});

module.exports = ComposePreviewImg;