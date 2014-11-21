(function() {

    $(".apply_close, .popup-sure").live("click", function() {
        $(".apply_popup").addClass("hidden");
        $('.wrapGrayBg').hide();
    });

    $("#link-to-fenqi").click(function() {
        $("#fenqi-popup").removeClass("hidden");
        $(".wrapGrayBg").show();
        return false;
    });


    $("#detailDoor .tab-item").mouseenter(function() {
        var $this = $(this);
        var index = $this.index();
        var target = null;
        var active = $(".tab-content-active");

        $(".tab-item-active").removeClass("tab-item-active");
        $this.addClass("tab-item-active");
        switch (index) {
            case 0:
                target = $("#J_tabService");
                break;
            case 1:
                target = $("#J_tabCqi");
                break;
            default:
                target = $("#J_tabAddr");
        }
        if (target.attr("class").indexOf("tab-content-active") == -1) {
            target.addClass("tab-content-active");
            active.removeClass("tab-content-active");
        }
    });

    $("#detailDoor .tab-item").mouseenter(function() {
        var $this = $(this);
        var index = $this.index();
        var target = null;
        var active = $(".tab-content-active");

        $(".tab-item-active").removeClass("tab-item-active");
        $this.addClass("tab-item-active");
        switch (index) {
            case 0:
                target = $("#J_tabService");
                break;
            case 1:
                target = $("#J_tabCqi");
                break;
            default:
                target = $("#J_tabAddr");
        }
        if (target.attr("class").indexOf("tab-content-active") == -1) {
            target.addClass("tab-content-active");
            active.removeClass("tab-content-active");
        }
    });
    //分期付款
    var phoneReg = /^1[3458][0-9]{9}$/;
    var $arrowTime = $("#arrow-time"),
        $mortgage = $("#arrow-mortgage"),
        $arrowrate = $("#arrow-rate"),
        $interest = $("#arrow-rate").attr('interest'),
        $fenqiList = $("#fenqi_list"),
        $fenqiTime = $("#fenqi_list li"),
        $fenqiTimeWrap = $("#fenqi-wrap");
    $fenqiMort = $("#fenqi-mort")

    var changeArrow = function(time) {
        var timeArrow, mortArrow,
            str = "fenqi-arrow arrow";
        if ($interest == "1") {
            switch (time) {
                case "6":
                    timeArrow = "0";
                    mortArrow = "3";
                    break;
                case "12":
                    timeArrow = "1";
                    mortArrow = "2";
                    break;
                case "24":
                    timeArrow = "2";
                    mortArrow = "1";
                    break;
                case "36":
                    timeArrow = "3";
                    mortArrow = "4";
                    break;
            }
        } else {
            switch (time) {
                case "12":
                    timeArrow = "1";
                    mortArrow = "3";
                    break;
                case "24":
                    timeArrow = "2";
                    mortArrow = "2";
                    break;
                case "36":
                    timeArrow = "3";
                    mortArrow = "1";
                    break;
            }
        }

        $arrowTime.attr("class", str + timeArrow);
        $mortgage.attr("class", str + mortArrow);
    };

    $("#fenqi_select").click(function(event) {
        $fenqiList.show();
        event.stopPropagation();
    });
    $("body, html").click(function() {
        $fenqiList.hide();
    });
    $fenqiTime.click(function() {
        var $this = $(this),
            time = $this.attr("time"),
            mortgage = $this.attr("mortpay"),
            rate = $this.attr("rate"),
            text = $this.text();

        $fenqiTimeWrap.text(text);
        $arrowrate.text(rate);
        $fenqiMort.text(mortgage);
        changeArrow(time);
    });
    //在线咨询
    var dialogGetMes = $("#dialog-getMes"),
        afterSubmit = $("#dialog-showMes, #dialog-apply2"),
        dialogLoginRemind = $("#dialog-login").find(".dialog-user-remind"),
        dialogRegRemind = $("#dialog-reg").find(".dialog-user-remind"),
        showPrice = $("#dialog-showPrice"),
        showText = $("#dialog-showText"),
        priceVal = $("#dialog-priceVal"),
        salePrice = $("#dialog-apply1").attr("price"),
        textVal = $("#dialog-textVal");

    //取得用户填写的信息
    var showMes = function() {
        showPrice.text(priceVal.val());
        showText.text(textVal.val());
        afterSubmit.removeClass("hidden");
    };

    //是否超过字数
    var mesNum = $("#dialog-mes-num");
    $("#dialog-textVal").keyup(function() {

        var length = $(this).val().length;
        mesNum.text(length);
        if (length >= 250) {
            //$(this).attr("disabled",true);
        }
    })
    // $(".detail-share .wx").click(function(e) {
    //     e.stopPropagation()
    //     $("#wx-popup").removeClass("hidden").css({
    //         left: $(".detail-share .wx").offset().left - 98,
    //         top: $(".detail-share .wx").offset().top - 210
    //     })
    //     $("#wx-popup img").attr("src", $("#wx-popup img").attr("data-src"))
    // });
    // $(document.body).click(function() {
    //     $("#wx-popup").addClass("hidden")
    // });
    
    //发送到微信or手机
    var submitToPhoneNew = function(){
        $.ajax({
            url: SaleDetailConfig.api_sendCarToPhone,
            data: {
                carId: SaleDetailConfig.carId
            },
            type: "post",
            success: function(data) {
                $("#send-phone-submit").addClass("hidden");
                $(".send-success").removeClass("hidden");
                window.setTimeout(function(){
                   $(".wx-open").addClass("hidden");
                },2000);
            }
        })
    }
    $(".detail-share #J_wx_phone").click(function(e){
       e.stopPropagation();
       $(".wx-open").removeClass("hidden");
    });
    $(document.body).click(function() {
        $(".wx-open").addClass("hidden");
     });
    $("#send-phone-form").on("submit",function(e){
       e.preventDefault();
        if (!phoneReg.test($("#send-phone").val())) {
            $(".warning", this).removeClass("hidden");
            return
        } else {
            $(".warning", this).addClass("hidden");
            submitToPhoneNew();
        }
     })
    //
    var submitToPhone = function() {
        $.ajax({
            url: $("#ph-form")[0].action,
            data: {
                carId: SaleDetailConfig.carId
            },
            type: "post",
            success: function(data) {
                $('body').append(data);
                $(".wrapGrayBg").show();
                $("#ph-popup").addClass("hidden")
                $("#ph-result-popup").removeClass('hidden');
            }
        })
    }
    $(".detail-share .ph").click(function() {
        $("#ph-popup .popup-title").html("保存到手机")
        $("#ph-popup .apply_close").attr("click_type", SaleDetailConfig.sendCarClose)
        $("#ph-popup .ph-submit").attr("click_type", SaleDetailConfig.sendCarSubmit)
        $("#ph-popup .tip").html("车辆内容会以短信方式保存到您的手机")
        $("#ph-form")[0].action = SaleDetailConfig.api_sendCarToPhone
        Souche.checkPhoneExist(function(is_login) {
            if (is_login) {
                submitToPhone();
            } else {
                $("#ph-popup").removeClass("hidden")
                $(".wrapGrayBg").show();
            }
        })
    })
    $("#ph-form").on("submit", function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#ph-phone").val())) {
            $(".warning", this).removeClass("hidden");
        } else {
            Souche.PhoneRegister($("#ph-phone").val(), function() {
                submitToPhone();
            })

        }
    })
    $("#ph-phone").blur(function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#ph-phone").val())) {
            $(".warning", $("#ph-form")).removeClass("hidden");
        } else {
            $(".warning", $("#ph-form")).addClass("hidden");
            $(".phone-true").removeClass("hidden");
        }
    })
    // $(".send_addr_tophone").click(function() {
    //     $("#ph-popup .popup-title").html("发地址到手机")
    //     $("#ph-popup .tip").html("输入手机号码，即可发送")
    //     $("#ph-popup .apply_close").attr("click_type", SaleDetailConfig.sendAddressClose)
    //     $("#ph-popup .ph-submit").attr("click_type", SaleDetailConfig.sendAddressSubmit)
    //     $("#ph-form")[0].action = SaleDetailConfig.api_sendAddressToPhone
    //     Souche.checkPhoneExist(function(is_login) {
    //         if (is_login) {
    //             submitToPhone();
    //         } else {
    //             $("#ph-popup").removeClass("hidden")
    //             $(".wrapGrayBg").show();
    //         }
    //     })
    // })
    //门店地址
    $(".car-adress .send-adress").mousemove(function() {
        $(".adress-open").removeClass("hidden");
    })
    $(document.body).on("click", function(e) {
        if (!$(e.target).closest(".adress-open").length) {
            $(".adress-open").addClass("hidden");
        }
    })
    var submitAddress = function() {
        $.ajax({
            url: SaleDetailConfig.api_AddressToPhone,
            data: {
                phone: $("#address-phone").val()
            },
            type: "post",
            success: function() {
               $(".adress-open").addClass("hidden");
            }
        })
    }
    $("#adress-from").on("submit", function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#address-phone").val())) {
            alert("请输入正确手机号码");
        } else {
            submitAddress();
        }
    })
    var submitJiangjia = function() {
            $.ajax({
                url: $("#jiangjia-form").attr('action'),
                data: $("#jiangjia-form").serialize(),
                success: function(data) {
                    if (data.errorMessage) {
                        alert(data.errorMessage)
                    } else {
                        $("#jiangjia-popup").addClass("hidden");
                        $("#jiangjia-success-popup").removeClass("hidden");
                        $(".wrapGrayBg").show();
                    }
                }
            })
        }
        //车牛车辆举报
    $(".detail-share .rep").click(function(e) {
        $(this).closest(".report").addClass("report-active");
        $(".report-open").removeClass("hidden");
        e.stopPropagation();
    });
    $(document.body).on("click", function(e) {
        if (!$(e.target).closest(".report-open").length) {
            $(".report-open").addClass("hidden");
            $(".report").removeClass("report-active");
        }
    });

    var submitReport = function() {
        var rlist = $(".report-input");
        var rlistlength = rlist.length;
        var Reasonstring;
        $(".report-input").on("click", function() {
            $(this).attr({
                checked: "checked"
            });
        });
        for (var i = 0; i < rlistlength; i++) {
            if (rlist[i].checked) {
                Reasonstring = rlist[i].value;

            }
        };
        $(".rep").addClass("hidden");
        $(".has-rep").removeClass("hidden");
        $.ajax({
            url: "http://niu.souche.com/open/inform_car",
            data: {
                carId: config.carId,
                reason: Reasonstring,
                userId: "#",
            },
            dataType: "json",
            type: "post",
            success: function() {
                $(".rep").addClass("hidden");
                $(".has-rep").removeClass("hidden");
            }
        })
    };
    $(".report-form").on("submit", function(e) {
        e.preventDefault();
        submitReport();
    })
    //车牛车辆举报 end
    //降价通知提交
    $("#jiangjia-form").submit(function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#jiangjia-phone").val())) {
            $(".warning", this).removeClass("hidden");
            return;
        }
        Souche.PhoneRegister($("#jiangjia-phone").val(), function() {

            submitJiangjia();
        })
    })
    $("#J_jiangjia").click(function() {
        Souche.checkPhoneExist(function(is_login) {
            //          if(is_login){
            //              submitJiangjia();
            //          }else{
            $("#jiangjia-popup").removeClass("hidden");
            $(".wrapGrayBg").show();
            //          }
        })
    });
    Bimu.form.selfValidate("J_dialogForm", "dialog-sendMes", function() {
        if (!(/^\+?[1-9][0-9]*$/.test(priceVal.val()))) {
            $("#price-valid").show();
            return false;
        }

        if (parseInt(priceVal.val()) >= parseInt(salePrice)) {
            $("#price-illegal").show();
            return false;
        }
        var content = $("#dialog-textVal").val();
        if (content && content.length > 250) {
            $("#content-valid").show();
            return false;
        }
        $("#content-valid").hide();
        $("#price-illegal").hide();
        $("#price-valid").hide();
        //是否登录
        $.ajax({
            url: contextPath + "/pages/evaluateAction/isLogin.json",
            type: "post",
            dataType: "json",
            async: false,
            success: function(data) {
                if (data.result == "true") {

                    ///
                    Bimu.ajax.formPost("J_dialogForm", function() {
                        showMes();
                        afterSubmit.removeClass("hidden");
                        dialogGetMes.removeClass("dialog-error").addClass("hidden");
                        $(".zixun-main").scrollTop($(".zixun-main").height())
                    });
                    ///
                    return true;
                } else {
                    dialogGetMes.addClass("dialog-error");
                    $(".zixun-main").scrollTop($(".zixun-main").height())
                    return false;
                }
            },
            error: function() {
                dialogGetMes.addClass("dialog-error");
                $(".zixun-main").scrollTop($(".zixun-main").height())
                return false;
            }
        });
    })
    // var doubleClickFlag = false;
    // var submitFav = function() {
    //     $.ajax({
    //         url: SaleDetailConfig.api_saveFavorite,
    //         data: {
    //             phone: $("#fav-phone").val(),
    //             carType: SaleDetailConfig.carType,
    //             carId: SaleDetailConfig.carId
    //         },
    //         dataType: "json",
    //         type: "post",
    //         success: function(data) {
    //             if (data.errorMessage) {
    //                 alert(data.errorMessage)
    //             } else {
    //                 //$('#shoucang-popup').removeClass('hidden');
    //                 var favPos = $("#J_shoucang").offset();
    //                 $("<div class='icon-fei'></div>").css({
    //                     left: favPos.left + 7,
    //                     top: favPos.top + 7
    //                 })
    //                     .appendTo(document.body)
    //                     .animate({
    //                         left: $(".sidebar").offset().left + 10,
    //                         top: $(".sidebar").offset().top + 10,
    //                         opacity: 0
    //                     }, 700, function() {
    //                         $(".collectside").addClass("flash")
    //                         setTimeout(function() {
    //                             $(".collectside").removeClass("flash")
    //                         }, 500)
    //                     })
    //                 $("#fav-popup").addClass("hidden")
    //                 $(".wrapGrayBg").hide();
    //                 $("#J_shoucang label").html('已收藏')
    //                 $("#J_shoucang").attr('value', '1').addClass("faved");
    //                 var num = $('#J_car_favorite').html();
    //                 $('#J_car_favorite').html(parseInt(num) + 1);
    //                 doubleClickFlag = false;
    //             }
    //         }
    //     })
    // }



    // var cancelFavSubmit = function() {
    //     $.ajax({
    //         url: SaleDetailConfig.api_delFavorite,
    //         data: {
    //             carId: SaleDetailConfig.carId //$(self).attr("data-carid")
    //         },
    //         dataType: "json",
    //         type: "post",
    //         success: function(data) {
    //             if (data.errorMessage) {
    //                 alert(data.errorMessage)
    //             } else {
    //                 $("#J_shoucang label").html('收藏')
    //                 $("#J_shoucang").removeClass("faved");
    //             }
    //         }
    //     })
    // }

    // $("#fav-form").on("submit", function(e) {
    //     e.preventDefault();
    //     if (!phoneReg.test($("#fav-phone").val())) {
    //         $(".warning", this).removeClass("hidden"); //("请填写正确的手机号码")
    //     } else {

    //         Souche.PhoneRegister($("#fav-phone").val(), function() {
    //             submitFav();
    //         })
    //     }
    // })
    // $('#shoucang-popup .apply_close').click(function() {

    //     $(this).parent().addClass('hidden');
    //     $(".wrapGrayBg").hide();
    // });

    Bimu.form.selfValidate("dialog-login", "dialog-loginBtn", function() {

        //登录验证
        if (!$('#user-phone').val()) {
            dialogLoginRemind.html("请输入手机号");
            return false;
        }
        if (!$('#user-psd').val()) {
            dialogLoginRemind.html("请输入密码");
            return false;
        }
        $("#dialog-loginBtn").val("登陆中...");

        return true;
    }, function(data) {
        if (data.errorMessage == "") {
            Bimu.ajax.formPost("J_dialogForm", function() {
                showMes();
                afterSubmit.removeClass("hidden");
                dialogGetMes.removeClass("dialog-error").addClass("hidden");
            });
        } else {
            dialogLoginRemind.html(data.errorMessage);
        }
        $(".zixun-main").scrollTop($(".zixun-main").height())
    });
    $("#user-phone").blur(function() {
        var phoneT = $(this).val();
        if (!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phoneT) && phoneT.length == 11)) {
            dialogLoginRemind.html("请正确填写手机号码！");
        } else {
            dialogLoginRemind.html("");
        }
    });

    //注册                
    var uuid = guid();
    $("#uuid").val(uuid);

    Bimu.form.validate("dialog-reg", "dialog-regBtn", function(data) {

        if (data.id) {
            if (data.msg) {
                dialogRegRemind.html(data.msg);
            }

            return;
        } else {
            dialogRegRemind.html("");
            $("#user-phone").val($("#user-regPhone").val());
            $("#user-psd").val($("#user-regPsd").val());
            Bimu.ajax.loginForm("dialog-login", function(data) {
                if (data.errorMessage == "") {
                    //登陆       
                    Bimu.ajax.formPost("J_dialogForm", function() {
                        showMes();
                        afterSubmit.removeClass("hidden");
                        dialogGetMes.removeClass("dialog-error dialog-register").addClass("hidden");
                    });
                }
            }, null);
        }

    }, function() {}, {
        noclear: true
    });

    $("#user-regPhone").blur(function() {
        var phoneT = $(this).val();
        if (!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phoneT) && phoneT.length == 11)) {
            dialogRegRemind.html("请正确填写手机号码");
        } else {
            dialogRegRemind.html("");
        }
    });

    function setButtonValue(obj) {
        var interVal = null;
        var phone = $("#user-regPhone").val();
        if (!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phone) && phone.length == 11)) {
            dialogRegRemind.html("请正确填写手机号码");
            if (interVal != null)
                clearInterval(interVal);

            obj.attr("disabled", false);
            obj.val("获取验证码");
            return;
        }
        var it = 0;

        obj.attr("disabled", true);

        setTimeout(function() {
            obj.attr("disabled", false);
            if (interVal != null) {
                clearInterval(interVal);
            }
            obj.val("获取验证码");
        }, 60000);

        interVal = setInterval(function() {

            if (it < 60) {
                obj.val((60 - it) + "秒后可重发");
                it++;
            }

        }, 1000);

        var uuid = $("#user-test").val();

        Bimu.ajax.post("sendMessageAction", "sendMessage", {
            phoneNumber: phone,
            type: "register",
            uuid: uuid
        }, function(data) {
            if (data.id) {
                dialogRegRemind.html("该手机号码已经注册");
                if (interVal != null) {

                    clearInterval(interVal);
                }
                obj.val("获取验证码");
                obj.attr("disabled", false);
            } else {
                dialogRegRemind.html("");
            }
        }, function() {});
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    $(".dialog-get-yz").click(function() {
        setButtonValue($(this));
    })

    $("#J_zixunPrice").click(function() {
        $("#dialog-apply1,#dialog-getMes").removeClass("hidden").slideDown(200);
        afterSubmit.addClass('hidden');
        $('#dialog-priceVal').val('');
        $("#dialog-textVal").val('');
        $(".zixun-main").scrollTop($(".zixun-main").height())
    });
    //  $(".J_linkShangqiao").click(function(){
    //      $("#bridgehead").trigger("click");
    //  });
    $(".J_linkShangqiao").mouseenter(function() {
        $(".shangqiao-remind", this.parentNode).show();
    }).mouseleave(function() {
        $(".shangqiao-remind", this.parentNode).hide();
    });
    $("#link-reg").click(function() {
        $("#dialog-getMes").addClass("dialog-register");
        return false;
    });
    $("#link-login").click(function() {
        $("#dialog-getMes").removeClass("dialog-register");
        return false;
    });
})();
//买车顾问弹出
$(".advisor-close").click(function() {
    $(".advisor-unfold").addClass("hidden");

});
$(".advisor-unfold").click(function() {
    $(".advisor-unfold").animate({
        width: "820px",
        height: "400px",
        bottom: "10px"
    }, 800)
});
var phoneReg = /^1[3458][0-9]{9}$/;
$(".unfold").on("submit", function(e) {
    e.preventDefault();
    if (!phoneReg.test($("#unfold-phone").val())) {
        $(".input-error-tip").removeClass("hidden")
        return;
    }
    Souche.PhoneRegister($("#unfold-phone").val(), function() {
        window.location.href = contextPath + "/pages/onsale/match_car_list.html"
    })
});
//查看大图
(function() {
    var bigImages = null;
    var iframe = null;
    var index = 0;
    var appendIframe = function(index) {
        if (bigImages) {
            iframe.Slider.setCurrent(index);
            bigImages.css("display", "block");
        } else {
            bigImages = $("<iframe name='bigImages' id='bigImages' allowtransparency='true' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
            bigImages.attr("src", SaleDetailConfig.api_bigImg);
            bigImages.css({
                display: "none",
                position: "fixed",
                top: 0,
                left: 0,
                background: "#000",
                width: "100%",
                height: $(document.body).height(),
                zIndex: 1000000000000
            })
            $(document.body).append(bigImages);
            iframe = window.frames['bigImages'];
            $(iframe).load(function() {
                iframe.Slider.init({
                    viewHeight: $(window).height()
                });
                iframe.Slider.setCurrent(index);
                bigImages.css("display", "block");
            })
        }
    }
    $("#onsale_detail .photosWrap").click(function(event) {
        var target = event.target;
        if (target.nodeName == "IMG") {
            index = $(target).parent().index();
            appendIframe(index);
        }
    });
    $("#onsale_detail .showBig").click(function() {
        appendIframe(0);
    });
})()
Souche.Detail = Souche.Detail || {}
Souche.Detail.PriceDown = function() {
    var carPrice, nowPrice, nowStr, start, end
    return {
        init: function(config) {
            carPrice = parseInt($('.price-now.now').text());
            nowPrice = carPrice - 1000;
            nowStr = nowPrice.toString();
            start = '<div class="price-num"><em>'
            end = '</em></div>';
            for (var i = 0; i < nowStr.length; i++) {
                $('.cutprice').append(start + nowStr.charAt(i) + end);
            }
            $('#expectedPrice').val((nowPrice / 10000).toFixed(2));

            $("#jiangyidian").click(this.downPriceStep)
            // this.downPriceStep();
        },
        downPriceStep: function() {
            if (100 * (carPrice - nowPrice) / carPrice > 5) {
                $("#jiangyidian").css({
                    "background-position": "0 0",
                    'cursor': 'auto'
                });
                $(".price-toolow").removeClass("hidden")
                return;
            }
            var length = nowPrice.toString().length;
            var curIndex = 0;
            var lowPrice = nowPrice - 1000;
            var now_s = nowPrice.toString(),
                low_s = lowPrice.toString();
            var $cutPrice = $('.cutprice');
            $cutPrice.find('.price-num em').fadeOut(function() {
                curIndex++;
                if (curIndex == length)
                    $cutPrice.find('.price-num.hidden').removeClass('hidden')
                $(this.parentNode).remove();
            });
            var s = '<div class="price-num hidden"><em>',
                e = '</em></div>';
            for (var i = 0; i < low_s.length; i++) {
                $cutPrice.append(s + low_s.charAt(i) + e);
            }
            nowPrice -= 1000;
            $('#expectedPrice').val((nowPrice / 10000).toFixed(2));
        }
    }
}();


define(["mod/fav", "detail/init_summary"], function(Fav, InitSummary) {
    Souche.DetailCommon = function() {
        var config = {}

        var operationCarDuibi = function(e) {

            var elem = e.srcElement | e.target;
            if (elem) {

            }
            var carID = config.carId;
            if (carID == undefined) {

                return;
            }

            var carconstrastID = $(".addcarduibi input").attr("contrastid");

            if (e.target.tagName == "INPUT") {
                $(".addcarduibi input")[0].checked = !$(".addcarduibi input")[0].checked;
            }

            if (!$(".addcarduibi input")[0].checked) {

                var self = this;
                self.e = e;
                $.ajax({
                    type: "POST",
                    url: config.api_addContrast,
                    dataType: "json",
                    context: self
                }).done(function(data) {
                    if (data.result == 2) {
                        $(".addcarduibi input").attr("checked", 'true');

                        var cloneElement = $(".addcarduibi").clone();
                        cloneElement.css({
                            opacity: 0.8,
                            position: 'absolute',
                            top: this.e.pageY + 'px',
                            left: this.e.pageX + 'px',
                            backgroundColor: "#BCEE68"
                        });

                        var endX = $(".side-box .contrast-img").offset().left;
                        var endY = $(".side-box .contrast-img").offset().top;

                        document.body.appendChild(cloneElement[0]);
                        cloneElement.animate({
                            top: endY,
                            left: endX
                        }, 500, function() {
                            cloneElement.remove();
                        });

                        $(".addcarduibi input").attr("contrastid", data.contrastId);

                        return;
                    }
                    if (data.result == -1) {
                        $(".addcarduibi input").attr("checked", 'true');
                        $(this).find(".contrast-waring").html("对比已添加！你不需要继续添加。").removeClass("hidden");
                        var context = $(this);
                        window.setTimeout(function() {
                            context.find(".contrast-waring").addClass("hidden");
                        }, 2000);
                        return;
                    }
                    if (data.result == 1) {
                        $(this).find(".contrast-waring").html("对比栏已满！你可以删除不需要的车辆，再继续添加。").removeClass("hidden");
                        var context = $(this);
                        window.setTimeout(function() {
                            context.find(".contrast-waring").addClass("hidden");
                        }, 2000);
                        return;
                    }
                    $(this).find(".contrast-waring").html("加入对比失败，请刷新页面。").removeClass("hidden");
                    var context = $(this);
                    window.setTimeout(function() {
                        context.find(".contrast-waring").addClass("hidden");
                    }, 2000);
                });
            } else {
                if (!carconstrastID) {
                    return;
                }

                $.ajax({
                    type: "POST",
                    url: config.api_deleteContrast,
                    data: {
                        cid: $(".addcarduibi input").attr("contrastid")
                    }
                }).done(function(data) {
                    $(".addcarduibi input").removeAttr("checked");
                    $(".addcarduibi input").removeAttr("contrastid");
                });
            }
            return false;
        }

        var _bind = function() {
            $(".addcarduibi,.addcarduibi input").on("click", operationCarDuibi);
        }

        return {
            init: function(_config) {
                $.extend(config, _config)
                InitSummary.init(config);
                Fav.init(config);
                // var carPrice = parseInt($('.price-now.now').text());
                // var nowPrice = carPrice;
                // var nowStr = nowPrice.toString();
                // var start = '<div class="price-num"><em>',
                //     end = '</em></div>';
                // for (var i = 0; i < nowStr.length; i++) {
                //     $('.cutprice').append(start + nowStr.charAt(i) + end);
                // }
                Souche.Detail.PriceDown.init(config);
                if ($(".brand-nav").length) {
                    $(window).scroll(function() {
                        var brandNavPos = $(".brand-nav").offset().top;
                        var brandHeight = $(".brand-wrapper").height();
                        var brandNavHeight = $(".brand-nav").height();
                        if ($(window).scrollTop() > brandNavPos + 40) {

                            if ($(window).scrollTop() > brandNavPos + brandHeight - brandNavHeight - 150) {
                                $(".brand-list").css({
                                    position: "absolute",
                                    top: brandHeight - brandNavHeight - 100
                                })
                            } else {
                                $(".brand-list").css({
                                    position: "fixed",
                                    top: 80
                                })
                            }
                        } else {
                            $(".brand-list").css({
                                position: "relative",
                                top: 0
                            })
                        }

                    })
                }

                _bind();


                var navSaleTabTop = $("#onsale_tab").offset().top;
                var navSaleTabHeight = $("#onsale_tab").height();

                $(window).scroll(function() {
                    var winTop = $(window).scrollTop();

                    if (winTop > navSaleTabTop) {
                        $("#onsale_tab").css({
                            position: "fixed",
                            top: 0,

                            zIndex: 1000
                        });
                        $("#onsale_tab_space").removeClass("hidden")
                    } else {
                        $("#onsale_tab").css({
                            position: "relative"
                        })
                        $("#onsale_tab_space").addClass("hidden")
                    }
                    var onSaleHeight = $(".onsale-summary").height();
                    if (winTop > navSaleTabTop + onSaleHeight - 40) {
                        $("#onsale_tab").css({
                            position: "relative"
                        })
                        $("#onsale_tab_space").addClass("hidden")
                    }



                });

            }
        }
    }();
    return Souche.DetailCommon;
});