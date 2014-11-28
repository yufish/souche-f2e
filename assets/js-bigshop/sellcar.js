require(['souche/util/action-list'], function(ActionList) {
    var defaultDist = $(window).height() * 0.7;
    Souche.Util.appear("#findbuyer", function () {
        var data1 = [
            [0,
                function () {
                    $(".layer1-1").animate({
                        left: 600
                    }, 2000)
                    $(".layer1-2").animate({
                        left: 600
                    }, 2000)
                }
            ]
        ]
        ActionList(data1, function () {})
    }, defaultDist);

    Souche.Util.appear("#realvalue", function () {
        var data = [
            [0,
                function () {
                    $(".pic2-1").animate({
                        left: 0,
                        opacity: 1
                    }, 700)
                    $(".pic2-3").animate({
                        left: 30,
                        opacity: 1
                    }, 700)
                }
            ],
            [600,
                function () {
                    $(".pic2-2").animate({
                        opacity: 1,
                        top: 100
                    }, 700)
                }
            ]
        ]
        ActionList(data, function () {})
    }, defaultDist);
    Souche.Util.appear("#realvalue", function () {
        var data = [
            [0,
                function () {
                    $(".pic2-1").animate({
                        left: 0,
                        opacity: 1
                    }, 700)
                    $(".pic2-3").animate({
                        left: 30,
                        opacity: 1
                    }, 700)
                }
            ],
            [600,
                function () {
                    $(".pic2-2").animate({
                        opacity: 1,
                        top: 100
                    }, 700)
                }
            ]
        ]
        ActionList(data, function () {})
    }, defaultDist);
    Souche.Util.appear("#helpsell", function () {
        var data = [
            [0,
                function () {
                    $(".pic3-1").animate({
                        top: 210,
                        opacity: 1
                    }, 1000)

                }
            ],
            [1000,
                function () {
                    $(".pic3-2").animate({
                        opacity: 1
                    }, 700)
                }
            ]
        ]
        ActionList(data, function () {})
    }, defaultDist);

    Souche.Util.appear("#timeandprice", function () {
        var data = [
            [0,
                function () {
                    $(".pic4-2").animate({
                        top: 275,
                        opacity: 1
                    }, 700)
                }
            ],
            [300,
                function () {
                    $(".pic4-3").animate({
                        top: 192,
                        opacity: 1
                    }, 700)
                }
            ],
            [300,
                function () {
                    $(".pic4-4").animate({
                        top: 120,
                        opacity: 1
                    }, 700)
                }
            ],
            [300,
                function () {
                    $(".pic4-5").animate({
                        top: 120,
                        opacity: 1
                    }, 700)
                }
            ]
        ]
        ActionList(data, function () {})
    }, 500);
    Souche.Util.appear("#sellstep", function () {
        var data = [
            [0,
                function () {
                    $(".pic5-1").animate({
                        width: 900
                    }, 1000)
                }
            ]
        ]
        ActionList(data, function () {})
    }, defaultDist);

    //求购历史滚动
    (function ($) {
        $.fn.myScroll = function (options) {

            var opts = $.extend({}, options),
                intId = [];

            function marquee(obj, step) {

                obj.find("ul").animate({
                    marginTop: '-=1'
                }, 0, function () {
                    var s = Math.abs(parseInt($(this).css("margin-top")));
                    if (s >= step) {
                        $(this).find("li").slice(0, 1).appendTo($(this));
                        $(this).css("margin-top", 0);
                    }
                });
            }

            this.each(function (i) {
                var sh = 20,
                    speed = 100,
                    _this = $(this);
                intId[i] = setInterval(function () {
                    if (_this.find("ul").height() <= _this.height()) {
                        clearInterval(intId[i]);
                    } else {
                        marquee(_this, sh);
                    }
                }, speed);

                _this.hover(function () {
                    clearInterval(intId[i]);
                }, function () {
                    intId[i] = setInterval(function () {
                        if (_this.find("ul").height() <= _this.height()) {
                            clearInterval(intId[i]);
                        } else {
                            marquee(_this, sh);
                        }
                    }, speed);
                });
            });
        }
    })(jQuery);
    $(function () {
        $(".slide").myScroll({});
    });
    
});