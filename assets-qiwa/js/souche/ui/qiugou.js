define(['souche/custom-select', 'souche/util/load-info', 'lib/jquery.easing.min', ], function(CustomSelect, LoadInfo) {
    var brandSelect, seriesSelect, priceLowSelect, priceHighSelect, ageSelect, modelSelect;
    var brandSort = function(data) {
        var zimu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var obj = {}
        for (var i in data) {
            var brand = data[i]
            var firstword = brand.name.charAt(0).toUpperCase();
            if (!obj[firstword]) {
                obj[firstword] = []
            }
            brand.name = brand.name.substr(2, brand.name.length)
            obj[firstword].push(brand);
        }

        return obj;
    }
    var qiugouData = null;
    var phoneReg = /^1[3458][0-9]{9}$/;
    var config = {

    }
    var is_submiting = false;
    return {
        init: function(_config) {
            $.extend(config, _config);
            var self = this;
            brandSelect = new CustomSelect("brand_select", {
                placeholder: "请选择品牌，可多选"
            });
            seriesSelect = new CustomSelect("series_select", {
                placeholder: "请选择车系，可多选"
            });
            ageSelect = new CustomSelect("age_select", {
                placeholder: "请选择",
                multi: false
            })


            modelSelect = new CustomSelect("model_select", {
                placeholder: "请选择",
                multi: false
            })
            //没有默认值，则只需要一个请求即可初始化
            brandSelect.removeAllOption();
            seriesSelect.removeAllOption();
            this._bindBrandChange();
            this._onlyNum();

            LoadInfo.loadBrands(function(data) {
                var html = "";
                data = brandSort(data.items);
                for (var i in data) {
                    var b = data[i];
                    var name = i;
                    html += "<div data-name='" + name + "' class='clearfix word-container'><div class='word-title'>" + name + "</div><div class='word-brands'>"
                    for (var n = 0; n < b.length; n++) {
                        var brand = b[n]
                        html += ('<a href="#" data-value="' + brand.code + '" class="option"><input type="checkbox" class="hidden"/><span class="value">' + brand.name + '</span></a>');
                    }
                    html += "</div></div>"

                }
                brandSelect.addOptions(html)
            })
            $("#qiugou-form").on("submit", function(e) {
                e.preventDefault();
                if (!$("#brand_select .selected_values").val() && !$("#series_select .selected_values").val() && !$("#age_select .selected_values").val() && !$("#model_select .selected_values").val() && !($("#price_low_select").val() && $("#price_hight_select").val())) {
                    $(".warning", self.ele).removeClass("hidden")
                    return;
                } else {
                    $(".warning", self.ele).addClass("hidden")
                }
                Souche.checkPhoneExist(function(isLogin) {
                    if (isLogin) {
                        self._submit();
                    } else {
                        $("#qiugou-popup").removeClass("hidden")
                        $(".wrapGrayBg").show();
                    }
                })
            })
            $("#qiugou_redo").on("click", function(e) {
                self._redo();
            })
            $("#qiugou_login").on("click", function(e) {
                e.preventDefault();
                Souche.MiniLogin.checkLogin(function() {
                    $(".qiugou .go-login").addClass("hidden")
                    window.location.href = window.location.href + "?123#qiugou-cur";
                })
            })

            $("#qiugou-phone-form").on("submit", function(e) {
                e.preventDefault();
                if (!phoneReg.test($("#qiugou-phone").val())) {
                    $(".warning", this).removeClass("hidden");
                } else {
                    Souche.PhoneRegister($("#qiugou-phone").val(), function() {
                        $(".go-login").addClass("hidden")
                        $("#qiugou-popup").addClass("hidden")
                        $(".wrapGrayBg").hide();
                        self._submit();
                    })

                }
            });

        },
        _submit: function() {
            var self = this;
            if (is_submiting) return;


            $(".qiugou .submit").addClass("loading").html("提交中  ...");
            is_submiting = true;
            $.ajax({
                url: contextPath + "/pages/homePageAction/saveBuyInfo.json",
                dataType: "json",
                data: $("#qiugou-form").serialize(),
                success: function(data) {
                    qiugouData = data;
                    window.location.href = contextPath + "/pages/onsale/match_car_list.html"
                },
                error: function() {

                }
            })
        },
        _onlyNum: function() {
            setInterval(function() {
                $("#price_low_select").val($("#price_low_select").val().replace(/[^0-9]/, ""))
                $("#price_hight_select").val($("#price_hight_select").val().replace(/[^0-9]/, ""))
            }, 200)
        },

        _bindBrandChange: function() {
            var self = this;
            if (brandSelect.selected.length == 0 && seriesSelect.selected.length == 0) {
                seriesSelect.disable("请先选择品牌")
            }
            $(brandSelect).on("select", function(e, data) {

                self._addSeries(data.key)
                seriesSelect.enable();
                //选中了某品牌
            }).on("unselect", function(e, data) {
                self._removeSeries(data.key)
                if (brandSelect.selected.length == 0) {
                    seriesSelect.disable("请先选择品牌")
                }
                //取消选中某品牌，删除其所拥有的车系列表
            }).on("show", function() {
                $("html,body").animate({
                    scrollTop: $(".qiugou").offset().top
                }, 200)
            })
            for (var i = 0; i < brandSelect.selected.length; i++) {
                self._addSeries(brandSelect.selected[i].key)
            }
        },
        _addSeries: function(brandCode) {
            if ($("#series_select .sc-select-list div[data-brandid=" + brandCode + "]").length) {
                return;
            }
            LoadInfo.loadSeries(brandCode, function(data) {
                var html = "";

                for (var i in data.codes) {
                    var b = data.codes[i];
                    var name = i;
                    html += "<div data-name='" + name + "' data-brandid='" + brandCode + "' class='clearfix word-container'><div class='brand-title'>" + name + "</div>"
                    for (var n = 0; n < b.length; n++) {
                        var series = b[n]
                        html += ('<a href="#" data-value="' + series.code + '" class="option"><input type="checkbox" class="hidden"/><span class="value">' + series.name + '</span></a>');
                    }
                    html += "</div>"

                }
                seriesSelect.addOptions(html)
            })

        },
        _removeSeries: function(brandCode) {

            $("#series_select .sc-select-list div[data-brandid=" + brandCode + "]").each(function(i, key) {
                var options = $(".option", $(this));
                options.each(function(n, k) {
                    var series_id = $(k).attr("data-value")
                    seriesSelect.removeSelected(series_id)
                })

                $(this).remove();
            })
        }
    };
});