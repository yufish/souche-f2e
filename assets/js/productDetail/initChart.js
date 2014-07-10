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
                url: "http://112.124.123.209:8080/price/b/" + config.brandCode + "/s/" + config.seriesCode + "/m/" + config.modelCode,
                dataType: "jsonp",
                success: function(_data) {
                    var data = _data.data;
                    if (data.items.length) {
                        var priceData = data.items[0];

                        $(".onsale-tab-item-price").removeClass("hidden")
                        $(".float-nav-item-price").removeClass("hidden")
                        var maxPrice = (priceData.price_guide).toFixed(1)
                        var middlePrice = ((priceData.priceNude.lowPrice + priceData.priceNude.highestPrice) / 2).toFixed(1)
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
                url: "http://112.124.123.209:8080/maintenance/b/" + config.brandCode + "/s/" + config.seriesCode + "/m/" + config.modelCode,
                dataType: "jsonp",
                success: function(_data) {
                    var data = _data.data;
                    if (data.items.length) {
                        var baoyangData = data.items[1];
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

                    }
                }
            })
        },
        load_koubei: function() {
            $.ajax({
                url: "http://112.124.123.209:8080/sentiment/b/" + config.brandCode + "/s/" + config.seriesCode + "/m/" + config.modelCode, //"http://115.29.10.121:8282/soucheproduct/car/sentiment/b/" + config.brandCode + "/s/" + config.seriesCode,
                dataType: "jsonp",
                success: function(_data) {
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
                                koubeiData.push({
                                    name: kv[i],
                                    rate: data[i].score / 100,
                                    labels: data[i].comments
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
                }
            })
        },
        load_config: function() {
            var kv = {
                baseConfig: '基本参数',
                carBody: '车身',
                engine: '发动机',
                gearbox: '变速箱',
                chassisDirection: '底盘转向',
                wheelBrake: '车轮制动',
                safetyEquipment: '安全装备',
                manipulateConfig: '操控配置',
                appearanceConfig: '外部配置',
                innerConfig: '内部配置',
                seatConfig: '座椅配置',
                multimediaConfig: '多媒体配置',
                lightConfig: '灯光配置',
                glassAndBackMirror: '玻璃/后视镜',
                airConditionAndFridge: '空调/冰箱',
                highTechConfig: '高科技配置'
            }
            var tpl = '<table><colgroup><col width="220"><col width="520"></colgroup>' +
                '<thead>' +
                '<tr>' +
                '<td colspan="2"><div><a>{{name}}</a></div><div class="border"></div></td>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '{{#items}}' +
                '<tr>' +
                '<td><div class="firstCol"><a>厂商</a></div></td>' +
                '<td><div class="secordCol"><a>奥迪进口</a></div></td>' +
                '</tr>' +
                '{{/items}}' +
                '</tbody></table>'
            $.ajax({
                url: "http://112.124.123.209:8080/configuration/b/" + config.brandCode + "/s/" + config.seriesCode + "/m/" + config.modelCode, //"http://115.29.10.121:8282/soucheproduct/car/sentiment/b/" + config.brandCode + "/s/" + config.seriesCode,
                dataType: "jsonp",
                success: function(_data) {
                    console.log(_data)
                    var data = _data.data;
                    for (var i in kv) {
                        var d = kv[i];
                        if (d) {

                        }
                    }
                }
            });
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
                self.load_price();
                self.load_baoyang();
                self.load_koubei();
                self.load_config();
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