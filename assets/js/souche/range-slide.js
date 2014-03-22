define(function() {
    var slider = function(_config) {
        this.config = {
            ele: "",
            steps: ["0万", "5万", "8万", "12万", "16万", "20万", "25万", "30万"],
            min: "8万",
            max: "20万",
            tpl: "%"
        }
        $.extend(this.config, _config);
        this.ele = $(this.config.ele);
        this.controlMin = $(".sc-rangeslider-min", this.ele);
        this.controlMax = $(".sc-rangeslider-max", this.ele);
        this.min = 0;
        this.max = 1;
        this._init();
    }

    $.extend(slider.prototype, {
        _init: function() {
            this._bindControls();
        },
        _bindControls: function() {
            var self = this;
            var steps = self.config.steps;
            var eleWidth = self.ele.width();
            var total = steps.length;
            var stepLength = eleWidth / (total - 1);
            var toStep = function(num) {
                for (var i = 0; i < total - 1; i++) {
                    var min = i * eleWidth / (total - 1);
                    var max = (i + 1) * eleWidth / (total - 1);
                    console.log("min:" + min + " max:" + max + " num:" + num + " i:" + i)
                    if (num >= min && num <= max) {
                        var middle = (min + max) / 2;
                        if (num < middle) return {
                            index: i,
                            pix: min,
                            value: self.config.steps[i]
                        };
                        else return {
                            index: i + 1,
                            pix: max,
                            value: self.config.steps[i + 1]
                        };
                    }
                }
            }
            $(self).on("minchange", function(e, data) {
                $(".sc-rangeslider-tip-inner span", self.controlMin).html(self.config.tpl.replace("%", data.value))
                $(".min-input", self.ele).val(data.value)
            })
            $(self).on("maxchange", function(e, data) {
                $(".sc-rangeslider-tip-inner span", self.controlMax).html(self.config.tpl.replace("%", data.value))
                $(".max-input", self.ele).val(data.value)
            })
            if (this.config.min) {
                var index = 0;
                for (var i = 0; i < this.config.steps.length; i++) {
                    if (this.config.steps[i] == this.config.min) {
                        index = i;
                    }
                }
                real = toStep(index * self.ele.width() / (self.config.steps.length - 1))
                $(self).trigger("minchange", real)
                self.controlMin.css({
                    left: real.pix - 10
                })
            }
            if (this.config.max) {
                var index = 0;
                for (var i = 0; i < this.config.steps.length; i++) {
                    if (this.config.steps[i] == this.config.max) {
                        index = i;
                    }
                }
                real = toStep(index * self.ele.width() / (self.config.steps.length - 1))
                $(self).trigger("maxchange", real)
                self.controlMax.css({
                    left: real.pix - 10
                })
            }
            $(document.body).on("mousemove", function(e) {
                if (self.controlMin.dragging) {
                    var mousePos = {
                        x: e.pageX,
                        y: e.pageY
                    }
                    var sliderPos = self.ele.offset();
                    var maxPos = self.controlMax.offset().left - sliderPos.left;
                    var x = mousePos.x - sliderPos.left
                    if (x < 0) x = 0;
                    if (x >= maxPos - stepLength) x = maxPos - stepLength;

                    real = toStep(x)
                    $(self).trigger("minchange", real)
                    self.controlMin.css({
                        left: real.pix - 10
                    })
                } else if (self.controlMax.dragging) {
                    var mousePos = {
                        x: e.pageX,
                        y: e.pageY
                    }
                    var sliderPos = self.ele.offset()
                    var minPos = self.controlMin.offset().left - sliderPos.left;
                    var x = mousePos.x - sliderPos.left
                    if (x > self.ele.width()) x = self.ele.width();
                    if (x <= minPos + stepLength) x = minPos + stepLength;
                    real = toStep(x)
                    $(self).trigger("maxchange", real)
                    self.controlMax.css({
                        left: real.pix - 10
                    })
                }
            }).on("mouseup", function() {
                self.controlMin.dragging = false;
                self.controlMax.dragging = false;
            })
            this.controlMin.on("mousedown", function() {
                self.controlMin.dragging = true;
            }).on("mouseup", function() {
                self.controlMin.dragging = false;
            })
            this.controlMax.on("mousedown", function() {
                self.controlMax.dragging = true;
            }).on("mouseup", function() {
                self.controlMax.dragging = false;
            })
        }
    })
    return slider;
});