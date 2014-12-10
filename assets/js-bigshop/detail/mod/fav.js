define(function() {
    var config = {};
    var doubleClickFlag = false;
    var submitFav = function() {

        $.ajax({
            url: config.api_saveFavorite,
            data: {
                crmUserId: $.cookie("crmUserId"),
                siteId:$.cookie("siteId"),
                carId: config.carId
            },
            dataType: "jsonp",
            type: "post",
            success: function(data) {
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {
                    //$('#shoucang-popup').removeClass('hidden');
//                    var favPos = $("#J_shoucang").offset();
//                    $("<div class='icon-fei'></div>").css({
//                        left: favPos.left + 7,
//                        top: favPos.top + 7
//                    })
//                        .appendTo(document.body)
//                        .animate({
//                            left: $(".sidebar").offset().left + 10,
//                            top: $(".sidebar").offset().top + 10,
//                            opacity: 0
//                        }, 700, function() {
//                            $(".collectside").addClass("flash")
//                            setTimeout(function() {
//                                $(".collectside").removeClass("flash")
//                            }, 500)
//                        })
                    $("#fav-popup").addClass("hidden")
                    $(".wrapGrayBg").hide();
                    $("#J_shoucang label").html('已收藏')
                    $("#J_shoucang").attr('value', '1').addClass("faved");
                    var num = $('#J_car_favorite').html();
                    num = num?num:0;
                    $('#J_car_favorite').html(parseInt(num) + 1);
                    doubleClickFlag = false;
                }
            }
        })
    }
    var cancelFavSubmit = function() {
        $.ajax({
            url: config.api_delFavorite,
            data: {
                carId: config.carId //$(self).attr("data-carid")
            },
            dataType: "json",
            type: "post",
            success: function(data) {
                $("#J_shoucang label").html('收藏');
                $("#J_shoucang").removeClass("faved");
                $("#J_shoucang").addClass("fav");
                var num = $('#J_car_favorite').html();
                $('#J_car_favorite').html(parseInt(num) - 1);
                doubleClickFlag = false;
            }
        })
    }
    return {
        init: function(_config) {
            config = _config;

            $("#J_shoucang").live('click', function(e) {

                e.preventDefault();

                if ($(this).hasClass("faved")) {

                    cancelFavSubmit()
                    return;
                } else {
                    if (doubleClickFlag) {
                        return;
                    }
                    // Souche.checkPhoneExist(function(is_login) {
                    //     if (is_login) {

                    //         submitFav();
                    //     } else {
                    //         $("#fav-popup").removeClass("hidden")
                    //         $(".wrapGrayBg").show();
                    //     }
                    // })
                    Souche.MiniLogin.checkLogin(function() {
                        doubleClickFlag = true;
                        submitFav();
                    })
                }


            });
        }
    }
})