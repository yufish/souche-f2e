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