define([], function(){
    var _config = null;

    var MIN_ROUND = 6;
    var MAX_ROUND = 9;


    var ele = {
        doc: $(document.body)
    };

    var _view = {
        init: function(){
            // _view.buildTurnList();
        },
        buildTurnList: function(){
            var list = document.createElement('ul');
            $list = $(list);
            $list.attr('id', 'turnto');
            var htmlStr = '';
            for(var i in angles){
                htmlStr += '<li class="turn-target" data-target="'+i+'">';
                htmlStr += i;
                htmlStr += '</li>';
            }
            $list.html(htmlStr);
            ele.doc.append($list);
        }
    };

    var _data = {
        getRandom: function(){
            var r = Math.random()
            if(r === 0){
            // if(r >0.5){
                // console.log('got what we wanna to exclude, try again...');
                return _data.getRandom()
            }
            else{
                return r;
            }
        },
        getRound: function(){
            var r = _data.getRandom();
            var round = MIN_ROUND + Math.round( r*(MAX_ROUND - MIN_ROUND) );
            return round;
        },
        getTagetAngle: function(target){
            var r = _data.getRandom();
            var max = _config.angles[target].end, min = _config.angles[target].start;
            var angle = min + Math.round( r*(max - min) );
            return angle;
        },
        getReword: function(){
            var index = Math.floor(Math.random()*(5));
            var n=0;
            // console.log(index);
            for(var i in _config.angles){
                if(n === index){
                    return i;
                }
                n++;
            }
        }
    };

    var _event = {
        bind: function(){
            // $('#start-turn').on('click', function(){
            //     // 随机计算一个奖品
            //     var result = _data.getReword();
            //     // 重置一下
            //     _event.reset();
            //     _event.go(result);
            // });
        },
        reset: function(){
            ele.table.css({
                '-webkit-transition': 'all 0 ease-out',
                    '-moz-transition': 'all 0 ease-out',
                    '-ms-transition': 'all 0 ease-out',
                    'transition': 'all 0 ease-out',
                    '-webkit-transform': 'rotate(0deg)',
                    '-moz-transform': 'rotate(0deg)',
                    '-ms-transform': 'rotate(0deg)',
                    'transform': 'rotate(0deg)'
            });
        },
        go: function(target){
            var round = _data.getRound();
            var targetAngle = _data.getTagetAngle(target);
            var total = targetAngle+round*360;
            var duration = Math.floor((1+Math.log(total)) * 300);
            var durationStr = duration + 'ms';
            var timingFunction = 'ease-out';
            var trans = 'rotate('+total+'deg)';

            var msg = '抽中了: ' + target + ', \n将会在'+duration+'毫秒内, 旋转'+round+'圈 零'+targetAngle+'度';
            // $('#console').text(msg);
            // console.log(msg);
            setTimeout(function(){
                ele.table.css({
                    '-webkit-transition': 'all '+ durationStr +' '+ timingFunction ,
                    '-moz-transition': 'all '+ durationStr +' '+ timingFunction ,
                    '-ms-transition': 'all '+ durationStr +' '+ timingFunction ,
                    'transition': 'all '+ durationStr +' '+ timingFunction ,
                    '-webkit-transform': trans,
                    '-moz-transform': trans,
                    '-ms-transform': trans,
                    'transform': trans
                })
            }, 500);
            // 阻止重复点击... 
            // 写cookie?

            // 返回旋转时间
            return duration;
        }
    }


    // 传入 盘的class, 需要操作他的样式;
    // 传入 奖品角度配置 angles

    function init(config){
        _config = config;
        
        // get ele
        for(var i in config._class){
            ele[i] = $('.'+config._class[i]);
        }
        _view.init();
        _event.bind();

        // 调整一个角度范围, 不要出现太靠近边缘的情况
        // 角度范围向里紧缩5deg
        for(var i in _config.angles){
            _config.angles[i].start = _config.angles[i].start + 10;
            _config.angles[i].end = _config.angles[i].end - 10;
        }
    }


    return {
        init: init,
        startZhuan: _event.go,
        reset: _event.reset,
        randomPrize: _data.getReword
    };
});