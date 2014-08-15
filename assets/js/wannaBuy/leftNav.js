define(function(){
    
    // "价格" 自定义 校验
    var customPriceReg = /^\d+$/;

    var _event = {
        bind: function(){
            // 自定义价格 提交表单
            $(".custom").submit(_event.checkCustomPrice);
            //颜色hover效果
            $(".sc-color a").mousemove(_event.colorActive).mouseout(_event.colorDeactive);
        },
        checkCustomPrice: function(e) {
            var minP = $("#minprice").val(), maxP = $("#maxprice").val();
            if(!customPriceReg.test(minP) || !customPriceReg.test(maxP)) {
                e.preventDefault();
                alert("请输入正确的价格！");
                return;
            }
            if(parseInt(maxP) <= parseInt(minP)) {
                e.preventDefault();
                alert("请输入正确的价格！");
                return;
            }
            $("#J_carPrice").val(minP + "-" + maxP);
        },
        colorActive: function(){
            $(this).find("span").removeClass("hidden");
        },
        colorDeactive: function(){
            $(this).find("span").addClass("hidden");
        }
    };

    function init(){
        _event.bind();
    };

    return {
        init: init
    };
})