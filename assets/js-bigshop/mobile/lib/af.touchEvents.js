//Touch events are based from zepto/touch.js
//Many modifications and enhancements made
/**
 * Simply include this in your project to get access to the following touch events on an element
 * tap
 * doubleTap
 * singleTap
 * longPress
 * swipe
 * swipeLeft
 * swipeRight
 * swipeUp
 * swipeDown
 */
/* global af*/
//在原开源文件中，加了2处,用于解决android上的bug
(function($) {
    "use strict";
    //(1)
    var isAndroid = false;
    if (navigator.userAgent.match(/Android/i)){
        isAndroid =true;
    }
    var touch = {}, touchTimeout;

    function parentIfText(node) {
        return "tagName" in node ? node : node.parentNode;
    }

    function swipeDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        if (xDelta >= yDelta) {
            return (x1 - x2 > 0 ? "Left" : "Right");
        } else {
            return (y1 - y2 > 0 ? "Up" : "Down");
        }
    }

    var longTapDelay = 750;
    function longTap() {
        if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
            touch.el.trigger("longTap");
            touch = {};
        }
    }
    var longTapTimer;
    $(document).ready(function() {
        var prevEl;
        $(document.body).bind("touchstart", function(e) {
            if (e.originalEvent)
                e = e.originalEvent;
            if (!e.touches || e.touches.length === 0) return;
            var now = Date.now(), delta = now - (touch.last || now);
            if (!e.touches || e.touches.length === 0) return;
            touch.el = $(parentIfText(e.touches[0].target));
            touchTimeout && clearTimeout(touchTimeout);
            touch.x1 = e.touches[0].clientX;
            touch.y1 = e.touches[0].clientY;
            touch.x2 = touch.y2 = 0;
            if (delta > 0 && delta <= 250)
                touch.isDoubleTap = true;
            touch.last = now;
            longTapTimer = setTimeout(longTap, longTapDelay);
            prevEl = touch.el;
        }).bind("touchmove", function(e) {
            if(e.originalEvent)
                e = e.originalEvent;
            touch.x2 = e.touches[0].clientX;
            touch.y2 = e.touches[0].clientY;
            //(2)
            var absX = Math.abs(touch.x1 - touch.x2),
                absY = Math.abs(touch.y1 - touch.y2)
            if(isAndroid && absX>10 && absX>absY ){
                e.preventDefault()
            }
            clearTimeout(longTapTimer);
        }).bind("touchend", function(e) {
            if(e.originalEvent)
                e=e.originalEvent;
            if (!touch.el)
                return;
            if (touch.isDoubleTap) {
                touch.el.trigger("doubleTap");
                touch = {};
            } else if (touch.x2 > 0 || touch.y2 > 0) {
                (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) &&
                touch.el.trigger("swipe") &&
                touch.el.trigger("swipe" + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)), touch);
                touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
            } else if ("last" in touch) {
                touch.el.trigger("tap");
                touchTimeout = setTimeout(function() {
                    touchTimeout = null;
                    if (touch.el)
                        touch.el.trigger("singleTap");
                    touch = {};
                }, 250);
            }
        }).bind("touchcancel", function() {
            touch = {};
            clearTimeout(longTapTimer);
        });
    });

    ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(m) {
        $.fn[m] = function(callback) {
            return this.bind(m, callback);
        };
    });
})($);
