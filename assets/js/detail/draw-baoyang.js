define(['lib/mustache', 'lib/svg.min'], function(Mustache, SVG) {
    var svg;
    var chartHeight = 300;
    var min = 0;
    var max = 0;
    var data;
    var feiyongs = [];
    var nowIndex = 0;
    var BaoyangDraw = {
        drawChart: function() {
            svg = SVG("baoyang_chart").size(1028, 350);
            for (var i = 0; i < feiyongs.length; i++) {
                if (feiyongs[i] > max) {
                    max = feiyongs[i];
                }
            }

            for (var i = 0; i < feiyongs.length; i++) {
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
                svg.rect(38, chartHeight * (feiyongs[i] / (max - min))).move(
                    i * 45 + 30,
                    chartHeight - chartHeight * (feiyongs[i] / (max - min))
                ).fill({
                    color: fillColor
                }).on("click", function(e) {
                    console.log(e)
                });
                svg.plain(i * 0.5 + "万").attr({
                    x: i * 45 + 6 + 30,
                    y: 320
                }).font({
                    size: 12
                }).fill(textColor);
            }
            svg.polyline('0,301 998,301').stroke({
                color: "#63b162",
                width: 3
            })
        },
        draw: function(data) {
            data = data;
            feiyongs = data.feiyongs;
            nowIndex = Math.floor(data.nowDistance / 0.5)
            this.drawChart();
        }
    }
    return BaoyangDraw;
})