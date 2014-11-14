define(['shop/shopMap', 'souche/util/tool'], function(ShopMap, Tool){

    var config = {};
    
    var MAX_PRICE_KEY = 'maxPrice';
    var MIN_PRICE_KEY = 'minPrice';

    var curUrlParams = Tool.parseUrlParam();

    var _view = {
        init: function(){
            _view.initShopMap();
        },
        initShopMap: function(){
            // 如果是车牛店  直接不必要去渲染地图了
            if( $('.shop-location').hasClass('shop-type-cheniu') ){
                return false;
            }
            var coord = {};
            
            var loca = config.shopLocation.split(',');
            // test data
            // var loca = '116.417854, 39.921988'.split(',');
            coord.log = Number(loca[0]);
            coord.lat = Number(loca[1]);
            ShopMap.init(coord, config.shopLocationLevel);
        }
    };

    var _data = {
        isValidPriceFilter: function(p1, p2){
            if( p1 === '' || p2 === '' ){
                return false;
            }
            p1 = Number(p1);
            p2 = Number(p2);
            // 非null判断
            if( !Boolean(p1) && p1 !== 0 && !Boolean(p2) && p2 !== 0 ){
                return false;
            }
            return true;
        }
    };

    var priceWarnTimer = null;
    var _event = {
        bind: function(){
            $('#submit-price').on('click', _event.changePriceChoose);
        },
        changePriceChoose: function(e){
            e.preventDefault();
            var curPagePath = window.location.pathname;
            var min = $.trim( $('#min-price').val() );
            var max = $.trim( $('#max-price').val() );

            if( _data.isValidPriceFilter(min, max) ){
                min = Number(min);
                max = Number(max);
                if(max < min){
                    curUrlParams[MAX_PRICE_KEY] = min;
                    curUrlParams[MIN_PRICE_KEY] = max;
                }
                else{
                    curUrlParams[MAX_PRICE_KEY] = max;
                    curUrlParams[MIN_PRICE_KEY] = min;
                }
                var newSearchArr = [];
                for( var i in curUrlParams ){
                    newSearchArr.push( i+'='+ curUrlParams[i] );
                }
                window.location.href = curPagePath + '?' + newSearchArr.join('&');
            }
            else{
                clearTimeout(priceWarnTimer);
                $('.price-warning').removeClass('hidden');
                priceWarnTimer = setTimeout(function(){
                    $('.price-warning').addClass('hidden');
                }, 2000);
            }
            // curUrlParams
        }
    };

    function init(){
        $.extend(config, shopConfig||{});

        _view.init();
        _event.bind();
    }

    return {
        init: init
    };
});