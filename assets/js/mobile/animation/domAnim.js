var animateFucs_head = function (exports) {
    var funcs = [];
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }
    //preload images for smooth animation
    app.use(function (next) {
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
        exports.images = images;
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
    //vs
    app.use(
        function (next) {
            var img = cutImage(images['vs.png']);
            $('#vs').append(images['vs.png']).velocity({
                top: 5
            }, {
                easing: 'easeOutBounce',
                complete: next
            })
        });
    return funcs;
}(window, undefined);

//screen 1
var animateFucs_s1 = function (exports) {

    var funcs = [];
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }
    //drawCircle
    app.use(
        function (next) {
            var repeatNext = repeat(2, next);
            var ctx = document.getElementById('circle').getContext('2d');
            ctx.strokeStyle = "#bebebe";
            ctx.lineWidth = 2;
            var deg = 90;
            var fenMu = Math.PI / 180;
            var startR = deg * fenMu;
            var ft = 1000 / 360;
            var drawHandler = setInterval(drawCircle, ft);

            function drawCircle() {
                if (deg > 450) {
                    clearInterval(drawHandler);
                    repeatNext();
                    return;
                } else {
                    ctx.clearRect(0, 0, 110, 110);
                    ctx.beginPath();
                    ctx.arc(55, 55, 50, startR, deg * fenMu);
                    ctx.stroke();
                    deg += 2;
                }
            }

            $('#vs-text').velocity({
                opacity: 1
            }, {
                easing: 'easeInCirc',
                duration: 1000,
                complete: repeatNext
            })
        }

    )
    //drawLine
    app.use(
        function (next) {
            var h = $(window).height();
            $('#line').velocity({
                height: h - 180
            }, 1000, next)
        }
    )

    app.use(
        function (next) {
            var img = cutImage(images['1-left.png']);
            $('#s1-left').append(img).velocity({
                left: 0
            }, 500, next)
        }
    )

    app.use(
        function (next) {
            var img = cutImage(images['1-left-word.png']);
            $('#s1-left-word').append(img).velocity({
                left: 0
            }, 500, next);
        }
    )
    app.use(
        function (next) {
            var img = cutImage(images['1-right.png']);
            $('#s1-right').append(img).velocity({
                right: 30
            }, 1000, next);
        }
    )
    app.use(
        function (next) {
            var img = cutImage(images['1-right-car.png']);
            $('#s1-right-car').append(img).velocity({
                opacity: 1
            }, {
                easing: 'easeInCirc',
                duration: 600,
                complete: next
            })
        }
    )
    app.use(
        function (next) {
            var img = cutImage(images['1-right-word.png']);
            var rWord = $('#s1-right-word');
            rWord.append(img).velocity({
                opacity: 1.5,
                top: 340
            }, {
                easing: 'easeOutBounce',
                duration: 1000,
                complete: next
            });

        }
    )
    /*app.use(
        function (next) {
            $('#s1-left-word').velocity({
                rotateZ: '30deg'
            }, next)
        }
    )
    app.use(
        function (next) {
            $('#s1-left').velocity({
                rotateZ: '-70deg'
            }, next)
        }
    )*/
    return funcs



}()