/**
 * @jsx React.DOM
 */

/*
 * 可以调节区块尺寸的容器
 * 
 * 
 */

var React = require('react');

// resize 拖拽元素的宽度/高度
var RESIZE_BAR_W = 2;

var isDrag = false, dragTarget=undefined;
function getPixalValue(str){
    return Number(str.substr(0, str.length-2));
}

// todo: 原生dom的class操作
// function addClass(ele, newClass){
//     var oldClass = ele.className;
// }

var Resizeable = React.createClass({
    propTypes:{
        id: React.PropTypes.string.isRequired
    },
    componentDidMount: function() {
        this.getCtnStyle();
        this.getResizeEle();
        // console.log(this.ctnStyle);
    },
    render: function() {
        return (
            <div id={this.props.id}
            className={'resizeable ' + this.props.classes || ''}
            onMouseUp={this._mouseUp}
            onMouseMove={this._mouseMove}  >

                {this.props.verLeftNode}

                <div className="resize-ver"
                onMouseDown={this._mouseDown}
                onMouseMove={this._mouseMove}
                onMouseUp={this._mouseUp} />
                {this.props.horTopNode}

                <div className="resize-hor"
                onMouseDown={this._mouseDown}
                onMouseMove={this._mouseMove}
                onMouseUp={this._mouseUp} />

                {this.props.horBottomNode}

            </div>
        );
    },
    _mouseDown: function(e){
        isDrag = true;
        dragTarget = e.target.className;
    },
    _mouseMove: function(e){
        if(isDrag && dragTarget){
            // console.log(e);
            if(dragTarget =='resize-ver'){
                // 添加class
                $(this.ele.ver).addClass('active');
                this._onDragVer(e);
            }
            else{
                // 添加class
                $(this.ele.hor).addClass('active');
                this._onDragHor(e);
            }
        }
    },
    _mouseUp: function(){
        // resize结束, 去除class
        $(this.ele.ver).removeClass('active');
        $(this.ele.hor).removeClass('active');

        isDrag = false;
    },
    _onDragVer: function(e){
        // console.log(e.pageX);
        var leftW = e.pageX - this.ctnStyle.x;
        var rightW = this.ctnStyle.width - leftW - RESIZE_BAR_W;

        // 通过校验后再执行dom操作
        if( this.props.verMoveValidator(leftW, rightW) ){
            this.ele.ver.style.left = leftW+'px';
            this.ele.hor.style.left = leftW+'px';

            this.props.verMoveCallback(leftW, rightW);
        }
    },
    _onDragHor: function(e){
        var topH = e.pageY - this.ctnStyle.y;
        var bottomH = this.ctnStyle.height - topH - RESIZE_BAR_W;
        // 通过校验后再执行dom操作
        if( this.props.horMoveValidator(topH, bottomH) ){
            this.ele.hor.style.top = topH+'px';

            this.props.horMoveCallback(topH, bottomH);
        }
    },
    ctnStyle: {
        x: 0,
        y: 0,
        height: 0,
        width: 0
    },
    ele: {
        ver: null,
        hor: null
    },
    getCtnStyle: function(){
        // this.getDOMNode() to get the returned ele

        var resizeEl = this.getDOMNode();
        this.ctnStyle.x = resizeEl.offsetLeft;
        this.ctnStyle.y = resizeEl.offsetTop;
        var cstyle = window.getComputedStyle(resizeEl);
        this.ctnStyle.height = getPixalValue(cstyle.height);
        this.ctnStyle.width = getPixalValue(cstyle.width);
    },
    getResizeEle: function(){
        this.ele.ver = document.querySelector('.resize-ver');
        this.ele.hor = document.querySelector('.resize-hor');
    }
});

module.exports = Resizeable;