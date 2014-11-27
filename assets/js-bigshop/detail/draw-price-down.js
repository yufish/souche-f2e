define(['lib/svg.min'], function(SVG) {

    return {
        draw: function(data) {
            var nowYear = new Date().getFullYear();
            var Years = ["当前", nowYear + 1 + "年", nowYear + 2 + "年", nowYear + 3 + "年", nowYear + 4 + "年", nowYear + 5 + "年"];
            var point = data;
            var viewWidth = 680;
            var viewHeight = 420;
            var draw = SVG("price_zhejiu").size(680, 420);
            var beginX = 10;
            var beginY = 0;
            var step = 0; //根据最大最小值换算位置
            var Max = data[0];
            var Min = 0;
            var maxReal = 280;
            var minReal = 40;
            //获取最大最小值
            for (var i = 0; i < data.length; i++) {

                if (data[i] > Max) {
                    Max = data[i];
                }
            }
            Min = 0;
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
                concat('?,? ?,? ?,?', [20, 10, 20, 330, 640, 330])
            ).fill('none').stroke({
                width: 3
            });
            //横向箭头
            draw.path(concat("M ?,? L ? ? L ? ? z", [640, 325, 650, 330, 640, 335]))
            //竖向箭头
            draw.path(concat("M ?,? L ? ? L ? ? z", [20, 0, 25, 10, 15, 10]))
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
                    y: 340 - ((val - Min) * (maxReal - minReal) / (Max - Min) + minReal)
                }
                if (i < point.length - 1) {
                    var val2 = point[i + 1];

                    var pointNext = {
                        x: ((i + 1) * 120) + 20,
                        y: 340 - ((val2 - Min) * (maxReal - minReal) / (Max - Min) + minReal)
                    }
                    var p = concat("M? ? C? ? ? ? ? ?", [pointNow.x, pointNow.y, pointNow.x + 40, pointNow.y + 30, pointNext.x - 40, pointNext.y - 30, pointNext.x, pointNext.y])
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
                    draw.circle(14).move(pointNow.x - 6 + beginX, pointNow.y - 6 + beginY).fill({
                        color: "#fc7000"
                    }).stroke({
                        color: "#c25701",
                        width: 1
                    })
                    draw.circle(30).move(pointNow.x - 14 + beginX, pointNow.y - 14 + beginY).fill({
                        color: "#fc7000",
                        opacity: 0.3
                    })
                } else {
                    draw.circle(14).move(pointNow.x - 6 + beginX, pointNow.y - 6 + beginY).fill({
                        color: "#61b25e"
                    }).stroke({
                        color: "#187541",
                        width: 1
                    })
                    draw.circle(30).move(pointNow.x - 14 + beginX, pointNow.y - 14 + beginY).fill({
                        color: "#61b25e",
                        opacity: 0.3
                    })
                }

            }

        }
    }

});