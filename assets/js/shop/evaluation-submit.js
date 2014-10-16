define(function(){

    var config = {};
    
    var _view = {
        updateActiveWidth: function(activeBar, wValue){
            activeBar.css('width', wValue + '%');
        }
    };

    var _data = {
        // 提交数据
        getActiveWidthByScore: function(score){
            var w = score*20;
            return w;
        }
    };

    var moseMoveTimer = null;
    var _event = {
        bind: function(){
            $('.eval-box').on('mousemove', '.eval i', _event.realTimeScore);
        },
        realTimeScore: function(e){
            // 如果是在100ms间隔内 不执行
            if( moseMoveTimer ){
                // console.log(moseMoveTimer);
                return false;
            }
            var scoreItem = $(this);
            var contItem = scoreItem.parents('.cont-item');
            var name = contItem.find('tit');

            // 位操作的黑魔法... 
            // 不会出现NaN
            var scoreN = ~~scoreItem.attr('data-score');
            // 找到这个i标签的左边定位
            var siStart = scoreItem.offset().left;
            var siW = scoreItem.width();
            var mouseLeft = e.pageX;

            if( mouseLeft - siStart < siW/2 ){
                scoreN -= 0.5;
            }

            // console.log(name.text() + ' should get this score: ' + scoreN);
            _view.updateActiveWidth( contItem.find('.eval-ac'), _data.getActiveWidthByScore(scoreN) );

            moseMoveTimer = setTimeout(function(){
                clearTimeout(moseMoveTimer);
                moseMoveTimer = false;
            }, 100);
        }
    }



    function init(_config){
        $.extend(config, _config);

        _event.bind();
    }

    return {
        init: init
    };
});