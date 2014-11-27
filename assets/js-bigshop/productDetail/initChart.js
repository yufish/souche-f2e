define(function() {
    var config = {};
    var hasInitTab = {

    }

    var SVGsupported = function() {
        ns = "http://www.w3.org/2000/svg"
        return !!document.createElementNS && !! document.createElementNS(ns, "svg").createSVGRect
    }()
    var config;
    var checkActive = function() {
        var showNavs = $("#productDetailInfo .nav li:not(.hidden)");
        if (showNavs.length) {
            for (var i = 0; i < showNavs.length; i++) {
                var nav = showNavs.get(i);
                $("#productDetailInfo .contents>div[data-id=" + $(nav).attr("data-id") + "]").addClass("hidden")
            }
            showNavs.removeClass("active")
            $(showNavs.get(0)).addClass("active");
            $("#productDetailInfo .contents>div[data-id=" + $(showNavs.get(0)).attr("data-id") + "]").removeClass("hidden")
        }
    }
    return {
        load_price: function() {
            $.ajax({
                url: config.api_price + config.brandCode + "/s/" + config.seriesCode + (config.modelCode ? "/m/" + config.modelCode : "") + "/p/北京",
                dataType: "jsonp",
                success: function(_data) {
                    var data = _data.data;
                    if (data) {
                        var priceData = data;
                        config.maxPrice = config.maxPrice * 1;
                        config.minPrice = config.minPrice * 1;
                        if (!config.maxPrice) {
                            $("*[data-id=onsale_price]").addClass("hidden")
                            checkActive();
                            return;
                        }
                        if (config.minPrice == 0) {
                            config.minPrice = config.maxPrice;
                        }
                        $(".onsale-tab-item-price").removeClass("hidden")
                        $(".float-nav-item-price").removeClass("hidden")
                        var maxPrice = (priceData.price_guide).toFixed(1) * 1;
                        var minPrice = ((config.minPrice + config.maxPrice) / 2).toFixed(2) * 1;
                        var rangePrice = config.minPrice + "-" + config.maxPrice;
                        if (priceData.priceNude) {
                            var middlePrice = ((priceData.priceNude.lowPrice + priceData.priceNude.highestPrice) / 2).toFixed(1)
                        } else {
                            var middlePrice = ((minPrice + maxPrice) / 2).toFixed(2);
                        }
                        if (config.minPrice == config.maxPrice) {
                            rangePrice = config.minPrice;
                        }
                        require(['detail/draw-sanprice'], function(SanPrice) {
                            SanPrice.draw(minPrice, maxPrice, middlePrice, rangePrice);
                        })
                        $("*[data-id=onsale_price]").removeClass("hidden");
                    } else {
                        $("*[data-id=onsale_price]").addClass("hidden")
                    }
                    checkActive();
                }
            })
            // require(['detail/draw-price-down'], function(DrawPriceDown) {
            //     DrawPriceDown.draw([250, 230, 200, 150, 100, 60])
            // })
        },
        load_baoyang: function() {
            $.ajax({
                url: config.api_maintenance + config.brandCode + "/s/" + config.seriesCode + (config.modelCode ? "/m/" + config.modelCode : ""),
                dataType: "jsonp",
                success: function(_data) {

                    var data = _data.data;
                    if (data) {
                        var baoyangData = data;
                        $(".onsale-tab-item-baoyang").removeClass("hidden");
                        $(".float-nav-item-baoyang").removeClass("hidden");
                        var prices = {};
                        for (var i = 0; i < baoyangData.maintenanceItem.length; i++) {
                            prices[baoyangData.maintenanceItem[i].name] = baoyangData.maintenanceItem[i].price;
                        }
                        var distanceData = [];
                        for (var i in baoyangData.mileageMark) {
                            var mileData = baoyangData.mileageMark[i];
                            var distance = mileData.name.replace(/ 公里.*$/, "") * 1;
                            var _prices = 0;
                            for (var n = 0; n < mileData.MaintenanceItemNames.length; n++) {
                                var key = mileData.MaintenanceItemNames[n];
                                _prices += prices[key] * 1;
                            }
                            distanceData.push({
                                distance: distance,
                                items: mileData.MaintenanceItemNames,
                                price: _prices
                            })
                        }
                        distanceData.sort(function(i1, i2) {
                            return i1.distance - i2.distance;
                        })
                        require(['detail/draw-baoyang'], function(Baoyang) {
                            Baoyang.draw({
                                distanceData: distanceData,
                                nowDistance: config.nowDistance
                            })
                        })
                        $("*[data-id=onsale_baoyang]").removeClass("hidden")
                    } else {
                        $("*[data-id=onsale_baoyang]").addClass("hidden")
                    }
                    checkActive();
                }
            })
        },
        load_koubei: function() {
            $.ajax({
                url: config.api_sentiment + config.brandCode + "/s/" + config.seriesCode + (config.modelCode ? "/m/" + config.modelCode : ""), //"http://115.29.10.121:8282/soucheproduct/car/sentiment/b/" + config.brandCode + "/s/" + config.seriesCode,
                dataType: "jsonp",
                success: function(_data) {
                    if (_data && _data.data) {
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
                        var data = _data.data
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
                        require(['detail/draw-koubei'],
                            function(DrawKoubei) {
                                DrawKoubei.draw({
                                    items: koubeiData,
                                    allScore: data.generalScore,
                                    "seriesName": data.seriesName,
                                    "seriesCode": data.seriesCode,
                                    "relatedSeries": data.relatedSeries,
                                    "topPosReview": data.topPosReview,
                                    "topNegReview": data.topNegReview
                                })
                                $(".onsale-tab-item-koubei").removeClass("hidden");
                                $(".float-nav-item-koubei").removeClass("hidden")
                            }
                        )

                        $("*[data-id=onsale_koubei]").removeClass("hidden")
                    } else {
                        $("*[data-id=onsale_koubei]").addClass("hidden")
                    }
                    checkActive();

                }
            })
        },
        initForChexi: function(_config) {
            config = _config;
            var self = this;

            if (SVGsupported) {
                // self.load_price();
                self.load_koubei();
                // self.load_config();
                // $(".nosvghidden").css({
                //     display: "block"
                // })
                // $("#productDetailInfo").css({
                //     display: "block"
                // })
            } else {
                $("#productDetailInfo").addClass("hidden")
                $(".nosvghidden").addClass("hidden")
            }
        },
        initForChexing: function(_config) {
            config = _config;
            var self = this;

            if (SVGsupported) {
                self.load_price();
                self.load_baoyang();
                // self.load_koubei();
                // self.load_config();
                // $(".nosvghidden").css({
                //     display: "block"
                // })
            } else {
                $(".nosvghidden").addClass("hidden")
            }
        }
    }
});