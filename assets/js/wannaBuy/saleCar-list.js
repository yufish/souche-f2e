define(['souche/dropdown','souche/custom-select', 'wannaBuy/leftNav', 'wannaBuy/filtByLoan', 'wannaBuy/filterOperate', 'wannaBuy/carOperate'],function(CustomDropdown,CustomSelect, LeftNav, FiltByLoan, FilterOperate, CarOperate){
    var _view = {
        init: function(){
            _view.initDropdown();
            _view.initCustomSelect();

            Souche.UI.Select.init({
                eles : ['F_buybrand', 'F_buyset', ''],
                type : "car-subdivision",
                defaultValues : []
            });
        },
        // 初始化"下拉选择"
        initDropdown: function(){
            $("*[data-ui='dropdown']").each(function(i,ele){
                $(ele).css({
                    zIndex:1000-i
                });
                new CustomDropdown(ele);
            });
        },
        // 初始化"自定义选择": 分期数, 每月还款额, 自定义月还款额
        initCustomSelect: function(){
            new CustomSelect("downpayment_select", {
                placeholder: "请选择",
                multi: false
            });
            new CustomSelect("repaymentvalue_select", {
                format:function(value)
                {
                    if(value!== "自定义")
                    {
                        return value+"元以内";
                    }
                    return  value;
                },
                placeholder: "不限",
                multi: false
            });
            new CustomSelect("downpayment_select_custom", {
                placeholder: "请选择",
                multi: false
            });
        }
    };


    function init(){
        _view.init();

        LeftNav.init();
        FiltByLoan.init();
        FilterOperate.init();
        CarOperate.init();
    }

    return {
        init: init
    };
});
Souche.Inside.init({
    fav_api : '/pages/saleDetailAction/savaCarFavorite.json',
    cancelfav_api : '/pages/saleDetailAction/delCarFavorite.json',
    api_isNoRegisterLogin : '/pages/evaluateAction/isNoRegisterLogin.json',
    api_noRegisterLogin : '/pages/evaluateAction/noRegisterLogin.jso'
});