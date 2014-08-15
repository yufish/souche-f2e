define(function(){
    
    // "价格" 自定义 校验
    var customPriceReg = /^\d+$/;
    $(".custom").submit(function(e) {
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

    })
    //颜色hover效果
    $(".sc-color a").mousemove(function() {
        $(this).find("span").removeClass("hidden");
    })
    $(".sc-color a").mouseout(function() {
        $(this).find("span").addClass("hidden");
    })

    function init(){

    }

    return {
        init: init
    };
})