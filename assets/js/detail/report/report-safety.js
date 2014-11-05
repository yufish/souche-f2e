define(['detail/report/histogram'], function(Histogram){

    var IS_MOBILE = /ipad|iphone|android/i.test(window.navigator.userAgent);

    var baseConfig = {
        y: {
            show: true,
            style: { width: '58px', dis: '32px'},
            axis: { className: 'y-axis' },
            scale: { className: 'y-scale-item', items: [], valueStyleProp: 'top' }
        },
        x: {
            show: true,
            axis: { className: 'x-axis' },
            scale: { className: 'x-scale-item', items: [] }
        },
        bar: {
            style: { width: '50px', height: '215px', dis: '25px' },
            items: [],
            max: 1.9,
            min: 1.2,
            guide: 1.6,
            cond: {
                more: { className: 'normal', text: '安全' },
                less: { className: 'danger', text: '危险' }
            },
            // 初始时 不通过值判断class
            condClass: false
        }
    };


    function getConfig( xItems, yItems, bar, ctn){
        var newConf = $.extend(true, {}, baseConfig);
        if(xItems){
            newConf.x.scale.items = xItems;
        }
        else{
            newConf.x.show = false;
        }
        if(yItems){
            newConf.y.scale.items = yItems;
        }
        else{
            newConf.y.show = false;
        }
        newConf.bar = $.extend(true, {}, newConf.bar, bar);
        newConf.ctn = ctn;
        // console.log(newConf);
        return newConf;
    }

    var APPEAR_DIS = 150;


    var WHEELDEPTH_GUIDEVALUE = 1.6;
    var wheelDepth = {
        init: function(){
            // 元素存在才操作
            if($('.safety-item.wheel-depth').length > 0){
                var hist = new Histogram(wheelDepth.getConfig());
                wheelDepth.hist = hist;
                wheelDepth.bind();
            }
        },

        // 胎纹深度模块比较特殊, 需要分段比例
        // 安全值: 1.6 ~ 5.0
        // 危险值: 1.0 ~ 1.6
        // 所以在给柱状图初始化和update的时候
        //      对值做一些手脚, 实现分段比例
        // 定为以危险值的比例为准, 对安全值就行换算
        // 同时注意修改bar的title, 显示的得是修改前的值
        getConfig: function(){
            // 真正的最大值
            // 根据设计, 1.0 ~ 1.6显示为80px,
            //      上部显示为135px
            // 根据这个来计算实际的最大值
            var realTopVal = 135/80 * (1.6-1);
            var realMax = WHEELDEPTH_GUIDEVALUE + realTopVal;
            var yItems =  [
                    {text: '5.0mm', value: realMax},
                    {text: '1.6mm<br/>(警戒值)', value: WHEELDEPTH_GUIDEVALUE},
                    {text: '1.0mm', value: 1.0}
                    ];
            var xItems =  [{text: '左前轮'},
                    {text: '左后轮'},
                    {text: '右前轮'},
                    {text: '右后轮'} ];
             var barConf = {
                max: realMax,
                min: 1.0,
                guide: WHEELDEPTH_GUIDEVALUE,
                items: [
                { name: '左前轮', value:  0},
                { name: '左后轮', value:  0},
                { name: '右前轮', value:  0},
                { name: '右后轮', value:  0}
                ],
                cond: {
                    more: { className: 'normal bounceInUp animated', text: '安全' },
                    less: { className: 'danger bounceInUp animated', text: '危险' }
                },
                condClass: false
            };
            return getConfig( xItems, yItems, barConf, $('.wheel-depth .safety-item-bd') );
        },
        bind: function(){
            function readAndUpdate(){
                var realValue = $('.wheel-depth .safety-item-bd').attr('data-reportdata').split(' ');
                // 分段比例
                var adjustArr = [];
                var realTopVal = 135/80 * (1.6-1);
                var viewTopVal = 5.0 - WHEELDEPTH_GUIDEVALUE;
                for( var i=0, j=realValue.length; i<j; i++ ){
                    // 高于基准值的, 要进行一些换算
                    if( realValue[i] > WHEELDEPTH_GUIDEVALUE ){
                        var top = (realValue[i] - WHEELDEPTH_GUIDEVALUE) * realTopVal / viewTopVal;
                        var adjustedVal = WHEELDEPTH_GUIDEVALUE + top;
                        adjustArr.push( adjustedVal );
                    }
                    // 低于的 直接push
                    else{
                        adjustArr.push( realValue[i] );
                    }
                }
                wheelDepth.hist.updateBar( adjustArr );

                // 将title换回原始值
                setTimeout(function(){
                    wheelDepth.hist.ele.find('.chart-bar').each(function(index, el){
                        var adjustedTitle = el.title;
                        var name = adjustedTitle.substr(0, 5);
                        // console.log(adjustedTitle);
                        el.title = name + realValue[index];
                    })
                }, 100);
            }
            if(IS_MOBILE){
                readAndUpdate();
            }
            else{
                Souche.Util.appear( ".wheel-depth .safety-item-bd", readAndUpdate, APPEAR_DIS);
            }
        }
    };

    var brakeThickness = {
        init: function(){
            // 元素存在才操作
            if($('.safety-item.brake-thickness').length > 0){
                var hist = new Histogram(brakeThickness.getConfig());
                brakeThickness.hist = hist;
                brakeThickness.bind();
            }
        },
        getConfig: function(){
            // 没有最大/最小值
            // 只有一个界限
            // 传来的数据也只有 0->正常  1->偏高  -1->偏低
            var yItems =  [
                    {text: '', value: 1.9},
                    {text: '警戒值', value: 1.6},
                    {text: '', value: 1.2}
                    ];
            var xItems =  [{text: '左前轮'},
                    {text: '左后轮'},
                    {text: '右前轮'},
                    {text: '右后轮'} ];
             var barConf = {
                max: 1.9,
                min: 1.2,
                guide: 1.6,
                items: [
                { name: '左前轮', value:  0},
                { name: '左后轮', value:  0},
                { name: '右前轮', value:  0},
                { name: '右后轮', value:  0}
                ],
                cond: {
                    more: { className: 'normal bounceInUp animated', text: '安全' },
                    less: { className: 'danger bounceInUp animated', text: '偏薄' }
                },
                condClass: false
            };
            return getConfig( xItems, yItems, barConf, $('.brake-thickness .safety-item-bd') );
        },
        bind: function(){
            function readAndUpdate(){
                var relValue = $('.brake-thickness .safety-item-bd').attr('data-reportdata').split(' ');
                for( var i=0, j=relValue.length; i<j; i++ ){
                    if( relValue[i]==0 ){
                        relValue[i] = 1.75;
                    }
                    else if( relValue[i] == -1){
                        relValue[i] = 1.45;
                    }
                }
                brakeThickness.hist.updateBar( relValue );
            }
            if(IS_MOBILE){
                readAndUpdate();
            }
            else{
                Souche.Util.appear( ".wheel-depth .safety-item-bd", readAndUpdate, APPEAR_DIS);
            }
        }
    };

    var liquidLevel = {
        init: function(){
            // 元素存在才操作
            if($('.safety-item.liquid-level').length > 0){
                var hist = new Histogram(liquidLevel.getConfig());
                liquidLevel.hist = hist;
                liquidLevel.bind();
            }
        },
        getConfig: function(){
            var yItems =  [
                    {text: '', value: 3},
                    {text: '(最高警戒值)', value: 2},
                    {text: '(最低警戒值)', value: 1},
                    {text: '', value: 0}
                    ];
            var xItems =  [{text: '制动液'},
                    {text: '机油'},
                    {text: '助力油'},
                    {text: '变速箱'} ];
            var barConf = {
                max: 3,
                min: 0,
                guide: [1, 2],
                items: [
                { name: '制动液', value:  0},
                { name: '机油', value:  0},
                { name: '助力油', value:  0},
                { name: '变速箱', value:  0}
                ],
                cond: {
                    more: { className: 'danger bounceInUp animated', text: '偏高' },
                    less: { className: 'danger bounceInUp animated', text: '偏低' },
                    between: { className: 'normal bounceInUp animated', text: '安全' }
                },
                condClass: false
            };
            return getConfig( xItems, yItems, barConf, $('.liquid-level .safety-item-bd') );
        },
        bind: function(){
            function readAndUpdate(){
                var relValue = $('.liquid-level .safety-item-bd').attr('data-reportdata').split(' ');
                for( var i=0, j=relValue.length; i<j; i++ ){
                    if( relValue[i]==0 ){
                        relValue[i] = 1.5;
                    }
                    else if( relValue[i] == -1){
                        relValue[i] = 0.8;
                    }
                    else if( relValue[i] == 1){
                        relValue[i] = 2.25;
                    }
                }
                liquidLevel.hist.updateBar( relValue );
            }
            if(IS_MOBILE){
                readAndUpdate();
            }
            else{
                Souche.Util.appear( ".wheel-depth .safety-item-bd", readAndUpdate, APPEAR_DIS);
            }
        }
    };

    var antiFreeze = {
        init: function(){
            // 元素存在才操作
            if($('.safety-item.antifreeze').length > 0){
                var antiConfig = antiFreeze.getConfig();
                // 修正config, 增加新的调整
                antiConfig.y.style.width = '82px';
                var hist = new Histogram( antiConfig );
                var bottomBallPos = -(40/2);
                bottomBallPos += (hist.ele.width()/2 - 50) + 5;
                $('.antifreeze .bottom-ball').css('margin-left',  bottomBallPos);

                antiFreeze.hist = hist;
                antiFreeze.bind();
            }
        },
        getConfig: function(){
            var yItems =  [
                    {text: '', value: -15},
                    {text: '-25C<br/>(警戒值)', value: -25},
                    {text: '-35C', value: -35},
                    {text: '-45C<br/>', value: -45},
                    {text: '', value: -55}
                    ];
            var xItems =  false;
            var barConf = {
                style: { width: '40px', height: '275px', dis: '0' },
                max: -15,
                min: -55,
                guide: [-25, -35, -45],
                // 初始值 应该为底部 而不是简单的0
                items: [
                    { name: '防冻液冰点', value:  -55}
                ],
                cond: {
                    more: { className: 'danger bounceInUp animated', text: '危险' },
                    less: { className: 'normal bounceInUp animated', text: '安全' }
                },
                // 初始时 不通过值判断class
                condClass: false
            };
            return getConfig( xItems, yItems, barConf, $('.antifreeze .safety-item-bd .hist-ctn') );
        },
        bind: function(){
            function readAndUpdate(){
                var relValue = [Number($('.antifreeze .safety-item-bd').attr('data-reportdata'))];
                antiFreeze.hist.updateBar(relValue);
                // 更新底部小球的class
                if( antiFreeze.hist.ele.find('.bar-value').hasClass('normal') ){
                    $('.antifreeze .bottom-ball').addClass('normal');
                }
                else{
                    $('.antifreeze .bottom-ball').addClass('danger');
                }

                // 动画结束后
                // 将value-text定位在小球上时仍可见
                var valueText = antiFreeze.hist.ele.find('.value-text');
                valueText.css('opacity', 0);
                setTimeout(function(){
                    antiFreeze.hist.ele.find('.chart-bar').css('overflow', 'visible');
                    valueText.animate({opacity: 1, duration: 100});
                }, 800);
            }
            if(IS_MOBILE){
                readAndUpdate();
            }
            else{
                Souche.Util.appear( ".wheel-depth .safety-item-bd", readAndUpdate, APPEAR_DIS);
            }
        }
    };
    




    var safetyModule = {
        init: function(){
            wheelDepth.init();
            brakeThickness.init();
            liquidLevel.init();
            antiFreeze.init();
        }
    };
    



    return safetyModule;
});