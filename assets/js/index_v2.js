define(function() {
    var config = {};

    var _bind = function() {
        var timeout =null;

        $(".car-brand,.car-models").mouseenter(function(event) {

            event.stopPropagation();
            var self = this;
            window.clearTimeout(timeout);

            $(".models-inner,.brand-inner").hide();
            timeout = window.setTimeout(function()
            {
                if (eval("''+/*@cc_on" + " @_jscript_version@*/-0") * 1 == 5.7) {
                    if ($(self).hasClass("car-models")) {
                        $(".car-price").css("visibility", "hidden");
                    } else {
                        $(".car-models,.car-price").css("visibility", "hidden");
                    }
                    $(self).find(".models-inner,.brand-inner").css("zIndex", 9999).show(0);
                } else {
                    $(self).find(".models-inner,.brand-inner").css("zIndex", 9999).show(50);
                }
            },200);

            return false;
        });

        $(".car-brand,.car-models").mouseleave(function() {

            var self = this;
            window.clearTimeout(timeout);

            if (eval("''+/*@cc_on" + " @_jscript_version@*/-0") * 1 == 5.7) {
                if ($(self).hasClass("car-models")) {
                    $(".car-price").css("visibility", "");
                } else {
                    $(".car-models,.car-price").css("visibility", "");
                }
                $(self).find(".models-inner,.brand-inner").css("zIndex", -999).hide(0);
            } else {
                $(self).find(".models-inner,.brand-inner").css("zIndex", -999).hide(100);
            }
        });
    }

    ////
    return {
        init: function(_config) {
            $.extend(config, _config);

            _bind();

            require(["index/qiugou_v2","index/qiugouModel",'souche/custom-select',"index/modelSeries"],
                function(qiugou,qiugouModel,customSelect,modelSeries) {

                qiugou.init(config);
                //modelSeriesModel.init(config);
                modelSeries.init(config);

                var ageSelect = new customSelect("age_select", {
                    placeholder: "请选择",
                    multi: false
                });

                var ageSelect = new customSelect("age_select_high", {
                    placeholder: "请选择",
                    multi: false
                });
                var ageSelect = new customSelect("age_select1", {
                    placeholder: "请选择",
                    multi: false
                });

                var ageSelect = new customSelect("age_select_high1", {
                    placeholder: "请选择",
                    multi: false
                });


            });


        }
    }
});