define(['acts/double11/like-share'], function(LikeShare){

    var _config = {};

    var _view = {
        init: function(){
        }
    };

    var _data = {
        sendLike: function( carid, callback ){
            var param = {
                foo: 'bar'
            };
            $.getJSON(_config.likeUrl, param, function(data, status){

            });
        }
    };


    var _event = {
        bind: function(){
            $('.share-button').on('click', _event.LikeAndPop);
        },
        LikeAndPop: function(e){
            LikeShare.popup(e);
            
            // Souche.MiniLogin.checkLogin(function(){
            //     _data.sendLike( '9527', function(data, status){
            //         LikeShare.popup(e);
            //     } );
            // },false,false,false,true);
        }
    };

    function init(pageConfig){
        $.extend(_config, pageConfig);

        LikeShare.init();

        _view.init();
        _event.bind();
    }

    return {
        init: init
    };
});