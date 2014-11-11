// 引入点赞分享 和 五折区/精品区
define(['acts/double11/like-share', 'acts/double11/zone'], function(LikeShare, Zone){

    var _config = {};

    var TEST_CARID='zBiylWh5Tm';

    var _view = {
        init: function(){
            // 两秒后隐藏
            setTimeout(function(){
                $('.help-getcar').animate({
                    outline: '5px #fff solid'
                }, 300, function(){
                    $('.help-getcar').addClass('no-green-border');
                });
            }, 4000);
        }
    };

    var _data = {
        sendLike: function( carid, callback ){
            var param = {
                carid: carid
            };
            $.getJSON(_config.likeUrl, param, callback);
        },
        helpLike: function(carid, actor, callback){
            var param = {
                carid: carid,
                actor: actor
            };
            $.getJSON(_config.helpLikeUrl, param, callback);
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
            $('.car-box:not(.miaosha-box,.help-getcar) .share-button').on('click', _event.LikeAndPop);
            // 帮朋友点赞~
            $('.car-box.help-getcar .share-button').on('click', _event.helpLike);
            // 秒杀
            $('.car-box.miaosha-box .share-button').on('click', _event.miaosha);
        },
        LikeAndPop: function(e){
            var btn = $(this);
            if(btn.hasClass('disabled')){
                return false;
            }
            var carBox = $(e.target).parents('.car-box');
            var carId = carBox.attr('data-carid');

            // // test for 202
            // var data = {code: 202, totalMoney: 3322, shareUrl: '1113', h5ShareUrl: 'h5'}
            // setRedShareAttr(data);
            // LikeShare.popup(carBox, 'like', data);

            // // test for 200
            // var data = {code: 200, money: 3333, shareUrl: '1113', h5ShareUrl: 'h5'}
            // setRedShareAttr(data);
            // LikeShare.popup(carBox, 'like', data);


            // 手机号 + 验证码登录
            Souche.MiniLogin.checkLogin(function(){
                _data.sendLike( carId, function(data, status){
                    if(status == 'success'){
                        var code = data.code;
                        if(code == '202'){
                            setRedShareAttr(data);
                            LikeShare.popup(carBox, 'like', data);
                        }
                        else if(code == '200'){
                            setRedShareAttr(data);
                            LikeShare.popup(carBox, 'like', data);
                        }
                        else{
                            alert('点赞失败, 请稍后重试');
                        }
                    }
                    else{
                        alert('点赞失败, 请稍后重试');
                    }
                } );
            },true,true,false,true);
        },
        helpLike: function(e){
            var btn = $(this);
            if(btn.hasClass('disabled')){
                return false;
            }
            var carBox = $(e.target).parents('.car-box');
            var carId = _config.encryptCarId;
            var actor = _config.actor;

            // // test for 202
            // var data = {code: 202, totalMoney: 3322, shareUrl: '1113', h5ShareUrl: 'h5'}
            // setRedShareAttr(data);
            // LikeShare.popup(carBox, 'help-like', data);

            // // test for 200
            // var data = {code: 200, money: 3333, shareUrl: '1113', h5ShareUrl: 'h5'}
            // setRedShareAttr(data);
            // LikeShare.popup(carBox, 'help-like', data);
            
            // 手机号 + 验证码登录
            Souche.MiniLogin.checkLogin(function(){
                _data.helpLike( carId, actor, function(data, status){
                    if(status == 'success'){
                        var code = data.code;
                        if(code == '202'){
                            LikeShare.popup(carBox, 'help-like', data);
                        }
                        else if(code == '402'){
                            alert('不要自己给自己点赞哦~ ');
                        }
                        else if(code == '203'){
                            alert('该分享链接无效');
                        }
                        else if(code == '204'){
                            alert('您朋友的红包达到上限数');
                        }
                        else if(code == '200'){
                            LikeShare.popup(carBox, 'help-like', data);
                        }
                        else{
                            alert('点赞失败, 请稍后重试');
                        }
                    }
                    else{
                        alert('点赞失败, 请稍后重试');
                    }
                } );
            },true,false,false,true);
        },
        miaosha: function(e){
            var carBox = $(e.target).parents('.car-box');
            var carId = carBox.attr('data-carid');
            var price = $.trim(carBox.find('.price-num').text());

            // 测试弹窗
            // LikeShare.popup(carBox, 'miaosha', {});
            // 正常请求
            Souche.MiniLogin.checkLogin(function(){
                _data.miaosha( carId, price, function(data, status){
                    if( status == 'success'){
                        var code = data.code;
                        if(code == 200){
                            // alert('您已成功抢到');
                            LikeShare.popup(carBox, 'miaosha', data);
                        }
                        else if(code== 302){
                            alert('不能重复秒杀');
                        }
                        else if(code== 301){
                            alert('莫急~莫急~秒杀还未开始，请耐心等待哦！');
                        }
                        else if(code== 404){
                            alert('该车已被抢购完');
                        } 
                        else{
                            alert('“人固有一秒，或秒到这辆车，或秒到其他车”。别放弃！快来看看别的车，这次千万不能被别人抢走啊！');
                        }
                    }
                    else{
                        alert('秒杀失败...');
                    }
                } );
            },true,true,false,true);
        }
    };

    function setRedShareAttr(result){
        $('.red-share').attr('data-shareurl', result.shareUrl);
        $('.red-share').attr('data-h5shareurl', result.h5ShareUrl);
    }

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