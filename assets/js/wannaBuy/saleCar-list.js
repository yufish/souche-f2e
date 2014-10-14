define(['souche/dropdown', 'souche/custom-select', 'wannaBuy/leftNav', 'wannaBuy/filtByLoan', 'wannaBuy/filterOperate', 'wannaBuy/carOperate', 'wannaBuy/new-list-nav', 'wannaBuy/sweetCountdown'], function(CustomDropdown, CustomSelect, LeftNav, FiltByLoan, FilterOperate, CarOperate, NewListNav, SweetCountdown) {
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

        initLimitYouhuiCountdown: function(){
            $('.time-limit-offer').each(function(i, el){
                var curTime = $(el).attr('beginTime');
                var endTime = $(el).attr('endTime');
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