define(['souche', 'lib/lazyload', 'lib/jquery.flexslider-min'], function(Lazyload, carGod) {
    Souche.Index = (function() {
        var config = {
            has_qiugou: false
        };
        return {
            init: function(_config) {
                $.extend(config, _config);
                var first = $($('.slides li img').get(0))
                first.attr("src", first.attr('data-src'));
                $('.flexslider').flexslider({
                    animation: "slide",
                    animationSpeed: 300,
                    initDelay: 0,
                    slideshowSpeed: 5000,
                    useCSS: true,

                    after: function(slider) {
                        var slides = slider.slides,
                            _index = slider.animatingTo,
                            $slide = $(slides[_index]),
                            $img = $slide.find('img[data-src]');
                        $img.attr("src", $img.attr('data-src'));
                        var nextnext = $(".slides li:nth-child(" + (_index + 2) + ") img")
                        nextnext.attr("src", nextnext.attr("data-src"))
                    }
                });
                $(".flexslider").mouseenter(function() {
                    $(this).flexslider("stop");
                }).mouseleave(function() {
                    $(this).flexslider("play");
                });
                $(".timebuy img").lazyload();
                $(".whybuy img").lazyload();
                $(".carlife img").lazyload();
                $(".banners img").lazyload();
                $(".buy-guide img").lazyload();
                $(".hotsell-list img").lazyload();
                $(".starbuy img").lazyload();
                $(".cars img").lazyload();
                $(".performance img").lazyload();
                //限时优惠的初始化
                Souche.Util.appear(".timebuy", function() {
                    require(['index/timedown'], function(downCounter) {
                        $('.down-counter').each(function() {
                            var $this = $(this);
                            downCounter($this);
                        });
                    })
                })
                //求购模块的初始化，包含求购历史的初始化
                Souche.Util.appear(".qiugou", function() {
                    require(['index/qiugou'], function(QiuGou) {
                        QiuGou.init(config);
                    })
                })
                //生活车初始化
                // Souche.Util.appear(".carlife", function() {
                //     require(['index/carlife'], function(CarLife) {
                //         CarLife.init(config);
                //     })
                // })

                //brand 出来，隐藏效果

                var showDelayT = 200;
                var checkDisplayStatus = function() {
                    var brandTimer = setTimeout(function() {
                        var zIndex = (+$('#brand').css('z-index')) + 1;
                        clearTimeout(brandTimer);
                        if (brandSelectActive == true) {
                            $('#nav-item-brand .hr').css({
                                'border-bottom': '1px solid #fff'
                            });
                            $('#nav-item-brand').css({
                                border: '1px solid #fc7000',
                                'border-right': '1px solid #fff',
                                'z-index': zIndex,
                                'background-color': "#fff"
                            });
                            $('#brand').show().animate({
                                width: '690px',
                                avoidTransforms: true
                            }, showDelayT);
                            $("#brand img").lazyload();
                        } else {
                            $('#brand').animate({
                                width: '0px',
                                avoidTransforms: true
                            }, showDelayT, function() {
                                $('#brand').hide();
                                $('#nav-item-brand .hr').css({
                                    'border-bottom': '1px solid #e6e6e6'
                                });
                                $('#nav-item-brand').css({
                                    border: '1px solid #f9f9f9',
                                    'z-index': 0,
                                    'background-color': "#f9f9f9"
                                });
                            });
                        }
                    }, showDelayT);
                };

                var brandSelectActive = false;

                $('#nav-item-brand,#brand').on('mouseenter', function() {
                    brandSelectActive = true;

                    checkDisplayStatus();

                }).on('mouseleave', function() {
                    brandSelectActive = false;
                    checkDisplayStatus();
                });

                var phoneReg = /^1[3458][0-9]{9}$/;
                var submitToPhone = function() {
                    $.ajax({
                        url: contextPath + "/pages/saleDetailAction/sendAddressToPhone.json",
                        data: {},
                        type: "post",
                        success: function(data) {
                            $(".wrapGrayBg").show();
                            $("#address-popup").addClass("hidden")
                            $("#address-result-popup").removeClass('hidden');
                        }
                    })
                }
                $("#address-form").on("submit", function(e) {
                    e.preventDefault();
                    if (!phoneReg.test($("#address-phone").val())) {
                        $(".warning", this).removeClass("hidden");
                    } else {
                        Souche.PhoneRegister($("#address-phone").val(), function() {
                            submitToPhone();
                        })

                    }
                })
                $(".sendadd").click(function() {
                    Souche.checkPhoneExist(function(is_login) {
                        if (is_login) {
                            submitToPhone();
                        } else {
                            $("#address-popup").removeClass("hidden")
                            $(".wrapGrayBg").show();
                        }
                    })
                })
            }
        }
    })();
    return Souche.Index;
});