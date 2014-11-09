// 引入点赞分享 和 五折区/精品区
define(['acts/double11/like-share', 'acts/double11/zone'], function(LikeShare, Zone){

    var _config = {};

    var _view = {
        init: function(){
        }
    };

    var _data = {
        sendLike: function( carid, price, callback ){
            var param = {
                carId: carid,
                price: price
            };
            $.getJSON(_config.likeUrl, param, function(data, status){

            });
        },
        miaosha: function(carid, price, callback){
            var param = {
                carId: carid,
                price: price
            };
            $.getJSON(_config.miaoshaUrl, param, callback);
        }
    };


    var _event = {
        bind: function(){
            // 点赞的事件绑定
            $('.car-box:not(.miaosha-box) .share-button').on('click', _event.LikeAndPop);
            // 秒杀
            $('.car-box.miaosha-box .share-button').on('click', _event.miaosha);
        },
        LikeAndPop: function(e){
            var carBox = $(e.target).parents('.car-box');
            var carId = carBox.attr('data-carid');
            LikeShare.popup(carBox, 'like', {});
            
            // Souche.MiniLogin.checkLogin(function(){
            //     _data.sendLike( '9527', function(data, status){
            //         LikeShare.popup(e);
            //     } );
            // },false,false,false,true);
        },
        miaosha: function(e){
            var carBox = $(e.target).parents('.car-box');
            var carId = carBox.attr('data-carid');
            var price = carBox.find('.price-num');

            LikeShare.popup(carBox, 'miaosha', {});
            // _data.miaosha( carId, price, function(data, status){
            //     if( status == 'success'){
            //         LikeShare.popup(carBox, 'miaosha', data);
            //     }
            //     else{
            //         alert('秒杀失败...');
            //     }
            // } );
        }
    };

    function init(pageConfig){
        $.extend(_config, pageConfig);

        LikeShare.init();
        Zone.init(_config);

        _view.init();
        _event.bind();
    }

    return {
        init: init
    };
});