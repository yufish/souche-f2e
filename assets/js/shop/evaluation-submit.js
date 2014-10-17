define(function(){

    var config = {};

    var scoreText = {
        1: '很差',
        2: '一般',
        3: '好',
        4: '很好',
        5: '非常好'
    };
    
    var _view = {
        init:  function(){
            _view.initResult();
        },
        updateScoreView: function(contItem, score){
            var activeBar = contItem.find('.eval-ac');
            var result = contItem.find('.result');
            var title = contItem.find('.tit');

            activeBar.css('width', _data.getActiveWidthByScore(score) + '%');
            if( score <= 0 ){
                _view.setInitialResult(result, title.text());
            }
            else{
                result.addClass('active').html( scoreText[score] );
            }
        },
        initResult: function(){
            $('.cont-item').each(function(i, el){
                var title = $(el).find('.tit');
                var result = $(el).find('.result');
                _view.setInitialResult(result, title.text());
            });
        },
        setInitialResult: function(resultEl, title){
            resultEl.removeClass('active').html('给'+ $.trim(title) +'打分');
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
            $('.eval-box').on('click', '.eval i', _event.clickScore);
            $('.eval-box').on('mouseleave', '.eval', _event.clearRealTime);
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
            /* -------- 半分的判断. 不需要半分 --------*/
            // 找到这个i标签的左边定位
            // var siStart = scoreItem.offset().left;
            // var siW = scoreItem.width();
            // var mouseLeft = e.pageX;
            // if( mouseLeft - siStart < siW/2 ){
            //     scoreN -= 0.5;
            // }
            /* --------   endof 半分的判断   --------*/

            // console.log(name.text() + ' should get this score: ' + scoreN);
            _view.updateScoreView( contItem, scoreN );

            moseMoveTimer = setTimeout(function(){
                clearTimeout(moseMoveTimer);
                moseMoveTimer = false;
            }, 30);
        },
        clickScore: function(e){
            var scoreItem = $(this);
            var contItem = scoreItem.parents('.cont-item');
            var scoreN = ~~scoreItem.attr('data-score');

            contItem.attr('data-clicked-score', scoreN);
        },
        clearRealTime: function(e){
            var evalBar = $(this);
            var contItem = $(this).parents('.cont-item');
            var lastClickScore = ~~contItem.attr('data-clicked-score');

            _view.updateScoreView( contItem, lastClickScore );
        }
    }



    function init(_config){
        $.extend(config, _config);

        _view.init();

        _event.bind();
    }

    return {
        init: init
    };
});