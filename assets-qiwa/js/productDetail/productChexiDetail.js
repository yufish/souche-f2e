/**
 * Created by Administrator on 2014/7/1.
 */
define(function() {
    var chexiControl = {};
    var config = {};
    var baseControlerConfig = {
        "carConstrast": "productDetail/carConstrast",
        "collect": "productDetail/collect",
        "nav": "productDetail/nav"
    };

    var loadImg = function() {
        $(".photosWrap img").lazyload({
            effect: "fadeIn"
        });

        $(".photosSmall img").lazyload({
            effect: "fadeIn"
        });
    }

    var init = function(_config) {
        $.extend(config, _config);

        //loadImg();
        initBaseControler();

        $("#allProduct table tr").eq(5).nextAll().addClass("hidden");
        $(this).removeClass("hasShow")

        $("#showMore").click(function() {
            if ($(this).hasClass("hasShow")) {
                $("#allProduct table tr").eq(5).nextAll().addClass("hidden");
                $(this).removeClass("hasShow");
                $(this).html("全部展开");
                $("html,body").scrollTop($("#allProduct").offset().top)
            } else {
                $("#allProduct table tr").eq(5).nextAll().removeClass("hidden");
                $(this).addClass("hasShow");
                $(this).html("收起");
            }
        });
    };

    var initBaseControler = function(conf) {
        var requireList = [];

        for (key in baseControlerConfig) {
            if (baseControlerConfig.hasOwnProperty(key)) {
                var path = baseControlerConfig[key];
                requireList.push(path);
            }
        }

        require(requireList, function() {
            var length = arguments.length;
            for (var index = 0; index < length; index++) {
                arguments[index].init(config);
            }
        });
    }

    chexiControl.init = init;
    return chexiControl;
});