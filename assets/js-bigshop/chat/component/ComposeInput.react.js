/**
 * @jsx React.DOM
 */

var React = require('react');

var ComposeInput = React.createClass({
    componentDidMount: function() {
        this._ele = this.getDOMNode();
    },
    render: function() {
        return (
            <div className="compose-input"
                contentEditable
                onKeyDown={this._keyDownHandler}
            >
            </div>
        );
    },
    _ele: null,
    _keyDownHandler: function(e){
        if(e.keyCode == 13){
            // ctrl + enter 还是可以换行的
            // console.log(e);
            if(e.ctrlKey){

            }
            else{
                var value = this._ele.textContent.trim();
                // console.log( value );
                // call submitHandler
                if( this.props.validator(value) ){
                    this.props.submitHandler( value );
                    this._ele.innerHTML = '';
                }
                e.preventDefault();
            }
        }
    }

});

module.exports = ComposeInput;