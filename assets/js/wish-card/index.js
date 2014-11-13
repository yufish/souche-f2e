define(['wish-card/wish-card-edit',
    'index/collect',
    'souche/util/image-resize',
    'index/guess-like'
    ], function(WishCardEdit, Collect, ImageResizer, GuessLike){
    

    var _config = {
        guessLikeImgSize: {
            width: 280,
            height: 200
        }
    };


    function init(config){
        $.extend(_config, config);
        WishCardEdit.init(_config);
        Collect.init(_config);
        ImageResizer.init('.wish-card-main .carImg img', 280, 200);
        GuessLike.init(_config);
    }

    return {
        init: init
    };
});