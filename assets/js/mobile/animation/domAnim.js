 var animateFuncs_head = function (exports) {
     var funcs = [];
     var app = {
         use: function (f) {
             funcs.push(f);
         }
     }
     //preload images for smooth animation
     app.use(function (next) {

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

             $('#vs-text-1').velocity({
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
             $('#line-1').velocity({
                 height: h - 180
             }, 1000, next)
         }
     )

     app.use(
         function (next) {
             var img = (images['1-left.png']);
             $('#s1-left').append(img).velocity({
                 left: 0
             }, 500, next)
         }
     )

     app.use(
         function (next) {
             var img = (images['1-left-word.png']);
             $('#s1-left-word').append(img).velocity({
                 left: 0
             }, 600, next);
         }
     )
     app.use(
         function (next) {
             var img = (images['1-right.png']);
             $('#s1-right').append(img).velocity({
                 right: 30
             }, 1000, next);
         }
     )
     app.use(
         function (next) {
             var img = (images['1-right-car.png']);
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
             var img = (images['1-right-word.png']);
             var rWord = $('#s1-right-word');
             rWord.append(img).velocity({
                 opacity: 1.5,
                 top: 305
             }, {
                 easing: 'easeOutBounce',
                 duration: 1000,
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
         function (next) {
             $('#other-title').velocity({
                 width: '*=0.67'
             }, 600, next)
         }
     )
     app.use(
         function (next) {
             $('#canvas-1').velocity({
                 top: '-100%'
             }, 2000, next)
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

     app.use(
         function (next) {
             var repeatNext = repeat(2, next);
             var ctx = document.getElementById('circle-2').getContext('2d');
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
                 height: h - 180
             }, 1000, next)
         }
     )
     app.use(function (next) {
         var img = images['left-2-1.png'];
         $('#s2-left').append(img).velocity({
             left: 0
         }, 600, next);
     })
     app.use(function (next) {
         var img = images['left-2-2.png'];
         $('#s2-left-2').append(img).velocity({
             top: 145
         }, 1000, next);
     })
     app.use(function (next) {
         var img = images['left-2-3.png'];
         $('#s2-left-3').append(img).velocity({
             top: 215
         }, 1000, next);
     })
     app.use(function (next) {
         var img = images['2-left-word.png'];
         $('#s2-left-word').append(img).velocity({
             left: 0
         }, 600, next)
     })

     app.use(function (next) {
         var img = images['right-2.png'];
         $('#s2-right').append(img).velocity({
             opacity: 1
         }, 600)
             .velocity({
                 top: 160
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
             top: 240
         }, {
             duration: 600
         })
         $('#circle-tag-2-2').append(img2).velocity({
             top: 240
         }, {
             delay: 200,
             duration: 600,
         })
         $('#circle-tag-2-3').append(img3).velocity({
             top: 240
         }, {
             delay: 400,
             duration: 600,
             complete: next
         })
     })
     app.use(function (next) {
         var img = images['2-right-word.png'];
         $('#s2-right-word').append(img).velocity({
             right: 0,
             opacity: 1
         }, 1000, next)
     })

     return funcs;

 }();