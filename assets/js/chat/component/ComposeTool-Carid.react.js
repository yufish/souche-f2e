/**
 * @jsx React.DOM
 */

var React = require('react');


function isNodeInRoot(node, root){
    //console.time('isNodeInRoot');
    while(node){
        if(node === root){
            //console.timeEnd('isNodeInRoot');
            return true;
        }
        node = node.parentNode;
    }
    //console.timeEnd('isNodeInRoot');
    return false;
    // 经简单测试, 每次耗时不多于0.1ms
    // 可能是因为dom层级不太深...?
}


var ComposeCarid = React.createClass({
    ele: null,
    componentDidMount: function(){
        this.ele = $(this.getDOMNode());
        this.input = $(this.refs['carid-input'].getDOMNode());

        // leart from react-bootstrap dropdown
        // https://github.com/react-bootstrap/react-bootstrap/blob/master/src/DropdownMenu.jsx
        $(document.body).on('click', function(e){
            // 如果点击事件发生在本元素之内
            if( isNodeInRoot(e.target, this.ele.get(0)) ){

            }
            else{
                this._hideTool();
            }
        }.bind(this));
    },
    render: function() {
        return (
            <div className="compose-tool compose-carid">
                <a className="compose-tool-icon" onClick={this._activeTool}></a>
                <div className="compose-tool-content">
                    <input type="text" id="carid-input" placeholder="请输入carid" ref="carid-input" onKeyDown={this._keyDownHandler}/>
                    <div className="btn btn-primary" id="send-carid" onClick={this._submitBtn}>发送</div>
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
            this.input.focus();
        }
    },
    // 通过添加timer来控制"点击本tool时不隐藏" 哈哈 解决啦~
    // 但是其他没有blur事件的弹出怎么做隐藏呢...
    _hideTool: function(){
        this.ele.removeClass('active');
    },
    // enterKey submit
    // click submit
    // and so on....
    _keyDownHandler: function(e){
        if(e.keyCode === 13 ){
            var input = e.target.value;
            if( this.props.validator(input) ){
                this.props.submitCarid(input);
                this._hideTool();
                e.target.value = '';
            }
        }
    },
    _submitBtn: function(){
        var input = this.input.val();
        if( this.props.validator(input) ){
            this.props.submitCarid(input);
            this._hideTool();
            this.input.val('');
        }
    }

});

module.exports = ComposeCarid;