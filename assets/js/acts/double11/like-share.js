define(function(){
    var CONG_4_SELF='恭喜您，点赞赢得红包';
    var CONG_4_OTHER='恭喜您，您帮$1点赞赢得红包';

    var sharePop = $('.popup.share-self');
    var Ele = {
        carImg: sharePop.find('.car-img'),
        carTitle: sharePop.find('.car-name'),
        carPrice: sharePop.find('.car-price .price-num'),
        shareText: sharePop.find('#share-text'),
        shareLink: {
            // sina: sharePop.find('.share-icon.sina'),
            // weixin: sharePop.find('.share-icon.weixin'),
            // qq: sharePop.find('.share-icon.qq'),
            // qzone: sharePop.find('.share-icon.qzone')
        }
    };

    var  _view = {
        renderPopup: function(carCtn){
            // get and fill
            var car = {
                img: carCtn.find('.car-pic img').attr('src'),
                title: $.trim(carCtn.find('.car-title').text()),
                link: carCtn.find('.car-title').attr('href'),
                price: $.trim(carCtn.find('.price .price-num').text()),
            };
            var shareContent = carCtn.attr('data-share-content');
            

            Ele.shareText.text(shareContent);
            Ele.carImg.attr('src', car.img);
            Ele.carTitle.text(car.title);
            Ele.carTitle.attr('href', car.link);
            Ele.carPrice.text(car.price);

            // 如果是帮ta点赞
            if( carCtn.hasClass('help-getcar') ){
                var other = carCtn.attr('data-helpwho');
                $('.share-congrate').text(CONG_4_OTHER.replace('$1', other || 'TA'));
            }
            else{
                $('.share-congrate').text( CONG_4_SELF );
            }

            // var shareLink = {
            //     sina: carCtn.attr('data-share-link-sina'),
            //     weixin: carCtn.attr('data-share-link-weixin'),
            //     qq: carCtn.attr('data-share-link-qq'),
            //     qzone: carCtn.attr('data-share-link-qzone')
            // };
            // for( var i in Ele.shareLink ){
            //     Ele.shareLink[i].attr('href', shareLink[i] || '#' );
            // }

            // 配置一遍分享内容
            _view.configShare();
            sharePop.addClass('active');
        },
        configShare: function(){
            window.jiathis_config = {
                url: 'http://分享内容里给出的链接',
                title: '大搜车双11活动标题',
                summary: Ele.shareText.val(),
                pic: Ele.carImg.attr('src')
            };
        }
    };

    var _event = {
        bind: function(){
            sharePop.find('.pop-close').on('click', _event.closePop);
            // 用户自己修改文案后再配置一遍
            Ele.shareText.on('blur', _view.configShare);
        },
        closePop: function(){
            sharePop.removeClass('active');
        }
    };

    function init(){
        _event.bind();
    }

    function popup(e){
        var carCtn = $(e.target).parents('.car-box');
        _view.renderPopup(carCtn);
    }

    return {
        init: init,
        popup: popup
    };
})