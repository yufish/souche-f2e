// (function(){
    var angles = {
        // 竹炭
        charcoal: {
            start: 0,
            end: 72
        },
        // 公仔
        toy: {
            start: 72,
            end: 144
        },
        // 急救包
        aidKit: {
            start: 144,
            end: 216
        },
        // 奖金
        money: {
            start: 216,
            end: 288
        },
        // 大虫
        tager: {
            start: 288,
            end: 360
        }
    };
    var MIN_ROUND = 2;
    var MAX_ROUND = 5;

    var _id = {
        pointer: 'pointer',
        table: 'table'
    };
    var ele = {
        doc: $(document.body)
    };

    var _view = {
        init: function(){
            _view.buildTurnList();
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
        }
    };

    var _event = {
        bind: function(){
            ele.doc.on('click', '.turn-target', function(){
                var self = this;
                _event.reset();
                setTimeout(function(){
                    _event.go.call(self);
                }, 500);
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
        go: function(){
            var target = $(this).attr('data-target');
            var round = _data.getRound();
            var targetAngle = _data.getTagetAngle(target);
            var total = targetAngle+round*360;
            var duration = Math.floor((1+Math.log(total)) * 300) + 'ms';
            var timingFunction = 'ease-out';
            var trans = 'rotate('+total+'deg)';

            $('#console').text('将会在'+duration+'毫秒内, 旋转'+round+'圈 零'+targetAngle+'度');

            ele.table.css({
                '-webkit-transition-duration': duration,
                '-moz-transition-duration': duration,
                '-ms-transition-duration': duration,
                'transition-duration': duration,
                '-webkit-transition-timing-function': timingFunction,
                '-moz-transition-timing-function': timingFunction,
                '-ms-transition-timing-function': timingFunction,
                'transition-timing-function': timingFunction,
                '-webkit-transform': trans,
                '-moz-transform': trans,
                '-ms-transform': trans,
                'transform': trans
            })
        }
    }


    function init(){

        // get ele
        for(var id in _id){
            ele[id] = $('#'+_id[id]);
        }
        _view.init();
        _event.bind();
    }

    init();

// })();