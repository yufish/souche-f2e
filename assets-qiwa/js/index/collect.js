/**
 * Created by Administrator on 2014/7/1.
 */
define(function() {
    var collectControl = {};
    var config = {};
    var collecting = false;
    var phoneReg = /^1[3458][0-9]{9}$/;
    var is_requesting = false;
    var _bind = function() {
        $(".carCollect").live("click", function() {
            var context = this;
            if (is_requesting) return;
            Souche.MiniLogin.checkLogin(function() {
                if ($(context).hasClass("colled")) {
                    var carID = $(context).attr("data-carid");
                    deleteCollect.call(context, carID);
                } else {
                    var carID = $(context).attr("data-carid");
                    addCollect.call(context, carID);
                }
            });
            return false;
        });

        $("#noreg-phone-form .submit").click(function() {
            $("#noreg-phone-form").submit();
            return false;
        });

    };

    var init = function(_config) {
        $.extend(config, _config);

        $(".item .itemTail .carCollect , .itemInfo .carCollect").hover(function() {
            $(this).addClass("hover");
        }, function() {
            $(this).removeClass("hover");
        });

        _bind();
    };


    //function begin
    function addCollect(carID) {
        var self = this;
        var url = config.api_saveFavorite;
        var collecting = true;
        is_requesting = true;
        if (collecting) {
            collecting = false;
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    phone: $("#fav-phone").val() || $.cookie("noregisteruser"),
                    carType: config.carType,
                    carId: carID
                },
                context: self
            }).done(function(data) {
                is_requesting = false;
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {

                    $("#fav-popup").addClass("hidden");
                    $(".wrapGrayBg").hide();
                    $(this).find("span").html($(this).find("span").html() * 1 + 1);
                    $(this).addClass("colled");

                }
                collecting = false;
            });
        }
    }

    function deleteCollect(carID) {
        var self = this;
        is_requesting = true;
        $.ajax({
            url: config.api_delFavorite,
            data: {
                carId: carID //$(self).attr("data-carid")
            },
            dataType: "json",
            type: "post",
            context: self,
            success: function(data) {
                is_requesting = false;
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {
                    //var num =parseInt($(this).find("span").html());
                    $(this).find("span").html($(this).find("span").html() * 1 - 1);
                    $(this).removeClass("colled");
                }

                collecting = false;
            }
        })
    }

    //function end

    collectControl.init = init;

    return collectControl;
});