define(['wish-card/wish-card-edit'], function(WishCardEdit){
    var _config = {};


    function init(config){
        $.extend(_config, config);
        WishCardEdit.init(_config);
    }

    return {
        init: init
    };
});