define([ 'souche/util/tool',  'detail/report/axis', 'detail/report/bar' ], function(Tool, Axis, Bar){

    var Histogram = function(config){
        this.ctn = config.ctn;
        this.ele = $(document.createElement('div'));
        this.bar = [];
        var gramClass = ['histogram'];
        var htmlStr = '';
        // 默认加上"竖直的"类
        gramClass.push('ver');

        var Width = 0;

        // 构造Y轴
        if(config.y && config.y.show == true){
            gramClass.push('with-y');
            // y轴高度和bar一样
            config.y.style.height = config.bar.style.height;
            this.yAxis = new Axis(config.y);
            this.ele.append(this.yAxis);
        }
        // Y轴占据的空间的宽度
        var yAxisSpaceW = px2Number(config.y.style.width) + px2Number(config.y.style.dis);
        Width += yAxisSpaceW;

        // 构建ChartContent
        var chartContent = $(document.createElement('ul'));
        chartContent.attr('class', 'chart-content');
        var chartFrag = document.createDocumentFragment();
        this.barConf = {
            style: config.bar.style,
            max: config.bar.max,
            min: config.bar.min,
            guide: config.bar.guide,
            cond: config.bar.cond,
            condClass: false
        };
        var items = config.bar.items;
        for(var i=0, j=items.length; i<j; i++){
            var barConf = {};
            for( var k in this.barConf ){
                if( this.barConf.hasOwnProperty(k) ){
                    barConf[k] = this.barConf[k];
                }
            }
            barConf.name = items[i].name;
            barConf.value = items[i].value;
            var tmpBar = new Bar(barConf);
            if(i !== 0){
                tmpBar.ele.style.marginLeft = config.bar.style.dis;
            }
            chartFrag.appendChild( tmpBar.ele );
            this.bar.push(tmpBar);
        }
        var chartW = j*px2Number(config.bar.style.width) + (j-1)*px2Number(config.bar.style.dis);
        chartContent.css({
            width: chartW + 'px',
            height: config.bar.style.height,
            'margin-left': yAxisSpaceW + 'px'
        });
        chartContent.append(chartFrag);
        this.ele.append(chartContent);

        Width += chartW;

        // 构造X轴
        if(config.x && config.x.show == true){
            // 构造x轴
            gramClass.push('with-x');
            // 通过bar的样式 计算和定位x轴
            if(!config.x.style){
                config.x.style = {};
            }
            config.x.style.width = chartW + 'px';
            // 根据bar宽度和间距, 定位x-axis刻度的宽度和间距
            if(!config.x.scale.style){
                config.x.scale.style = {};
            }
            config.x.scale.style.width = config.bar.style.width || 'auto';
            config.x.scale.style.dis = config.bar.style.dis || 'auto';

            this.xAxis = new Axis(config.x);
            this.ele.append(this.xAxis);
        }
        // this.ele.html(htmlStr);

        this.ele.attr('class', gramClass.join(' '));
        if(this.ele.length >0 ){
            this.ctn.append( this.ele );
        }
        this.ele.css('width', Width);
        return this;
    };

    // 接受一个数组作为参数, 对应各个bar
    Histogram.prototype.updateBar = function(valueArray) {
        if( valueArray.length !== this.bar.length ){
            console.log('传入新值的数量与柱子数量不符... 只更新部分bar或部分数据...');
        }
        this.barConf.condClass = true;
        // 遍历传入数组, 边界为柱子个数(多传值忽略)
        for(var i=0, j=Tool.getMin(this.bar.length, valueArray.length); i<j; i++){
            // 允许某个值为undefined或null, 这样就跳过这个更新
            if( valueArray[i] !== undefined && valueArray[i] !== null){
                var barConf = {};
                for( var k in this.barConf ){
                    if( this.barConf.hasOwnProperty(k)){
                        barConf[k] = this.barConf[k];
                    }
                }
                barConf.value = Number(valueArray[i]);
                this.bar[i].update(barConf);
            }
        }
        return this;
    };

    function px2Number(pxStr){
        return Number(pxStr.substr(0, pxStr.length-2));
    }

    return Histogram;
});