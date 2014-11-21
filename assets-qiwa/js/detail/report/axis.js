define(function(){
    // config
    //      list className
    //      scale item className
    //      scales: an array of scale item object
    // 
    /* demo:
    var demoConfig = {
        axis: {
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
    };
    */
         
    var Axis = function(config){
        var axis = document.createElement('ul');
        axis.setAttribute('class', config.axis.className);
        var scaleItemClassName = config.scale.className;

        var styleStr = '';
        if(config.style){
            styleStr += 'width: '+ (config.style.width||'auto') + ';';
            styleStr += 'height: '+ (config.style.height||'auto') + ';';
        }
        

        var html = '';
        var items = config.scale.items;
        var itemStyle = config.scale.style;
        var scaleStyle = {
            first: '',
            common: ''
        }
        if(itemStyle){
            scaleStyle.first = 'width: ' +(itemStyle.width|| 'auto')+ '; margin-left: 0;';
            scaleStyle.common = 'width: ' +(itemStyle.width|| 'auto')+ ';' + 'margin-left: ' +(itemStyle.dis||'auto')+';';
        }

        if(items.length > 0 ){
            // 有item 而且是有值的那种, 不是只有文本text
            if(items[0].value !== undefined){
                items.sort(function(a, b){
                    // 降序
                    return b.value - a.value;
                });

                // 值范围
                var max = items[0].value, min = items[items.length-1].value;
                var range = max - min;
                
                for(var i=0, j=items.length; i<j; i++){
                    // 如果没有文本  就不生成li 该项只会被作为求max/min的一员
                    if(!items[i].text){
                        continue;
                    }
                    var style = config.scale.valueStyleProp+': '+ ((max - items[i].value)/range)*100 +'%;';
                    if(i==0){
                        style += scaleStyle.first;
                    }
                    else{
                        style += scaleStyle.common;
                    }
                    
                    html += '<li class="'+scaleItemClassName+'" style="'+style+'">' + items[i].text + '</li>';
                }
            }
            // 没有value, 只有文本的情况
            else{
                for(var i=0, j=items.length; i<j; i++){
                    var style = '';
                    if(i==0){
                        style += scaleStyle.first;
                    }
                    else{
                        style += scaleStyle.common;
                    }
                    html += '<li class="'+scaleItemClassName+'" style="'+style+'">' + items[i].text + '</li>';
                }
            }
        }

        axis.innerHTML = html;
        axis.setAttribute('style', styleStr);
        return axis;
    };


    return Axis;
});