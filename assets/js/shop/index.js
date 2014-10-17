define(['shop/shopMap.js'], function(ShopMap){

    var config = {};
    

    var _view = {
        init: function(){
            _view.initShopMap();
        },
        initShopMap: function(){
            var coord = {};
            
            var loca = config.shopLocation.split(',');
            // test data
            // var loca = '116.417854, 39.921988'.split(',');
            coord.log = Number(loca[0]);
            coord.lat = Number(loca[1]);
            ShopMap.init(coord);
        }
    };

    function init(){
        $.extend(config, shopConfig||{});

        _view.init();
    }

    return {
        init: init
    };
});