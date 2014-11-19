define(['wannaBuy/sweetCountdown'],function(SweetCountdown){

    var _config = {};

    var _view = {
        init: function(){
            _view.initChooseNav();
            _view.initLimitSaleHover();
            _view.initLimitSaleCountdown();
            _view.initWhoBuySlide();
        },
        initChooseNav: function(){
            $("#choose_brand").on("mouseenter",function(){
                $(this).addClass("active");
            }).on("mouseleave",function(){
                $(this).removeClass("active");
            })
            $("#choose_model").on("mouseenter",function(){
                $(this).addClass("active");
            }).on("mouseleave",function(){
                $(this).removeClass("active");
            })
        },
        initLimitSaleHover: function(){
            // 鼠标进入bubble 和 图片时触发
            var triggerEl = $('.limit-sale .limit-info, .limit-sale .car-info .img-ctn');
            var affectEl = $('.limit-sale');
            triggerEl.on('mouseenter', function(){
                affectEl.addClass('hover');
            }).on('mouseleave', function(){
                affectEl.removeClass('hover');
            });
        },
        initLimitSaleCountdown: function(){
            var curTime = (new Date($('#nowtime').val())).valueOf();
            var endTime = (new Date($('.limit-sale-left-time').attr('deadline'))).valueOf();
            SweetCountdown.mini( {
                nowTime: Number(curTime),
                endTime: Number(endTime),
                zeroCallback: function(){
                    $('.left-time-data').html('限时优惠已结束');
                },
                ctn: $('.left-time-data'),
                showDay: true,
                word: {
                    pre: '',
                    day: ' 天 ',
                    hour: ' 时 ',
                    minute: ' 分 ',
                    second: ' 秒 '
                }
            });
        },
        initWhoBuySlide: function(){
            $('.flexslider').flexslider({
                animation: "slide"
            });
        }
    };

    var _data = {
        markAdviceRead: function(callback){
            // 不考虑返回值
            $.ajax({
                type: 'GET',
                url: _config.markAdivceRead
            }).always(callback);
        }
    };

    var _event = {
        bind: function(){
            // 有推荐车辆时, 发送一个已读请求
            $('.gift-card.has-advice .go').on('click', _event.markAdviceRead);
        },
        markAdviceRead: function(e){
            e.preventDefault();
            var card = $(this).parents('.gift-card');
            var adviceCount = Number(card.find('.advice-count').text());
            if(adviceCount > 0){
                _data.markAdviceRead(function(){
                    window.location.href= _config.wishCardPageUrl;
                });
            }
        }
    }

    var Index = {
        init:function(config){
            $.extend(_config, config);
            _view.init();
            _event.bind();
        }
    }
    return Index;
})