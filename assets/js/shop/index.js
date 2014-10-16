define(['shop/shopMap.js'], function(ShopMap){

    var config = {};
    

    var _view = {
        init: function(){
            _view.initShopMap();
        },
        initShopMap: function(){
            ShopMap.init(config.shopLocation);
        }
    };

    function init(){
        $.extend(config, pageConfig);

        _view.init();
    }

    return {
        init: init
    };
});