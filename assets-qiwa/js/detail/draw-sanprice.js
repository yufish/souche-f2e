define(function() {
    return {
        draw: function(min, max, middle, rangePrice) {
            var minPrice = min;
            var maxPrice = max;
            var minLength = 45;
            var maxLength = 520;
            $(".souche-price-text").html("￥" + rangePrice + "万")
            $(".souche-price-middle").html(middle)
            $(".souche-price-min").html(rangePrice)
            $(".souche-price-max").html(max)
            $(".souche-price-down").html((middle - min).toFixed(1));
            $(".souche-price-lv").html((min * 100 / middle).toFixed(0) + "%")

            function createInterpolation(minV, maxV, minD, maxD) {
                var vGap = maxV - minV,
                    dGap = maxD - minD;
                return function(value) {
                    return (value - minV) / vGap * dGap+minD;
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