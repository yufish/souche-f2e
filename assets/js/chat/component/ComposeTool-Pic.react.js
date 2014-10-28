/**
 * @jsx React.DOM
 */

var React = require('react');

var PicSelect = React.createClass({
    componentDidMount: function(){
        this.picInput = this.refs['pic-input'].getDOMNode();
    },
    render: function() {
        return (
            <div className="compose-tool compose-pic">
                <a className="compose-tool-icon" onClick={this._triggerFileInput}></a>
                <div className="compose-tool-content">
                    <input type="file" accept="image/*" ref="pic-input" onChange={this._showPicPreview} />
                </div>
            </div>
        );
    },
    _triggerFileInput: function(){
        $(this.picInput).trigger('click');
    },
    _showPicPreview: function(){
        var picPath = this.picInput.value;
        // 根据浏览器的capability
        // 传file 或者 pathname
        if( window.FileReader ){
            this.props.previewImg(this.picInput.files[0]);
        }
        else{
            this.props.previewImg(picPath);
        }
    }

});

module.exports = PicSelect;