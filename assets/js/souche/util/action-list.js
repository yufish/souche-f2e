/**
 * 这是一个动作串联的方法，可以把一连串动作用数据来表示出来，最后传入此方法，即可按照设定执行相关的逻辑。
 * 好处是看起来更清晰，不会因为页面动作太多导致代码乱七八糟。
 *
 */

define(function() {
    var ActionList = function() {
        this.nowIndex = 0;
        this.data = [];
        this.callback = null;
    }
    ActionList.prototype = {
        init: function(data, callback) {
            this.data = data;
            this.callback = callback;
            this._loop()
        },
        _loop: function() {
            if (this.nowIndex >= this.data.length) {
                this.callback && this.callback();
                return;
            }
            var info = this.data[this.nowIndex];
            var self = this;
            setTimeout(function() {
                info[1]();
                self.nowIndex++;
                self._loop();
            }, info[0])
        }
    }
    return function(data, callback) {
        var actions = new ActionList();
        actions.init(data, callback);
    }
});