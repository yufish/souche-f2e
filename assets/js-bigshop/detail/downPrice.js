/**
 * Created by Administrator on 2014/6/19.
 */
define( function () {
    var carPrice, nowPrice, nowStr, start, end
    return {
        init: function (config) {
            carPrice = parseInt($('.price-now.now').text());
            nowPrice = carPrice - 1000;
            nowStr = nowPrice.toString();
            start = '<div class="price-num"><em>'
            end = '</em></div>';
            var phoneReg = /^1[3458][0-9]{9}$/;

            for (var i = 0; i < nowStr.length; i++) {
                $('.cutprice').append(start + nowStr.charAt(i) + end);
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

            $('#expectedPrice').val((nowPrice / 10000).toFixed(2));

            $("#jiangyidian").click(this.downPriceStep)
            // this.downPriceStep();
        },
        downPriceStep: function () {
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
            $cutPrice.find('.price-num em').fadeOut(function () {
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
});