define(function() {
    /**
     * 让图片自动填充满一个区域
     */
    return {
        init: function(selector, width, height) {
            $(selector).each(function(i, img) {
                img.onload = function() {
                    var w = this.width;
                    var h = this.height;
                    if (h == 0 || w / h <= width / height) {
                        $(this).css({
                            width: "100%",
                            height: "auto"
                        })
                    } else {
                        $(this).css({
                            height: "100%",
                            width: "auto"
                        })
                        $(img).css({
                            marginLeft: width / 2 - $(img).width() / 2
                        })
                        $(window).on("resize", function() {
                            $(img).css({
                                marginLeft: width / 2 - $(img).width() / 2
                            })
                        })
                    }
                }
            })
        }
    }
});