var animateFucs = function (exports) {
    var funcs = [];
    var group = {};
    var app = {
        use: function (f) {
            funcs.push(f);
        }
    }


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