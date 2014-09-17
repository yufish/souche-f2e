define(function(){
    var demoConfig = {
        y:{
            show: true,
            style: {
                width: '58px',
                dis: '20px'
            },

            axix: {
                style: {},
                className: 'y-axis'
            },
            scale: {
                style: {},
                className: 'y-scale-item',
                items: [
                    {text: '1.9mm', value: 1.9},
                    {text: '1.6mm<br/>警戒值', value: 1.6},
                    {text: '1.2mm', value: 1.2}
                ],
                valueStyleProp: 'top'
            }
        },
        bar: {
            style: {
                width: '50px',
                height: '215px',
                dis: '25px'
            },
            items: [
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
            cond: {
                more: {
                    className: 'normal',
                    text: '安全'
                },
                less: {
                    className: 'danger',
                    text: '危险'
                }
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
            axix: {
                style: {},
                className: 'x-axis'
            },
            scale: {
                style: {},
                className: 'x-scale-item',
                items: [
                    {text: '左前轮'},
                    {text: '左后轮'},
                    {text: '右前轮'},
                    {text: '右后轮'}
                ]
            }
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

        var Width = 0;

        // 构造Y轴
        if(config.y && config.y.show == true){
            gramClass.push('with-y');
            // y轴高度和bar一样
            config.y.style.height = config.bar.style.height;
            this.yAxis = new window.Axis(config.y);
            this.ele.append(this.yAxis);
        }
        // Y轴占据的空间的宽度
        var yAxisSpaceW = px2Number(config.y.style.width) + px2Number(config.y.style.dis);
        Width += yAxisSpaceW;

        // 构建ChartContent
        var chartContent = $(document.createElement('ul'));
        chartContent.attr('class', 'chart-content');
        var chartFrag = document.createDocumentFragment();
        var items = config.bar.items;
        for(var i=0, j=items.length; i<j; i++){
            var barConf = {
                style: config.bar.style,
                max: config.bar.max,
                min: config.bar.min,
                guide: config.bar.guide,
                cond: config.bar.cond
            };
            barConf.name = items[i].name;
            barConf.value = items[i].value;
            var tmpBar = new Bar(barConf);
            if(i !== 0){
                tmpBar.style.marginLeft = config.bar.style.dis;
            }
            chartFrag.appendChild( tmpBar );
        }
        var chartW = j*px2Number(config.bar.style.width) + (j-1)*px2Number(config.bar.style.dis);
        chartContent.css({
            width: chartW,
            height: config.bar.style.height,
            'margin-left': yAxisSpaceW
        })
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
            config.x.scale.style.width = chartW + 'px';
            config.x.scale.style.dis = config.bar.style.dis;

            this.xAxis = new window.Axis(config.x);
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

    function px2Number(pxStr){
        return Number(pxStr.substr(0, pxStr.length-2));
    }



    // function getMax

    var hist = new Histogram(demoConfig);


    return Histogram;
});