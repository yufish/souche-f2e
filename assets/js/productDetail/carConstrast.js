/**
 * Created by Administrator on 2014/7/1.
 */
define(function() {
    var constrastControl = {};
    var constrasting = false;
    var phoneReg = /^1[3458][0-9]{9}$/;

    var _bind = function() {
        $(".carConstrast span,.carConstrast input").live("click", function (e) {
            if(constrasting)
            {
                return false;
            }

            Souche.NoRegLogin.checkLogin(function(isLogin) {
                var element = e.target|| e.srcElement;
                if (element.nodeName == "INPUT") {
                    if (this.checked) {
                        var carID ;
                        addConstrast.apply(this,carID);
                    }
                    else
                    {
                        var constrastID ;
                        deleteConstrast(constrastID);
                    }
                }
                else if (element.nodeName == "SPAN") {
                    if ($(this).parent().find("input")[0].checked) {
                        var constrastID ;
                        deleteConstrast(constrastID);
                        $(this).parent().find("input")[0].checked = false;
                    }
                    else {
                        var carID;
                        var input = $(this).parent().find("input")[0];
                        addConstrast.apply(input, carID);
                        input.checked = true;
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            });
        });
    }

    //function begin

    function deleteConstrast(constrastID)
    {
        var url = config.url;

        var url = config.url
        $.ajax({
            url:url,
            data:{
                carID:carID
            },
            type:"json"
        }).done(function(result)
        {
            constrasting=false;
        });
    }

    function addConstrast(carID) {
        var url = config.api_addContrast;
        var self = this;
        $.ajax({
            type: "POST",
            url: url,
            data: {
                carID: carID
            },
            type: "json",
            context:self
        }).done(function (data) {
            if (data.result == 2) { //正常
                this.checked = true;

            }
            else if (data.result == -1) {  // 已经添加
                this.checked = true;
                var waring= $(this).parent().parent().find(".contrast-waring");
                waring.html("已经加入对比").removeClass("hidden");
                window.setTimeout(function()
                {
                    waring.addClass("hidden");
                },3000);
            }
            else if(data.result == 1) //已满
            {
                var waring= $(this).parent().parent().find(".contrast-waring");
                waring.html("对比项已满").removeClass("hidden");
                window.setTimeout(function()
                {
                    waring.addClass("hidden");
                },3000);
            }

            constrasting=false;
        });
    }
    //function end

    var init = function () {
        _bind();
    }

    constrastControl.init = init;
    return constrastControl;
});