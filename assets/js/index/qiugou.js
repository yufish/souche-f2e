define(['souche/custom-select', 'souche/select', 'lib/jquery.easing.min'], function(CustomSelect, Select) {
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
            this._bindBrandChange();
            this._onlyNum();
            //没有默认值，则只需要一个请求即可初始化
            brandSelect.removeAllOption();
            seriesSelect.removeAllOption();
            $.ajax({
                url: contextPath + "/pages/dicAction/loadRootLevel.json",
                dataType: "json",
                data: {
                    type: "car-subdivision"
                },
                success: function(data) {
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

                },
                error: function() {
                    // alert("品牌信息请求出错，刷新后再试")
                },
                failure: function() {
                    // alert("品牌信息请求出错，刷新后再试")
                }
            });
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
                    window.location.href = window.location.href + "#qiugou-cur";
                })
            })
            $("#qiugou-phone-form").on("submit", function(e) {
                e.preventDefault();
                if (!phoneReg.test($("#qiugou-phone").val())) {
                    $(".warning", this).removeClass("hidden");
                } else {
                    Souche.PhoneRegister($("#qiugou-phone").val(), function() {
                        $(".go-login").addClass("hidden")
                        self._submit();
                    })

                }
            });

            // //自动开始提交
            // if(config.has_qiugou){
            //   var hasSubmit = false;
            //   $(window).on("scroll",function(e){
            //     if(hasSubmit) return;
            //     if($(window).scrollTop()+$(window).height()>$(".qiugou .submit").offset().top){
            //       self._submit();
            //       hasSubmit = true;
            //     }
            //   });
            // }

        },
        _submit: function() {
            var self = this;
            if (is_submiting) return;
            $(".qiugou .person-bg").animate({
                backgroundPosition: 0
            }, 800, 'easeOutExpo', function() {

            })

            $(".submit").addClass("loading").html("正在提交");
            is_submiting = true;
            $.ajax({
                url: contextPath + "/pages/homePageAction/saveBuyInfo.json",
                dataType: "json",
                data: $("#qiugou-form").serialize(),
                success: function(data) {
                    qiugouData = data;
                    $("#qiugou-popup").addClass("hidden")
                    setTimeout(function() {
                        $(".submit").removeClass("loading").html("重新定制");
                        is_submiting = false;
                    }, 1500)

                    $(".wrapGrayBg").hide();
                    $("#qiugou_count").html(data.totalNumber)
                    if (!data.totalNumber) {
                        $(".qiugou .submit").html("重新定制")
                        $(".qiugou .person-bg").animate({
                            backgroundPosition: -402
                        }, 800, 'easeOutExpo', function() {

                        })
                        $(".qiugou .head .head-inner").animate({
                            marginTop: -120
                        }, 300)
                    } else {
                        self._renderResult();
                        self._successAnim();
                    }

                },
                error: function() {

                }
            })

        },
        _successAnim: function() {
            var self = this;
            $(".qiugou .head .head-inner").css({
                marginTop: 0
            }).animate({
                marginTop: -60
            }, 300)
            setTimeout(function() {
                $(".qiugou .head .head-inner").animate({
                    marginTop: -120
                }, 300)
                setTimeout(function() {
                    self._hideForm();
                }, 600)
            }, 800)
        },
        _hideForm: function() {
            $("#qiugou_redo").removeClass("hidden")
            if (qiugouData && qiugouData.items && qiugouData.items.length) {
                $(".qiugou .form").css({
                    height: $(".qiugou .form").height(),
                    overflow: "hidden"
                })
                $(".qiugou .form .form-inner").animate({
                    marginTop: $(".qiugou .form").height() + 50
                }, 800, 'easeOutExpo', function() {
                    $(".qiugou .form").addClass("hidden")
                })
            }
            setTimeout(function() {
                $(".qiugou .person-bg").animate({
                    backgroundPosition: ($(".qiugou .person-bg").height() + 50)
                }, 800, 'easeOutExpo', function() {

                })
            }, 200)
            setTimeout(function() {
                $(".qiugou .person-bg").addClass("hidden")
                $(".qiugou").css({
                    overflow: "hidden"
                })
                $(".qiugou .result-inner").animate({
                    marginLeft: 0
                }, 800, 'easeOutExpo')
            }, 500)
        },
        _onlyNum: function() {
            setInterval(function() {
                $("#price_low_select").val($("#price_low_select").val().replace(/[^0-9]/, ""))
                $("#price_hight_select").val($("#price_hight_select").val().replace(/[^0-9]/, ""))
            }, 200)
        },
        _renderResult: function() {
            if (qiugouData && qiugouData.items && qiugouData.items.length >= 3) {
                //渲染更多的模式
                $(".qiugou .cars").html("")
                for (var i = 0; i < qiugouData.items.length; i++) {
                    var car = qiugouData.items[i];
                    var html = '<a href="' + car.link + '" class="car" target="_blank">' +
                        '<div class="pic"><img src="' + car.pic + '"></div>' +
                        '<div class="title">' + car.name + '</div>' +
                        '<div class="price"><em>' + car.price + '万 </em><span class="time">上牌：' + car.time + '</span></div></a>'
                    $(".qiugou .cars").append(html)
                }
                $(".qiugou .cars").append("<a class='car more' target='_blank' href='" + contextPath + "/pages/onsale/sale_car_list.html?match=" + qiugouData.user + "'></a>")
            } else {
                //渲染寻找中的模式
                $(".qiugou .cars").html("")
                for (var i = 0; i < qiugouData.items.length; i++) {
                    var car = qiugouData.items[i];
                    var html = '<a href="' + car.link + '" class="car" target="_blank">' +
                        '<div class="pic"><img src="' + car.pic + '"></div>' +
                        '<div class="title">' + car.name + '</div>' +
                        '<div class="price"><em>' + car.price + '万 </em><span class="time">上牌：' + car.time + '</span></div></a>'
                    $(".qiugou .cars").append(html)
                }
                for (var i = 0; i < 4 - qiugouData.items.length; i++) {
                    $(".qiugou .cars").append("<a class='car no'></a>")
                }
            }
        },
        _redo: function() {
            $(".qiugou .result-inner").animate({
                marginLeft: 930
            }, 800, 'easeOutExpo', function() {
                $(".qiugou").css({
                    overflow: "visible"
                })
            })
            setTimeout(function() {
                $(".qiugou .person-bg").removeClass("hidden").animate({
                    backgroundPosition: 0
                }, 800, 'easeOutExpo')
            }, 800)
            setTimeout(function() {
                $(".qiugou .form").removeClass("hidden")
                $(".qiugou .form .form-inner").animate({
                    marginTop: 0
                }, 800, 'easeOutExpo', function() {
                    $(".qiugou .form").css({
                        height: "auto",
                        overflow: "visible"
                    })
                })
            }, 1000)
            $(".qiugou .head .head-inner").animate({
                marginTop: 0
            }, 300)
            $("#qiugou_redo").addClass("hidden")
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
            brandSelect.selected
            for (var i = 0; i < brandSelect.selected.length; i++) {
                self._addSeries(brandSelect.selected[i].key)
            }
        },
        _addSeries: function(brandCode) {
            if ($("#series_select .sc-select-list div[data-brandid=" + brandCode + "]").length) {
                return;
            }
            $.ajax({
                url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                dataType: "json",
                data: {
                    type: "car-subdivision",
                    code: brandCode
                },
                success: function(data) {
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
                },
                error: function() {
                    // alert("车系信息请求出错，刷新后再试")
                },
                failure: function() {
                    // alert("车系信息请求出错，刷新后再试")
                }
            });
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