define(function() {
    var config = {};

    var _bind = function() {
        var timeout = null;

        $(".car-brand,.car-models,.car-price").mouseenter(function(event) {

            event.stopPropagation();
            var self = this;
            window.clearTimeout(timeout);

            $(".models-inner,.brand-inner,.price-inner").hide();
            timeout = window.setTimeout(function() {
                if (eval("''+/*@cc_on" + " @_jscript_version@*/-0") * 1 == 5.7) {
                    if ($(self).hasClass("car-models")) {
                        $(".car-price").css("visibility", "hidden");
                    } else {
                        $(".car-models,.car-price").css("visibility", "hidden");
                    }
                    $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", 9999).show(0);
                } else {
                    $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", 9999).show(50);
                }
            }, 200);

            return false;
        });

        $(".car-brand,.car-models,.car-price").mouseleave(function() {

            var self = this;
            window.clearTimeout(timeout);

            if (eval("''+/*@cc_on" + " @_jscript_version@*/-0") * 1 == 5.7) {
                if ($(self).hasClass("car-models")) {
                    $(".car-price").css("visibility", "");
                } else {
                    $(".car-models,.car-price").css("visibility", "");
                }
                $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", -999).hide(0);
            } else {
                $(self).find(".models-inner,.brand-inner,.price-inner").css("zIndex", -999).hide(100);
            }
        });
    }



    ////
    return {
        init: function(_config) {
            $.extend(config, _config);

            _bind();

            require(["index/qiugou_v2"], function(qiugou) {
                qiugou.init();
            });
        }
    }
});