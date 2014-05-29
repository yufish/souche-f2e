define(function() {
    return {
        draw: function(min, max, middle) {
            var minPrice = min;
            var maxPrice = max;
            var minLength = 45;
            var maxLength = 520;
            $(".souche-price-text").html("￥" + min + "万")
            $(".souche-price-middle").html(middle)
            $(".souche-price-min").html(min)
            $(".souche-price-max").html(max)
            $(".souche-price-down").html((middle - min).toFixed(1));
            $(".souche-price-lv").html((middle - min / middle).toFixed(0) + "%")

            function createInterpolation(minV, maxV, minD, maxD) {
                var vGap = maxV - minV,
                    dGap = maxD - minD;
                return function(value) {
                    return (value - minV) / vGap * dGap;
                }
            }
            var getMiddlePoint = createInterpolation(minPrice, maxPrice, minLength, maxLength);
            var midD = getMiddlePoint(middle);
            $('#sc-price').css({
                left: minLength
            })
            $('#new-price').css({
                left: midD
            })
            $('#guide-price').css({
                left: maxLength
            })
        }
    }
})