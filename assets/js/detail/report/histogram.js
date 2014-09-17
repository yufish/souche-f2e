define(function(){
    var demoConfig = {
        y:{
            show: true,
            style: {
                width: '60px'
            },
            scales: [
                {
                    text: '1.2mm',
                    value: 1.2
                },
                {
                    text: '1.6mm<br/>(警戒值)',
                    value: 1.6
                },
                {
                    text: '1.9mm',
                    value: 1.9
                }
            ]
        },
        bar: {
            style: {
                width: '50px',
                height: '215px',
                dis: '25px'
            },
            values: [
                {
                    // join name and value together and show as title
                    name: '左前轮',
                    value: 1.8
                },
                {
                    name: '左后轮',
                    value: 1.55
                },
                {
                    name: '右前轮',
                    value: 1.65
                },
                {
                    name: '右后轮',
                    value: 1.75
                }
            ],
            max: 1.9,
            min: 1.2,
            guide: 1.6,
            classes: {
                more: 'normal',
                less: 'danger'
            }
            // another version:
            // if guide is a array
            // classes can have a between porp
            // guide: [1.5, 1.7],
            // classes: {
            //     more: 'danger',
            //     less: 'danger',
            //     between: 'normal'
            // }
        },
        x: {
            show: true,
            scales: ['左前轮', '左后轮', '右前轮', '右后轮'],
            scaleUnit: '',
            // 要不要给高度呢...
            height: '20px'
        },
        ctn: $('.wheel-depth .safety-item-bd')
    };


    var Histogram = function(config){
        this.ctn = config.ctn;
        this.ele = $(document.createElement('div'));
        var gramClass = ['histogram'];
        var htmlStr = '';
        // 默认加上"竖直的"类
        gramClass.push('ver');
        if(config.y && config.y.show == true){
            gramClass.push('with-y');
            // 构造y轴
            var yAxis = initY(config);
            // 填充...
            htmlStr += yAxis;
        }
        if(!(config.bar && config.bar.values)){
            console.warn('请在config中传递config.bar 和 config.bar.valus');
            return false;
        }
        var chartContent = initChartContent(config);
        htmlStr += chartContent;

        if(config.x && config.x.show == true){
            gramClass.push('with-x');
            var xAxis = initX(config);
            htmlStr += xAxis;
        }
        this.ele.attr('class', gramClass.join(' '));
        this.ele.html(htmlStr);
        if(this.ele.length >0 ){
            this.ctn.append( this.ele );
        }
        return this;
    };

    function initY(config){
        var ycon = config.y;
        // 重新排列
        ycon.scales.sort(function(a, b){
            // 降序
            return b.value - a.value;
        });
        // 值范围
        var max = ycon.scales[0].value, min = ycon.scales[ycon.scales.length-1].value;
        var range = max - min;

        var html = '<ul class="y-axis">';
        for(var i=0, j=ycon.scales.length; i<j; i++){
            var style = 'top: '+ ((max - ycon.scales[i].value)/range)*100 +'%';
            html += '<li class="y-scale-item" style="'+style+'">' + ycon.scales[i].text + '</li>';
        }
        html += '</ul>';
        return html;
    }

    function initChartContent(config){
        var html = '<ul class="chart-content">';
        var max = config.bar.max, min = config.bar.min;
        var guide = config.bar.guide;
        for(var i=0, j=config.bar.values.length; i<j; i++){
            var valObj = config.bar.values[i];
            html += '<li class="chart-bar" title="'+valObj.name+': '+valObj.value+'">';
            
            html += buildBarValue(valObj.value, max, min, guide, config.bar.classes);

            html += buildGuideLine(guide, max, min);
            
            html += '</li>';
        }
        html += '</ul>';
        return html;
    }
    function buildBarValue(cur, max, min, guide, classes){
        var html = '';
        var valueStyle = 'height: '+ safeValue((cur - min)/(max - min))*100 +'%;';
        var classArr = ['bar-value'];
        if( typeof guide === 'number'){
            if(cur >= guide){
                classArr.push(classes.more);
            }
            else if(cur < guide){
                classArr.push(classes.less);
            }
        }
        else{

        }

        html += '<div class="'+classArr.join(' ')+'" style="'+valueStyle+'">';
        html += '</div>';
        return html;
    }
    function buildGuideLine(guide, max, min){
        var html = '';
        var guideLineStyle = 'top: '+ safeValue((max - guide)/(max - min))*100 +'%'
        html += '<div class="guideLine">';
        html += '</div>';

        return html;
    }
    function safeValue(val, safeZone){
        safeZone = safeZone || {max: 1, min:0};
        if(val > safeZone.max){
            return safeZone.max;
        }
        else if(val < safeZone.min){
            return safeZone.min;
        }
        else{
            return val;
        }
    }

    function initX(config){
        var xcon = config.x;
        var html = '';
        html += '<ul class="x-axis">';
        for(var i=0,j=xcon.scales.length; i<j; i++){
            html +='<li class="x-scale-item">'+xcon.scales[i]+'</li>';
        }
        html += '</ul>';
        return html;
    }



    // function getMax

    var hist = new Histogram(demoConfig);


    return Histogram;
});