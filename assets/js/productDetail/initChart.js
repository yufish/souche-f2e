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
                url: "http://115.29.10.121:8282/soucheproduct/car/price/b/" + config.brandCode + "/s/" + config.seriesCode + "/m/" + config.modelCode,
                dataType: "jsonp",
                success: function(data) {
                    if (data.priceInterval_nudeCar) {
                        $(".onsale-tab-item-price").removeClass("hidden")
                        $(".float-nav-item-price").removeClass("hidden")
                        var maxPrice = (data.price_guide).toFixed(1)
                        var middlePrice = ((data.priceInterval_nudeCar.first + data.priceInterval_nudeCar.second) / 2).toFixed(1)
                        var minPrice = config.price;
                        require(['detail/draw-sanprice'], function(SanPrice) {
                            SanPrice.draw(minPrice, maxPrice, middlePrice);
                        })
                    }
                }
            })
            require(['detail/draw-price-down'], function(DrawPriceDown) {
                DrawPriceDown.draw([250, 230, 200, 150, 100, 60])
            })
        },
        load_baoyang: function() {
            $.ajax({
                url: "http://115.29.10.121:10001/demo/carprice/maintenance?modelcode=" + config.modelCode,
                dataType: "jsonp",
                success: function(data) {
                    if (data && data.maitenanceItems) {
                        $(".onsale-tab-item-baoyang").removeClass("hidden");
                        $(".float-nav-item-baoyang").removeClass("hidden")
                        var distanceData = [];
                        for (var i in data.maitenanceItems) {
                            var distance = i.replace(/ 公里.*$/, "") * 1;
                            var prices = 0;
                            for (var n = 0; n < data.maitenanceItems[i].length; n++) {
                                var key = data.maitenanceItems[i][n];
                                prices += data.itemPrice[key] * 1;
                            }
                            distanceData.push({
                                distance: distance,
                                items: data.maitenanceItems[i],
                                price: prices
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

                    }
                }
            })
        },
        load_koubei: function() {
            $.ajax({
                url: "http://115.29.10.121:8282/soucheproduct/car/sentiment/b/b1/s/s1", //"http://115.29.10.121:8282/soucheproduct/car/sentiment/b/" + config.brandCode + "/s/" + config.seriesCode,
                dataType: "jsonp",
                success: function(data) {
                    var koubeiData = [];
                    if (data.data) {
                        var koubeiData = [{
                            name: "细节",
                            rate: 0.7,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.8,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.9,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.5,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.8,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.5,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.2,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.3,
                            labels: ["价格高", "储物空间大"]
                        }, {
                            name: "细节",
                            rate: 0.8,
                            labels: ["价格高", "储物空间大"]
                        }]
                    }
                    require(['detail/draw-koubei'],
                        function(DrawKoubei) {

                            DrawKoubei.draw({
                                items: koubeiData,
                                allScore: 34.4,
                                "seriesName": null,
                                "seriesCode": "s1",
                                "relatedSeries": [{
                                    "seriesCode": "s1",
                                    "name": "宝马1系"
                                }, {
                                    "seriesCode": "s2",
                                    "name": "宝马2系"
                                }],
                                "topPosReview": ["preview1", "preview2", "preview4"],
                                "topNegReview": ["review1", "review2", "review4"]
                            })
                            $(".onsale-tab-item-koubei").removeClass("hidden");
                            $(".float-nav-item-koubei").removeClass("hidden")
                        }
                    )
                }
            })
        },

        init: function(_config) {
            config = _config;
            var self = this;
            // var saleTabTop = $(".onsale-tab-item").offset().top;

            // $(".onsale-tab-item").on("click", function(e) {
            //     var id = $(this).attr("data-id");
            //     $(".onsale-content-item").addClass("hidden")
            //     $("#" + id).removeClass("hidden");
            //     // $(".onsale-tab-item").removeClass("active");
            //     // $(this).addClass("active")
            //     $(window).trigger("tab_change", id);

            //     if ($(this).attr("data-scrollto")) {
            //         $('html,body').animate({
            //             scrollTop: $("#" + $(this).attr("data-scrollto")).offset().top
            //         }, 500, function() {
            //             $(".onsale-tab-item").removeClass("active");
            //             $(self).addClass("active")
            //         });
            //     }
            //     var self = this;

            // });



            // $(".onsale-tab-item").each(function(i, tab) {
            //     if ($("#" + $(tab).attr("data-scrollto")).length) {
            //         Souche.Util.appear("#" + $(tab).attr("data-scrollto"), function() {
            //             $(".onsale-tab-item").removeClass("active")
            //             $(tab).addClass("active")
            //         }, $(window).height() - 100, true)
            //     }

            // })
            // $(".float-nav-item").on("click", function(e) {
            //     var id = $(this).attr("data-id");
            //     $(".onsale-content-item").addClass("hidden")
            //     $("#" + id).removeClass("hidden");
            //     $(".float-nav-item").removeClass("activeNav");
            //     $(this).addClass("activeNav")
            //     $(window).trigger("tab_change", id);
            //     e.preventDefault();
            // });
            // var picsLoaded = false;
            // var brandHistoryLoaded = false;
            // $(window).on("tab_change", function(e, id) {
            //     if (id == "onsale_pics") {
            //         if (!picsLoaded) {
            //             $("#onsale_pics img").lazyload();



            //             picsLoaded = true;
            //         }

            //     } else if (id == "onsale_brand") {
            //         if (!brandHistoryLoaded) {

            //             self.init_brandHistory();


            //             brandHistoryLoaded = true;
            //         }
            //     }
            // });
            if (SVGsupported) {
                // self.load_price();
                self.load_baoyang();
                self.load_koubei();
            }
            // $(window).on("tab_change", function(e, id) {
            //     if (!hasInitTab[id]) {
            //         if (id == "onsale_price") {
            //             self.load_price();
            //         } else if (id == "onsale_baoyang") {
            //             require(['detail/draw-baoyang'], function(Baoyang) {
            //                 Baoyang.draw({
            //                     feiyongs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8],
            //                     nowDistance: 3.4
            //                 })
            //             })
            //         } else if (id == "onsale_koubei") {
            //             require(['detail/draw-koubei'],
            //                 function(DrawKoubei) {
            //                     var koubeiData = [{
            //                         name: "细节",
            //                         rate: 0.7,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.8,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.9,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.5,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.8,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.5,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.2,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.3,
            //                         labels: ["价格高", "储物空间大"]
            //                     }, {
            //                         name: "细节",
            //                         rate: 0.8,
            //                         labels: ["价格高", "储物空间大"]
            //                     }]
            //                     DrawKoubei.draw(koubeiData)
            //                 }
            //             )
            //         }
            //         hasInitTab[id] = 1;
            //     }
            // })
        }
    }
});