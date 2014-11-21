define(function() {
    /**
     * 让图片自动填充满一个区域
     */

    function resizeImg(W, H){
        var w = this.width;
        var h = this.height;
        if (h == 0 || w / h <= W / H) {
            $(this).css({
                width: "100%",
                height: "auto"
            })

        } else {
            $(this).css({
                height: "100%",
                width: "auto"
            })
            $(this).css({
                marginLeft: W / 2 - $(this).width() / 2
            })
            $(window).on("resize", function() {
                $(this).css({
                    marginLeft: W / 2 - $(this).width() / 2
                })
            })
        }
    }
    return {
        init: function(selector, width, height) {
            $(selector).each(function(i, img) {
                // 如果图片已经onload
                if(img.complete){
                    resizeImg.apply(img, [width, height]);
                }
                else{
                    img.onload = function() {
                        resizeImg.apply(this, [width, height]);
                    }
                }
            });
        }
    }
});