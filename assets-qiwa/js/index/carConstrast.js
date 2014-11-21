/**
 * Created by Administrator on 2014/7/1.
 */
define(function() {
    var constrastControl = {};
    var constrasting = false;
    var config = {};
    var phoneReg = /^1[3458][0-9]{9}$/;

    var _bind = function() {
        $(".carConstrast span").live("click", function(e) {

            var element = e.target || e.srcElement;
            var carID = $(this).parent().attr("carid");
            addConstrast.call(this, carID);
            e.stopPropagation();
            e.preventDefault();
        });
    }

    //function begin

    function deleteConstrast(constrastID) {
        var url = config.api_deleteContrast;
        var self1 = this;

        $.ajax({
            url: url,
            data: {
                cid: constrastID
            },
            dataType: "json",
            context: self1
        }).done(function(result) {
            $(this).parent().find("input")[0].checked = false;
        });
    }

    function addConstrast(carID) {
        var url = config.api_addContrast;
        var self = this;
        var constrasting = true;

        if (constrasting) {
            Souche.MiniLogin.checkLogin(function(){
                $.ajax({
                    type: "POST",
                    url: config.api_addContrast,
                    data: {
                        carId: carID
                    },
                    dataType: "json",
                    context: self
                }).done(function(data) {
                    if (data.result == 2) { //正常
                        this.checked = true;
                        $(this).parent().find("span").html("已对比")
                        var contrastId = data.contrastId;
                        $(this).parent().attr("contrastId", contrastId);

                        var cloneElement = $(this).parent().clone();
                        cloneElement.css({
                            opacity: 0.8,
                            position: 'absolute',
                            top: $(this).parent().offset().top + 'px',
                            left: $(this).parent().offset().left + 'px',
                            backgroundColor: "#ff5517",
                            color: "#fff"
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
                    } else if (data.result == -1) { // 已经添加
                        this.checked = true;
                        var waring = $(this).parent().parent().parent().find(".contrast-waring");
                        waring.html("已经加入对比").removeClass("hidden");
                        window.setTimeout(function() {
                            waring.addClass("hidden");
                        }, 3000);

                        var contrastId = data.contrastId;
                        $(this).parent().attr("contrastId", contrastId);
                    } else if (data.result == 1) //已满
                    {
                        var waring = $(this).parent().parent().parent().find(".contrast-waring");
                        waring.html("对比项已满").removeClass("hidden");
                        window.setTimeout(function() {
                            waring.addClass("hidden");
                        }, 3000);
                    }

                    constrasting = false;
                });
            })

        }
    }
    //function end

    var init = function(_config) {
        $.extend(config, _config);
        _bind();
    }

    constrastControl.init = init;
    return constrastControl;
});