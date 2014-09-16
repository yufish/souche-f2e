/**
 * @jsx React.DOM
 */

(function(){
    var Bar = React.createClass({
        getInitialState: function() {
            return {};
        },
        render: function() {
            var valObj = this.props.valObj;
            var nodes = [];
            // 构建bar-value元素
            var valueProp = 'height';
            var styleObj = {};
            styleObj[valueProp] = this._consValueStyle(this.props.curValue, valObj.max, valObj.min);
            var classes = ['bar-value'];
            if(this.props.curValue== 0){

            }
            else if(this.props.curValue > valObj.guide){
                classes.push(this.props.classes.more)
            }
            else if(this.props.curValue < valObj.guide){
                classes.push(this.props.classes.less)
            }
            
            nodes.push(<div className={classes.join(' ')} style={styleObj} />);
            // endof 构建bar-value元素
            // 构建guideLine元素
            if(this.props.showGuideLine){
                var gStyle = {
                    // accord to 竖直 柱状图
                    'bottom': this._consValueStyle(valObj.guide, valObj.max, valObj.min)
                };
                var guideLine = <span className="guideLine" style={gStyle}></span>
                nodes.push( guideLine );
            }
            return (
                <li>
                    {nodes}
                </li>
            );
        },
        // 构建"表现值的样式值", 即height 或 width 的百分比值
        _consValueStyle: function(cur, max, min){
            var percentage = ((cur-min)/(max-min))*100;
            // console.log(percentage);
            if(percentage > 100){
                percentage = 100;
            }
            else if(percentage < 0){
                percentage = 0;
            }
            return percentage + '%';
        }

    });
    // module.exports = ;
    window.Bar = Bar;
})();

