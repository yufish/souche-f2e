/**
 * Created by Administrator on 2014/7/1.
 */
define(function() {
    var collectControl = {};
    var config={};
    var collecting = false;
    var phoneReg = /^1[3458][0-9]{9}$/;

    var _bind = function () {
        $(".carCollect span").live("click", function () {
            if(collecting){
                return false;
            }
            collecting=true;
            Souche.NoRegLogin.checkLogin(function(isLogin) {
                if ($(this).haveClass("active")) {
                    var carID;
                    delteCollect.apply(this, carID);
                }
                else {
                    var carID;
                    addCollect.apply(this, carID);
                }
            })
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
        var url = config.url;

        $.ajax(
            {
                url: url,
                type: "POST",
                data: {
                    phone: $("#fav-phone").val(),
                    carType: config.carType,
                    carId: config.carId
                },
                context: self
            }
        ).done(function (data) {
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {
                    $("#fav-popup").addClass("hidden");
                    $(".wrapGrayBg").hide();
                    $(this).html('已收藏');
                    $(this).addClass("active");
                }
                collecting=false;
            });
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
                    $(this).html('收藏');
                }

                collecting=false;
            }
        })
    }

    //function end

    collectControl.init = init;

    return collectControl;
});