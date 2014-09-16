/**
 * @jsx React.DOM
 */

(function(){
    var Bar = window.Bar;
    
    var Histogram = React.createClass({
        render: function(){
            var conf = this.props.config;
            var barValObj = {
                max: conf.value.max,
                min: conf.value.min,
                guide: conf.value.guide,
            };
            var BarList = conf.bars.map(function(data, i){
                return <Bar name={data.name} valObj={barValObj} curValue={data.value} key={i} showGuideLine={conf.showGuideLine} classes={conf.classes}/>;
            });
            return (
                <div className="histogram">
                    <ul className="chart-content hor">
                        {BarList}
                    </ul>
                </div>
            );
        }
    })

    // module.exports = ;
    window.Histogram = Histogram;
})();
