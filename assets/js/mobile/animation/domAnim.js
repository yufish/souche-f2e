! function (exports) {
    function Next(funcs) {
        this.funcs = funcs || [];
        this.complete = function () {};
        this.stopped = false;
    }
    var fn = Next.prototype;
    fn.stop = function () {
        this.stopped = false;
    }
    fn.resume = function () {
        this.stopped = true;
        this.start();
    }
    fn.use = function (f) {
        if (isArray(f)) {
            for (var i in f) {
                this.funcs.push(f[i]);
            }
        } else {

            this.funcs.push(f);
        }
        return this;
    }
    fn.onComplete=function(f){
        this.complete = f;
        return this;
    }
    fn.start = function () {
        var self = this;
        var funcs = self.funcs;
        var complete = self.complete;

        function next() {
            if (self.stopped) return;
            var f = funcs.shift();
            if (f) {
                f(next);
            } else {
                complete();
            }
        }
        next();
    }
    exports.Next = Next;
}(window, undefined);

var wait = function (t) {
    return function (next) {
        setTimeout(next, t)
    }
}
var toString = Object.prototype.toString;
var isArray = function (obj) {
    return toString.call(obj) == '[object Array]';
};

function repeat(time, next) {
    return function () {
        if (--time == 0) {
            next();
        }
    }
}

function cutImage(img) {
    img.width = Math.ceil(img.width / 2);
    img.height = Math.ceil(img.height / 2);
    return img;
}

var animateFuncs_head = function (exports) {
    var funcs = [];
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }

    //preload images for smooth animation
    app.use(function (next) {
        var once = function (next) {
            var i = 0;
            return function () {
                if (i == 0) {
                    next();
                    i++;
                }
            }
        }(next);
        setTimeout(once, 5000);
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
                    images[key] = cutImage(this);
                    if (++j == len) {
                        once();
                    }
                    $('#progress').css({width:(j/len)*260});
                }
            }(key)
        }
        exports.images = images;
    })

    app.use(
        function (next) {
            $('#load-screen').hide();
            next();
        }
    )

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
            var img = images['vs.png'];
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
var animateFuncs_s1 = function (exports) {

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
            var ctx = document.getElementById('circle-1').getContext('2d');
            ctx.strokeStyle = "#bebebe";
            ctx.lineWidth = 2;
            var deg = 90;
            var fenMu = Math.PI / 180;
            var startR = deg * fenMu;
            var ft = 500 / 360;
            var drawHandler = setInterval(drawCircle, ft);

            function drawCircle() {
                if (deg > 450) {
                    clearInterval(drawHandler);

                    ctx.clearRect(0, 0, 110, 110);
                    ctx.beginPath();
                    ctx.arc(55, 55, 50, startR, deg * fenMu);
                    ctx.stroke();

                    repeatNext();
                } else {
                    ctx.clearRect(0, 0, 110, 110);
                    ctx.beginPath();
                    ctx.arc(55, 55, 50, startR, deg * fenMu);
                    ctx.stroke();
                    deg += 2;
                }
            }

            $('#vs-text-1').velocity({
                opacity: 1
            }, {
                easing: 'easeInCirc',
                duration: 500,
                complete: repeatNext
            })
        }

    )
    //drawLine
    app.use(
        function (next) {
            var h = $(window).height();
            $('#line-1').velocity({
                height: 187
            }, 800, next)
        }
    )

    app.use(
        function (next) {
            var img = (images['1-left.png']);
            $('#s1-left').append(img).velocity({
                left: 0
            }, 500)
            var img = (images['1-left-word.png']);
            $('#s1-left-word').append(img).velocity({
                left: 0
            }, 500, next);
        }
    )

    app.use(
        function (next) {
            var img = (images['1-right.png']);
            $('#s1-right').append(img).velocity({
                right: 20
            }, 1000);
            var img = (images['1-right-car.png']);
            $('#s1-right-car').append(img).velocity({
                opacity: 1
            }, {
                easing: 'easeInCirc',
                duration: 1200,
                complete: next
            })
        }
    )

    app.use(
        function (next) {
            var img1 = images['circle-1-1.png']
            var img2 = images['circle-1-2.png']
            var img3 = images['circle-1-3.png']
            $('#circle-tag-1-1').append(img1).velocity({
                right: 100
            }, 600)
            $('#circle-tag-1-2').append(img2).velocity({
                right: 50
            }, {
                delay: 200,
                duration: 600
            })
            $('#circle-tag-1-3').append(img3).velocity({
                right: 0
            }, {
                delay: 400,
                duration: 600,
                complete: next
            })
        }
    )
    app.use(
        function (next) {
            var img = (images['1-right-word.png']);
            var rWord = $('#s1-right-word');
            rWord.append(img).velocity({
                opacity: 1.5,
                top: 260
            }, {
                easing: 'easeOutBounce',
                duration: 800,
                complete: next
            });
        }
    )
    app.use(
        function (next) {
            $('#s1-left').velocity({
                rotateZ: '-70deg',
                top: '+=20'
            }, 600, next)
        }
    );
    app.use(
        function(next){
            $('#next').velocity({opacity:1})
            next();
        }
    )
    return funcs
}();

