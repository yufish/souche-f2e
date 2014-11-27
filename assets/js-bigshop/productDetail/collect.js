/**
 * Created by Administrator on 2014/7/1.
 */
define(function() {
    var collectControl = {};
    var config={};
    var collecting = false;
    var phoneReg = /^1[3458][0-9]{9}$/;

    var _bind = function () {
        $(".carCollect").live("click", function () {
            var context = this;

            Souche.MiniLogin.checkLogin(function() {
                if ($(context).hasClass("active")) {
                    var carID = $(context).parent().attr("carid");

                    deleteCollect.call(context, carID);
                }
                else {
                    var carID = $(context).parent().attr("carid");
                    addCollect.call(context, carID);
                }
            });
            return false;
        });

        $("#noreg-phone-form .submit").click(function()
        {
            $("#noreg-phone-form").submit();
            return false;
        });

    };

    var init = function (_config) {
        $.extend(config,_config);

        $(".item .itemTail .carCollect , .itemInfo .carCollect").hover(function()
        {
            $(this).addClass("hover");
        },function()
        {
            $(this).removeClass("hover");
        });

        _bind();
    };


    //function begin
    function addCollect(carID) {
        var self = this;
        var url = config.api_saveFavorite;
        var collecting = true;

        if(collecting) {
            collecting = false;
            $.ajax(
                {
                    url: url,
                    type: "POST",
                    data: {
                        phone: $("#fav-phone").val() || $.cookie("noregisteruser"),
                        carType: config.carType,
                        carId: carID
                    },
                    context: self
                }
            ).done(function (data) {
                    if (data.errorMessage) {
                        alert(data.errorMessage)
                    } else {

                        $("#fav-popup").addClass("hidden");
                        $(".wrapGrayBg").hide();
                        $(this).find("span").html('已收藏');
                        $(this).addClass("active");

                    }
                    collecting = false;
                });
        }
    }

    function deleteCollect(carID) {
        var self = this;
        $.ajax({
            url: config.api_delFavorite,
            data: {
                carId: carID //$(self).attr("data-carid")
            },
            dataType: "json",
            type: "post",
            context:self,
            success: function(data) {
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {
                    $(this).find("span").html('收藏');
                    $(this).removeClass("active");
                }

                collecting=false;
            }
        })
    }

    //function end

    collectControl.init = init;

    return collectControl;
});