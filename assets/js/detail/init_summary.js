define(function() {
    var hasInitTab = {

    }
    var config;
    return {
        load_price: function() {
            $.ajax({
                url: "http://115.29.10.121:10001/demo/carprice/price?modelcode=133358",
                dataType: "jsonp",
                success: function(data) {
                    var maxPrice = ((data.priceInterval_nudeCar.first + data.priceInterval_nudeCar.second) / 2).toFixed(1)
                    var middlePrice = ((data.priceInterval_4s.first + data.priceInterval_4s.second) / 2).toFixed(1)
                    var minPrice = config.price;
                    console.log(minPrice)
                    console.log(middlePrice)
                    console.log(maxPrice)
                    require(['detail/draw-sanprice'], function(SanPrice) {
                        SanPrice.draw(minPrice, maxPrice, middlePrice);
                    })
                }
            })
            require(['detail/draw-price-down'], function(DrawPriceDown) {
                DrawPriceDown.draw([250, 230, 200, 150, 100, 60])
            })
        },
        init: function(_config) {
            config = _config;
            var self = this;
            $(".onsale-tab-item").on("click", function(e) {
                var id = $(this).attr("data-id");
                $(".onsale-content-item").addClass("hidden")
                $("#" + id).removeClass("hidden");
                $(".onsale-tab-item").removeClass("active");
                $(this).addClass("active")
                $(window).trigger("tab_change", id);
            });
            $(window).on("tab_change", function(e, id) {
                if (!hasInitTab[id]) {
                    if (id == "onsale_price") {
                        self.load_price();
                    } else if (id == "onsale_baoyang") {
                        require(['detail/draw-baoyang'], function(Baoyang) {
                            Baoyang.draw({
                                feiyongs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8],
                                nowDistance: 3.4
                            })
                        })
                    } else if (id == "onsale_koubei") {
                        require(['detail/draw-koubei'],
                            function(DrawKoubei) {
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
                                DrawKoubei.draw(koubeiData)
                            }
                        )
                    }
                    hasInitTab[id] = 1;
                }
            })
        }
    }
});