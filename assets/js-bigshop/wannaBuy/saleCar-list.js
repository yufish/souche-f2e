define(['souche/dropdown', 'souche/custom-select', 'wannaBuy/leftNav', 'wannaBuy/filtByLoan', 'wannaBuy/filterOperate', 'wannaBuy/carOperate', 'wannaBuy/new-list-nav', 'wannaBuy/sweetCountdown', 'souche/util/image-resize'], function(CustomDropdown, CustomSelect, LeftNav, FiltByLoan, FilterOperate, CarOperate, NewListNav, SweetCountdown, ImageResize) {
    // define(['souche/dropdown','souche/custom-select', 'wannaBuy/leftNav', 'wannaBuy/filterOperate', 'wannaBuy/carOperate'],function(CustomDropdown,CustomSelect, LeftNav, FilterOperate, CarOperate){

    var config = {};
    var _view = {
        init: function() {
            _view.initDropdown();
            _view.initCustomSelect();
            FiltByLoan.init();
            Souche.UI.Select.init({
                eles: ['F_buybrand', 'F_buyset', ''],
                type: "car-subdivision",
                defaultValues: []
            });
            NewListNav.init();

            _view.initLimitYouhuiCountdown();
            // 暂时没有猜你喜欢
            _view.initGuessLike();
            _view.autoFitImage();
        },
        // 初始化"下拉选择"
        initDropdown: function() {
            $("*[data-ui='dropdown']").each(function(i, ele) {
                $(ele).css({
                    zIndex: 1000 - i
                });
                new CustomDropdown(ele);
            });
        },
        // 初始化"自定义选择": 分期数, 每月还款额, 自定义月还款额
        initCustomSelect: function() {
            new CustomSelect("downpayment_select", {
                placeholder: "请选择",
                multi: false
            });
            new CustomSelect("repaymentvalue_select", {
                format: function(value) {
                    if (value !== "自定义") {
                        return value + "元以内";
                    }
                    return value;
                },
                placeholder: "不限",
                multi: false
            });
            new CustomSelect("downpayment_select_custom", {
                placeholder: "请选择",
                multi: false
            });
        },

        // 限时优惠倒计时
        initLimitYouhuiCountdown: function(){
            $('.time-limit-offer').each(function(i, el){
                var curTime = $(el).attr('servertime');
                var endTime = $(el).attr('endtime');
                SweetCountdown.mini( {
                    nowTime: Number(curTime),
                    endTime: Number(endTime),
                    zeroCallback: function(){
                        $(el).find('.offer-countdown').html('限时优惠已结束');
                    },
                    ctn: $(el).find('.offer-countdown'),
                    word: {
                        pre: '剩余',
                        hour: '时',
                        minute: '分',
                        second: '秒'
                    }
                });
            });
        },
        // 获取"猜你喜欢"的数据, 用apear方法控制lazy加载到dom
        initGuessLike: function(){
            var guessLikeCtn = $(".guess-like");
            guessLikeCtn.addClass('loading');
            // TBD, server added this hidden
            // guessLikeCtn.removeClass('hidden');
            $.ajax({
                url: config.api_guessCars,
                success: function(html) {
                    Souche.Util.appear( ".guess-like", fillGuessCallback );
                    $(window).trigger("scroll")
                    function fillGuessCallback(){
                        guessLikeCtn.removeClass('loading');
                        guessLikeCtn.html(html);
                        // ImageResize.init(".guess-like .carsItem img", 240, 160);
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
                                url: config.api_nolikeUrl,
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
        },
        // 避免尺寸不同的car-img造成样式错乱
        autoFitImage: function(){
            var carWrap = $('.car-wrap');

            if( carWrap.hasClass('card-box') ){
                ImageResize.init(".carsItem img", 240, 160);
            }
//            else if(carWrap.hasClass('list-box')){
//                ImageResize.init(".carsItem img", 180, 120);
//            }
            
        }
    };


    function init(_config) {
        $.extend(config, _config);

        _view.init();

        LeftNav.init();
        // FiltByLoan.init();
        FilterOperate.init(config);
        CarOperate.init(config);
    }

    return {
        init: init
    };
});