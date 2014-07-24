var queuedo = require("queuedo");
var phantom = require('phantom');
var STest = function(name) {
    this.name = name;
    this.page = null;
    this.ph = null;
    this.url = null;
    this.actions = [];
    this.checks = [];
    this.errors = []; //跑测试过程中产生的错误
}

STest.prototype = {
    open: function(url) {
        this.url = url;
        return this;
    },
    run: function(action) {
        this.actions.push(action);
        return this;
    },
    wait: function(time) {
        this.actions.push(time);
        return this;
    },
    check: function(checkFunction) {
        this.checks.push(checkFunction);
        return this;
    },
    done: function(_callback) {
        var self = this;
        phantom.create(function(ph) {
            self.ph = ph;
            ph.createPage(function(page) {
                self.page = page;
                self.page.open(self.url, function(status) {
                    if (status !== 'success') {
                        self.errors.push(new Error(self.name + ": Network error."));
                        _callback(self.errors)
                    } else {
                        queuedo(self.actions, function(action, next, context) {
                            if (typeof(action) == "function") {
                                page.evaluate(action);
                                next.call(context)
                            } else {
                                setTimeout(function() {
                                    next.call(context)
                                }, action);
                            }
                        }, function() {
                            queuedo(self.checks, function(check, next, context) {
                                    self.page.evaluate(check, function(result) {
                                        if (result) {
                                            self.errors.push(result);
                                        }
                                        next.call(context)
                                    });
                                },
                                function() {
                                    _callback(self.errors);
                                    ph.exit();
                                })
                        })
                    }
                })
            })
        })
    }
}

module.exports = STest;