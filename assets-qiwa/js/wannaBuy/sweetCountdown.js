
// 最简单的countdown
// 直接重写内容
// 无new
define(function(){
    // 接收两个毫秒数
    // opt
    function sweetCountdown(opt){
        var leftTime = opt.endTime - opt.nowTime;
        var timer = setInterval(function(){
            leftTime -= 1000;
            if( leftTime <= 0 ){
                clearInterval(timer);
                if( opt.zeroCallback instanceof Function){
                    opt.zeroCallback();
                }
            }
            else{
                consHTML( leftTime, opt.ctn, opt.word, opt.showDay );
            }
        }, 1000);

        consHTML( leftTime, opt.ctn, opt.word, opt.showDay );
    }
    // 是否显示 多少天
    function consHTML(leftTime, ctn, word, showDay){

        leftTime = Math.floor(leftTime/1000);
        var htmlStr = '' + word.pre||'';
        var hourCount = Math.floor(leftTime/3600);
        var day = '';
        var hour = 0;
        if( showDay ){
            day = Math.floor(hourCount/24);
            if( day > 0 ){
                htmlStr += '<span class="down-day">'+day + (word.day||':') +'</span>';
            }
            hour = hourCount%24;
        }
        else{
            hour = hourCount;
        }

        var minute = Math.floor( (leftTime - (hourCount * 3600)) / 60);
        var second = leftTime - (hourCount * 3600) - (minute*60);
        
        htmlStr += '<span class="down-hour">'+hour + (word.hour||':') +'</span>';
        htmlStr += '<span class="down-minute">'+ makeDoubleDigits(minute)  + (word.minute||':') + '</span>';
        htmlStr += '<span class="down-second">'+makeDoubleDigits(second) + (word.second||':') +'</span>';
        htmlStr += word.after||'';
        ctn.html( htmlStr );
    }

    function makeDoubleDigits(n){
        if(n>=10){
            return n;
        }
        else{
            return '0' + n;
        }
    }

    return {
        mini: sweetCountdown
    }
});