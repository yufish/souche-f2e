define(function(){

    var _view = {
        init: function(){
            _view.initChooseNav();
            _view.initLimitSaleHover();
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
        initWhoBuySlide: function(){
            $('.flexslider').flexslider({
                animation: "slide"
            });
        }
    }

    var Index = {
        init:function(){
            _view.init();
        }
    }
    return Index;
})