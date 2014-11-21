/**
 * Created by Administrator on 2014/7/1.
 */
define(function()
{
    var chexingControl = {};
    var config={};
    var baseControlerConfig={
        "carConstrast":"productDetail/carConstrast",
        "collect":"productDetail/collect",
        "nav":"productDetail/nav",
        "anchor":"productDetail/anchorAnimate"
    };

    var loadImg = function()
    {
        $(".photosWrap img").lazyload({
            effect: "fadeIn"
        });

        $(".photosSmall img").lazyload({
            effect: "fadeIn"
        });
    }

    var init = function(_config)
    {
        $.extend(config,_config);

       // loadImg();
        initBaseControler();
    };


    var initBaseControler = function(conf)
    {
        var requireList = [];

        for(key in baseControlerConfig)
        {
            if(baseControlerConfig.hasOwnProperty(key)) {
                var path = baseControlerConfig[key];
                requireList.push(path);
            }
        }

        require(requireList,function()
        {
            var length  = arguments.length;
            for(var index=0;index<length;index++) {
                arguments[index].init(config);
            }
        });
    }

    chexingControl.init = init;
    return chexingControl;
});