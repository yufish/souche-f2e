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
                        var minPrice = ((config.minPrice + config.maxPrice) / 2).toFixed(2);
                        var rangePrice = config.minPrice + "-" + config.maxPrice;

                        require(['detail/draw-sanprice'], function(SanPrice) {
                            SanPrice.draw(minPrice, maxPrice, middlePrice, rangePrice);
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
                                    rate: (data[i].score * 1).toFixed(2),
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
        initForChexi: function(_config) {
            config = _config;
            var self = this;

            if (SVGsupported) {
                // self.load_price();
                self.load_baoyang();
                self.load_koubei();
                // self.load_config();
            } else {
                $("#productDetailInfo").addClass("hidden")
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
            } else {

            }
        }
    }
});