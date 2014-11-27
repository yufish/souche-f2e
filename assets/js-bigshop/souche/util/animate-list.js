/**
 * 这是一个动画列表的方法
 * @return {[type]} [description]
 */
define(function() {
    var Anim = function(list, callback) {
        this.list = list || [];
        this.index = 0;
        this.callback = callback;
        this.next();
    }
    Anim.prototype = {
        next: function() {
            if (this.index == this.list.length) {
                this.callback();
                return;
            }
            var config = this.list[this.index];
            this.index++;
            var self = this;
            $(config[0]).animate(config[1], config.length >= 3 ? config[2] : 500, function() {
                self.next();
            })
        }
    }
    return function(list, callback) {
        return new Anim(list, callback);
    }
})