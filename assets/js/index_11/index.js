define(['wannaBuy/sweetCountdown'],function(SweetCountdown){

    var _config = {};

    // 把 yyyy-mm-dd hh:mm:ss 转化为 mm/dd/yyyy hh:mm:ss
    // 后者是通用的new date的格式
    function getValidDateStr(str){
        var arr1 = str.split(' ');
        var ymd = arr1[0];
        var arr2 = ymd.split('-');
        var mdy = arr2[1] + '/' + arr2[2] +'/' + arr2[0];
        return [mdy, arr1[1]].join(' ');
    }

    // //banner-slide
    // $(document).ready(function() {
    //       $('.flexslider').flexslider({
    //           animation: "slide",
    //           slideshowSpeed: 4000,
    //           directionNav: true,
    //           controlNav: true,
    //           pauseOnHover: true
    //       });
    //   });
   ;
    $(document).ready(function(){
        $('.flex-viewport').unslider({
            speed: 500,
            delay: 3000, 
            keys: true,  
            dots: true,   
            fluid: true  
        });
        var unslider = $('.flex-viewport').unslider();
        $(".flex-prev").click(function(){
           unslider.data('unslider').stop();
           unslider.data('unslider').prev();
        });
        $(".flex-next").click(function(){
           unslider.data('unslider').stop();
           unslider.data('unslider').next();
        });

    })
    // $(".flexslider").mouseenter(function(){
    //       $(".flex-direction-nav").stop().animate({
    //           opacity:0.2
    //       },500)
    //   });
    // $(".flexslider").mouseleave(function(){
    //       $(".flex-direction-nav").stop().animate({
    //           opacity: 
    //       },500)
    //   });

    var _view = {
        init: function(){
            _view.initChooseNav();
            _view.initLimitSaleHover();
            _view.initLimitSaleCountdown();
            _view.initWhoBuySlide();
        },
        initChooseNav: function(){
            var isInBrand = false;
            var isInModel = false;
            $("#choose_brand").on("mouseenter",function(){
                isInBrand = true;
                var self = this;
                setTimeout(function(){
                    if(isInBrand){
                        $(self).addClass("active");
                    }
                },300)


            }).on("mouseleave",function(){
                isInBrand = false;
                var self = this;
                setTimeout(function(){
                    if(!isInBrand){
                        $(self).removeClass("active");
                    }
                },300)
            })
            $("#choose_model").on("mouseenter",function(){
                isInModel = true;
                var self = this;
                setTimeout(function(){
                    if(isInModel){
                        $(self).addClass("active");
                    }
                },300)
            }).on("mouseleave",function(){
                isInModel = false;
                var self = this;
                setTimeout(function(){
                    if(!isInModel){
                        $(self).removeClass("active");
                    }
                },300)
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
            var curTime = (new Date( getValidDateStr($('#nowtime').val()) )).valueOf();
            var endTime = (new Date( getValidDateStr($('.limit-sale-left-time').attr('deadline')) )).valueOf();
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
        $('.flexslider').unslider({
            speed: 500,
            delay: 3000,
            keys: true,  
            dots: true,   
            fluid: false  
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