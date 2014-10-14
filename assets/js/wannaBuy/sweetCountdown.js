
// 最简单的countdown
// 直接重写内容
// 无new
define(function(){
    // 接收两个毫秒数
    // opt
    function sweetCountdown(opt){
    // function sweetCountdown(nowTime, endTime, ctn, zeroCallback){
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
                consHTML( leftTime, opt.ctn, opt.word );
            }
        }, 1000);
        consHTML( leftTime, opt.ctn, opt.word );
    }

    function consHTML(leftTime, ctn, word){

        leftTime = Math.floor(leftTime/1000);
        var htmlStr = '' + word.pre||'';
        var hour = Math.floor(leftTime/3600);
        var minute = Math.floor( (leftTime - (hour * 3600)) / 60);
        var second = leftTime - (hour * 3600) - (minute*60);
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