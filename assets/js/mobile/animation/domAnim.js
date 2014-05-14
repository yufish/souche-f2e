var animateFucs = function (exports) {
    var funcs = [];
    var group = {};
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }
    //preload images for smooth animation
    app.use(function () {
        var imgDir = '../../assets/images/mob/animation/';
        var imgStrs = [
                    '1-left.png',
                    '1-left-word.png',
                    '1-right.png',
                    '1-right-car.png',
                    '1-right-word.png',
                    'vs.png',
                    'cir-top-left.png',
                    'cir-top-right.png',
                    'cir-bottom-left.png',
                    'cir-bottom-right.png'
                ]
        var j = 0;
        var len = imgStrs.length;
        var images = {};
        for (var i = 0; i < imgStrs.length; i++) {
            var tempImg = new Image()
            var key = imgStrs[i]
            var srcUri = imgDir + key
            tempImg.src = srcUri;
            tempImg.onload = function (key) {
                return function () {
                    images[key] = this;
                    if (++j == len) {
                        next();
                    }
                }
            }(key)
        }
        window.images = images;
    })

    app.use(
        function (next) {
            var repeatNext = repeat(2, next);
            $('#other-title')
                .velocity({
                    left: 0
                }, {
                    easing: 'easeOutBounce',
                    duration: 1000,
                    complete: repeatNext
                })
            $('#sc-title')
                .velocity({
                    right: 0
                }, {
                    easing: 'easeOutBounce',
                    duration: 1000,
                    complete: repeatNext
                });
        });
    app.use(
        function (next) {
            var img = cutImage(images['vs.png']);
            $('#vs').append(images['vs.png']).velocity({
                top: 5
            }, {
                easing: 'easeOutBounce',
                complete: next
            })
        })

    app.use(
        function circleAnimate(next) {
            var ctx = document.getElementById('circle').getContext('2d');
            ctx.strokeStyle = "#bebebe";
            ctx.lineWidth = 2;
            var deg = 0;
            var ft = 1000 / 360;
            var drawHandler = setInterval(drawCircle, ft);

            function drawCircle() {
                if (deg > 360) {
                    clearInterval(drawHandler);
                    next();
                    return;
                } else {
                    //setTimeout(function() {
                    ctx.clearRect(0, 0, 110, 110);
                    ctx.beginPath();
                    ctx.arc(55, 55, 50, 0, deg / 180 * Math.PI);
                    ctx.stroke();
                    deg += 2;
                    //}, ft)
                }
            }
        }
    )


    return {
        funcs: funcs,
        group: group
    }



}(window, undefined)