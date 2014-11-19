define(function(){

    var _config = {};

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
            $('#header .user .login-text').on('click', _event.login);

            $('#header .user .headpic, #header .user .trigger').on('click', _event.popUserMenu);
            _event.bindUsermenuHide();
            // 有推荐车辆时, 发送一个已读请求
            $('.gift-card.has-advice .go').on('click', _event.markAdviceRead);
        },
        login: function(){
            Souche.MiniLogin.checkLogin(function(){
                window.location.href = window.location.href;
            },true,false,false,true);
        },
        popUserMenu: function(){
            if($('#user-menu').hasClass('active')){
                $('#user-menu').removeClass('active');
            }
            else{
                $('#user-menu').addClass('active');
            }
        },
        bindUsermenuHide: function(){
            $(document.body).on('click', function(){
                $('#user-menu').removeClass('active');
            });
            var stopBubbleEles = $('#header .user .headpic, #header .user .trigger, #user-menu');
            stopBubbleEles.on('click', function(e){
                e.stopPropagation();
            });
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