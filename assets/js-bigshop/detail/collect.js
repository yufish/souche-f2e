/**
 * Created by Administrator on 2014/6/27.
 */
define(function()
{
    var phoneReg = /^1[3458][0-9]{9}$/;

    var init = function(SaleDetailConfig)
    {
        var submitFav = function() {
            $.ajax({
                url: SaleDetailConfig.api_saveFavorite,
                data: {
                    crmUserId: $.cookie("crmUserId"),
                    siteId:$.cookie("siteId"),
                    carId: SaleDetailConfig.carId
                },
                dataType: "jsonp",
                type: "post",
                success: function(data) {
                    if (data.errorMessage) {
                        alert(data.errorMessage)
                    } else {
                        //$('#shoucang-popup').removeClass('hidden');
                        var favPos = $("#J_shoucang").offset();
                        $("<div class='icon-fei'></div>").css({
                            left: favPos.left + 7,
                            top: favPos.top + 7
                        })
                            .appendTo(document.body)
                            .animate({
                                left: $(".sidebar").offset().left + 10,
                                top: $(".sidebar").offset().top + 10,
                                opacity: 0
                            }, 700, function() {
                                $(".collectside").addClass("flash")
                                setTimeout(function() {
                                    $(".collectside").removeClass("flash")
                                }, 500)
                            })
                        $("#fav-popup").addClass("hidden")
                        $(".wrapGrayBg").hide();
                        $("#J_shoucang label").html('已收藏')
                        $("#J_shoucang").attr('value', '1').addClass("faved");
                        var num = $('#J_car_favorite').html();
                        $('#J_car_favorite').html(parseInt(num) + 1);
                        doubleClickFlag = false;
                    }
                }
            })
        }

        var cancelFavSubmit = function() {
            $.ajax({
                url: SaleDetailConfig.api_delFavorite,
                data: {
                    carId: SaleDetailConfig.carId //$(self).attr("data-carid")
                },
                dataType: "json",
                type: "post",
                success: function(data) {
                    if (data.errorMessage) {
                        alert(data.errorMessage)
                    } else {
                        $("#J_shoucang label").html('收藏')
                        $("#J_shoucang").removeClass("faved");
                    }
                }
            })
        }
        $("#J_shoucang").live('click', function(e) {

            e.preventDefault();

            if ($(this).hasClass("faved")) {
                return;
            }else{
                Souche.checkPhoneExist(function(is_login) {
                    if (is_login) {

                        submitFav();
                    } else {
                        $("#fav-popup").removeClass("hidden")
                        $(".wrapGrayBg").show();
                    }
                })
            }


        });
        $("#fav-form").on("submit", function(e) {
            e.preventDefault();
            if (!phoneReg.test($("#fav-phone").val())) {
                $(".warning", this).removeClass("hidden"); //("请填写正确的手机号码")
            } else {
                Souche.PhoneRegister($("#fav-phone").val(), function() {
                    submitFav();
                })
            }
        })
        $('#shoucang-popup .apply_close').click(function() {

            $(this).parent().addClass('hidden');
            $(".wrapGrayBg").hide();
        });
    }



    var collectControl = {};
    collectControl.init = init;

    return collectControl;
});