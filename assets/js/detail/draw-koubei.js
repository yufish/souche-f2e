define(['lib/mustache', 'lib/svg.min'], function(Mustache, SVG) {
    var rateData = [];
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
    var drawPoint = function(x, y) {
        draw.circle(10).move(x - 5, y - 5).fill({
            color: "#63b162"
        }).stroke({
            color: "#ffffff",
            width: 1
        })
    };
    var draw;
    var data;
    var centerPoint = {
        x: 250,
        y: 250
    }
    var radius = 225;
    var item_tpl;
    var realPoints = [];
    var outlinePoints = [];
    var DrawKoubei = {
        draw: function(_data) {
            data = _data;
            for (var i = 0; i < data.length; i++) {
                rateData.push(data[i].rate);
            }
            item_tpl = $("#koubei_item_template").html();
            this.drawRadar();
            this.drawLabel();
        },
        drawRadar: function() {
            draw = SVG("koubei_svg").size(500, 500);
            realPoints = [];
            outlinePoints = [];
            //画9个点
            for (var i = 0; i < rateData.length; i++) {
                var pointNow = {
                    x: rateData[i] * radius * Math.sin(i * 40 * Math.PI / 180) + centerPoint.x,
                    y: rateData[i] * radius * Math.cos(i * 40 * Math.PI / 180) + centerPoint.y
                }
                var pointOutline = {
                    x: radius * Math.sin(i * 40 * Math.PI / 180) + centerPoint.x,
                    y: radius * Math.cos(i * 40 * Math.PI / 180) + centerPoint.y
                }

                realPoints.push(pointNow)
                outlinePoints.push(pointOutline)
                //画外轮廓
            }
            //画外轮廓线
            var outlinePathStr = "M";
            for (var i = 0; i < outlinePoints.length; i++) {
                outlinePathStr += outlinePoints[i].x + " " + outlinePoints[i].y + " "
                draw.line(centerPoint.x, centerPoint.y, outlinePoints[i].x, outlinePoints[i].y).stroke({
                    color: "#dddddd",
                    width: 1
                })
            }
            draw.path(outlinePathStr + " z").fill("none").stroke({
                color: "#dddddd",
                width: 1
            })
            //画真实路径
            var realPathStr = "M";
            for (var i = 0; i < realPoints.length; i++) {
                realPathStr += realPoints[i].x + " " + realPoints[i].y + " ";
                drawPoint(realPoints[i].x, realPoints[i].y);
            }
            draw.path(realPathStr + " z").fill({
                color: "#95c194",
                opacity: 0.6
            }).stroke({
                color: "#63b162",
                width: 3
            })


        },
        drawLabel: function() {
            for (var i = 0; i < data.length; i++) {
                data[i].width = data[i].rate * 100;
                var label = $(Mustache.render(item_tpl, data[i]));
                $(".koubei-content").append(label);

                if (i < 5) {
                    label.css({
                        left: outlinePoints[i].x + 350,
                        top: outlinePoints[i].y + 40
                    })
                } else {
                    label.css({
                        left: outlinePoints[i].x + 180,
                        top: outlinePoints[i].y + 30
                    }).addClass("float-left-item")
                }
                if (i == 0) {
                    label.css({
                        left: outlinePoints[i].x + 260,
                        top: outlinePoints[i].y + 70
                    })
                } else if (i == 1) {
                    label.css({
                        left: outlinePoints[i].x + 330,
                        top: outlinePoints[i].y + 80
                    })
                } else if (i == 4) {
                    label.css({
                        left: outlinePoints[i].x + 350,
                        top: outlinePoints[i].y + 20
                    })
                } else if (i == 5) {
                    label.css({
                        left: outlinePoints[i].x + 180,
                        top: outlinePoints[i].y + 20
                    })
                } else if (i == 8) {
                    label.css({
                        left: outlinePoints[i].x + 180,
                        top: outlinePoints[i].y + 60
                    })
                }
            }
        }
    }
    return DrawKoubei;
})