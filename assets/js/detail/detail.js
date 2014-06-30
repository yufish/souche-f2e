/**
 * Created by Administrator on 2014/6/18.
 */
define(['lib/lazyload'],function(lazyload)
{
    var config = {};
    var detailPageControler={};

    var baseControlerConfig={
        "yuyue":"detail/yuyue",
        "summary":"detail/init_summary",
        "photoSlide":"detail/photoSlide",
        "yuyue":"detail/yuyue",
        "performPoint":"detail/performPoint",
        "downPrice":"detail/downPrice",
        "fenqi":"detail/fenqi",
        "collect":"detail/collect",
        "constrast":"detail/constrast",
        "thirParty":"detail/thirdPartyTool",
        "nav":"detail/nav"
    };

    var lazyloadImg = function()
    {
        $(".detail_photosGallary img").lazyload({
            effect: "fadeIn"
        });
        $(".fadongji_rule img").lazyload({
            effect: "fadeIn"
        });
        $(".detail_otherCars img").lazyload({
            effect: "fadeIn"
        });
        $(".qimian_img img").lazyload({
            effect: "fadeIn"
        });
        $(".perform_img img").lazyload({
            effect: "fadeIn"
        });
        $(".perform_img img").lazyload({
            effect: "fadeIn"
        });
        $(".perform-intro img").lazyload({
            effect: "fadeIn"
        });
    }

    var fadongjiControl= function()
    {
        var oldImg = null;
        var oldSrc = "";
        $(".fadongji_viewImg img").mouseenter(function() {
            var currentSrc = $(this).attr("src");
            oldImg = $(this).closest(".fadongji_view").find(".fadongji_rule img");
            oldSrc = oldImg.attr("src");
            oldImg.attr("src", currentSrc);
        }).mouseleave(function() {
            oldImg.attr("src", oldSrc);
        });

        $(window).scroll(function() {
            if ($(window).scrollTop() >= $(document).height() - $(window).height() - 270) {
                $("#quick_buy").fadeIn(200);
            } else {
                $("#quick_buy").fadeOut(200);
            }
        });
        $("body,html").click(function() {
            $(".perform-intro").fadeOut(100);
        });
    }

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

    var init = function(_config)
    {
        $.extend(config,_config);

        lazyloadImg();
        initBaseControler();
        fadongjiControl();
    }


    detailPageControler.init = init;

    return detailPageControler;
});
