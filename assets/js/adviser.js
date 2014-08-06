require(['souche/util/action-list'], function(ActionList) {
    var defaultDist = $(window).height() * 0.7;

    Souche.Util.appear("#aiche", function() {
        var data1 = [
            [0,
                function() {
                    $(".pic-1-4").animate({
                        height: 405
                    }, 2000)
                }
            ],
            [2500,
                function() {
                    $(".pic-1-5").animate({
                        height: 580
                    }, 2500)
                }
            ],
            [3000,
                function() {
                    $(".pic-1-6").animate({
                        height: 627
                    }, 2500)
                }
            ]
        ]
        ActionList(data1, function() {})
    }, defaultDist);

    Souche.Util.appear("#test", function() {
        var data = [
            [1000,
                function() {
                    $(".pic-2-1").animate({
                        opacity: 0
                    }, 1000)
                    $(".car-1").animate({
                        opacity: 0
                    }, 1000)
                    $(".car-5").animate({
                        opacity: 0
                    }, 1000)
                    $(".text-1").animate({
                        opacity: 0
                    }, 1000)
                }
            ],
            [2000,
                function() {
                    $(".pic-2-2").animate({
                        opacity: 0,
                    }, 1000)
                    $(".car-2").animate({
                        opacity: 0
                    }, 1000)
                    $(".car-4").animate({
                        opacity: 0
                    }, 1000)
                    $(".text-2").animate({
                        opacity: 0
                    }, 1000)
                }
            ]
        ]
        ActionList(data, function() {})
    }, defaultDist);
    Souche.Util.appear("#bargain", function() {
        var data = [
            [0,
                function() {
                    $(".pic-3-2-1").animate({
                        height: 353
                    }, 1000)

                }
            ],
            [1200,
                function() {
                    $(".pic-3-2-2").animate({
                        height: 375
                    }, 1000)
                }
            ],
            [1800,
                function() {
                    $(".pic-3-2-3").animate({
                        height: 369
                    }, 1000)
                }
            ],
            [2200,
                function() {
                    $(".pic-3-2-4").animate({
                        height: 355
                    }, 1000)
                }
            ],
            [2800,
                function() {
                    $(".pic-3-2-5").animate({
                        height: 413
                    }, 1000)
                }
            ],
        ]
        ActionList(data, function() {})
    }, defaultDist);
    Souche.Util.appear("#staging", function() {
        var data = [
            [0,
                function() {
                    $(".pic-4-2").animate({
                        width: 291
                    }, 2000)
                }
            ]
        ]
        ActionList(data, function() {})
    }, defaultDist);
    Souche.Util.appear("#back", function() {
        var data = [
            [0,
                function() {
                    $(".pic-5-1-2").animate({
                        height: 254,
                    }, 2500)
                }
            ],
            [2800,
                function() {
                    $(".pic-5-1-3").animate({
                        height: 223,
                    }, 2000)
                }
            ],
            [3000,
                function() {
                    $(".pic-5-1-4").animate({
                        height: 254,
                    }, 2000)
                }
            ]
        ]
        ActionList(data, function() {})
    }, defaultDist);
    Souche.Util.appear("#qa", function() {
        var data = [
            [0,
                function() {
                    $(".pic-6-1-3").animate({
                        height: 547,
                    }, 3000)
                }
            ],
            [3500,
                function() {
                    $(".pic-6-3-2").animate({
                        height: 608,
                    }, 3500)
                }
            ]

        ]
        ActionList(data, function() {})
    }, defaultDist);

    Souche.Util.appear("#img7", function() {
        var data = [
            [0,
                function() {
                    $(".img-7-2").animate({
                        height: 872
                    }, 3000)
                }
            ]
        ]
        ActionList(data, function() {})
    }, defaultDist);
    Souche.Util.appear("#address", function() {
        var data = [
            [0,
                function() {
                    $(".wrap7-4").animate({
                        opacity: 1,
                        bottom: 312
                    }, 2000)
                }
            ],
            [0,
                function() {
                    $(".wrap7-6").animate({
                        opacity: 1,
                        top: 52
                    }, 2000)
                }
            ],
            [0,
                function() {
                    $(".wrap7-7").animate({
                        opacity: 1,
                    }, 2000)
                }
            ]
        ]
        ActionList(data, function() {})
    }, defaultDist);

})