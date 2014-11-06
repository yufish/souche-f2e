define(function(){
    
    var sharePop = $('.popup.share-self');
    var Ele = {
        carImg: sharePop.find('.car-img'),
        carTitle: sharePop.find('.car-title'),
        carPrice: sharePop.find('.car-price .price-num'),
        shareText: sharePop.find('#share-text'),
        shareLink: {
            sina: sharePop.find('.share-icon.sina'),
            weixin: sharePop.find('.share-icon.weixin'),
            qq: sharePop.find('.share-icon.qq'),
            qzone: sharePop.find('.share-icon.qzone')
        }
    };

    var  _view = {
        renderPopup: function(carCtn){
            
            // get and fill
            var car = {
                img: carCtn.find('.car-pic img').attr('src'),
                title: $.trim(carCtn.find('.car-title').text()),
                price: $.trim(carCtn.find('.price .price-num').text()),
            };
            var shareContent = carCtn.attr('data-share-content');
            var shareLink = {
                sina: carCtn.attr('data-share-link-sina'),
                weixin: carCtn.attr('data-share-link-weixin'),
                qq: carCtn.attr('data-share-link-qq'),
                qzone: carCtn.attr('data-share-link-qzone')
            };

            Ele.shareText.text(shareContent);
            Ele.carImg.attr('src', car.img);
            Ele.carTitle.text(car.title);
            Ele.carPrice.text(car.price);

            for( var i in Ele.shareLink ){
                Ele.shareLink[i].attr('href', shareLink[i] || '#' );
            }

            sharePop.addClass('active');
        }
    };

    var _event = {
        bind: function(){
            sharePop.find('.pop-close').on('click', _event.closePop);
            _event.bindShare();
        },
        bindShare: function(){

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