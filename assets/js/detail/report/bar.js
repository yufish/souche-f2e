(function(){

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
    // 
    //          

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


    var Bar = function(config){
        var li = document.createElement('li');
        var classes = ['chart-bar'];
        
        var html = '';
        // var styleStr = 
        html += buildBarValue(config);
        html += buildGuideLine(config);

        var styleStr = '';
        styleStr += 'width:' + config.style.width + ';';
        styleStr += 'height:' + config.style.height + ';';

        li.setAttribute('class', classes.join(' '));
        li.setAttribute('style', styleStr);
        li.innerHTML = html;
        return li;
    }

    function buildBarValue(config){
        var value = config.value;
        var max = config.max;
        var min = config.min;
        var guide = config.guide;
        var cond = config.cond;
        // var classes
        var html = '';
        var valueStyle = 'height: '+ safeValue((value - min)/(max - min))*100 +'%;';
        var classArr = ['bar-value'];
        var text = '';
        if( typeof guide === 'number'){
            if(value >= guide){
                classArr.push(cond.more.className);
                text = cond.more.text;
            }
            else if(value < guide){
                classArr.push(cond.less.className);
                text = cond.less.text;
            }
        }
        // else{

        // }

        html += '<div class="'+classArr.join(' ')+'" style="'+valueStyle+'">';
        if(text){
            html += '<div class="value-text">'+text+'</div>';
        }
        html += '</div>';
        return html;
    }
    function buildGuideLine( config ){
        var max = config.max;
        var min = config.min;
        var guide = config.guide;
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

    window.Bar = Bar;
})();