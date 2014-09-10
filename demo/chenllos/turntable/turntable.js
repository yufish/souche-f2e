// (function(){
    var angles = {
        // 大虫
        tager: {
            start: 0,
            end: 72
        },
        // 奖金
        money: {
            start: 72,
            end: 144
        },
        // 急救包
        aidKit: {
            start: 144,
            end: 216
        },
        // 公仔
        cat_toy: {
            start: 216,
            end: 288
        },
        // 竹炭
        charcoal_toy: {
            start: 288,
            end: 360
        }
    };

    // 调整一个角度范围, 不要出现太靠近边缘的情况
    // 角度范围向里紧缩5deg
    for(var i in angles){
        angles[i].start = angles[i].start + 5;
        angles[i].end = angles[i].end - 5;
    }


    var MIN_ROUND = 3;
    var MAX_ROUND = 6;

    var _class = {
        pointer: 'pointer',
        table: 'table'
    };
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
                console.log('got what we wanna to exclude, try again...');
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
            var max = angles[target].end, min = angles[target].start;
            var angle = min + Math.round( r*(max - min) );
            return angle;
        },
        getReword: function(){
            var index = Math.floor(Math.random()*(5));
            var n=0;
            console.log(index);
            for(var i in angles){
                if(n === index){
                    return i;
                }
                n++;
            }
        }
    };

    var _event = {
        bind: function(){
            $('#start-turn').on('click', function(){
                // 随机计算一个奖品
                var result = _data.getReword();
                // 重置一下
                _event.reset();
                _event.go(result);
            });
        },
        reset: function(){
            ele.table.css({
                '-webkit-transition-duration': '0ms',
                'transition-duration': '0ms',
                '-webkit-transform': 'rotate('+0+'deg)',
                'transform': 'rotate('+0+'deg)'
            })
        },
        go: function(target){
            var round = _data.getRound();
            var targetAngle = _data.getTagetAngle(target);
            var total = targetAngle+round*360;
            var duration = Math.floor((1+Math.log(total)) * 300) + 'ms';
            var timingFunction = 'ease-out';
            var trans = 'rotate('+total+'deg)';

            var msg = '抽中了: ' + target + ', \n将会在'+duration+'毫秒内, 旋转'+round+'圈 零'+targetAngle+'度';
            $('#console').text(msg);
            console.log(msg);
            setTimeout(function(){
                ele.table.css({
                    '-webkit-transition': 'all '+ duration +' '+ timingFunction ,
                    '-moz-transition': 'all '+ duration +' '+ timingFunction ,
                    '-ms-transition': 'all '+ duration +' '+ timingFunction ,
                    'transition': 'all '+ duration +' '+ timingFunction ,
                    '-webkit-transform': trans,
                    '-moz-transform': trans,
                    '-ms-transform': trans,
                    'transform': trans
                })
            }, 500);
            // 阻止重复点击... 
            // 写cookie?
        }
    }


    function init(){

        // get ele
        for(var id in _class){
            ele[id] = $('.'+_class[id]);
        }
        _view.init();
        _event.bind();
    }

    init();

// })();