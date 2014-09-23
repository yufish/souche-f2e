define(function(){
    
    var _config = {
        interval: 3000
    };
    // 绑定事件
    var _view = {
        init: function(){
            var initSlide = $('.idc-item.active .idc-target');
            if( initSlide.length <= 0 ){
                // 取第一个
                initSlide = $('.idc-item .idc-target').eq(0);
            }
            initSlide.trigger('click');
        }
    }
    var slideContent = $('.costum-slide-ctn .content');
    var allSlide = slideContent.find('li');

    var slideIndicator = $('.report_control .costum-slide-ctn .indicator');
    var allIdc = slideIndicator.find('.idc-item');

    var autoSlideTimer = null;
    var _event = {
        bind: function(){
            slideIndicator.on('click', '.idc-target', _event.clickSwitch );
            _view.init();
        },
        clickSwitch: function(){
            var targetClass = $(this).attr('data-target');
            allSlide.removeClass('active');
            slideContent.find('.'+targetClass).addClass('active');

            allIdc.removeClass('active');
            $(this).parents('.idc-item').addClass('active');

            // 清空之前的定时
            clearInterval(autoSlideTimer);
            // 从现在开始auto
            _event.autoSlide();
        },
        autoSlide: function(){
            autoSlideTimer = setInterval(function(){
                var cur = slideIndicator.find('.idc-item.active');
                var next = cur.next('.idc-item');
                if(next.length <= 0){
                    next = slideIndicator.find('.idc-item').eq(0);
                }
                next.find('.idc-target').trigger('click');
            }, _config.interval);
        }
    }


    function init(config){
        _event.bind();

        $.extend(_config, config);
    }


    return {
        init: init,
        startAudoSlide: _event.autoSlide
    };
});