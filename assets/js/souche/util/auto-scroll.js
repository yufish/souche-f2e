define(function() {
    var AutoScroll = function(selector, time) {
        this.ele = $(selector);
        this.time = time;
        this.nowIndex = 0;
        this.length = 0;
        this.itemHeight = this.ele.height();
        this.init();
    }
    AutoScroll.prototype = {
        init: function() {
            var items = this.ele.find(".item");
            this.length = items.length;
            var self = this;
            setInterval(function() {
                self.nowIndex++;
                if (self.nowIndex >= self.length) {
                    self.nowIndex = 0;
                }
                var scrollTop = 0;
                for (var i = 0; i < self.nowIndex; i++) {
                    scrollTop += items.eq(i).height();
                }
                self.ele.animate({
                    scrollTop: scrollTop
                })
            }, this.time);
        }
    }
    return function(selector, time) {
        return new AutoScroll(selector, time);
    }
});