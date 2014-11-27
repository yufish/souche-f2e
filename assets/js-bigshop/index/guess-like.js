define(["souche/util/image-resize"], function(ImageResize){

    var _config = {};
    
    // 获取"猜你喜欢"的数据, 用apear方法控制lazy加载到dom
    function initGuessLike(){
        var guessLikeCtn = $(".guess-like");
        guessLikeCtn.addClass('loading');
        $.ajax({
            url: _config.api_guessCars,
            success: function(html) {

                Souche.Util.appear( ".guess-like", fillGuessCallback );
                $(window).trigger("scroll")
                function fillGuessCallback(){
                    guessLikeCtn.removeClass('loading');
                    guessLikeCtn.html(html);
                    
                    var targetW, targetH;
                    if( _config.guessLikeImgSize ){
                        targetW = _config.guessLikeImgSize.width;
                        targetH = _config.guessLikeImgSize.height;
                    }
                    else{
                        targetW = 240;
                        targetH = 160;
                    }

                    ImageResize.init(".guess-like .carsItem img", targetW, targetH);
                    // "不喜欢"事件处理
                    guessLikeCtn.on('click', '.nolike', function(e) {
                        var self = this;
                        $(self).closest(".like-box").animate({
                            opacity: 0,
                            width: 0
                        }, 500, function() {
                            $(self).closest(".like-box").remove()
                        })
                        $.ajax({
                            url: _config.api_nolikeUrl,
                            data: {
                                carId: $(this).attr("data-id")
                            },
                            dataType: "json",
                            success: function() {}
                        })
                    })
                }
            }
        });
    }

    function init(config){
        $.extend(_config, config);
        initGuessLike();
    }

    return {
        init: init
    }
})