var animateFuncs_s2 = function () {
    var funcs = [];
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }

    app.use(function(next){
        $('#next').css({opacity:0})
        next();
    })
    app.use(
        function (next) {
            var repeatNext = repeat(2, next);
            var ctx = document.getElementById('circle-2').getContext('2d');
            ctx.strokeStyle = "#bebebe";
            ctx.lineWidth = 2;
            var deg = 90;
            var fenMu = Math.PI / 180;
            var startR = deg * fenMu;
            var ft = 500 / 360;
            var drawHandler = setInterval(drawCircle, ft);

            function drawCircle() {
                if (deg > 450) {
                    clearInterval(drawHandler);

                    ctx.clearRect(0, 0, 110, 110);
                    ctx.beginPath();
                    ctx.arc(55, 55, 50, startR, deg * fenMu);
                    ctx.stroke();

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

            $('#vs-text-2').velocity({
                opacity: 1
            }, {
                easing: 'easeInCirc',
                duration: 1000,
                complete: repeatNext
            })
        }
    )
    app.use(
        function (next) {
            var h = $(window).height();
            $('#line-2').velocity({
                height: 187
            }, 800, next)
        }
    )
    app.use(function (next) {
        var img = images['left-2-1.png'];
        $('#s2-left').append(img).velocity({
            left: 0
        }, 600);
        var img = images['2-left-word.png'];
        $('#s2-left-word').append(img).velocity({
            left: 0
        }, 600, next)
    })
    app.use(function (next) {
        var img = images['left-2-2.png'];
        $('#s2-left-2').append(img).velocity({
            top: 130
        }, 600,next);
    })

    app.use(function(next){
        var img = images['left-2-3.png'];
        $('#s2-left-3').append(img).velocity({
            top: '+=15'
        }, 1000, next);
    })

    app.use(function (next) {
        var img = images['right-2.png'];
        $('#s2-right').append(img).velocity({
            opacity: 1
        }, 600)
            .velocity({
                top: '+=20'
            }, {
                easing: 'easeOutBounce',
                duration: 1000,
                complete: next
            });
    })
    app.use(function (next) {
        var img1 = images['circle-2-1.png'];
        var img2 = images['circle-2-2.png'];
        var img3 = images['circle-2-3.png'];
        $('#circle-tag-2-1').append(img1).velocity({
            top: 215
        }, {
            duration: 600
        })
        $('#circle-tag-2-2').append(img2).velocity({
            top: 215
        }, {
            delay: 200,
            duration: 600
        })
        $('#circle-tag-2-3').append(img3).velocity({
            top: 215
        }, {
            delay: 400,
            duration: 600
            //complete: next
        })
        var img = images['2-right-word.png'];
        $('#s2-right-word').append(img).velocity({
            right: 0,
            opacity: 1
        }, 1000, next)
    })

    app.use(
        function(next){
            $('#next').velocity({opacity:1})
            next();
        }
    )
    return funcs;

}();

var animateFuncs_s3 = function () {
    var funcs = [];
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }
    app.use(function(next){
        $('#next').css({opacity:0})
        next();
    })
    app.use(
        function (next) {
            var repeatNext = repeat(2, next);
            var ctx = document.getElementById('circle-3').getContext('2d');
            ctx.strokeStyle = "#bebebe";
            ctx.lineWidth = 2;
            var deg = 90;
            var fenMu = Math.PI / 180;
            var startR = deg * fenMu;
            var ft = 500 / 360;
            var drawHandler = setInterval(drawCircle, ft);

            function drawCircle() {
                if (deg > 450) {
                    clearInterval(drawHandler);

                    ctx.clearRect(0, 0, 110, 110);
                    ctx.beginPath();
                    ctx.arc(55, 55, 50, startR, deg * fenMu);
                    ctx.stroke();

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

            $('#vs-text-3').velocity({
                opacity: 1
            }, {
                easing: 'easeInCirc',
                duration: 1000,
                complete: repeatNext
            })
        }
    )

    app.use(
        function (next) {
            var h = $(window).height();
            $('#line-3').velocity({
                height: 187
            }, 800, next)
        }
    )

    app.use(
        function (next) {
            var img = images['left-3-1.png'];
            $('#s3-left').append(img).velocity({
                rotateY: '45deg'
            }, 600).velocity({
                rotateY: '-45deg'
            }, 400).velocity({
                rotateY: '0'
            }, 600, next)
            var img = images['3-left-word.png'];
            $('#s3-left-word').append(img).velocity({
                left: 20
            }, 600)
        }
    )
    app.use(
        function (next) {
            var img2 = images['left-3-2.png'];
            $('#s3-left-2').append(img2);
            wait(200)(next);
        }
    )
    app.use(
        function (next) {
            var img3 = images['left-3-3.png'];
            $('#s3-left-3').append(img3);
            wait(500)(next);
        }
    )
    app.use(
        function (next) {
            var img = images['right-3-1.png'];
            $('#s3-right-1').append(img).velocity({
                opacity: 1
            }, 500, next)
        }
    )
    app.use(
        function (next) {
            var img = images['right-3-2.png'];
            $('#s3-right-2').append(img).animate({
                opacity: 1
            }, 100, next)
        }
    )
    app.use(
        function (next) {
            var img1 = images['circle-3-1.png'];
            var img2 = images['circle-3-2.png'];
            var img3 = images['circle-3-3.png'];
            $('#circle-tag-3-1').append(img1).velocity({
                top: 220,
                right: 100
            }, 600)
            $('#circle-tag-3-2').append(img2).velocity({
                top: 220,
                right: 50
            }, {
                delay: 200,
                duration: 600
            })
            $('#circle-tag-3-3').append(img3).velocity({
                top: 220,
                right: 0
            }, {
                delay: 400,
                duration: 600
                //complete: next
            })

            var img = images['3-right-word.png'];
            $('#s3-right-word').append(img).velocity({
                top: 260,
                opacity: 1
            }, {
                duration: 1000,
                easing: 'easeOutBounce',
                complete: next
            })
        }
    )

    app.use(
        function (next) {
            var img = images['start.png'];
            $('#next').hide();
            $('#start').append(img).velocity({
                opacity: 1
            }, 200, next)
        }
    )
    app.use(
        function (next) {
            function forerverShake() {
                $('#start').velocity({
                    rotateZ: '5deg'
                }).velocity({
                    rotateZ: '-5deg'
                }).velocity({
                    rotateZ: '0'
                })
            }
            forerverShake();
            setInterval(forerverShake, 2000);
            next();
        }
    )
    return funcs;
}();

var touchStart = 'touchstart';
if (!('ontouchstart' in window)) {
    touchStart = 'click';
}

$('#start').on('click', function () {
    window.location.href = 'custom-search.html';
})

var winH = $(window).height();
var maxMove = 80;
var recoverT=100,
    animateT =500;
function createTouch(screenIndex){
    var startPosY=0;
    var dst;
    return function(e){
        var touches = e.touches;
        e.preventDefault();
        var type = e.type;
        if(type == 'touchstart') {
            startPosY = touches[0].pageY;
        }
        else if(type=='touchmove'){

                dst = touches[0].pageY - startPosY
                $(can1).css({
                    'margin-top':-(screenIndex-1)*winH+dst
                })

        }else{
            if(dst<-maxMove){
                if(screenIndex==3){
                    $(can1).velocity({
                        'margin-top':-2*winH
                    },recoverT)
                    return;
                }
                $(can1).velocity({
                    'margin-top':-screenIndex*winH
                },animateT)
                var idx = screenIndex+1
                if(!animationMap[idx]){
                    if(window['next'+idx]) {
                        window['next' + idx].start();
                    }
                    animationMap[idx] = true;
                }
            }else if(dst>maxMove){
                if(screenIndex==1){
                    $(can1).velocity({
                        'margin-top':0
                    },recoverT)
                    return;
                }
                $(can1).velocity({
                    'margin-top':-winH*(screenIndex-2)
                },animateT)
            }else{
                $(can1).velocity({
                    'margin-top':-winH*(screenIndex-1)
                },animateT)
            }
        }
    }
}

var can1 = document.getElementById('canvas-1');
var can2 = document.getElementById('canvas-2');
var can3 = document.getElementById('canvas-3');
function addTouchEvent(el,screenIdx){
    var toucheEvent = createTouch(screenIdx)
    el.addEventListener('touchstart',toucheEvent,false);
    el.addEventListener('touchmove',toucheEvent,false);
    el.addEventListener('touchend',toucheEvent,false);
    el.addEventListener('touchcancel',toucheEvent,false);
}


var curScreen = 1;
var next1 = new Next(),
    next2= new Next(),
    next3 = new Next();
next1.use(animateFuncs_head)
    .use(animateFuncs_s1)
next2.use(animateFuncs_s2);
next3.use(animateFuncs_s3)


next1.onComplete(function(){
    addTouchEvent(can1,1);
}).start();
next2.onComplete(function(){
    addTouchEvent(can2,2)
})
next3.onComplete(function(){
    addTouchEvent(can3,3);
})

var animationMap=[true,false,false]


$('#next').on('click', function () {
    $(this).css({opacity:0});
    var next;
    if (curScreen == 1) {
        next = next2
    }
    if (curScreen == 2) {
        next = next3
    }

    $('#canvas-1').velocity({
        'margin-top': '-='+winH
    }, 1000, function () {
        next.start();
    })
    curScreen++;
})