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
    };

    var _event = {
        bind: function(){
            $('#header .user .login-text').on('click', _event.login);

            $('#header .user .headpic, #header .user .trigger').on('click', _event.popUserMenu);
            _event.bindUsermenuHide();
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
        }
    }

    var Index = {
        init:function(){
            _view.init();
            _event.bind();
        }
    }
    return Index;
})