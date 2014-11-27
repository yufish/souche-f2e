var screen1 = function (exports) {
    var funcs = [];
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }

    var svgMain = window.svgMain;
    var group = svgMain.group().attr({
        id: 'sg1'
    });
    //step1 : round 1 show and hide
    app.use(
        function (next) {
            var svgRound = Snap('#round').animate({
                x: 10
            }, 1000, mina.bounce)
            var svgOne = Snap('#one').animate({
                x: 120
            }, 1000, mina.bounce, function () {
                var roundGroup = svgMain.group(svgRound, svgOne).animate({
                    opacity: 0
                }, 1000, next);
            })

            group.append(svgRound);
            group.append(svgOne);
        }
    );
    //step2:draw circle
    app.use(
        function (next) {
            var c = window.circlePos;
            var tCirPath = 'M' + c.x + ' ' + c.y + 'm 0 r a r r 0 1 1 0 -d  a r r 0 1 1 0 d';
            var rCirPath = tCirPath.replace(/r/g, c.r).replace(/d/g, 2 * c.r);

            var circlePath = svgMain.path(rCirPath).attr({
                stroke: "#bebebe",
                strokeWidth: 3,
                fill: 'none',
            });
            var len = circlePath.getTotalLength();
            circlePath.attr({
                'stroke-dasharray': len,
                'stroke-dashoffset': len
            }).animate({
                'stroke-dashoffset': 0
            }, 1000, next)
            var s = svgMain.group(
                svgMain.text(150, 90, '想买辆大众').attr({
                    'text-anchor': 'middle',
                    dy: '0.3em',
                    fill: '#595959',

                }),
                svgMain.text(150, 110, '开开').attr({
                    'text-anchor': 'middle',
                    dy: '0.3em',
                    fill: '#595959',

                })).attr({
                opacity: 0,
                'font-size': '15px',
                'font-weight': 'bold',
            }).animate({
                opacity: 1
            }, 1000, mina.easeout)
            group.append(circlePath);
            group.append(s);
        }
    );

    //draw split line
    app.use(
        function (next) {
            var s = svgMain.line(150, 150, 150, 150).attr({
                stroke: "#bebebe",
                strokeWidth: 3,
            }).animate({
                y2: winH
            }, 1000, next);
            group.append(s);
        }
    );

    //draw 1-left.png
    app.use(
        function (next) {
            var s = svgMain.image(images['1-left.png'], -130, 170, 106, 91)
                .attr({
                    id: 'left-out-png-1'
                })
                .animate({
                    x: 25
                }, 500, next);

            group.append(s);
        }
    )

    //draw 1-left-word.png
    app.use(
        function (next) {
            var s = svgMain.image(images['1-left-word.png'], -130, 300, 143, 59)
                .animate({
                    x: 3
                }, 500, next);
            group.append(s);
        }
    )

    //draw 1-right
    app.use(
        function (next) {
            var s = svgMain.image(images['1-right.png'], 300, 170, 88, 76)
                .animate({
                    x: 200
                }, 1000, next);
            group.append(s)
        }
    )

    app.use(
        function (next) {
            var s = svgMain.image(images['1-right-car.png'], 215, 130, 83, 39)
                .attr({
                    opacity: 0
                })
                .animate({
                    opacity: 1
                }, 1000, mina.easeout, next);
            group.append(s);
        }
    )

    //draw l-right-word.png
    app.use(
        function (next) {
            var s = svgMain.image(images['1-right-word.png'], 300, 300, 122, 57)
                .animate({
                    x: 170
                }, 1000, next)
            group.append(s);
        }
    )
    app.use(
        wait(1000)
    )
    //rotate 1-left.png
    app.use(
        function (next) {
            Snap('#left-out-png-1').animate({
                transform: 'r-60 120 240'
            }, 1000, next)
        }
    )
    app.use(
        function (next) {
            //掉血
            var oTitle = Snap('#other-title').animate({
                y: 170
            }, 1000, function () {
                Snap('#other-title rect').animate({
                    width: 80
                }, 1000, next)
            })
        }
    )

    return {
        funcs: funcs,
        group: group
    }



}(window, undefined)