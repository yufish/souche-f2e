define(['souche/util/tool'], function(Tool){

    // config
    //      height
    //      width
    //      dis
    //      max
    //      min
    //      guide
    //      name, value
    //      cond:
    //          more:
    //              className
    //              text
    //              
    //          less: ...
    //          between: ...

    /* demo: 
    var demoConfig = {
        style: {},
        max: 1.9,
        min: 1.2,
        guide: 1.6,
        cond: {
            more: {
                text: '正常',
                className: 'normal'
            },
            less: {
                text: '危险',
                className: 'danger'
            }
        }
    };
    */
    // <li class="" style="" title="">
    //     <div class="bar-value " style="">
    //         <div class="value-text"></div>
    //     </div>
    //     <div class="guideLine"></div>
    // </li>

    var DEFAULT_VALUECLASS = 'bar-value';

    var Bar = function(config){
        var li = document.createElement('li');
        var classes = ['chart-bar'];
        this.name = config.name;
        this.value = config.value;
        
        

        var styleStr = '';
        styleStr += 'width:' + config.style.width + ';';
        styleStr += 'height:' + config.style.height + ';';

        li.setAttribute('class', classes.join(' '));
        li.setAttribute('style', styleStr);
        this.ele = li;

        // var html = '';
        // // var styleStr = 
        // html += buildBarValue(config);
        // html += buildGuideLine(config);
        // li.innerHTML = html;
        var barValue = document.createElement('div');
        this.barValue = barValue;
        var barValleDetail = getBarValueDetail(config);
        for( var i in barValleDetail.attr){
            if( barValleDetail.attr.hasOwnProperty(i) ){
                this.barValue.setAttribute( i.substr(1), barValleDetail.attr[i] );
            }
        }
        // title还是放在.chart-bar上, 不放在barValue上
        this.ele.title = this.name + ': ' + this.value;
        this.barValue.innerHTML = '<div class="value-text">' + barValleDetail.content + '</div>';
        this.ele.appendChild(this.barValue);

        var guideStyleArr = getGuideLineStyle(config);
        this.guideLineArr = [];
        for( var i=0, j=guideStyleArr.length; i<j; i++ ){
            var el = document.createElement('div');
            el.setAttribute('class', 'guideLine');
            this.guideLineArr.push(el);
            this.guideLineArr[i].setAttribute('style', guideStyleArr[i]);

            this.ele.appendChild( this.guideLineArr[i] );
        }

        return this;
    }
    Bar.prototype.update = function(config) {
        // 更新bar
        var barValleDetail = getBarValueDetail(config);
        for( var i in barValleDetail.attr){
            if( barValleDetail.attr.hasOwnProperty(i) ){
                this.barValue.setAttribute( i.substr(1), barValleDetail.attr[i] );
            }
        }
        this.ele.title = this.name + ': ' + config.value;
        this.barValue.innerHTML = '<div class="value-text">' + barValleDetail.content + '</div>';
        // this.ele.appendChild(this.barValue);

        // 更新guideline
        var guideStyleArr = getGuideLineStyle(config);
        for( var i=0, j=guideStyleArr.length; i<j; i++ ){
            var el = document.createElement('div');
            this.guideLineArr[i].setAttribute('style', guideStyleArr[i]);
        }
    };

    function getBarValueDetail(config){
        var value = config.value;
        var max = config.max;
        var min = config.min;
        var guide = config.guide;
        var cond = config.cond;
        
        var result = {};

        var valueStyle = 'height: '+ safeValue((value - min)/(max - min))*100 +'%;';
        var classArr = [DEFAULT_VALUECLASS];
        var text = '';
        if( typeof guide === 'number'){
            if(value >= guide){
                classArr.push(cond.more.className);
                text = cond.more.text || '';
            }
            else if(value < guide){
                classArr.push(cond.less.className);
                text = cond.less.text || '';
            }
        }
        else if(Array.isArray(guide)){
            var mm = Tool.getMaxMin(guide);
            if(value > mm.max){
                classArr.push(cond.more.className);
                text = cond.more.text || '';
            }
            else if(value < mm.min){
                classArr.push(cond.less.className);
                text = cond.less.text || '';
            }
            else{
                // 如果判断有between选项的话
                if( cond.between ){
                    classArr.push(cond.between.className);
                    text = cond.between.text || '';
                }
                // 没有的话就用less的class
                // 因为between也是低于最大值的
                else{
                    classArr.push(cond.less.className);
                    text = cond.less.text || '';
                }
            }
        }

        result.attr = {
            _style: valueStyle
        };
        // 如果传入的condClass为真
        if(config.condClass){
            result.attr._class = classArr.join(' ');
        }
        // false时  只带有默认class
        else{
            result.attr._class = DEFAULT_VALUECLASS;
        }
        
        result.content = text;
        return result;
    }
    function getGuideLineStyle( config ){
        var max = config.max;
        var min = config.min;
        var guide = config.guide;
        // var html = '';
        if( typeof guide == 'number' ){
            return ['top: '+ safeValue((max - guide)/(max - min))*100 +'%;'];
        }
        else if( Array.isArray(guide) ){
            var arr = [];
            for( var i=0, j=guide.length; i<j; i++ ){
                arr.push( 'top: '+ safeValue((max - guide[i])/(max - min))*100 +'%;' );
            }
            return arr;
        }
        return false;
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



    return Bar;
});