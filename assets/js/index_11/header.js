
define(function(){
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
        },
    };

    function init(){
        _event.bind();
    }

    return {
        init: init
    };
});