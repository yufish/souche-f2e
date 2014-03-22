define(function() {
    var slider = function(_config) {
        this.config = {
            ele: "",
            steps: [0, 5, 8, 12, 16, 20, 25, 30],
            min: 8,
            max: 20
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
            var total = steps.length
            var toStep = function(num) {
                for (var i = 0; i < total - 1; i++) {
                    var min = i * eleWidth / total;
                    var max = (i + 1) * eleWidth / total;
                    console.log("min:" + min + " max:" + max)
                    if (num > min && num < max) {
                        var middle = (min + max) / 2;
                        if (num < middle) return {
                            index: i,
                            pix: min,
                            value: self.config.steps[i]
                        };
                        else return {
                            index: i,
                            pix: max,
                            value: self.config.steps[i]
                        };
                    }
                }
            }
            $(self).on("minchange", function(e, data) {

            })
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
                    if (x > maxPos) x = maxPos;

                    real = toStep(x - 10)
                    $(self).trigger("minchange", real)
                    self.controlMin.css({
                        left: real.pix
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
                    if (x < minPos) x = minPos;
                    real = toStep(x)
                    $(self).trigger("maxchange", real)
                    self.controlMax.css({
                        left: real.pix
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