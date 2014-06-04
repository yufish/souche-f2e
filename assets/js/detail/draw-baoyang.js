define(['lib/mustache', 'lib/svg.min', 'souche/custom-select'], function(Mustache, SVG, CustomSelect) {
    var svg;
    var chartHeight = 300;
    var min = 0;
    var max = 0;
    var data;
    var feiyongs = [];
    var nowIndex = 0;
    var kv = {
        "机油滤清器": 1,
        "变速箱油（CVT）": 6,
        "空调滤清器": 3,
        "差速器油": 464.0,
        "空气滤清器": 2,
        "发动机机油": 0,
        "分动器油": 120.0,
        "发动机冷却液": 488.0,
        "转向助力液": 7,
        "前制动器": -1.0,
        "后制动器": -1.0,
        "整车制动液": 5,
        "全部火花塞": 8
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
            }).on("mousemove", function(e) {
                $(".baoyang .price-point").css({
                    left: i * 45 + 5,
                    top: 154 + chartHeight - chartHeight * (price / (max - min))
                })
                $(".baoyang .price-point .price-value").html(price)
            });
        },
        drawChart: function() {
            svg = SVG("baoyang_chart").size(1028, 350);
            var maxL = feiyongs.length;
            if (maxL >= 21) {
                maxL = 21;
            }
            for (var i = 0; i < maxL; i++) {
                if (feiyongs[i] > max) {
                    max = feiyongs[i];
                }
            }

            for (var i = 0; i < maxL; i++) {
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
                svg.plain((i + 1) * 0.5 + "万").attr({
                    x: i * 45 + 6 + 30,
                    y: 320
                }).font({
                    size: 12
                }).fill(textColor);
            }
            $(".baoyang .price-point").css({
                left: nowIndex * 45 + 5,
                top: 154 + chartHeight - chartHeight * (feiyongs[nowIndex] / (max - min))
            })
            $(".baoyang .price-point .price-value").html(feiyongs[nowIndex])
            svg.polyline('0,301 988,301').stroke({
                color: "#63b162",
                width: 3
            })
        },
        draw: function(data) {
            data = data;
            for (var i = 0; i < data.distanceData.length; i++) {
                feiyongs.push(data.distanceData[i].price);
            }
            nowIndex = Math.floor(data.nowDistance / 0.5)
            this.drawChart();

            var distanceSelect = new CustomSelect("distance_select", {
                placeholder: "请选择",
                multi: false
            })
        }
    }
    return BaoyangDraw;
})