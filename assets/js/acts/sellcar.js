require(['souche/util/action-list'], function(ActionList) {
    Souche.Util.appear("#findbuyer", function() {
        var data1 = [
            [0,
                function() {
                    $(".layer1-1").animate({
                        left: 600
                    }, 2000)
                    $(".layer1-2").animate({
                        left: 600
                    }, 2000)
                }
            ]
        ]
        ActionList(data1, function() {
            console.log("end")
        })
    }, 500);

    Souche.Util.appear("#realvalue", function() {
        var data = [
            [0,
                function() {
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
                function() {
                    $(".pic2-2").animate({
                        opacity: 1,
                        top: 100
                    }, 700)
                }
            ]
        ]
        ActionList(data, function() {
            console.log("end")
        })
    }, 500);
});