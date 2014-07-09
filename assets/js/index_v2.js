define(function() {
    var config = {};
    var lockAnimate = true;

    var _bind = function () {
        $(".car-brand,.car-models").mouseover(function (event) {
            event.stopPropagation();
            if ($(event.target).hasClass("car-models") || $(event.target).hasClass("car-brand")) {
                lockAnimate = false;
                $(".models-inner,.brand-inner").hide();
                $(this).find(".models-inner,.brand-inner").show(100);

            }
            return false;
        });
        $("body").mouseover(function () {
            $(this).find(".models-inner,.brand-inner").hide(100);
        });
    }



    ////
    return {
        init: function (_config) {
            $.extend(config, _config);

            _bind();

            require(["index/qiugou_v2"],function(qiugou)
            {
                qiugou.init();
            });
        }
    }
});
