define(function() {
    return {
        init: function() {
            //carlife effect
            var $clItems = $('.carlife-item');
            var clIndex = 0,
                clLength = $clItems.size(),
                clAnimateStop = false;
            var height = $clItems.height();
            var clAnimation = function() {
                if (clAnimateStop) return;
                $clItems.each(function(index, ele) {
                    if (index === clIndex) {
                        $('.front', ele).animate({
                            'top': -height
                        });
                        $('.back', ele).animate({
                            'top': -height
                        });
                        //$(this).animate({top:-height});
                    } else {
                        $('.front', ele).animate({
                            'top': 0
                        });
                        $('.back', ele).animate({
                            'top': 0
                        });
                        //$(this).animate({top:0});
                    }
                });
                if (clIndex == clLength - 1) {
                    clIndex = 0;
                } else {
                    clIndex++;
                }
            }
            setInterval(clAnimation, 3000);
            $clItems.on('mouseenter', function(e) {
                clAnimateStop = true;
                var self = this;
                $clItems.each(function(index, ele) {
                    if (ele != self) {
                        $('.front', ele).stop(true, true).animate({
                            'top': 0
                        });
                        $('.back', ele).stop(true, true).animate({
                            'top': 0
                        });
                    } else {
                        $('.front', ele).animate({
                            'top': -height
                        });
                        $('.back', ele).animate({
                            'top': -height
                        });
                    }
                })
                e.stopPropagation();
            }).on('mouseleave', function(e) {
                //$clItems.css({top:0});
                clAnimateStop = false;
            });

        }
    }
})