define(function() {
    var hasInitTab = {

    }

    var SVGsupported = function() {
        ns = "http://www.w3.org/2000/svg"
        return !!document.createElementNS && !! document.createElementNS(ns, "svg").createSVGRect
    }()
    var config;
    return {
        load_price: function() {
            $.ajax({
                url: config.api_price + config.brandCode + "/s/" + config.seriesCode + (config.modelCode ? "/m/" + config.modelCode : "") + "/p/默认",
                dataType: "jsonp",
                success: function(_data) {
                    var data = _data.data;
                    if (data) {
                        var priceData = data;
                        config.maxPrice = config.maxPrice * 1;
                        config.minPrice = config.minPrice * 1;
                        config.taxPrice = (config.taxPrice*1).toFixed(1)*1;
                        if (config.minPrice == 0) {
                            config.minPrice = config.maxPrice;
                        }
                        $(".onsale-tab-item-price").removeClass("hidden")
                        $(".float-nav-item-price").removeClass("hidden")
                        $("#onsale_price").removeClass("hidden");
                        // 新车厂商指导成交价 不应该加税
                        var maxPrice = (priceData.price_guide).toFixed(2) * 1;
                        var minPrice = ((config.minPrice + config.maxPrice) / 2).toFixed(2) * 1;
                        var rangePrice = config.minPrice + "-" + config.maxPrice;
                        if (config.minPrice == config.maxPrice) {
                            rangePrice = config.minPrice;
                        }
                        if (priceData.priceNude&&priceData.priceNude.lowPrice&&priceData.priceNude.highestPrice) {
                            var middlePrice = ((priceData.priceNude.lowPrice + priceData.priceNude.highestPrice) / 2).toFixed(1)  * 1
                        } else {
                            var middlePrice = ((minPrice + maxPrice) / 2).toFixed(2) * 1;

                        }
                        middlePrice=(middlePrice*1+config.taxPrice).toFixed(2) * 1
                            if(minPrice>middlePrice){
                                //大搜车价大于平均成交价
                                $(".onsale-tab-item-price").addClass("hidden")
                                $(".float-nav-item-price").addClass("hidden")
                                $("#onsale_price").addClass("hidden");
                            }
                        require(['detail/draw-sanprice'], function(SanPrice) {
                            SanPrice.draw(minPrice, maxPrice, middlePrice, rangePrice);
                        })
                    } else {
                        $("*[data-id=onsale_price]").addClass("hidden")
                        $("*[data-scrollto=onsale_price]").addClass("hidden")
                    }
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
                        $("#onsale_baoyang").removeClass("hidden");
                        var prices = {};
                        var totalPrice = 0;
                        for (var i = 0; i < baoyangData.maintenanceItem.length; i++) {
                            prices[baoyangData.maintenanceItem[i].name] = baoyangData.maintenanceItem[i].price;
                            totalPrice+=baoyangData.maintenanceItem[i].price;
                        }
                        if(totalPrice<0){
                            $("*[data-id=onsale_baoyang]").addClass("hidden")
                            $("*[data-scrollto=onsale_baoyang]").addClass("hidden")
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
                    } else {
                        $("*[data-id=onsale_baoyang]").addClass("hidden")
                        $("*[data-scrollto=onsale_baoyang]").addClass("hidden")
                    }
                }
            })
        },
        load_koubei: function() {
            $.ajax({
                url: config.api_sentiment + config.brandCode + "/s/" + config.seriesCode, //"http://115.29.10.121:8282/soucheproduct/car/sentiment/b/" + config.brandCode + "/s/" + config.seriesCode,
                dataType: "jsonp",
                success: function(_data) {
                    if (_data && _data.data&&_data.data.items&&_data.data.items.length) {
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
                                },config)
                                $(".onsale-tab-item-koubei").removeClass("hidden");
                                $(".float-nav-item-koubei").removeClass("hidden")
                                $("#onsale_koubei").removeClass("hidden")
                            }
                        )

                    } else {
                        $("*[data-id=onsale_koubei]").addClass("hidden")
                        $("*[data-scrollto=onsale_koubei]").addClass("hidden")
                    }

                }
            })
        },
        init_brandHistory: function() {
            $("#onsale_brand img").lazyload();
            $(".age-image img").click(function() {
                $(this).closest(".age-image").children("img").each(function() {
                    $(this).toggleClass("one-image");
                })
                // $(this).addClass("one-image");
                // $(this).removeClass("more-image");
            })


        },
        init: function(_config) {
            config = _config;
            var self = this;
            var saleTabTop = $(".onsale-tab-item").offset().top;

            $(".onsale-tab-bigitem .bigitem-inner-h").on("click", function(e) {
                var id = $(this).attr("data-id");
                $(".onsale-big-item").addClass("hidden")
                $("#" + id).removeClass("hidden");
                // $(".onsale-tab-item").removeClass("active");
                // $(this).addClass("active")
                $(window).trigger("nav_change", id);
                $(".onsale-tab-bigitem").removeClass("active");
                $(this.parentNode).addClass("active")
                var self = this;
                $('html,body').animate({
                    scrollTop: $("#" + id).offset().top - 70
                }, 500, function() {
                });

            });
            $(".onsale-tab-bigitem .onsale-tab-item").on("click", function(e) {
                var id = $(this).attr("data-id");
//                $(".onsale-content-item").addClass("hidden")
                $("#" + id).removeClass("hidden");
                $(window).trigger("nav_change", id);
                if ($(this).attr("data-scrollto")) {
                    $('html,body').animate({
                        scrollTop: $("#" + $(this).attr("data-scrollto")).offset().top - 70
                    }, 500, function() {
                    });
                }
                var self = this;
                e.stopPropagation()

            });



            $(".onsale-tab-item:not(hidden)").each(function(i, tab) {
                if ($("#" + $(tab).attr("data-scrollto")).length) {
                    Souche.Util.appear("#" + $(tab).attr("data-scrollto"), function() {
                        $(".onsale-tab-item").removeClass("active")
                        $(tab).addClass("active")
                    }, $(window).height() - 100, true)
                }

            })
            $(".float-nav-item").on("click", function(e) {
                var id = $(this).attr("data-id");
                $(".onsale-content-item").addClass("hidden")
                $("#" + id).removeClass("hidden");
                $(".float-nav-item").removeClass("activeNav");
                $(this).addClass("activeNav")
                $(window).trigger("nav_change", id);
                e.preventDefault();
            });
            var picsLoaded = false;
            var brandHistoryLoaded = false;
            $(window).on("nav_change", function(e, id) {
                if (id == "onsale_pics") {
                    if (!picsLoaded) {
                        $("#onsale_pics img").lazyload();



                        picsLoaded = true;
                    }

                } else if (id == "onsale_brand") {
                    if (!brandHistoryLoaded) {

                        self.init_brandHistory();


                        brandHistoryLoaded = true;
                    }
                } else if (id == "onsale_koubei") {

                }
            });
            if (SVGsupported && config.showChart) {
                self.load_price();
                self.load_baoyang();
                self.load_koubei();
            }

        }
    }
});