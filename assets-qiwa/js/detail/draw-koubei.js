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
    var drawPoint = function(x, y,color) {
        return draw.circle(10).move(x - 5, y - 5).fill({
            color:color
        }).stroke({
            color: "#ffffff",
            width: 1
        })
    };
    var draw;
    var data;
    var centerPoint = {
        x: 200,
        y: 200
    }
    var radius = 200;
    var item_tpl;
    var realPoints = [];
    var outlinePoints = [];
    var config = {}
    var otherDraw;
    var DrawKoubei = {
        draw: function(_data,_config) {
            data = _data;
            var self = this;
            $.extend(config,_config);
            var totalScore = 0;
            for (var i = 0; i < data.items.length; i++) {
                rateData.push(data.items[i].rate);
                totalScore += data.items[i].rate * 10;
                var labels = data.items[i].labels;
                if (labels) {
                    for (var n = 0; n < labels.length; n++) {
                        var label = labels[n];

                        labels[n] = label.replace(/\(([0-9]*?)\)/, function(r, r1) {
                            return "<span>(" + r1 + "人)</span>"
                        })
                    }
                }
            }
            item_tpl = $("#koubei_item_template").html();
            this.drawRadar();
            this.drawLabel();

            $(".all-score em").html((totalScore / 9).toFixed(2))
            $(".series-tab").html("")
            var tab = $(document.createElement("div"));
            tab.addClass("series-tab-item item-active")
            tab.attr("data-code", data.seriesCode);
            tab.html(data.seriesName)
            $(".series-tab").append(tab)
            tab.click(function() {
                self.loadOtherSeries($(this).attr("data-code"));
                $(".series-tab-item").removeClass("item-active")
                $(this).addClass("item-active")
            })
            if(data.relatedSeries){
                for (var i = 0; i < data.relatedSeries.length; i++) {
                    var item = data.relatedSeries[i];
                    var tab = $("<div class='series-tab-item'></div>").html(item.name).attr("data-code", item.seriesCode);
                    $(".series-tab").append(tab)
                    tab.click(function() {
                        self.loadOtherSeries($(this).attr("data-code"));
                        $(".series-tab-item").removeClass("item-active")
                        $(this).addClass("item-active")
                    })
                }
            }
            if(data.topPosReview){
                for (var i = 0; i < data.topPosReview.length; i++) {
                    if (data.topPosReview[i].indexOf("�") != -1) {
                        data.topPosReview.splice(i, 1)
                        i--
                    }
                }
            }
            if(data.topNegReview){
                for (var i = 0; i < data.topNegReview.length; i++) {
                    if (data.topNegReview[i].indexOf("�") != -1) {
                        data.topNegReview.splice(i, 1)
                        i--
                    }
                }
            }

            data.topPosReview = data.topPosReview.splice(0, 10)
            data.topNegReview = data.topNegReview.splice(0, 10);
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
            otherDraw =  SVG("koubei_svg").size(500, 500);
        },
        redraw:function(_data){
            data = _data;
            var totalScore = 0;
            rateData = [];
            for (var i = 0; i < data.items.length; i++) {
                rateData.push(data.items[i].rate);
                totalScore += data.items[i].rate * 10;
                var labels = data.items[i].labels;
                if (labels) {
                    for (var n = 0; n < labels.length; n++) {
                        var label = labels[n];

                        labels[n] = label.replace(/\(([0-9]*?)\)/, function(r, r1) {
                            return "<span>(" + r1 + "人)</span>"
                        })
                    }
                }
            }
//            $("#koubei_svg").html("")
//            item_tpl = $("#koubei_item_template").html();
            this.drawRadar(otherDraw,"#66b7ce");
//            this.drawLabel();
//
//            $(".all-score em").html((totalScore / 9).toFixed(2))
//
//            for (var i = 0; i < data.topPosReview.length; i++) {
//                if (data.topPosReview[i].indexOf("�") != -1) {
//                    data.topPosReview.splice(i, 1)
//                    i--
//                }
//            }
//            for (var i = 0; i < data.topNegReview.length; i++) {
//                if (data.topNegReview[i].indexOf("�") != -1) {
//                    data.topNegReview.splice(i, 1)
//                    i--
//                }
//            }
//            data.topPosReview = data.topPosReview.splice(0, 10)
//            data.topNegReview = data.topNegReview.splice(0, 10);
//            $(".advantage-left .advantage-content").html("<li>" + data.topPosReview.join("</li><li>") + "</li>")
//            $(".advantage-right .advantage-content").html("<li>" + data.topNegReview.join("</li><li>") + "</li>")
//            data.items.sort(function(i1, i2) {
//                return i1.rate < i2.rate
//            });
//            var t = 3;
//            var bestLabels = [];
//            $(".koubei-labels").html("")
//            for (var i = 0; i < t; i++) {
//                if (data.items[i].labels.length) {
//                    bestLabels.push(data.items[i].labels[0])
//                    $(".koubei-labels").append("<label>" + data.items[i].labels[0] + "</label>")
//                } else {
//                    t++;
//                    if (t > 8) t = 8;
//                }
//            }
        },
        loadOtherSeries: function(seriesCode) {
            var self = this;

            $.ajax({
                url: config.api_sentiment.replace("/b","") +"/s/" + seriesCode,
                dataType: "jsonp",
                success: function(_data) {
                    if (_data&&_data.data&&_data.data.items&&_data.data.items.length) {
                        var koubeiData = [];
                        var kv = {
                            upholstery: "内饰",
                            accelerate: '加速',
                            manipulate: '操控',
                            space: '空间',
                            detail: '细节',
                            appearance: '外观',
                            configuration: '配置',
                            comfortable: "舒适",
                            noise: "噪音"
                        }
                        var data = _data.data.items[0]
                        if (_data.data) {
                            var koubeiData = [];
                            for (var i in kv) {
                                if (data[i]) {
                                    for (var c = 0; c < data[i].comments.length; c++) {
                                        var label = data[i].comments[c];
                                        label = label.replace(/\((.*?)\)/, function(v, v2) {
                                            return "(" + ((v2 * 1)).toFixed(0) + ")"
                                        })
                                        data[i].comments[c] = label
                                    }
                                    koubeiData.push({
                                        name: kv[i],
                                        rate: (data[i].score * 1).toFixed(2),
                                        labels: data[i].comments.slice(0, 3)
                                    })
                                } else {
                                    koubeiData.push({
                                        name: kv[i],
                                        rate: 1,
                                        labels: []
                                    })
                                }
                            }
                        }
                        self.redraw({
                            items: koubeiData,
                            allScore: data.generalScore,
                            "seriesName": data.seriesName,
                            "seriesCode": data.seriesCode,
                            "relatedSeries": data.relatedSeries,
                            "topPosReview": data.topPosReview,
                            "topNegReview": data.topNegReview
                        })


                    }

                }
            })
        },
        drawRadar: function(svgD,color) {
            if(svgD){
                draw = svgD;
                draw.clear()
            }else{
                draw = SVG("koubei_svg").size(500, 500);
            }

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
                }).attr("style", "stroke-dasharray:3")
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

                tempPathPoints.push([realPoints[i].x, realPoints[i].y])
                realPathPoints.push([centerPoint.x, centerPoint.y])
            }
            var polygon = draw.polygon(realPathStr + "").fill({
                color:color?color: "#95c194",
                opacity: 0.6
            }).stroke({
                color: color?color:"#63b162",
                width: 3
            })
            for (var i = 0; i < realPoints.length; i++) {
                svgPoints.push(drawPoint(centerPoint.x, centerPoint.y,color?color:"#63b162"));
            }
            queuedo([0, 1, 2, 3, 4, 5, 6, 7, 8], function(index, next, context) {
                realPathPoints[index] = tempPathPoints[index];

                polygon.animate(200, "<>").plot(realPathPoints);
                svgPoints[index].animate(400, "<>").move(realPoints[index].x - 5, realPoints[index].y - 5)
                setTimeout(function() {
                    next.call(context);
                }, 150)
            }, function() {

            })




        },
        drawLabel: function() {
            for (var i = 0; i < data.items.length; i++) {
                data.items[i].width = data.items[i].rate * 100;
                var label = $(Mustache.render(item_tpl, data.items[i]));
                $(".koubei-content").append(label);
                label.on("mouseenter", function() {
                    $(".koubei-item-labels").addClass("hidden")
                    $(".koubei-item-labels", $(this)).removeClass("hidden");

                })


                if (i < 5) {
                    label.css({
                        left: outlinePoints[i].x + 420,
                        top: outlinePoints[i].y + 40
                    })
                } else {
                    label.css({
                        left: outlinePoints[i].x + 90,
                        top: outlinePoints[i].y + 40
                    }).addClass("float-left-item")
                }
                if (i == 0) {
                    label.css({
                        left: outlinePoints[i].x + 340,
                        top: outlinePoints[i].y + 90
                    })
                } else if (i == 1) {
                    label.css({
                        left: outlinePoints[i].x + 410,
                        top: outlinePoints[i].y + 80
                    })
                } else if (i == 4) {
                    label.css({
                        left: outlinePoints[i].x + 410,
                        top: outlinePoints[i].y + 10
                    })
                } else if (i == 5) {
                    label.css({
                        left: outlinePoints[i].x + 100,
                        top: outlinePoints[i].y + 10
                    })
                } else if (i == 8) {
                    label.css({
                        left: outlinePoints[i].x + 90,
                        top: outlinePoints[i].y + 70
                    })
                }
            }
            $(".koubei-item-labels").addClass("hidden")
            $(".koubei-item-labels:eq(5)").removeClass("hidden")
        }
    }
    return DrawKoubei;
})