define(['index/qiugou', 'souche/down-counter', 'lib/lazyload'], function(QiuGou, downCounter, Lazyload) {

    $('.down-counter').each(function() {
        var $this = $(this);
        downCounter($this);
    });
    Souche.Index = (function() {
        var config = {
            has_qiugou: false
        };

        $(".timebuy img").lazyload();
        $(".whybuy img").lazyload();
        $(".carlife img").lazyload();
        $(".banners img").lazyload();
        $(".buy-guide img").lazyload();
        $(".hotsell-list img").lazyload();
        $(".starbuy img").lazyload();
        $(".cars img").lazyload();
        $(".performance img").lazyload();
        var slides = $(".qiugou-history .slides");
        var slides2 = slides.clone();
        $(".qiugou-history").append(slides2);
        var childHeight = $("li", slides).height();
        var childCount = $("li", slides).length;
        var slideIndex = 0;
        setInterval(function() {
            if (slideIndex < childCount * -1) {
                //slideIndex = 0;

            }
            $("ul", slides).animate({
                marginTop: slideIndex * childHeight
            });
            slideIndex -= childCount;
        }, 1000)

        return {
            init: function(_config) {
                $.extend(config, _config);
                QiuGou.init(config);
                //sidebar自动顶住
                var contentTop = $("#content").offset().top;
                var contentHeight = $("#content").height();
                var sidebarHeight = $("#side_bar").height();
                var checkSidebar = function() {
                    var windowTop = $(window).scrollTop();
                    //顶部对齐
                    if (windowTop > (contentTop - 20)) {
                        $("#side_bar").css({
                            top: 10
                        })
                    } else {
                        $("#side_bar").css({
                            top: contentTop - windowTop
                        })
                    }
                }
                checkSidebar()
                $(window).on("scroll", function(e) {
                    checkSidebar();
                    //底部对其
                    // if(sidebarHeight+windowTop>contentTop+contentHeight){
                    // 	$("#side_bar").css({
                    // 		top:contentHeight-sidebarHeight
                    // 	})
                    // }
                })
                //sidebar脚本

                //brand 出来，隐藏效果

                var showDelayT = 200;
                var checkDisplayStatus = function() {
                    var brandTimer = setTimeout(function() {
                        var zIndex = (+$('#brand').css('z-index')) + 1;
                        clearTimeout(brandTimer);
                        if (brandSelectActive == true) {
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
                        } else {
                            $('#brand').animate({
                                width: '0px',
                                avoidTransforms: true
                            }, showDelayT, function() {
                                $('#brand').hide();
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


                //carlife effect
                var $clItems = $('.carlife-item');
                var clIndex = 0,
                    clLength = $clItems.size(),
                    clAnimateStop = false;
                var height = $clItems.height();
                var clAnimation = function() {
                    if (clAnimateStop) return;
                    $clItems.each(function(index, ele) {
                        if (index === clIndex) {
                            $('.front', ele).animate({
                                'top': -height
                            });
                            $('.back', ele).animate({
                                'top': -height
                            });
                            //$(this).animate({top:-height});
                        } else {
                            $('.front', ele).animate({
                                'top': 0
                            });
                            $('.back', ele).animate({
                                'top': 0
                            });
                            //$(this).animate({top:0});
                        }
                    });
                    if (clIndex == clLength - 1) {
                        clIndex = 0;
                    } else {
                        clIndex++;
                    }
                }
                setInterval(clAnimation, 3000);




                $clItems.on('mouseenter', function(e) {
                    clAnimateStop = true;
                    var self = this;
                    $clItems.each(function(index, ele) {
                        if (ele != self) {
                            $('.front', ele).stop(true, true).animate({
                                'top': 0
                            });
                            $('.back', ele).stop(true, true).animate({
                                'top': 0
                            });
                        } else {
                            $('.front', ele).animate({
                                'top': -height
                            });
                            $('.back', ele).animate({
                                'top': -height
                            });
                        }
                    })
                    e.stopPropagation();
                }).on('mouseleave', function(e) {
                    //$clItems.css({top:0});
                    clAnimateStop = false;
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