/**
 * Created by Administrator on 2014/6/19.
 */
define(function()
{
    var setPerformPoint = function() {
        var points = $(".perform-point");
        var neishi = $(".perform_neishi");
        points.each(function() {
            var $this = $(this);
            var intro = $this.parent().find(".perform-intro");
            var x = parseInt($this.attr("x"));
            var y = parseInt($this.attr("y"));
            var introX = parseInt(intro.css("left"));
            var timer = null;
            $this.css({
                left: x + "px",
                top: y + "px"
            });
            intro.css({
                left: introX + (x + 80) + "px",
                top: (y - 217) + "px"
            });
            $this.mouseenter(function() {
                timer = setTimeout(function() {
                    intro.fadeIn(300);
                    if (introX != 0) {
                        neishi.css("z-index", 100);
                    } else {
                        neishi.css("z-index", 10);
                    }
                }, 100)

            }).mouseleave(function() {
                clearTimeout(timer);
                intro.fadeOut(100);
            });
        });
        $(".perform-close").click(function() {
            $(this).parent().fadeOut(100);
        });
    };

    return {
        init:function()
        {
            setPerformPoint();
        }
    };
});