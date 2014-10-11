define(['lib/svg.min', 'souche/custom-select'], function(SVG, CustomSelect) {
    var svg;
    var chartHeight = 350;
    var min = 0;
    var max = 0;
    var data;
    var feiyongs = [];
    var nowIndex = 0;
    var kv = {
        "机油滤清器": 0,
        "变速箱油（CVT）": 1,
        "空调滤清器": 2,
        "差速器油": 3,
        "空气滤清器": 4,
        "发动机机油": 5,
        "分动器油": 6,
        "发动机冷却液": 7,
        "转向助力液": 8,
        "前制动器": 9,
        "后制动器": 10,
        "整车制动液": 11,
        "全部火花塞": 12
    }
    var BaoyangDraw = {
        drawColumn: function(i, price) {
            var fillColor = "#cfe6cf";
            var textColor = "#a0c9a0";
            if (i < nowIndex) {
                fillColor = "#e6e6e6";
                textColor = "#ccc";
            } else if (i == nowIndex) {
                fillColor = "#63b162"
                textColor = "#999";
            }
            svg.rect(38, chartHeight * (price / (max - min))).move(
                i * 45 + 30,
                chartHeight - chartHeight * (price / (max - min))
            ).fill({
                color: fillColor
            }).on("mouseover", function(e) {
                this.fill({
                    color: "#63b162"
                })
                $(".baoyang .price-point .price-value").html(price + "元")
                var items = data.distanceData[i].items;
                $(".baoyang-project").addClass("hidden");
                items.forEach(function(item) {
                    $($(".baoyang-project").get(kv[item])).removeClass("hidden");
                })
                var top = chartHeight - chartHeight * (price / (max - min)) - $(".baoyang-main .price-tag").height() - 24 + 200;
                if (top < 20)
                    top = 20;
                $(".baoyang .price-point").css({
                    left: i * 45 + 75 - 50,
                    top: top
                })
            }).on("mouseleave", function(e) {
                this.fill({
                    color: fillColor
                })
            })
        },
        drawChart: function() {
            svg = SVG("baoyang_chart").size(1228, 380);
            var maxL = feiyongs.length;
            if (maxL >= 21) {
                maxL = 21;
            }
            for (var i = 0; i < maxL; i++) {
                if (feiyongs[i] > max) {
                    max = feiyongs[i];
                }
            }
            for(var i=0;i<(data.distanceData.length>20?20:data.distanceData.length);i++){
                var d = feiyongs[i];
                var fillColor = "#cfe6cf";
                var textColor = "#a0c9a0";
                if (i < nowIndex) {
                    fillColor = "#e6e6e6";
                    textColor = "#ccc";
                } else if (i == nowIndex) {
                    fillColor = "#63b162"
                    textColor = "#999";
                }
                this.drawColumn(i, feiyongs[i])

                svg.plain((data.distanceData[i].distance/10000).toFixed(1) + "万").attr({
                    x: i * 45 + 6 + 30,
                    y: 370
                }).font({
                    size: 12
                }).fill(textColor);
            }

            svg.plain("里程:公里").attr({
                x: 998,
                y: 371
            }).font({
                size: 12
            }).fill("#999999");
            svg.plain("价格:元").attr({
                x: 10,
                y: 10
            }).font({
                size: 12
            }).fill("#999999");
            $(window).on("nav_change", function(e, d) {
                if (d == "onsale_baoyang") {
                    $(".baoyang .price-point .price-value").html(feiyongs[nowIndex] + "元")
                    var items = data.distanceData[nowIndex].items;
                    $(".baoyang-project").addClass("hidden");
                    items.forEach(function(item) {
                        $($(".baoyang-project").get(kv[item])).removeClass("hidden");
                    })
                    var top = chartHeight - chartHeight * (feiyongs[0] / (max - min)) - $(".baoyang-main .price-tag").height() - 24 + 200;
                    if (top < 20)
                        top = 20;
                    $(".baoyang .price-point").css({
                        left: nowIndex * 45 + 75 - 50,
                        top: top
                    })
                }
            })


            svg.polyline('0,351 988,351').stroke({
                color: "#63b162",
                width: 3
            })
            svg.polyline('1.5,0 1.5,351').stroke({
                color: "#63b162",
                width: 3
            })
        },
        draw: function(_data) {
            data = _data;
            for (var i = 0; i < data.distanceData.length; i++) {
                feiyongs.push(data.distanceData[i].price);
            }
            for (var i = 0; i < data.distanceData.length; i++) {
                if(data.distanceData[i].distance*1>=data.nowDistance*10000){
                    nowIndex = i
                    break;
                }
            }

            this.drawChart();
            var distanceSelect;
            distanceSelect = new CustomSelect("distance_select", {
                placeholder: "请选择",
                multi: false,
                onchange: function(e, d) {
                    var distance = d.key.replace(/[^0-9]/g, '') * 1;
                    var price = 0;
                    for (var i = 0; i < data.distanceData.length; i++) {
                        if (distance >= data.distanceData[i].distance) {
                            price += data.distanceData[i].price * 1;
                        }
                    }
                    $("#baoyang_price").html(price.toFixed(2))
                }
            })
            // $(distanceSelect).on("change", function(e, d) {
            //     var distance = d.key * 10000;
            //     var price = 0;
            //     alert("change")
            //     for (var i = 0; i < data.distanceData.length; i++) {
            //         if (distance >= data.distanceData[i].distance) {
            //             price += data.distanceData[i].price * 1;
            //         }
            //     }
            //     $("#baoyang_price").html(price)
            // })
        }
    }
    return BaoyangDraw;
})