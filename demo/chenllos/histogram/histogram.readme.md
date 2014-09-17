## Histogram 柱状图

### feature

* 横着的柱状图, 竖着的柱状图(目前只支持竖着的) 指示类为hor(rizon) / ver(tical)
* y轴 x轴可为空
* bar给定最大值最小值和基准线值, 可根据基准线值附加不同的class

### 生成的dom结构
Histogram会根据传入的config生成如下dom结构, 如果传入的config包含所有支持的功能项:

整洁版:

    .histogram(.ver / .hor)
        ul.y-axis
            li.y-scale-item(*n)
        ul.chart-content
            li.chart-bar(*n)
                .bar-value
                .guideLine(*n)
        ul.x-axis
            li.x-scale-item(*n)

注释版
    
    .histogram(.ver / .hor)
        ul.y-axis    // y轴
            li.y-scale-item(*n)    // y轴刻度
        ul.chart-content    // 柱状图主题内容部分
            li.chart-bar(*n)    // 柱子们
                .bar-value    // 柱子值的指示dom
                .guideLine(*n)    // 基准线 可以为一个或多个, 但是多于两个之后就不会再生成相应的类了
        ul.x-axis    // x轴
            li.x-scale-item(*n)    // x轴刻度/指示词

### config格式
    
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
        },
        x: {
            show: true,
            scales: ['左前轮', '左后轮', '右前轮', '右后轮'],
            scaleUnit: '',
            // 要不要给高度呢...
            height: '20px'
        },
        ctn: $('.wheel-depth .safety-item-bd')
    }



