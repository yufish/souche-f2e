/**
 * Created by Administrator on 2014/6/27.
 */
define(function() {
    var constrastControl = {};
    var config = {};

    var operationCarDuibi = function(e) {
        var carID = config.carId;
        if (carID == undefined) {

            return;
        }

        var carconstrastID = $(".addcarduibi input").attr("contrastid");

        if (e.target.tagName == "INPUT") {
            $(".addcarduibi input")[0].checked = !$(".addcarduibi input")[0].checked;
        }
        Souche.MiniLogin.checkLogin(function() {
            if (!$(".addcarduibi input")[0].checked) {

                var self = this;
                self.e = e;
                $.ajax({
                    type: "POST",
                    url: config.api_addContrast,
                    dataType: "json",
                    context: self
                }).done(function (data) {
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
                        }, 500, function () {
                            cloneElement.remove();
                        });

                        $(".addcarduibi input").attr("contrastid", data.contrastId);

                        return;
                    }
                    if (data.result == -1) {
                        $(".addcarduibi input").attr("checked", 'true');
                        $(this).find(".contrast-waring").html("对比已添加！你不需要继续添加。").removeClass("hidden");
                        var context = $(this);
                        window.setTimeout(function () {
                            context.find(".contrast-waring").addClass("hidden");
                        }, 2000);
                        return;
                    }
                    if (data.result == 1) {
                        $(this).find(".contrast-waring").html("对比栏已满！你可以删除不需要的车辆，再继续添加。").removeClass("hidden");
                        var context = $(this);
                        window.setTimeout(function () {
                            context.find(".contrast-waring").addClass("hidden");
                        }, 2000);
                        return;
                    }
                    $(this).find(".contrast-waring").html("加入对比失败，请刷新页面。").removeClass("hidden");
                    var context = $(this);
                    window.setTimeout(function () {
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
                }).done(function (data) {
                    $(".addcarduibi input").removeAttr("checked");
                    $(".addcarduibi input").removeAttr("contrastid");
                });
            }
        })
        return false;
    }


    var init = function(_config) {
        $.extend(config, _config);
        $(".addcarduibi").on("click", operationCarDuibi);
    }

    constrastControl.init = init;
    return constrastControl;
});