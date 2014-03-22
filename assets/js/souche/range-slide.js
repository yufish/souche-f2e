define(function() {
    var mousedown_key = "mousedown";
    var mouseup_key = "mouseup";
    var mousemove_key = "mousemove";
    if ('ontouchstart' in window) {
        mousedown_key = "touchstart";
        mouseup_key = "touchend";
        mousemove_key = "touchmove";
    }
    var slider = function(_config) {
        this.config = {
            ele: "",
            steps: ["0万", "3万", "5万", "6万", "7万", "8万", "9万", "10万", "11万", "12万", "13万", "14万", "15万", "16万", "17万", "18万", "19万", "20万", "21万", "22万", "23万", "24万", "25万", "30万", "35万", "40万", "50万", "60万", "70万", "100万", "无限"],
            min: "8万",
            max: "20万",
            tpl: "%"
        }
        $.extend(this.config, _config);
        this.ele = $(this.config.ele);
        this.controlMin = $(".sc-rangeslider-min", this.ele);
        this.controlMax = $(".sc-rangeslider-max", this.ele);
        this.data = {
            min: null,
            max: null
        }
        this._init();
    }
    $.extend(slider.prototype, {
        getData: function() {
            return this.data;
        }
    })
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
                self.data.min = data;
                $(self).trigger("change", self.getData())
            })
            $(self).on("maxchange", function(e, data) {
                $(".sc-rangeslider-tip-inner span", self.controlMax).html(self.config.tpl.replace("%", data.value))
                $(".max-input", self.ele).val(data.value)
                self.data.max = data;
                $(self).trigger("change", self.getData())
            }).on("change", function(e, data) {
                if (data.min && data.max)
                    self.drawHighlight(data.min.pix, data.max.pix)
            })
            // $(self.ele).on("click", function(e) {
            //     console.log("click")
            //     var x = e.pageX;
            //     var middle = (self.data.min.pix + self.data.max.pix) / 2
            //     if (x > middle) {
            //         real = toStep(x - self.ele.offset().left)
            //         $(self).trigger("maxchange", real)
            //         self.controlMax.css({
            //             left: real.pix - 10
            //         })
            //     } else {
            //         real = toStep(x - self.ele.offset().left)
            //         $(self).trigger("minchange", real)
            //         self.controlMin.css({
            //             left: real.pix - 10
            //         })
            //     }

            // })
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
            $(document.body).on(mousemove_key, function(e) {
                if (self.controlMin.dragging) {
                    self.controlMax.dragging = false;

                    var mousePos = {
                        x: e.pageX,
                        y: e.pageY
                    }
                    if (e.originalEvent.targetTouches && e.originalEvent.targetTouches[0]) {
                        var mousePos = {
                            x: e.originalEvent.targetTouches[0].pageX,
                            y: e.originalEvent.targetTouches[0].pageY
                        }
                    }
                    console.log(mousePos)
                    var sliderPos = self.ele.offset();
                    var maxPos = self.controlMax.offset().left - sliderPos.left;
                    var x = mousePos.x - sliderPos.left
                    if (x < 0) x = 0;
                    if (x >= maxPos - stepLength) x = maxPos - stepLength;

                    real = toStep(x)
                    real.pix = x - 10;
                    $(self).trigger("minchange", real)
                    self.controlMin.css({
                        left: x - 10
                    })
                    e.stopPropagation();
                } else if (self.controlMax.dragging) {
                    self.controlMin.dragging = false;
                    var mousePos = {
                        x: e.pageX,
                        y: e.pageY
                    }
                    if (e.originalEvent.targetTouches && e.originalEvent.targetTouches[0]) {
                        var mousePos = {
                            x: e.originalEvent.targetTouches[0].pageX,
                            y: e.originalEvent.targetTouches[0].pageY
                        }
                    }
                    var sliderPos = self.ele.offset()
                    var minPos = self.controlMin.offset().left - sliderPos.left;
                    var x = mousePos.x - sliderPos.left
                    if (x > self.ele.width()) x = self.ele.width();
                    if (x <= minPos + stepLength) x = minPos + stepLength;
                    real = toStep(x)
                    real.pix = x - 10;
                    $(self).trigger("maxchange", real)
                    self.controlMax.css({
                        left: x - 10
                    })
                    e.stopPropagation();
                }
            }).on(mouseup_key, function(e) {
                e.stopPropagation();
                self.controlMin.dragging = false;
                self.controlMax.dragging = false;
            })
            this.controlMin.on(mousedown_key, function() {
                self.controlMin.dragging = true;
            }).on("click", function(e) {
                e.stopPropagation();
            })
            this.controlMax.on(mousedown_key, function() {
                self.controlMax.dragging = true;
            }).on("click", function(e) {
                e.stopPropagation();
            })
        },
        drawHighlight: function(min, max) {
            $(".sc-rangeslider-highlight", this.ele).css({
                left: min,
                width: max - min
            })
        }
    })
    return slider;
});