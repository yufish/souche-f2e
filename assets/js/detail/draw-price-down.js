define(function() {

    return {
        draw: function(data) {
            var nowYear = new Date().getFullYear();
            var Years = ["当前", nowYear + 1 + "年", nowYear + 2 + "年", nowYear + 3 + "年", nowYear + 4 + "年", nowYear + 5 + "年"];
            var point = data;
            var draw = SVG("price_zhejiu").size(680, 420);
            var beginX = 20;
            var beginY = 50;
            var step = 0; //根据最大最小值换算位置
            var Max = 0;
            var Min = data[0];
            //获取最大最小值
            for (var i = 0; i < data.length; i++) {
                if (data[i] < Min) {
                    Min = data[i];
                }
                if (data[i] > Max) {
                    Max = data[i];
                }
            }
            var concat = function(str, arr) {
                var count = 0;
                for (var i in arr) {
                    if (i % 2 == 0) {
                        arr[i] = arr[i] * 1 + beginX;
                    } else {
                        arr[i] = arr[i] * 1 + beginY;
                    }
                }
                str = str.replace(/\?/g, function(a, b) {
                    //alert(count + ":" + arr[count++])
                    return arr[count++]
                })
                return str;
            }
            draw.polyline(
                concat('?,? ?,? ?,?', [0, 10, 0, 330, 640, 330])
            ).fill('none').stroke({
                width: 3
            });
            //横向箭头
            draw.path(concat("M ?,? L ? ? L ? ? z", [640, 325, 650, 330, 640, 335]))
            //竖向箭头
            draw.path(concat("M ?,? L ? ? L ? ? z", [20, 20, 5, 10, -5, 10]))
            for (var i = 0; i < Years.length; i++) {
                draw.plain(Years[i]).attr({
                    x: i * 120 + beginX,
                    y: 360 + beginY
                }).font({
                    size: 14
                }).fill("#666")
            }
            for (var i in point) {
                var val = point[i];
                var i = i * 1;
                var pointNow = {
                    x: (i) * 120 + 20,
                    y: (300 - val) + 4
                }
                if (i < point.length - 1) {
                    var val2 = point[i + 1];

                    var pointNext = {
                        x: ((i + 1) * 120) + 20,
                        y: (300 - val2) + 4
                    }
                    var p = concat("M? ? C? ? ? ? ? ?", [pointNow.x, pointNow.y, pointNow.x + 50, pointNow.y + 40, pointNext.x, pointNext.y - 10, pointNext.x, pointNext.y])
                    draw.path(p).fill("none").stroke({
                        color: "#ddd",
                        width: 10,
                        opacity: 0.4
                    });
                }
                if (i != 0) {
                    var p = concat("M? ? ? ?", [pointNow.x, pointNow.y, pointNow.x, 330]);
                    draw.path(p).fill("none").stroke({
                        width: 1,
                        "dasharray": "2,2",
                        color: "#ddd"
                    })
                    draw.plain("￥" + val + "万").attr({
                        x: pointNow.x - 20 + beginX,
                        y: pointNow.y - 20 + beginY
                    }).font({
                        size: 14
                    }).fill("#666")
                } else {
                    draw.plain("￥" + val + "万").attr({
                        x: pointNow.x + 10 + beginX,
                        y: pointNow.y - 20 + beginY
                    }).font({
                        size: 14
                    }).fill("#ff7700")
                }
                if (i == 0) {
                    draw.circle(14).move(i * 120 + 14 + beginX, 300 - val + beginY).fill({
                        color: "#fc7000"
                    }).stroke({
                        color: "#c25701",
                        width: 2
                    })
                    draw.circle(30).move(i * 120 + 6 + beginX, 300 - val - 8 + beginY).fill({
                        color: "#fc7000",
                        opacity: 0.3
                    })
                } else {
                    draw.circle(14).move(i * 120 + 14 + beginX, 300 - val + beginY).fill({
                        color: "#61b25e"
                    }).stroke({
                        color: "#187541",
                        width: 2
                    })
                    draw.circle(30).move(i * 120 + 6 + beginX, 300 - val - 8 + beginY).fill({
                        color: "#61b25e",
                        opacity: 0.3
                    })
                }

            }

        }
    }

});