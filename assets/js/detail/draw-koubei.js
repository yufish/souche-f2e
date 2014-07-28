define(['lib/mustache', 'lib/svg.min', 'lib/queuedo'], function(Mustache, SVG, queuedo) {
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
        return draw.circle(10).move(x - 5, y - 5).fill({
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
            var totalScore = 0;
            for (var i = 0; i < data.items.length; i++) {
                rateData.push(data.items[i].rate);
                totalScore += data.items[i].rate * 10;
            }

            item_tpl = $("#koubei_item_template").html();
            this.drawRadar();
            this.drawLabel();
            $(".all-score em").html((totalScore / 9).toFixed(2))
            $(".series-tab").html("")
            var tab = $("<div class='series-tab-item item-active'></div>").html(data.seriesName).attr("data-code", data.seriesCode);
            $(".series-tab").append(tab)
            tab.click(function() {
                self.redraw(item.seriesCode);
            })
            for (var i = 0; i < data.relatedSeries.length; i++) {
                var item = data.relatedSeries[i];
                var tab = $("<div class='series-tab-item'></div>").html(item.name).attr("data-code", item.seriesCode);
                $(".series-tab").append(tab)
                tab.click(function() {
                    self.redraw(item.seriesCode);
                })
            }
            for (var i = 0; i < data.topPosReview.length; i++) {
                if (data.topPosReview[i].indexOf("�") != -1) {
                    data.topPosReview.splice(i, 1)
                    i--
                }
            }
            for (var i = 0; i < data.topNegReview.length; i++) {
                if (data.topNegReview[i].indexOf("�") != -1) {
                    data.topNegReview.splice(i, 1)
                    i--
                }
            }
            $(".advantage-left .advantage-content").html("<li>" + data.topPosReview.join("</li><li>") + "</li>")
            $(".advantage-right .advantage-content").html("<li>" + data.topNegReview.join("</li><li>") + "</li>")
            data.items.sort(function(i1, i2) {
                return i1.rate < i2.rate
            });
            var t = 3;
            var bestLabels = [];
            $(".koubei-labels").html("")
            for (var i = 0; i < t; i++) {
                if (data.items[i].labels.length) {
                    bestLabels.push(data.items[i].labels[0])
                    $(".koubei-labels").append("<label>" + data.items[i].labels[0] + "</label>")
                } else {
                    t++;
                    if (t > 8) t = 8;
                }
            }

        },
        redraw: function() {

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
            var realPathStr = "";
            var realPathPoints = [];
            var tempPathPoints = [];
            var svgPoints = [];
            for (var i = 0; i < realPoints.length; i++) {
                realPathStr += centerPoint.x + "," + centerPoint.y + " ";
                svgPoints.push(drawPoint(centerPoint.x, centerPoint.y));
                tempPathPoints.push([realPoints[i].x, realPoints[i].y])
                realPathPoints.push([centerPoint.x, centerPoint.y])
            }
            var polygon = draw.polygon(realPathStr + "").fill({
                color: "#95c194",
                opacity: 0.6
            }).stroke({
                color: "#63b162",
                width: 3
            })
            queuedo([0, 1, 2, 3, 4, 5, 6, 7, 8], function(index, next, context) {
                realPathPoints[index] = tempPathPoints[index];

                polygon.animate(200, "<>").plot(realPathPoints);
                svgPoints[index].animate(400, "<>").move(realPoints[index].x - 5, realPoints[index].y - 5)
                setTimeout(function() {
                    next.call(context);
                }, 150)
            })




        },
        drawLabel: function() {
            for (var i = 0; i < data.items.length; i++) {
                data.items[i].width = data.items[i].rate * 100;
                var label = $(Mustache.render(item_tpl, data.items[i]));
                $(".koubei-content").append(label);

                if (i < 5) {
                    label.css({
                        left: outlinePoints[i].x + 370,
                        top: outlinePoints[i].y + 40
                    })
                } else {
                    label.css({
                        left: outlinePoints[i].x + 40,
                        top: outlinePoints[i].y + 40
                    }).addClass("float-left-item")
                }
                if (i == 0) {
                    label.css({
                        left: outlinePoints[i].x + 260,
                        top: outlinePoints[i].y + 80
                    })
                } else if (i == 1) {
                    label.css({
                        left: outlinePoints[i].x + 330,
                        top: outlinePoints[i].y + 80
                    })
                } else if (i == 4) {
                    label.css({
                        left: outlinePoints[i].x + 370,
                        top: outlinePoints[i].y - 10
                    })
                } else if (i == 5) {
                    label.css({
                        left: outlinePoints[i].x + 40,
                        top: outlinePoints[i].y - 10
                    })
                } else if (i == 8) {
                    label.css({
                        left: outlinePoints[i].x + 40,
                        top: outlinePoints[i].y + 70
                    })
                }
            }
        }
    }
    return DrawKoubei;
})